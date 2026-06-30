import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";  // ✅ shared client (adapter sanga)

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();
    
    console.log("🔍 Checking subscription for Clerk userId:", userId);
    
    if (!userId) {
      console.log("❌ No userId found - returning Free plan");
      return NextResponse.json(
        { 
          daysLeft: 0,
          planType: 'Free',
          isActive: false,
          endDate: ''
        },
        { status: 200 }
      );
    }

    // Get user from Clerk to find email
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    console.log("📧 User email from Clerk:", userEmail);

    if (!userEmail) {
      console.log("❌ No email found - returning Free plan");
      return NextResponse.json(
        { 
          daysLeft: 0,
          planType: 'Free',
          isActive: false,
          endDate: ''
        },
        { status: 200 }
      );
    }

    // First find the User record (don't include subscription - it has schema mismatch)
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    console.log("👤 User found in User table:", user);

    if (!user) {
      console.log("ℹ️ No user record found - returning Free");
      return NextResponse.json({
        daysLeft: 0,
        planType: 'Free',
        isActive: false,
        endDate: ''
      });
    }

    // Try to get subscription data (but catch errors due to schema mismatch)
    let subscriptionEndDate = null;
    try {
      const subscription = await prisma.$queryRaw`
        SELECT * FROM "Subscription" WHERE "userId" = ${user.id} LIMIT 1
      ` as any[];
      
      if (subscription && subscription.length > 0 && subscription[0].currentPeriodEnd) {
        subscriptionEndDate = new Date(subscription[0].currentPeriodEnd);
        console.log("📅 Found subscription end date:", subscriptionEndDate);
      }
    } catch (err) {
      console.log("⚠️ Could not fetch subscription (using defaults)");
    }

    // Use plan from User table
    if (user.plan && user.plan !== 'free') {
      const now = new Date();
      const endDate = subscriptionEndDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const result = {
        daysLeft: Math.max(0, daysLeft),
        planType: user.plan.charAt(0).toUpperCase() + user.plan.slice(1),
        isActive: true,
        endDate: endDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
      
      console.log("✅ Returning plan:", result);
      return NextResponse.json(result);
    }

    console.log("ℹ️ No paid plan found - returning Free");
    return NextResponse.json({
      daysLeft: 0,
      planType: 'Free',
      isActive: false,
      endDate: ''
    });
  } catch (error) {
    console.error("❌ Error fetching user subscription:", error);
    return NextResponse.json(
      { 
        daysLeft: 0,
        planType: 'Free',
        isActive: false,
        endDate: ''
      },
      { status: 200 }
    );
  }
}