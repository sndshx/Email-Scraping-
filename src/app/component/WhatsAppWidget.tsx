"use client";

import { useState } from "react";

// ── WhatsApp Icon Component - Flat Style ─────────────────────────────
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      {/* Green circle background */}
      <circle cx="50" cy="50" r="45" fill="#25D366" />
      
      {/* White phone icon */}
      <path 
        d="M 30 70 C 28 72 25 72 23 70 C 21 68 21 65 23 63 L 25 61 C 26 60 26 58 25 57 L 22 54 C 21 53 19 53 18 54 L 15 57 C 12 60 12 65 15 68 L 32 85 C 35 88 40 88 43 85 L 46 82 C 47 81 47 79 46 78 L 43 75 C 42 74 40 74 39 75 L 37 77 C 35 79 32 79 30 77 L 23 70 C 21 68 21 65 23 63 L 30 70 Z M 70 30 L 77 37 C 79 39 79 42 77 44 L 70 51 C 68 53 65 53 63 51 L 56 44 C 54 42 54 39 56 37 L 63 30 C 65 28 68 28 70 30 Z" 
        fill="white"
      />
      
      {/* Chat bubble tail */}
      <path 
        d="M 25 75 L 20 82 L 28 78 Z" 
        fill="#25D366"
      />
    </svg>
  );
}

export default function WhatsAppWidget() {
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);

  const openWhatsApp = () => {
    const phoneNumber = "14155238886"; // Your Twilio WhatsApp number
    const message = "Hi! I'd like to scrape some companies.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* WhatsApp Chat Widget */}
      {showWhatsAppChat && (
        <div className="fixed bottom-24 right-8 w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slideUp">
          {/* Header - WhatsApp Green */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
              </div>
              <div>
                <p className="text-white font-bold text-base">ScrapeEngine</p>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  <p className="text-white/90 text-sm font-medium">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWhatsAppChat(false)}
              className="text-white/90 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body - WhatsApp Background Pattern */}
          <div className="p-6 bg-[#E5DDD5] min-h-[420px] max-h-[420px] overflow-y-auto relative" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
            <div className="space-y-4">
              {/* Bot Message with realistic WhatsApp styling */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md max-w-[85%] border border-slate-100">
                  <p className="text-sm text-slate-800 leading-relaxed">
                    👋 <span className="font-semibold">Hi! I&apos;m your ScrapeEngine AI assistant.</span>
                  </p>
                  <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                    Send me a message on WhatsApp to:
                  </p>
                  <ul className="text-sm text-slate-700 mt-3 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#25D366] font-bold">•</span>
                      <span>Scrape companies by keyword</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#25D366] font-bold">•</span>
                      <span>Get CSV files instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#25D366] font-bold">•</span>
                      <span>Check your subscription</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#25D366] font-bold">•</span>
                      <span>Ask questions anytime</span>
                    </li>
                  </ul>
                  <p className="text-xs text-slate-400 mt-2">10:30 AM</p>
                </div>
              </div>

              {/* Info Card with improved styling */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-900 mb-1">Quick Tips</p>
                    <p className="text-xs text-blue-700 mb-3">Try sending:</p>
                  </div>
                </div>
                <div className="space-y-2 ml-11">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                    <p className="text-xs text-blue-900 font-mono">
                      &quot;IT companies in New York&quot;
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                    <p className="text-xs text-blue-900 font-mono">
                      &quot;plan&quot; - Check usage
                    </p>
                  </div>
                </div>
              </div>

              {/* Typing indicator (optional) */}
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with improved button */}
          <div className="p-5 bg-white border-t border-slate-200">
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6B] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-6 h-6" />
              <span className="text-base">Open WhatsApp Chat</span>
            </button>
            <p className="text-xs text-slate-500 text-center mt-3 font-medium">
              💬 Chat with AI • ⚡ Available 24/7
            </p>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full shadow-2xl shadow-green-300/50 flex items-center justify-center transition-all hover:scale-110 z-40 group"
      >
        <WhatsAppIcon className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white text-xs font-bold">1</span>
        </div>
        {/* Pulse ring animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
      </button>
    </>
  );
}
