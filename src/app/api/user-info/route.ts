import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

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
    const email = user.emailAddresses?.[0]?.emailAddress || 'user@scrapeengine.com';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'ScrapeEngine User';
    
    // Get the initial (first letter of first name or email)
    const initial = firstName 
      ? firstName.charAt(0).toUpperCase() 
      : email.charAt(0).toUpperCase();

    return NextResponse.json({
      email,
      name: fullName,
      initial,
      userId: user.id
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      {
        email: 'user@scrapeengine.com',
        name: 'ScrapeEngine User',
        initial: 'S'
      },
      { status: 200 }
    );
  }
}
