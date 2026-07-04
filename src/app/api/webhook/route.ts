import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

        if (!['free', 'starter', 'plus'].includes(planType)) {
          planType = "plus";
        }

        console.log(`📦 Plan purchased: ${planType}`);
        console.log(`📧 User email: ${userEmail}`);
        console.log(`📱 WhatsApp phone: ${whatsappPhone}`);

        let subscriptionEndDate: Date | null = null;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          subscriptionEndDate = new Date(
            subscription.items.data[0].current_period_end * 1000
          );
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
          console.log(`✅ Created new user with plan: ${planType}`);
        } else {
          user = await prisma.user.update({
            where: { email: userEmail },
            data: {
              plan: planType,
              stripeCustomerId: session.customer as string,
              planExpiry: subscriptionEndDate,
            }
          });
          console.log(`✅ Updated user plan to: ${planType}`);
        }

        // Save payment record
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

        console.log("✅ Payment and user plan saved to database");

        // ── Send WhatsApp success message ─────────────────────────────────
        // Get phone from metadata first, fallback to searching message history
        let phoneNumber = whatsappPhone
        if (!phoneNumber) {
          phoneNumber = await findWhatsAppNumberByEmail(userEmail)
        }

        console.log(`📱 Sending WhatsApp to: ${phoneNumber}`)

        if (phoneNumber) {
          // Also update WhatsAppUser plan
          await prisma.whatsAppUser.updateMany({
            where: { phoneNumber },
            data: { plan: planType },
          }).catch(() => {})

          const planDetails: Record<string, { name: string; features: string }> = {
            starter: { name: 'Starter', features: '500 emails/month, 5 concurrent jobs, Unlimited CSV export' },
            plus: { name: 'Plus', features: 'Unlimited emails, 10 concurrent jobs, API access, Priority support' },
          }
          const plan = planDetails[planType] || { name: planType, features: 'premium features' }
          const renewDate = subscriptionEndDate
            ? subscriptionEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'monthly'

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
Thank you for upgrading! Just send me a scraping request anytime and I'll get started right away. 😊`

          await sendWhatsAppMessage(phoneNumber, successMessage)
        } else {
          console.log('⚠️ Could not find WhatsApp number for this user')
        }

      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", subscription.customer);

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
              `ℹ️ Your ScrapeEngine subscription has been cancelled and your account has been moved back to the Free plan.\n\nYou still have access to 100 free companies. If you'd like to resubscribe, just say *"upgrade to Starter"* or *"upgrade to Plus"* anytime! 😊`
            )
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