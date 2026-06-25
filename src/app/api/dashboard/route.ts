import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
      latestJob,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.scrapeJob.count(),
      prisma.scrapeJob.count({ where: { status: "SUCCESS" } }),
      prisma.scrapeJob.count({ where: { status: "FAILED" } }),
      prisma.scrapeJob.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
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
