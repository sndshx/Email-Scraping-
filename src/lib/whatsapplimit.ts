import { prisma } from "@/lib/prisma";

const FREE_LIMIT = 100;

// Find or create a WhatsAppUser record for this phone number
export async function getOrCreateWhatsAppUser(phoneNumber: string) {
  let user = await prisma.whatsAppUser.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    user = await prisma.whatsAppUser.create({
      data: { phoneNumber },
    });
  }

  return user;
}

// Check current usage for this WhatsApp number
export async function checkWhatsAppLimit(phoneNumber: string) {
  const user = await getOrCreateWhatsAppUser(phoneNumber);
  const isPro = user.plan === "pro";

  return {
    used: user.scrapeCount,
    limit: FREE_LIMIT,
    isLimitReached: !isPro && user.scrapeCount >= FREE_LIMIT,
    isPro,
    remaining: isPro ? Infinity : Math.max(0, FREE_LIMIT - user.scrapeCount),
  };
}

// Call this after a successful scrape to add to their count
export async function incrementScrapeCount(phoneNumber: string, count: number) {
  await prisma.whatsAppUser.update({
    where: { phoneNumber },
    data: { scrapeCount: { increment: count } },
  });
}

// Returns the upgrade message with pricing link
export function getUpgradeMessage(): string {
  const pricingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`;
  return `🚀 *Upgrade to ScrapeEngine Pro!*\n\nYou've reached your free limit of ${FREE_LIMIT} companies.\nGet unlimited scraping, priority support, and more.\n\n👉 Upgrade here: ${pricingLink}`;
}