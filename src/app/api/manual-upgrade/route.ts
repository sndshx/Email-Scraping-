import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Get user email from Clerk
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const { plan } = await req.json();

    if (!['starter', 'plus'].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    console.log(`🔧 Manual upgrade: ${userEmail} → ${plan}`);

    // Find or create user in DB (keyed by email)
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: clerkUser.firstName || "User",
          email: userEmail,
          password: "",
          plan: plan,
        }
      });
    } else {
      user = await prisma.user.update({
        where: { email: userEmail },
        data: { plan: plan }
      });
    }

    // Update or create subscription using user.id (Int)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

    await prisma.subscription.upsert({
      where: { userId: user.id },   // ✅ Int, not email string
      update: {
        plan: plan,
        status: "active",
        currentPeriodEnd: endDate,
      },
      create: {
        userId: user.id,            // ✅ Int, not email string
        stripeSubscriptionId: "manual",
        stripePriceId: "manual",
        billingCycle: "monthly",
        plan: plan,
        status: "active",
        currentPeriodEnd: endDate,
      }
    });

    console.log(`✅ Manually upgraded ${userEmail} to ${plan}`);

    return NextResponse.json({ 
      success: true, 
      message: `Upgraded to ${plan}`,
      endDate: endDate.toISOString()
    });

  } catch (error) {
    console.error("Manual upgrade error:", error);
    return NextResponse.json(
      { error: "Failed to upgrade" },
      { status: 500 }
    );
  }
}
