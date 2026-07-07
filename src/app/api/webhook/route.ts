import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

async function sendWhatsAppMessage(to: string, message: string) {
  try {
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to,
      body: message,
    })
    console.log(`✅ WhatsApp sent to ${to}`)
  } catch (error: any) {
    console.error('WhatsApp send error:', error.message)
  }
}

async function sendPaymentSuccessEmail(
  email: string,
  planName: string,
  features: string,
  renewDate: string,
  amount: number
) {
  try {
    await resend.emails.send({
      from: 'ScrapeEngine <onboarding@resend.dev>',
      to: email,
      subject: `🎉 Payment Successful — Welcome to ${planName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <div style="background: #16a34a; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Payment Successful!</h1>
          </div>

          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Plan</td><td style="padding: 8px 0; font-weight: bold; text-align: right;">${planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; text-align: right;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Status</td><td style="padding: 8px 0; text-align: right; color: #16a34a; font-weight: bold;">✅ Paid</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Renews</td><td style="padding: 8px 0; text-align: right;">${renewDate}</td></tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Amount Paid</td>
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px; text-align: right; color: #2563EB;">$${amount}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #1f2937; margin-top: 0;">🚀 You now have access to:</h3>
            <p style="color: #4b5563; line-height: 1.8;">${features}</p>
          </div>

          <p style="color: #9ca3af; text-align: center; font-size: 12px;">
            Thank you for upgrading ScrapeEngine! Go back to WhatsApp to start scraping. 😊
          </p>
        </div>
      `,
    })
    console.log(`✅ Payment success email sent to ${email}`)
  } catch (error: any) {
    console.error('Error sending payment success email:', error.message)
  }
}

async function findWhatsAppNumberByEmail(email: string): Promise<string | null> {
  try {
    const messages = await prisma.whatsAppMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    for (const msg of messages) {
      const emailMatch = msg.customerMessage.match(
        /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
      )
      if (emailMatch && emailMatch[0].toLowerCase() === email.toLowerCase()) {
        return msg.from
      }
    }
    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Payment successful!", session.customer_email);

      try {
        let planType = session.metadata?.plan || "plus";
        const userEmail = session.metadata?.userEmail || session.customer_email!;
        const whatsappPhone = session.metadata?.whatsappPhone || session.client_reference_id || null;

        if (!['free', 'starter', 'plus'].includes(planType)) planType = "plus";

        console.log(`📦 Plan: ${planType} | 📧 Email: ${userEmail} | 📱 Phone: ${whatsappPhone}`);

        let subscriptionEndDate: Date | null = null;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          subscriptionEndDate = new Date(subscription.items.data[0].current_period_end * 1000);
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email: userEmail } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: session.customer_details?.name || "Unknown",
              email: userEmail,
              password: "",
              plan: planType,
              stripeCustomerId: session.customer as string,
            }
          });
        } else {
          user = await prisma.user.update({
            where: { email: userEmail },
            data: {
              plan: planType,
              stripeCustomerId: session.customer as string,
              planExpiry: subscriptionEndDate,
            }
          });
        }

        // Save payment
        await prisma.payment.create({
          data: {
            stripePaymentId: (session.payment_intent as string) || session.id,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency || "usd",
            status: session.payment_status || "unknown",
            customerEmail: userEmail,
            stripeCustomerId: session.customer as string,
            userId: user.id,
          }
        });

        console.log("✅ Payment saved to database");

        // Plan details
        const planDetails: Record<string, { name: string; features: string }> = {
          starter: { name: 'Starter', features: '500 emails/month, 5 concurrent jobs, Unlimited CSV export, Email support' },
          plus: { name: 'Plus', features: 'Unlimited emails, 10 concurrent jobs, API access, Priority support, All platforms' },
        }
        const plan = planDetails[planType] || { name: planType, features: 'premium features' }
        const renewDate = subscriptionEndDate
          ? subscriptionEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : 'monthly'
        const amount = (session.amount_total ?? 0) / 100

        // Send payment success email
        await sendPaymentSuccessEmail(userEmail, plan.name, plan.features, renewDate, amount)

        // Find WhatsApp number
        let phoneNumber = whatsappPhone
        if (!phoneNumber) {
          phoneNumber = await findWhatsAppNumberByEmail(userEmail)
        }

        if (phoneNumber) {
          // Update WhatsAppUser plan
          await prisma.whatsAppUser.updateMany({
            where: { phoneNumber },
            data: { plan: planType },
          }).catch(() => {})

          // Send WhatsApp success message
          const successMessage = `🎉 *Payment Successful!*
━━━━━━━━━━━━━━━━━━━━
✅ Plan: *${plan.name}*
📧 Email: ${userEmail}
💰 Status: *Paid*
📅 Renews: ${renewDate}
━━━━━━━━━━━━━━━━━━━━
🚀 *You now have access to:*
${plan.features}
━━━━━━━━━━━━━━━━━━━━
A confirmation has also been sent to your email! 📩

Thank you for upgrading! Just send me a scraping request anytime. 😊`

          await sendWhatsAppMessage(phoneNumber, successMessage)
        } else {
          console.log('⚠️ Could not find WhatsApp number')
        }

      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string }
        })

        await prisma.user.updateMany({
          where: { stripeCustomerId: subscription.customer as string },
          data: { plan: "free" }
        });

        if (user?.email) {
          const phoneNumber = await findWhatsAppNumberByEmail(user.email)
          if (phoneNumber) {
            await prisma.whatsAppUser.updateMany({
              where: { phoneNumber },
              data: { plan: 'free' },
            }).catch(() => {})

            await sendWhatsAppMessage(
              phoneNumber,
              `ℹ️ Your ScrapeEngine subscription has been cancelled and your account is now on the Free plan.\n\nYou still have 100 free companies. To resubscribe, say *"upgrade to Starter"* or *"upgrade to Plus"* anytime! 😊`
            )

            // Also send cancellation email
            await resend.emails.send({
              from: 'ScrapeEngine <onboarding@resend.dev>',
              to: user.email,
              subject: 'Your ScrapeEngine subscription has been cancelled',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                  <h2>Subscription Cancelled</h2>
                  <p>Your ScrapeEngine subscription has been cancelled. You've been moved back to the Free plan.</p>
                  <p>You still have access to 100 free companies. You can resubscribe anytime from our pricing page.</p>
                  <p>Thank you for being a ScrapeEngine customer!</p>
                </div>
              `,
            }).catch(() => {})
          }
        }

        console.log("✅ User downgraded to free plan");
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}