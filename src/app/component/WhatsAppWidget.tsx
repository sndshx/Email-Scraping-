"use client";

import { useState } from "react";

// ── WhatsApp Icon Component ────────────────────────────────────────────────
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.247 1.414 1.414-5.247-0.292-0.507c-1.224-2.162-1.87-4.588-1.87-7.070 0-7.51 6.123-13.633 13.633-13.633s13.633 6.123 13.633 13.633c0 7.51-6.123 13.633-13.633 13.633z"/>
      <path d="M23.274 19.654c-0.385-0.194-2.283-1.125-2.637-1.253-0.354-0.129-0.611-0.194-0.868 0.194s-0.998 1.253-1.223 1.511c-0.226 0.258-0.451 0.29-0.836 0.097-0.385-0.194-1.625-0.599-3.096-1.911-1.145-1.020-1.918-2.282-2.144-2.667s-0.024-0.595 0.169-0.788c0.175-0.173 0.385-0.451 0.578-0.677 0.193-0.226 0.257-0.387 0.386-0.645s0.064-0.483-0.032-0.677c-0.097-0.194-0.868-2.091-1.189-2.863-0.314-0.751-0.632-0.651-0.868-0.663-0.225-0.011-0.482-0.013-0.739-0.013s-0.675 0.097-1.029 0.483c-0.354 0.387-1.349 1.318-1.349 3.215s1.381 3.728 1.574 3.986c0.193 0.258 2.717 4.15 6.584 5.818 0.92 0.397 1.638 0.634 2.197 0.811 0.923 0.294 1.762 0.253 2.427 0.153 0.741-0.111 2.283-0.933 2.605-1.834s0.322-1.673 0.226-1.834c-0.097-0.161-0.354-0.258-0.739-0.451z"/>
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
