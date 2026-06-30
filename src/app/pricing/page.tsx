"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, Sparkles, Zap, Download } from "lucide-react";
import Sidebar from "@/app/component/sidebar";

const PRICE_IDS = {
  starter: {
    monthly: "price_1TnYfE5ZTEXUpREBwxNwwEqV", // $29/month ✅ ACTIVE
    yearly:  "price_1TnwvI5ZTEXUpREBhdfJS2s6",  // $199/year ✅ ACTIVE
  },
  plus: {
    monthly: "price_1TnwtN5ZTEXUpREBI2uOTv98",  // $59/month ✅ ACTIVE
    yearly:  "price_1Tnwvd5ZTEXUpREBYKPYdWWy",  // $399/year ✅ ACTIVE
  }
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    badge: "Current",
    description: "Humanize your everyday writing",
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
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
    badge: null,
    description: "More room for everyday writing",
    buttonText: "Get Starter",
    buttonVariant: "outline" as const,
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
    badge: "Most Popular",
    description: "Best for regular creators",
    buttonText: "Get Plus",
    buttonVariant: "primary" as const,
    popular: true,
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
  const [userPlan, setUserPlan] = useState<string>("free"); // Track user's current plan

  const getPrice = (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return "$0";
    const amount = plan.prices[billing];
    return amount === 0 ? "Free" : `$${amount}`;
  };

  const getPeriod = () => {
    if (billing === "monthly") return "/month";
    return "/year";
  };

  const getSavingsPercentage = (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || plan.prices.monthly === 0) return 0;
    
    const monthlyTotal = plan.prices.monthly * 12;
    const yearlyPrice = plan.prices.yearly;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    
    return percentage;
  };

  // Fetch user's current subscription
  const fetchUserSubscription = async () => {
    try {
      const res = await fetch("/api/user-subscription", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("📊 User subscription data:", data);
        
        // Map the plan from API to our plan IDs
        const planMap: Record<string, string> = {
          "free": "free",
          "Free": "free",
          "starter": "starter",
          "Starter": "starter",
          "plus": "plus",
          "Plus": "plus",
          "pro": "plus",
        };
        const mappedPlan = planMap[data.planType] || "free";
        console.log("📦 Setting user plan to:", mappedPlan);
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
    
    // Check if returning from successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const planParam = urlParams.get('plan');

    if (successParam === 'true') {
      console.log("🎉 Returned from successful payment - refreshing subscription...");

      // Remove success param from URL immediately
      window.history.replaceState({}, '', '/pricing');

      // If plan is in URL (from checkout), trigger manual upgrade as webhook fallback
      if (planParam && ['starter', 'plus'].includes(planParam)) {
        console.log(`🔧 Triggering manual upgrade fallback for plan: ${planParam}`);
        fetch("/api/manual-upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planParam }),
        })
          .then(res => res.json())
          .then(data => {
            console.log("✅ Manual upgrade result:", data);
            // Retry fetching subscription after upgrade
            return fetchUserSubscription();
          })
          .catch(err => console.error("Manual upgrade error:", err));
      }

      // Also retry multiple times to catch webhook updates
      const retryDelays = [2000, 5000, 10000];
      retryDelays.forEach(delay => {
        setTimeout(() => {
          console.log(`🔄 Retry fetching subscription after ${delay}ms...`);
          fetchUserSubscription();
        }, delay);
      });
    }
  }, []);

  const handleUpgrade = async (planId: string) => {
    // Don't allow action if it's the current plan or free plan
    if (planId === userPlan || planId === 'free') {
      return;
    }

    setLoading(planId);
    try {
      // Get the correct price ID based on plan and billing period
      let priceId = '';
      if (planId === 'starter') {
        priceId = billing === "monthly" ? PRICE_IDS.starter.monthly : PRICE_IDS.starter.yearly;
      } else if (planId === 'plus') {
        priceId = billing === "monthly" ? PRICE_IDS.plus.monthly : PRICE_IDS.plus.yearly;
      } else {
        alert("Invalid plan selected");
        setLoading(null);
        return;
      }

      console.log("🛒 Checkout with:", { planId, priceId, billing });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId,
          planName: planId, // Pass plan name (starter or plus)
        }),
      });

      const data = await res.json();
      
      console.log("📦 Checkout response:", data);

      if (data.url) {
        console.log("✅ Redirecting to Stripe...");
        window.location.href = data.url;
      } else {
        console.error("❌ Checkout failed:", data);
        alert(data.error || "Something went wrong. Please try again.");
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
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
              {(["monthly", "yearly"] as BillingType[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all min-w-[110px] ${
                    billing === b
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#2563EB]"
                  }`}
                >
                  {b === "monthly" && "Monthly"}
                  {b === "yearly" && (
                    <span className="flex items-center gap-2">
                      Yearly
                      <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Save 39%
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
                const features = plan.features;
                const isCurrentPlan = plan.id === userPlan;
                
                // Determine button text based on current plan
                let buttonText = `Get ${plan.name}`;
                if (isCurrentPlan) {
                  buttonText = "Current Plan";
                } else if (plan.id === 'free') {
                  buttonText = "Current Plan"; // Free is always current for non-paid users
                }
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 ${
                      plan.popular
                        ? "border-[#2563EB] shadow-xl shadow-blue-500/10"
                        : "border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300"
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-lg ${
                          plan.popular 
                            ? "bg-slate-800 text-white"
                            : isCurrentPlan
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {isCurrentPlan ? "CURRENT" : plan.badge}
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
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
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
                        isCurrentPlan || plan.id === 'free'
                          ? "bg-green-50 text-green-700 border-2 border-green-300 cursor-not-allowed"
                          : plan.buttonVariant === "primary"
                          ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                          : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? "Loading..." : buttonText}
                    </button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {features.map((feature, index) => (
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
