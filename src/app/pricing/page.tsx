"use client";

import { useState } from "react";
import { Check, ArrowRight, Sparkles, Zap, Download } from "lucide-react";
import Sidebar from "@/app/component/sidebar";

const WEEKLY_PRICE_ID = "price_1TnaKr5ZTEXUpREBzoYN24Lm";
const MONTHLY_PRICE_ID = "price_1TnYfE5ZTEXUpREBwxNwwEqV";
const YEARLY_PRICE_ID = "price_1TnYh85ZTEXUpREBy4zrsnzo";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    prices: { weekly: 0, monthly: 0, yearly: 0 },
    features: [
      "50 companies/month",
      "1 scraping job at a time",
      "Basic email extraction",
      "CSV export (limited)"
    ]
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "For serious scrapers",
    buttonText: "Upgrade to Pro",
    buttonVariant: "primary" as const,
    popular: true,
    prices: { weekly: 9, monthly: 29, yearly: 199 },
    features: [
      "Unlimited companies",
      "10 concurrent jobs",
      "Advanced extraction",
      "Unlimited CSV export",
      "Priority support",
      "All platforms"
    ]
  },
  {
    id: "team",
    name: "Team Plan",
    description: "For growing teams",
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    prices: { weekly: 29, monthly: 99, yearly: 299 },
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Team billing",
      "Role-based access",
      "Analytics dashboard",
      "API access"
    ]
  }
];

type BillingType = "weekly" | "monthly" | "yearly";

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingType>("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const getPrice = (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return "$0";
    const amount = plan.prices[billing];
    return amount === 0 ? "Free" : `$${amount}`;
  };

  const getPeriod = () => {
    if (billing === "weekly") return "/week";
    if (billing === "monthly") return "/month";
    return "/year";
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === "starter") {
      return;
    }

    setLoading(planId);
    try {
      const priceId =
        billing === "weekly"
          ? WEEKLY_PRICE_ID
          : billing === "monthly"
          ? MONTHLY_PRICE_ID
          : YEARLY_PRICE_ID;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2" fill="none" />
                <path d="M3 8L12 13L21 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the perfect plan for your needs.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-slate-500 text-sm">
                Start free. Upgrade when you need more.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-2">
              {(["weekly", "monthly", "yearly"] as BillingType[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    billing === b
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#2563EB]"
                  }`}
                >
                  {b === "weekly" && "Weekly"}
                  {b === "monthly" && "Monthly"}
                  {b === "yearly" && (
                    <span className="flex items-center gap-1.5">
                      Yearly
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                        Save 17%
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => {
                const isLoading = loading === plan.id;
                const price = getPrice(plan.id);
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 ${
                      plan.popular
                        ? "border-[#2563EB] shadow-xl shadow-blue-500/10"
                        : "border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="bg-[#2563EB] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">{price}</span>
                        {price !== "Free" && (
                          <span className="text-sm text-slate-500 font-medium">{getPeriod()}</span>
                        )}
                      </div>
                      {billing === "yearly" && price !== "Free" && (
                        <p className="text-xs text-slate-400 mt-1">
                          Save ${plan.prices.monthly * 12 - plan.prices.yearly} per year
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isLoading || plan.id === "starter"}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 mb-6 ${
                        plan.buttonVariant === "primary"
                          ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                          : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? "Loading..." : plan.buttonText}
                    </button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular ? "bg-[#2563EB]" : "bg-slate-900"
                          }`}>
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Test Card Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-amber-900 font-semibold text-sm mb-1 flex items-center justify-center gap-2">
                <span>🧪</span> Test Mode Active
              </p>
              <p className="text-amber-700 text-xs">
                Use card: <span className="font-mono font-bold">4242 4242 4242 4242</span> · Any expiry · Any CVV
              </p>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <a 
                href="/dashboard" 
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
