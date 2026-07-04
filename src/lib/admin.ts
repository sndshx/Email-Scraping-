import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { prisma } from "@/lib/prisma";

export async function getAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user || user.role !== "admin") return null;
    return user;
  } catch (error) {
    console.error("Error in getAdminUser:", error);
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Unauthorized: Admin access required");
  return admin;
}
