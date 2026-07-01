"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, Zap, Shield, Sparkles as SparklesIcon } from "lucide-react";
import Sidebar from "@/app/component/sidebar";

// Confetti particle component
const ConfettiParticle = ({ delay, type }: { delay: number; type: 'square' | 'circle' | 'ribbon' }) => {
  const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;
  const randomRotation = Math.random() * 360;

  return (
    <div
      className="absolute"
      style={{
        left: `${randomX}%`,
        top: '-20px',
        animation: `fall ${randomDuration}s linear ${delay}s infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {type === 'square' && (
        <div
          className="w-2 h-2"
          style={{
            backgroundColor: randomColor,
            transform: `rotate(${randomRotation}deg)`,
            animation: `spin ${randomDuration}s linear infinite`,
          }}
        />
      )}
      {type === 'circle' && (
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: randomColor,
          }}
        />
      )}
      {type === 'ribbon' && (
        <div
          className="w-1 h-3 rounded-full"
          style={{
            backgroundColor: randomColor,
            transform: `rotate(${randomRotation}deg)`,
            animation: `spin ${randomDuration}s linear infinite`,
          }}
        />
      )}
    </div>
  );
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    daysLeft: 30,
    endDate: '',
    planType: 'Monthly'
  });
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        // ✅ Read plan from URL (e.g. ?plan=plus or ?plan=starter)
        const planParam = searchParams.get("plan");

        // ✅ Trigger manual upgrade as webhook fallback (works in local dev)
        if (planParam && ['starter', 'plus'].includes(planParam)) {
          console.log(`🔧 Triggering manual upgrade for plan: ${planParam}`);
          try {
            const upgradeRes = await fetch("/api/manual-upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan: planParam }),
            });
            const upgradeData = await upgradeRes.json();
            console.log("✅ Manual upgrade result:", upgradeData);
          } catch (upgradeErr) {
            console.error("Manual upgrade failed:", upgradeErr);
          }
        }

        if (sessionId) {
          // Fetch session details from your API
          const response = await fetch(`/api/subscription-details?session_id=${sessionId}`);
          
          if (response.ok) {
            const data = await response.json();
            calculateSubscriptionInfo(data.interval);
          } else {
            calculateSubscriptionInfo('month');
          }
        } else {
          calculateSubscriptionInfo('month');
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        calculateSubscriptionInfo('month');
      } finally {
        setLoading(false);
        setShowConfetti(true);
      }
    };

    const timer = setTimeout(fetchSubscriptionDetails, 1000);
    return () => clearTimeout(timer);
  }, [sessionId, searchParams]);

  const calculateSubscriptionInfo = (interval: string) => {
    const today = new Date();
    let daysToAdd = 30;
    let planType = 'Monthly';
    
    switch (interval) {
      case 'week':
        daysToAdd = 7;
        planType = 'Weekly';
        break;
      case 'month':
        daysToAdd = 30;
        planType = 'Monthly';
        break;
      case 'year':
        daysToAdd = 365;
        planType = 'Yearly';
        break;
      default:
        daysToAdd = 30;
        planType = 'Monthly';
    }
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysToAdd);
    
    setSubscriptionInfo({
      daysLeft: daysToAdd,
      endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      planType
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100 flex">
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
                Payment confirmation
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Confetti Animation - Falling from top */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={i * 0.08}
                  type={['square', 'circle', 'ribbon'][i % 3] as 'square' | 'circle' | 'ribbon'}
                />
              ))}
            </div>
          )}

          {/* Global Animation Styles */}
          <style jsx global>{`
            @keyframes fall {
              from {
                transform: translateY(-20px);
                opacity: 1;
              }
              to {
                transform: translateY(100vh);
                opacity: 0;
              }
            }
            
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-8px);
              }
            }

            @keyframes pulse-ring {
              0% {
                transform: scale(0.9);
                opacity: 0.8;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }

            .animate-float {
              animation: float 3s ease-in-out infinite;
            }

            .animate-pulse-ring {
              animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>

          <div className="max-w-xs w-full relative z-10">{loading ? (
              <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping" />
                  <div className="relative w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Verifying Payment...
                </h2>
                <p className="text-slate-500 text-sm">
                  Please wait while we confirm your subscription
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                  Payment Failed
                </h2>
                <p className="text-slate-500 text-xs mb-4">
                  {error}
                </p>
                <button
                  onClick={() => router.push("/pricing")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Try Again
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Green Gradient Header with Enhanced Decorations */}
                <div className="relative bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] px-4 pt-5 pb-4 overflow-hidden">
                  {/* Floating Confetti Particles in Header */}
                  <div className="absolute top-2 left-8 w-1.5 h-1.5 bg-[#34d399] rounded-sm transform rotate-45 animate-float" style={{ animationDelay: '0s' }} />
                  <div className="absolute top-3 left-1/4 w-1 h-1 bg-[#6ee7b7] rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-2.5 right-10 w-1 h-1 bg-[#a7f3d0] rounded-full animate-float" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-[#34d399] rounded-sm transform rotate-12 animate-float" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute bottom-4 left-1/5 w-1 h-1 bg-[#d1fae5] rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
                  <div className="absolute bottom-3 right-1/4 w-0.5 h-2 bg-[#34d399] rounded-full transform rotate-45 animate-float" style={{ animationDelay: '0.6s' }} />

                  {/* Curved Ribbons - Top Left */}
                  <div className="absolute top-0 left-2 opacity-30">
                    <svg width="25" height="35" viewBox="0 0 25 35" fill="none">
                      <path d="M6 0 Q 7 9, 4 18 T 6 35" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M10 0 Q 11 10, 8 20 T 10 35" stroke="#a7f3d0" strokeWidth="1" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Curved Ribbons - Top Right */}
                  <div className="absolute top-0 right-2 opacity-30">
                    <svg width="25" height="35" viewBox="0 0 25 35" fill="none">
                      <path d="M19 0 Q 18 9, 21 18 T 19 35" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M15 0 Q 14 10, 17 20 T 15 35" stroke="#a7f3d0" strokeWidth="1" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Sparkle Stars - Top Right */}
                  <div className="absolute top-3 right-6">
                    <div className="relative">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                      <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-yellow-200 rounded-full" />
                    </div>
                  </div>

                  {/* Sparkle Stars - Bottom Left */}
                  <div className="absolute bottom-4 left-6">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>

                  {/* Party Emojis */}
                  <div className="absolute top-2 left-10 text-base animate-float" style={{ animationDelay: '0.2s' }}>
                    🎉
                  </div>
                  <div className="absolute bottom-4 right-8 text-sm animate-float" style={{ animationDelay: '0.7s' }}>
                    🎊
                  </div>
                  
                  {/* Success Icon with Multiple Pulse Rings */}
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <div className="absolute inset-0 rounded-full bg-white/25 animate-pulse-ring" />
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
                    <div className="relative w-16 h-16 rounded-full bg-white shadow-2xl shadow-emerald-900/20 flex items-center justify-center animate-float">
                      <CheckCircle2 className="w-9 h-9 text-[#10b981]" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Success Message */}
                  <h2 className="text-xl font-extrabold text-white mb-1 tracking-tight text-center drop-shadow-lg">
                    Payment Successful!
                  </h2>
                  <p className="text-white/95 text-[11px] font-medium text-center">
                    🎉 Welcome to Pro Membership
                  </p>
                </div>

                {/* Content Section */}
                <div className="px-4 py-4 bg-gradient-to-b from-white to-slate-50/50">
                  {/* Active Membership Badge */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-emerald-700 text-[11px] font-bold">Active Membership</span>
                    </div>
                  </div>

                  {/* Subscription Period Info */}
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-0.5">
                          {subscriptionInfo.planType} Plan
                        </p>
                        <p className="text-blue-900 text-xs font-bold">{subscriptionInfo.daysLeft} Days Remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-600 mb-0.5">Renews on</p>
                        <p className="text-blue-900 text-xs font-bold">{subscriptionInfo.endDate}</p>
                      </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <p className="text-center text-slate-600 text-[11px] mb-3 font-medium leading-relaxed">
                    Your subscription has been activated successfully.<br/>
                    <span className="text-slate-500 text-[10px]">You now have access to all premium features!</span>
                  </p>

                  {/* Premium Features List */}
                  <div className="space-y-2 mb-4">
                    {[
                      { icon: Zap, title: "Unlimited Scraping", desc: "No limits on companies" },
                      { icon: SparklesIcon, title: "All Platforms", desc: "LinkedIn, Maps & more" }
                    ].map((feature, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200/50">
                          <feature.icon className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-800 leading-tight">{feature.title}</p>
                          <p className="text-[9px] text-slate-500 leading-tight">{feature.desc}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-200">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-bold text-xs hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer shadow-md shadow-blue-200/50"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => router.push("/scrape")}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                      Start Scraping Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
