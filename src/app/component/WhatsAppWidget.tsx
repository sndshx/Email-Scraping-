"use client";

import { useState } from "react";

// ── WhatsApp Icon Component - Original Simple Logo ─────────────────────────────
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path 
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" 
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

      {/* Floating WhatsApp Button - Always Animating */}
      <button
        onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
        className="fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center z-40 animate-bounce"
      >
        <svg 
          className="w-16 h-16 drop-shadow-lg animate-pulse" 
          viewBox="0 0 175.216 175.552" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="whatsappGradient" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#57d163"/>
              <stop offset="1" stopColor="#23b33a"/>
            </linearGradient>
          </defs>
          <path 
            fill="url(#whatsappGradient)" 
            d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
          />
          <path 
            fill="#fff" 
            fillRule="evenodd" 
            d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
          />
        </svg>
        {/* Notification badge with ping animation */}
        <div className="absolute top-0 right-0 w-5 h-5 bg-[#DC2626] rounded-full flex items-center justify-center shadow-md border-2 border-white animate-ping"></div>
        <div className="absolute top-0 right-0 w-5 h-5 bg-[#DC2626] rounded-full flex items-center justify-center shadow-md border-2 border-white">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </button>
    </>
  );
}
