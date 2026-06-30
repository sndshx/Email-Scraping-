import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, planName } = await req.json();
    
    console.log("🛒 Checkout requested for:", { priceId, planName });
    
    // Get Clerk user ID
    const { userId } = await auth();
    
    console.log("🔐 Clerk userId:", userId);
    
    if (!userId) {
      console.log("❌ No userId - user not logged in");
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }

    // Get user email from Clerk
    console.log("📧 Fetching user email from Clerk...");
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    console.log("📧 User email:", userEmail);

    if (!userEmail) {
      console.log("❌ No email found for user");
      return NextResponse.json(
        { error: "No email found. Please update your profile." },
        { status: 400 }
      );
    }

    console.log("💳 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        plan: planName || "plus",
        clerkUserId: userId,
        userEmail: userEmail,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planName || 'plus'}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    });

    console.log("✅ Checkout session created:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Checkout error:", error);
    console.error("Error message:", error.message);
    console.error("Error type:", error.type);
    
    // Return more specific error message
    let errorMessage = "Failed to create checkout session";
    
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('price')) {
        errorMessage = "Invalid price ID. Please contact support.";
      } else if (error.message.includes('key')) {
        errorMessage = "Payment system configuration error. Please contact support.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}