"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Zap } from "lucide-react";

export default function ProfileMenu() {
  const { signOut } = useClerk();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: 'user@scrapeengine.com',
    name: 'ScrapeEngine User',
    initial: 'S'
  });
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    daysLeft: 30,
    planType: 'Free',
    isActive: false
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/user-info");
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        }
      } catch (err) {
        console.error("User info fetch error:", err);
      }
    };

    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/user-subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscriptionInfo(data);
        }
      } catch (err) {
        console.error("Subscription fetch error:", err);
      }
    };

    fetchUserInfo();
    fetchSubscription();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
      >
        <span className="text-white text-sm font-extrabold leading-none select-none">{userInfo.initial}</span>
      </button>

      {/* Dropdown Menu */}
      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-lg font-bold">{userInfo.initial}</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{userInfo.name}</p>
                <p className="text-blue-100 text-xs">{userInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subscription</span>
              {subscriptionInfo.isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-700 text-[10px] font-bold">Active</span>
                </span>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-0.5">{subscriptionInfo.planType} Plan</p>
                  <p className="text-lg font-bold text-blue-900">{subscriptionInfo.daysLeft} Days</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-blue-600 mt-1">Remaining in your subscription</p>
            </div>

            {!subscriptionInfo.isActive && (
              <Link 
                href="/pricing"
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4 text-slate-400" />
              Manage Subscription
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
