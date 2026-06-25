import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = ["Name", "Email", "Website", "Location", "Industry", "Size", "Source", "Date Scraped"];
    const rows = companies.map((c) => [
      c.name,
      c.email || "",
      c.website || "",
      c.location || "",
      c.industry || "",
      c.companySize || "",
      c.source || "",
      c.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=results.csv",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to download" }, { status: 500 });
  }
}