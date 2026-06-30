import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
      runningJobs,
      emailsExtracted,
      latestJob,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.scrapeJob.count(),
      prisma.scrapeJob.count({ where: { status: "SUCCESS" } }),
      prisma.scrapeJob.count({ where: { status: "FAILED" } }),
      prisma.scrapeJob.count({ where: { status: "RUNNING" } }),
      prisma.company.count({ where: { email: { not: null } } }),
      prisma.scrapeJob.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const successRate =
      totalJobs > 0 ? Math.round((successJobs / totalJobs) * 100) : 0;

    // Weekly emails — last 7 days
    const weeklyEmails = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        return prisma.company.count({
          where: {
            email: { not: null },
            createdAt: { gte: start, lte: end },
          },
        });
      })
    );

    // Emails over time — last 7 days cumulative
    const emailsOverTime = weeklyEmails.reduce<number[]>((acc, val, i) => {
      acc.push((acc[i - 1] || 0) + val);
      return acc;
    }, []);

    return NextResponse.json({
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
      runningJobs,
      emailsExtracted,
      successRate,
      weeklyEmails,
      emailsOverTime,
      latestJob,
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}