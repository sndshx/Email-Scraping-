import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.scrapeJob.count(),
      prisma.scrapeJob.count({ where: { status: "SUCCESS" } }),
      prisma.scrapeJob.count({ where: { status: "FAILED" } }),
    ]);

    return NextResponse.json({
      totalCompanies,
      totalJobs,
      successJobs,
      failedJobs,
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
