import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 overflow-x-hidden">

      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-600">ScrapeEngine</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            </nav>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md">
              Login
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            {/* Badge — fixed icon to sparkle/star */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold border border-blue-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Next-Gen Social Email Scraper
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
              Extract Verified Leads From <span className="text-blue-600">Social Media</span>
            </h1>

            <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              Find highly targeted business emails in seconds. We scrape Google Maps, company websites, contact pages and more — powered by Apify — and deliver a ready-to-use CSV.
            </p>

            <div className="flex justify-center">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg hover:scale-[1.02]">
                Start Scraping for Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-100 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '98.2%', label: 'SMTP Accuracy' },
                  { value: '< 1s',  label: 'Scrape Time' },
                  { value: '12M+',  label: 'Leads Extracted' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. How It Works — REDESIGNED */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-base mt-3">Three simple steps to get your leads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Step 1 */}
            <div className="group relative bg-white border-2 border-slate-100 hover:border-blue-500 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">
                STEP 01
              </div>
              <div className="w-20 h-20 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Enter Keyword</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Type what you are looking for — like <span className="text-slate-700 font-semibold">"IT companies in USA"</span> or <span className="text-slate-700 font-semibold">"marketing agencies in New York."</span>
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white border-2 border-slate-100 hover:border-blue-500 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">
                STEP 02
              </div>
              <div className="w-20 h-20 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Scraper</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our system connects to Apify and automatically scrapes company names, websites, locations and emails for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white border-2 border-slate-100 hover:border-blue-500 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">
                STEP 03
              </div>
              <div className="w-20 h-20 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Download CSV</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Get a clean spreadsheet with all verified data, ready to import directly into your email outreach tool.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Features Grid — REDESIGNED */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 text-base mt-3">Powerful features built for lead generation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                iconBg: 'bg-blue-50 group-hover:bg-blue-100',
                iconColor: 'text-blue-600',
                borderHover: 'hover:border-blue-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
                title: 'Keyword Search',
                desc: 'Search any industry or location. Our engine finds the right companies automatically.',
              },
              {
                iconBg: 'bg-purple-50 group-hover:bg-purple-100',
                iconColor: 'text-purple-600',
                borderHover: 'hover:border-purple-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />,
                title: 'Email Extraction',
                desc: 'We pull verified company emails, websites, names and locations from across the web.',
              },
              {
                iconBg: 'bg-emerald-50 group-hover:bg-emerald-100',
                iconColor: 'text-emerald-600',
                borderHover: 'hover:border-emerald-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
                title: 'CSV Download',
                desc: 'Download your leads as a clean CSV file ready to import into any email tool.',
              },
              {
                iconBg: 'bg-rose-50 group-hover:bg-rose-100',
                iconColor: 'text-rose-600',
                borderHover: 'hover:border-rose-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Dashboard Stats',
                desc: 'Track total companies scraped, jobs completed, and your latest activity at a glance.',
              },
              {
                iconBg: 'bg-amber-50 group-hover:bg-amber-100',
                iconColor: 'text-amber-600',
                borderHover: 'hover:border-amber-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
                title: 'Scrape History',
                desc: 'View all past scraping jobs with keyword, date, result count and status.',
              },
              {
                iconBg: 'bg-indigo-50 group-hover:bg-indigo-100',
                iconColor: 'text-indigo-600',
                borderHover: 'hover:border-indigo-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                title: 'Secure Login',
                desc: 'JWT protected login system ensures only your team can access the platform.',
              },
            ].map((card) => (
              <div key={card.title} className={`group bg-white border-2 border-slate-100 ${card.borderHover} rounded-2xl p-7 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 cursor-default`}>
                <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center transition-colors duration-300`}>
                  <svg className={`w-7 h-7 ${card.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Scrape Sources */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Powered by Apify
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              6 Ways We Find Your Leads
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              We use multiple Apify scrapers to find emails from different sources — giving you the most complete lead data possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                iconBg: 'bg-emerald-50',
                badge: 'bg-emerald-100 text-emerald-700',
                badgeText: 'Google Maps',
                title: 'Google Maps Scraper',
                desc: 'Search any business type in any city or country. We pull business names, phone numbers, websites and emails directly from Google Maps listings.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                iconBg: 'bg-blue-50',
                badge: 'bg-blue-100 text-blue-700',
                badgeText: 'Contact Details',
                title: 'Contact Detail Scraper',
                desc: 'Extracts full contact details from company pages — including phone numbers, addresses, social links and email addresses of key decision makers.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                ),
                iconBg: 'bg-purple-50',
                badge: 'bg-purple-100 text-purple-700',
                badgeText: 'Website Contact',
                title: 'Website Contact Scraper',
                desc: "Visits a company's website and finds the Contact Us page, About page and footer to extract any email addresses or contact forms listed.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                iconBg: 'bg-rose-50',
                badge: 'bg-rose-100 text-rose-700',
                badgeText: 'Website Email',
                title: 'Website Email Scraper',
                desc: 'Crawls the entire website — not just the contact page — and extracts every email address found across all pages including blog posts and team pages.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                ),
                iconBg: 'bg-amber-50',
                badge: 'bg-amber-100 text-amber-700',
                badgeText: 'Email Extractor',
                title: 'Email Extractor',
                desc: 'A powerful general-purpose email extractor that finds and verifies email addresses from any URL or domain you provide, with built-in duplicate removal.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                ),
                iconBg: 'bg-teal-50',
                badge: 'bg-teal-100 text-teal-700',
                badgeText: 'Domain Contact',
                title: 'Domain Contact Scraper',
                desc: 'Takes a domain name and scrapes all contact emails associated with it — including WHOIS data, DNS records and publicly listed contact addresses.',
              },

            ].map((source) => (
              <div key={source.title} className="group bg-white hover:shadow-lg border-2 border-slate-100 hover:border-blue-400 rounded-2xl p-6 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${source.iconBg} rounded-2xl flex items-center justify-center`}>
                    {source.icon}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${source.badge}`}>
                    {source.badgeText}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">{source.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Start Generating Verified Leads Today
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto font-medium">
            Join thousands of modern founders, freelance agencies, and sales reps generating high-converting lead pipelines on autopilot.
          </p>
          <div className="pt-4">
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-slate-50 font-black text-base rounded-2xl transition-all shadow-md hover:scale-[1.02]">
              Get Started — Login
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

     {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-12 border-b border-slate-800">
            
            {/* Brand */}
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold text-white">ScrapeEngine</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The fastest way to find verified business emails. Powered by Apify. Built for modern sales teams.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">Login →</Link>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact</h4>
              <div className="flex flex-col gap-3">
                <p className="text-slate-400 text-sm">Built for smart outreach teams</p>
                <p className="text-slate-400 text-sm">Powered by Apify</p>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              &copy; 2026 ScrapeEngine Lead Systems. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-500 font-semibold">All systems operational</p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}