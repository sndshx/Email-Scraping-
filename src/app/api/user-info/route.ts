import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get the current logged-in user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Extract user information
    const email = user.emailAddresses?.[0]?.emailAddress;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email not found in Clerk" },
        { status: 400 }
      );
    }

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'ScrapeEngine User';
    
    // Get the initial (first letter of first name or email)
    const initial = firstName 
      ? firstName.charAt(0).toUpperCase() 
      : email.charAt(0).toUpperCase();

    // Query database user to fetch role and limits
    let dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        scrapeCount: true,
        scrapeLimit: true,
        isBanned: true
      }
    });

    // If user doesn't exist in our DB yet, create one matching Clerk info
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email,
          name: fullName,
          password: '',
          role: 'user',
          plan: 'free',
          scrapeCount: 0,
          scrapeLimit: 50,
        },
        select: {
          id: true,
          role: true,
          scrapeCount: true,
          scrapeLimit: true,
          isBanned: true
        }
      });
    } else {
      // Update clerkId if missing (for existing users who logged in via Clerk)
      await prisma.user.update({
        where: { email },
        data: { clerkId: user.id },
      });
    }

    return NextResponse.json({
      email,
      name: fullName,
      initial,
      userId: user.id,
      role: dbUser.role,
      scrapeCount: dbUser.scrapeCount,
      scrapeLimit: dbUser.scrapeLimit,
      isBanned: dbUser.isBanned
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      {
        email: 'user@scrapeengine.com',
        name: 'ScrapeEngine User',
        initial: 'S',
        role: 'user',
        scrapeCount: 0,
        scrapeLimit: 50,
        isBanned: false
      },
      { status: 200 }
    );
  }
}
