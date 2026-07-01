'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-slate-900 font-bold text-sm pr-4">{question}</p>
        <div
          style={open ? { backgroundColor: '#3b82f6' } : {}}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-200 ${open ? 'border-transparent' : 'border-slate-200'}`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-45 text-white' : 'text-slate-400'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-500 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Services', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Use case', href: '#pricing', id: 'pricing' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      const scrollPos = window.scrollY + 140
      let current = ''
      navLinks.forEach((link) => {
        const sec = document.getElementById(link.id)
        if (sec && sec.offsetTop <= scrollPos) {
          current = link.id
        }
      })
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white min-h-screen text-slate-900 overflow-x-hidden">

      {/* 1. Navbar - fixed, always visible on scroll */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled ? 'border-slate-200 shadow-sm' : 'border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="ScrapeEngine" className="w-9 h-9 rounded-xl" />
              <span className="text-xl font-bold tracking-tight" style={{ color: '#3b82f6' }}>ScrapeEngine</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="/" className="hover:text-[#3b82f6] transition-colors">Home</Link>
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  style={activeSection === link.id ? { color: '#3b82f6' } : {}}
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  {link.label}
                </a>
              ))}
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

      {/* Spacer to offset fixed navbar height */}
      <div className="pt-16">

      {/* 2. Hero */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-10 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#3b82f6] px-4 py-2 rounded-full text-xs font-bold border border-blue-200">
              <span style={{ backgroundColor: '#3b82f6' }} className="text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
              Next-Gen Social Media Scraper
            </div>

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

            {/* Dashboard Preview */}
            <div className="pt-12">
              <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-left">
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

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-base font-black text-slate-900">Welcome back</p>
                      <p className="text-xs text-slate-400">Here&apos;s what&apos;s happening with your campaigns today</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1">↻ Refresh</span>
                      <span style={{ backgroundColor: '#3b82f6' }} className="text-white text-xs font-bold px-3 py-1.5 rounded-lg">+ New campaign</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Companies', value: '184', change: '+12%', color: '#3b82f6' },
                      { label: 'Emails Extracted', value: '50', change: '+18%', color: '#10b981' },
                      { label: 'Total Jobs', value: '23', change: '+12%', color: '#f59e0b' },
                      { label: 'Success Rate', value: '57%', change: 'Needs attention', color: '#f59e0b' },
                    ].map((stat) => (
                      <div key={stat.label} style={{ borderLeftColor: stat.color }} className="bg-white border border-slate-100 border-l-4 rounded-xl p-3">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: stat.color }}>→ {stat.change}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white border border-slate-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-700 mb-3">Job success rate</p>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full flex-shrink-0" style={{ background: 'conic-gradient(#10b981 0% 57%, #f59e0b 57% 65%, #e2e8f0 65% 100%)' }}>
                          <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                            <span className="text-sm font-black">57%</span>
                          </div>
                        </div>
                        <div className="text-[10px] space-y-1">
                          <p className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Successful 13</p>
                          <p className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Running 2</p>
                          <p className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Failed 0</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-700 mb-3">Emails extracted</p>
                      <div className="flex items-end gap-1.5 h-14">
                        {[0, 0, 0, 0, 80, 0, 0].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.max(h, 5)}%`, backgroundColor: h > 0 ? '#3b82f6' : '#e2e8f0' }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-700 mb-2">Emails extracted over time</p>
                    <svg viewBox="0 0 300 70" className="w-full h-16">
                      <polygon points="0,68 40,68 80,68 120,68 160,20 200,12 240,12 280,8 280,70 0,70" fill="#3b82f6" opacity="0.1" />
                      <polyline points="0,68 40,68 80,68 120,68 160,20 200,12 240,12 280,8" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
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
              <div style={{ backgroundColor: '#3b82f6' }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">STEP 01</div>
              <div className="w-20 h-20 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9" style={{ color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Enter Keyword</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Type what you are looking for — like <span className="text-slate-700 font-semibold">&quot;IT companies in USA&quot;</span> or <span className="text-slate-700 font-semibold">&quot;marketing agencies in New York.&quot;</span></p>
            </div>

            <div className="group relative bg-white border-2 border-slate-100 hover:border-orange-500 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">STEP 02</div>
              <div className="w-20 h-20 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Scraper</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Our system connects to Apify and automatically scrapes company names, websites, locations and emails for you.</p>
            </div>

            <div className="group relative bg-white border-2 border-slate-100 hover:border-emerald-600 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest">STEP 03</div>
              <div className="w-20 h-20 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-6 transition-colors duration-300">
                <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Download CSV</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get a clean spreadsheet with all verified data, ready to import directly into your email outreach tool.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 text-base mt-3">Powerful features built for lead generation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />, title: 'Keyword Search', desc: 'Search any industry or location. Our engine finds the right companies automatically.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />, title: 'Email Extraction', desc: 'We pull verified company emails, websites, names and locations from across the web.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />, title: 'CSV Download', desc: 'Download your leads as a clean CSV file ready to import into any email tool.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, title: 'Dashboard Stats', desc: 'Track total companies scraped, jobs completed, and your latest activity at a glance.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />, title: 'Scrape History', desc: 'View all past scraping jobs with keyword, date, result count and status.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />, title: 'Secure Login', desc: 'JWT protected login system ensures only your team can access the platform.' },
            ].map((card) => (
              <div key={card.title} className="group bg-white border-2 border-slate-100 hover:border-[#3b82f6] rounded-2xl p-7 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <svg className="w-7 h-7" style={{ color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">{card.icon}</svg>
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
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>Powered by Apify</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Ways We Find Your Leads</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">We use Apify scrapers across three platforms to find emails from different sources — giving you the most complete lead data possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                bg: '#0a66c2', badge: 'LinkedIn', title: 'LinkedIn Scraper',
                desc: 'Search company pages and decision-makers directly on LinkedIn. We pull company names, titles, locations, websites and emails of key contacts.',
              },
              {
                icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                bg: '#10b981', badge: 'Google Maps', title: 'Google Maps Scraper',
                desc: 'Search any business type in any city or country. We pull business names, phone numbers, websites and emails directly from Google Maps listings.',
              },
              {
                icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                bg: '#7c3aed', badge: 'Apollo.io', title: 'Apollo.io Scraper',
                desc: "Tap into Apollo.io's database of verified B2B contacts. We extract company details, job titles, locations and direct emails for outreach.",
              },
            ].map((source) => (
              <div key={source.title} style={{ backgroundColor: source.bg }} className="rounded-2xl p-7 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">{source.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">{source.badge}</span>
                </div>
                <h3 className="text-lg font-black mb-3">{source.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-sm mt-2">Start free. Upgrade when you need more.</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-10 mt-8">
            <div className="bg-white border border-slate-200 rounded-full p-1.5 flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setBilling('monthly')}
                style={billing === 'monthly' ? { backgroundColor: '#3b82f6' } : {}}
                className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 ${billing === 'monthly' ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                style={billing === 'yearly' ? { backgroundColor: '#3b82f6' } : {}}
                className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 ${billing === 'yearly' ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Yearly
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Save 39%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {[
              {
                id: 'free',
                name: 'Free',
                description: 'Try it out, no credit card needed',
                monthly: 0,
                yearly: 0,
                cta: 'Free Plan',
                href: '/signup',
                popular: false,
                features: ['50 emails/month', '1 scraping job at a time', 'Basic email extraction', 'CSV export (limited)'],
              },
              {
                id: 'starter',
                name: 'Starter',
                description: 'More leads for growing outreach',
                monthly: 29,
                yearly: 199,
                cta: 'Get Starter',
                href: '/signup',
                popular: false,
                features: ['500 emails/month', '5 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Email support'],
              },
              {
                id: 'plus',
                name: 'Plus',
                description: 'Best for high-volume lead gen',
                monthly: 59,
                yearly: 399,
                cta: 'Get Plus',
                href: '/signup',
                popular: true,
                features: ['Unlimited emails', '10 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Priority support', 'All platforms', 'API access'],
              },
            ].map((plan) => {
              const price = billing === 'monthly' ? plan.monthly : plan.yearly
              const priceLabel = price === 0 ? 'Free' : `$${price}`
              const savings = plan.monthly * 12 - plan.yearly

              return (
                <div
                  key={plan.id}
                  style={plan.popular ? { borderColor: '#3b82f6' } : {}}
                  className={`relative bg-white rounded-2xl border-2 p-6 h-full flex flex-col transition-all duration-300 ${
                    plan.popular ? 'shadow-xl' : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="text-[10px] font-bold px-3 py-1 rounded-full shadow-lg bg-slate-800 text-white">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">{priceLabel}</span>
                      {priceLabel !== 'Free' && (
                        <span className="text-sm text-slate-500 font-medium">
                          {billing === 'monthly' ? '/month' : '/year'}
                        </span>
                      )}
                    </div>
                    {billing === 'yearly' && priceLabel !== 'Free' && (
                      <div className="mt-2">
                        <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          Save ${savings}/year
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    style={plan.id === 'free' ? {} : { backgroundColor: '#3b82f6' }}
                    className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 mb-6 ${
                      plan.id === 'free'
                        ? 'bg-slate-50 text-slate-400 border-2 border-slate-200'
                        : 'text-white hover:opacity-90 shadow-md shadow-blue-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-slate-900">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base mt-3">Everything you need to know about ScrapeEngine</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What is ScrapeEngine?', a: 'ScrapeEngine is a lead generation platform that automatically scrapes verified business emails from Google Maps, LinkedIn, and Apollo.io. You simply type a keyword like "IT companies in USA" and we deliver a ready-to-use CSV file with company names, emails, websites and locations.' },
              { q: 'How does the scraping work?', a: 'We connect to Apify, a powerful web scraping infrastructure, to search Google Maps, LinkedIn and Apollo.io based on your keyword. Results are saved to your account and available to download as a CSV file instantly.' },
              { q: 'Is the email data verified?', a: 'Yes! We use SMTP verification to check that extracted emails are valid before saving them. Our platform maintains a 98.2% accuracy rate across all extracted emails.' },
              { q: 'Can I use ScrapeEngine on WhatsApp?', a: 'Yes! ScrapeEngine has a WhatsApp AI chatbot. Simply message our business number, type a keyword like "marketing agencies in London", and our AI will scrape results and send you back the top companies directly on WhatsApp.' },
              { q: 'What is the difference between Monthly and Yearly plans?', a: 'The Yearly plan gives you a 39% discount compared to paying monthly. You get exactly the same features — just at a significantly lower price by committing annually.' },
              { q: 'Can I download results as a CSV?', a: 'Absolutely. Every scrape job produces a downloadable CSV file containing company name, website, email, location and more. You can import this directly into any email outreach tool like Mailchimp, HubSpot or Apollo.' },
              { q: 'How many results can I get per scrape?', a: 'On the Free plan you get up to 50 emails per month. The Starter plan gives you 500 emails per month with 5 concurrent jobs. The Plus plan gives you unlimited emails and 10 concurrent jobs running at the same time.' },
              { q: 'Is my data secure?', a: 'Yes. All accounts are protected with Clerk authentication which supports Google, Apple and email login. Your scraping history and data is private to your account and never shared with third parties.' },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-20 text-white relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Start Generating Verified Leads Today</h2>
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

      {/* 9. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="ScrapeEngine" className="w-9 h-9 rounded-xl" />
                <span className="text-xl font-extrabold text-white">ScrapeEngine</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">The fastest way to find verified business emails. Powered by Apify. Built for modern sales teams.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <a href="#faq" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">FAQ →</a>
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
            <p className="text-xs text-slate-600">&copy; 2026 ScrapeEngine Lead Systems. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-500 font-semibold">All systems operational</p>
            </div>
          </div>
        </div>
      </footer>

      </div>
      {/* end spacer wrapper */}

    </div>
  )
}