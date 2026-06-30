import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

const prisma = new PrismaClient();

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
        // Get payment intent details
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: session.customer_email! }
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await prisma.user.create({
            data: {
              name: session.customer_details?.name || "Unknown",
              email: session.customer_email!,
              password: "", // User will set password later or use OAuth
              plan: "pro",
              stripeCustomerId: session.customer as string,
            }
          });
        } else {
          // Update existing user
          await prisma.user.update({
            where: { email: session.customer_email! },
            data: { 
              plan: "pro", 
              stripeCustomerId: session.customer as string 
            }
          });
        }

        // Save payment record
        await prisma.payment.create({
          data: {
            stripePaymentId: paymentIntent.id,
            amount: session.amount_total! / 100, // Convert from cents to dollars
            currency: session.currency!,
            status: paymentIntent.status,
            customerEmail: session.customer_email!,
            stripeCustomerId: session.customer as string,
            userId: user.id,
          }
        });

        console.log("✅ Payment saved to database:", paymentIntent.id);
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }
      
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", subscription.customer);
      
      try {
        // Downgrade user in DB
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