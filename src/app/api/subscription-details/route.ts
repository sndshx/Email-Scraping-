import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!session.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = session.subscription as Stripe.Subscription;
    
    // Get the interval (day, week, month, year)
    const interval = subscription.items.data[0]?.price.recurring?.interval || 'month';

    return NextResponse.json({
      interval,
      currentPeriodEnd: (subscription as any).current_period_end ?? (subscription as any).currentPeriodEnd,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details", interval: 'month' },
      { status: 500 }
    );
  }
}
