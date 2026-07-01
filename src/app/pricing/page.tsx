"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Sidebar from "@/app/component/sidebar";

const PRICE_IDS = {
  starter: {
    monthly: "price_1TnYfE5ZTEXUpREBwxNwwEqV",
    yearly:  "price_1TnwvI5ZTEXUpREBhdfJS2s6",
  },
  plus: {
    monthly: "price_1TnwtN5ZTEXUpREBI2uOTv98",
    yearly:  "price_1Tnwvd5ZTEXUpREBYKPYdWWy",
  }
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Humanize your everyday writing",
    prices: { monthly: 0, yearly: 0 },
    features: [
      "50 emails/month",
      "1 scraping job at a time",
      "Basic email extraction",
      "CSV export (limited)"
    ]
  },
  {
    id: "starter",
    name: "Starter",
    description: "More room for everyday writing",
    prices: { monthly: 29, yearly: 199 },
    features: [
      "500 emails/month",
      "5 concurrent jobs",
      "Advanced extraction",
      "Unlimited CSV export",
      "Email support"
    ]
  },
  {
    id: "plus",
    name: "Plus",
    description: "Best for regular creators",
    prices: { monthly: 59, yearly: 399 },
    features: [
      "Unlimited emails",
      "10 concurrent jobs",
      "Advanced extraction",
      "Unlimited CSV export",
      "Priority support",
      "All platforms",
      "API access"
    ]
  }
];

type BillingType = "monthly" | "yearly";

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingType>("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("free");

  const getPrice = (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return "$0";
    const amount = plan.prices[billing];
    return amount === 0 ? "Free" : `$${amount}`;
  };

  const fetchUserSubscription = async () => {
    try {
      const res = await fetch("/api/user-subscription", {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        const planMap: Record<string, string> = {
          "free": "free", "Free": "free",
          "starter": "starter", "Starter": "starter",
          "plus": "plus", "Plus": "plus",
          "pro": "plus",
        };
        const mappedPlan = planMap[data.planType] || "free";
        setUserPlan(mappedPlan);
        return mappedPlan;
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    }
    return "free";
  };

  useEffect(() => {
    fetchUserSubscription();

    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const planParam = urlParams.get('plan');

    if (successParam === 'true') {
      window.history.replaceState({}, '', '/pricing');

      if (planParam && ['starter', 'plus'].includes(planParam)) {
        fetch("/api/manual-upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planParam }),
        })
          .then(res => res.json())
          .then(() => fetchUserSubscription())
          .catch(err => console.error("Manual upgrade error:", err));
      }

      [2000, 5000, 10000].forEach(delay => {
        setTimeout(() => fetchUserSubscription(), delay);
      });
    }
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === userPlan || planId === 'free') return;

    setLoading(planId);
    try {
      let priceId = '';
      if (planId === 'starter') {
        priceId = billing === "monthly" ? PRICE_IDS.starter.monthly : PRICE_IDS.starter.yearly;
      } else if (planId === 'plus') {
        priceId = billing === "monthly" ? PRICE_IDS.plus.monthly : PRICE_IDS.plus.yearly;
      } else {
        setLoading(null);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName: planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2" fill="none" />
                <path d="M3 8L12 13L21 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Choose the perfect plan for your needs.</p>
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
              <p className="text-slate-500 text-sm">Start free. Upgrade when you need more.</p>
            </div>

            {/* Billing Toggle */}
            {/* Billing Toggle */}
<div className="flex items-center justify-center">
  <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
    <button
      onClick={() => setBilling("monthly")}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
        billing === "monthly"
          ? "bg-[#2563EB] text-white shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      Monthly
    </button>
    <button
      onClick={() => setBilling("yearly")}
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
        billing === "yearly"
          ? "bg-[#2563EB] text-white shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      Yearly
      <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
        Save 39%
      </span>
    </button>
  </div>
</div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => {
                const isLoading = loading === plan.id;
                const price = getPrice(plan.id);
                const isCurrentPlan = plan.id === userPlan && billing === "monthly";
                const isPopular = plan.id === "plus";

                let buttonText = `Get ${plan.name}`;
                if (isCurrentPlan) buttonText = "Current Plan";
                else if (plan.id === 'free') buttonText = "Free Plan";

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 ${
                      isCurrentPlan
                        ? "border-[#2563EB] shadow-xl shadow-blue-500/10"
                        : "border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300"
                    }`}
                  >
                    {/* Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      {!isCurrentPlan && isPopular && (
                        <div className="text-[10px] font-bold px-3 py-1 rounded-full shadow-lg bg-slate-800 text-white">
                          MOST POPULAR
                        </div>
                      )}
                    </div>

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
                          <span className="text-sm text-slate-500 font-medium">
                            {billing === "monthly" ? "/month" : "/year"}
                          </span>
                        )}
                      </div>
                      {billing === "yearly" && price !== "Free" && (
                        <div className="mt-2">
                          <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            Save ${plan.prices.monthly * 12 - plan.prices.yearly}/year
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isLoading || isCurrentPlan || plan.id === 'free'}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 mb-6 ${
                        isCurrentPlan
                          ? "bg-blue-50 text-[#2563EB] border-2 border-[#2563EB] cursor-not-allowed"
                          : plan.id === 'free'
                          ? "bg-slate-50 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                          : isCurrentPlan === false && plan.id === 'plus'
                          ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                          : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      } disabled:opacity-60`}
                    >
                      {isLoading ? "Loading..." : buttonText}
                    </button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCurrentPlan ? "bg-[#2563EB]" : "bg-slate-900"
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
          </div>
        </main>
      </div>
    </div>
  );
}
