'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  // Adjust these to your real pricing — yearly shown here at ~20% off, billed annually
  const prices = {
    starter: { monthly: 29, yearly: 23 },
    plus: { monthly: 59, yearly: 47 },
  }

  return (
    <div className="bg-white min-h-screen text-slate-900">

      {/* 1. Navbar - sticky, stays visible on scroll */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="ScrapeEngine logo" width={32} height={32} className="rounded-xl" unoptimized />
              <span className="text-xl font-bold tracking-tight" style={{ color: '#3b82f6' }}>ScrapeEngine</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="/" className="hover:text-[#3b82f6] transition-colors">Home</Link>
              <a href="#features" className="hover:text-[#3b82f6] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#3b82f6] transition-colors">Services</a>
              <a href="#pricing" className="hover:text-[#3b82f6] transition-colors">Use case</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/signup" className="text-sm font-bold text-slate-700 hover:text-[#3b82f6] transition-colors">
                Sign up
              </Link>
              <Link
                href="/login"
                style={{ backgroundColor: '#3b82f6' }}
                className="inline-flex items-center gap-2 px-5 py-2.5 hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-10 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
              Extract Verified Leads From <span style={{ color: '#3b82f6' }}>Social Media</span>
            </h1>

            <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              Find verified business emails in seconds. We scrape Google Maps, LinkedIn and Apollo.io to deliver a ready-to-use CSV.
            </p>

            <div className="flex items-center justify-center gap-6">
              <Link
                href="/login"
                style={{ backgroundColor: '#3b82f6' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 hover:opacity-90 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg hover:scale-[1.02]"
              >
                Get started for free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href="#pricing" className="text-sm font-bold text-slate-700 hover:text-[#3b82f6] transition-colors">
                See our plans →
              </a>
            </div>

            {/* Real Dashboard Preview */}
            <div className="pt-12">
              <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-left">
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-md px-4 py-1 text-xs text-slate-400 border border-slate-200 max-w-xs w-full text-center">
                      scrapeengine.app/dashboard
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 py-4">
                    <div>
                      <p className="text-xl font-black text-slate-900">Welcome back</p>
                      <p className="text-sm text-slate-400 mt-1">Here&apos;s what&apos;s happening with your campaigns today</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500 border border-slate-200 px-4 py-2.5 rounded-lg flex items-center gap-1">
                        ↻ Refresh
                      </span>
                      <span style={{ backgroundColor: '#3b82f6' }} className="text-white text-sm font-bold px-4 py-2.5 rounded-lg">+ New campaign</span>
                    </div>
                  </div>

                  {/* Top stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Companies', value: '184', change: '+12%', color: '#3b82f6' },
                      { label: 'Emails Extracted', value: '50', change: '+18%', color: '#10b981' },
                      { label: 'Total Jobs', value: '23', change: '+12%', color: '#f59e0b' },
                      { label: 'Success Rate', value: '57%', change: 'Needs attention', color: '#f59e0b' },
                    ].map((stat) => (
                      <div key={stat.label} style={{ borderLeftColor: stat.color }} className="bg-white border border-slate-100 border-l-4 rounded-xl p-6 min-h-[140px] flex flex-col justify-between">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 my-3">{stat.value}</p>
                        <p className="text-xs font-semibold" style={{ color: stat.color }}>→ {stat.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Job success rate + emails extracted */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border border-slate-100 rounded-xl p-6 min-h-[200px]">
                      <p className="text-sm font-bold text-slate-700 mb-6">Job success rate</p>
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-full flex-shrink-0" style={{ background: 'conic-gradient(#10b981 0% 57%, #f59e0b 57% 65%, #e2e8f0 65% 100%)' }}>
                          <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                            <span className="text-xl font-black">57%</span>
                          </div>
                        </div>
                        <div className="text-xs space-y-2">
                          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Successful 13</p>
                          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Running 2</p>
                          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Failed 0</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-6 min-h-[200px]">
                      <p className="text-sm font-bold text-slate-700 mb-6">Emails extracted</p>
                      <div className="flex items-end gap-2 h-28">
                        {[0, 0, 0, 0, 80, 0, 0].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: h > 0 ? '#3b82f6' : '#e2e8f0' }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Line chart */}
                  <div className="bg-white border border-slate-100 rounded-xl p-6 min-h-[180px]">
                    <p className="text-sm font-bold text-slate-700 mb-4">Emails extracted over time</p>
                    <svg viewBox="0 0 300 70" className="w-full h-24">
                      <polyline
                        points="0,68 40,68 80,68 120,68 160,20 200,12 240,12 280,8"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                      />
                      <polygon points="0,68 40,68 80,68 120,68 160,20 200,12 240,12 280,8 280,70 0,70" fill="#3b82f6" opacity="0.1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '98.2%', label: 'SMTP Accuracy' },
                  { value: '< 1s', label: 'Scrape Time' },
                  { value: '12M+', label: 'Leads Extracted' },
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

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-base mt-3">Three simple steps to get your leads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="group relative bg-white border-2 border-slate-100 hover:border-[#3b82f6] rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div style={{ backgroundColor: '#3b82f6' }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">
                STEP 01
              </div>
              <div className="w-20 h-20 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9" style={{ color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Enter Keyword</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Type what you are looking for — like <span className="text-slate-700 font-semibold">&quot;IT companies in USA&quot;</span> or <span className="text-slate-700 font-semibold">&quot;marketing agencies in New York.&quot;</span>
              </p>
            </div>

            <div className="group relative bg-white border-2 border-slate-100 hover:border-orange-500 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-100">
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

            <div className="group relative bg-white border-2 border-slate-100 hover:border-emerald-600 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100">
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

      {/* 4. Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 text-base mt-3">Powerful features built for lead generation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
                title: 'Keyword Search',
                desc: 'Search any industry or location. Our engine finds the right companies automatically.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />,
                title: 'Email Extraction',
                desc: 'We pull verified company emails, websites, names and locations from across the web.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
                title: 'CSV Download',
                desc: 'Download your leads as a clean CSV file ready to import into any email tool.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Dashboard Stats',
                desc: 'Track total companies scraped, jobs completed, and your latest activity at a glance.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
                title: 'Scrape History',
                desc: 'View all past scraping jobs with keyword, date, result count and status.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                title: 'Secure Login',
                desc: 'JWT protected login system ensures only your team can access the platform.',
              },
            ].map((card) => (
              <div key={card.title} className="group bg-white border-2 border-slate-100 hover:border-[#3b82f6] rounded-2xl p-7 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <svg className="w-7 h-7" style={{ color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* 5. Lead Sources */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              Powered by Apify
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ways We Find Your Leads
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              We use Apify scrapers across three platforms to find emails from different sources — giving you the most complete lead data possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                ),
                bg: '#0a66c2',
                badgeText: 'LinkedIn',
                title: 'LinkedIn Scraper',
                desc: 'Search company pages and decision-makers directly on LinkedIn. We pull company names, titles, locations, websites and emails of key contacts.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                bg: '#10b981',
                badgeText: 'Google Maps',
                title: 'Google Maps Scraper',
                desc: 'Search any business type in any city or country. We pull business names, phone numbers, websites and emails directly from Google Maps listings.',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                bg: '#7c3aed',
                badgeText: 'Apollo.io',
                title: 'Apollo.io Scraper',
                desc: 'Tap into Apollo.io\'s database of verified B2B contacts. We extract company details, job titles, locations and direct emails for outreach.',
              },
            ].map((source) => (
              <div key={source.title} style={{ backgroundColor: source.bg }} className="rounded-2xl p-7 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {source.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    {source.badgeText}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-3">{source.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing - Modern Clean Design */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-600 text-base">Start free. Upgrade when you need more.</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-white shadow-md border border-gray-200">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                  billing === 'monthly' 
                    ? 'bg-white text-slate-700' 
                    : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all relative flex items-center gap-2 ${
                  billing === 'yearly' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-slate-500'
                }`}
              >
                Yearly
                {billing === 'yearly' && (
                  <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Current
              </div>
              
              <div className="mb-6 pt-2">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <p className="text-sm text-slate-400">Humanize your everyday writing</p>
              </div>
              
              <div className="mb-6">
                <p className="text-5xl font-bold text-slate-900">Free</p>
              </div>

              <Link 
                href="/signup" 
                className="block w-full text-center py-3.5 px-4 rounded-xl bg-green-50 text-green-600 font-semibold mb-8 border border-green-200"
              >
                Current Plan
              </Link>

              <ul className="space-y-4">
                {['50 emails/month', '1 scraping job at a time', 'Basic email extraction', 'CSV export (limited)'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <div className="mb-6 pt-5">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-sm text-slate-400">More room for everyday writing</p>
              </div>
              
              <div className="mb-2">
                <p className="text-5xl font-bold text-slate-900">
                  ${billing === 'yearly' ? '199' : prices.starter[billing]}
                  <span className="text-xl font-normal text-slate-400">/year</span>
                </p>
              </div>

              {billing === 'yearly' && (
                <p className="text-sm text-green-600 font-semibold mb-6">+ Save $148/year</p>
              )}

              <Link 
                href="/login" 
                className="block w-full text-center py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-slate-900 font-semibold mb-8 border border-gray-300 transition-colors"
              >
                Get Starter
              </Link>

              <ul className="space-y-4">
                {['500 emails/month', '5 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Email support'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plus Plan - Current */}
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Current
              </div>
              
              <div className="mb-6 pt-2">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plus</h3>
                <p className="text-sm text-slate-400">Best for regular creators</p>
              </div>
              
              <div className="mb-2">
                <p className="text-5xl font-bold text-slate-900">
                  ${billing === 'yearly' ? '399' : prices.plus[billing]}
                  <span className="text-xl font-normal text-slate-400">/year</span>
                </p>
              </div>

              {billing === 'yearly' && (
                <p className="text-sm text-green-600 font-semibold mb-6">+ Save $309/year</p>
              )}

              <Link 
                href="/login" 
                className="block w-full text-center py-3.5 px-4 rounded-xl bg-green-50 text-green-600 font-semibold mb-8 border border-green-200"
              >
                Current Plan
              </Link>

              <ul className="space-y-4">
                {['Unlimited emails', '10 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Priority support', 'All platforms', 'API access'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-20 text-white relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Start Generating Verified Leads Today
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto font-medium">
            Join thousands of modern founders, freelance agencies, and sales reps generating high-converting lead pipelines on autopilot.
          </p>
          <div className="pt-4">
            <Link href="/login" style={{ color: '#3b82f6' }} className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 font-black text-base rounded-2xl transition-all shadow-md hover:scale-[1.02]">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-12 border-b border-slate-800">

            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="ScrapeEngine logo" width={32} height={32} className="rounded-xl" />
                <span className="text-xl font-extrabold text-white">ScrapeEngine</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The fastest way to find verified business emails. Powered by Apify. Built for modern sales teams.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <Link href="/signup" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">Sign up →</Link>
                <Link href="/login" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">Login →</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact</h4>
              <div className="flex flex-col gap-3">
                <p className="text-slate-400 text-sm">Built for smart outreach teams</p>
                <p className="text-slate-400 text-sm">Powered by Apify</p>
              </div>
            </div>

          </div>

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