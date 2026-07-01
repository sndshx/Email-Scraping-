import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";  // ✅ shared adapter-based client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

        if (!['free', 'starter', 'plus'].includes(planType)) {
          planType = "plus";
        }

        console.log(`📦 Plan purchased: ${planType}`);
        console.log(`📧 User email: ${userEmail}`);

        let subscriptionEndDate: Date | null = null;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          subscriptionEndDate = new Date(
            subscription.items.data[0].current_period_end * 1000
          );
          console.log(`📅 Subscription end date: ${subscriptionEndDate}`);
        }

        // Find or create user (by email)
        let user = await prisma.user.findUnique({
          where: { email: userEmail }
        });

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
              stripeCustomerId: session.customer as string
            }
          });
          console.log(`✅ Updated user plan to: ${planType}`);
        }

        // ✅ Actually save the payment record
        await prisma.payment.create({
          data: {
            stripePaymentId: (session.payment_intent as string) || session.id,
            amount: (session.amount_total ?? 0) / 100, // Stripe amounts are in cents
            currency: session.currency || "usd",
            status: session.payment_status || "unknown",
            customerEmail: userEmail,
            stripeCustomerId: session.customer as string,
            userId: user.id,
          }
        });

        console.log("✅ Payment and user plan saved to database");
        console.log(`📅 Subscription will renew on: ${subscriptionEndDate || 'N/A'}`);
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", subscription.customer);

      try {
        await prisma.user.updateMany({
          where: { stripeCustomerId: subscription.customer as string },
          data: { plan: "free" }
        });

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