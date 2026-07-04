export function getScrapeLimit(plan: string): number {
  switch (plan.toLowerCase()) {
    case "plus":
      return 1000000;
    case "starter":
      return 500;
    case "free":
    default:
      return 50;
  }
}
