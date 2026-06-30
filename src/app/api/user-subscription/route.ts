import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function GET(req: NextRequest) {
  try {
    // TODO: Get the actual user's email from session/auth
    // For now, returning mock data
    // You'll need to integrate with your auth system (Clerk, NextAuth, etc.)
    
    // Example: Get user's Stripe customer ID from database
    // const user = await getCurrentUser();
    // const stripeCustomerId = user.stripeCustomerId;
    
    // Mock data for demonstration
    const mockSubscription = {
      daysLeft: 27,
      planType: 'Pro',
      isActive: true,
      endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };

    /* 
    // Real implementation would look like this:
    if (stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const now = Math.floor(Date.now() / 1000);
        const daysLeft = Math.ceil((subscription.current_period_end - now) / (24 * 60 * 60));
        const interval = subscription.items.data[0]?.price.recurring?.interval || 'month';
        
        let planType = 'Pro';
        if (interval === 'week') planType = 'Weekly';
        if (interval === 'month') planType = 'Monthly';
        if (interval === 'year') planType = 'Yearly';

        return NextResponse.json({
          daysLeft,
          planType,
          isActive: true,
          endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        });
      }
    }
    */

    // Return mock data or free plan
    return NextResponse.json(mockSubscription);
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json(
      { 
        daysLeft: 0,
        planType: 'Free',
        isActive: false,
        endDate: ''
      },
      { status: 200 } // Return 200 with free plan data instead of error
    );
  }
}
