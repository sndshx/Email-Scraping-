'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslation, type Translation } from '@/lib/translations'

/* ─── Language context (shared across all components in the page) ─── */
const LangContext = createContext<Translation>(getTranslation('en'))

/* ─── World Languages ─── */
const WORLD_LANGUAGES = [
  // Most Popular
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese (Mandarin)', native: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  // Europe
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱' },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾' },
  { code: 'ca', name: 'Catalan', native: 'Català', flag: '🏴' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  // Asia
  { code: 'th', name: 'Thai', native: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', native: 'ລາວ', flag: '🇱🇦' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino (Tagalog)', native: 'Filipino', flag: '🇵🇭' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'fa', name: 'Persian (Farsi)', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫' },
  { code: 'uz', name: 'Uzbek', native: "O'zbek", flag: '🇺🇿' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ', flag: '🇰🇿' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргыз', flag: '🇰🇬' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'tk', name: 'Turkmen', native: 'Türkmen', flag: '🇹🇲' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  // Africa
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy', flag: '🇲🇬' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho', flag: '🇱🇸' },
  { code: 'sn', name: 'Shona', native: 'chiShona', flag: '🇿🇼' },
  { code: 'ny', name: 'Nyanja (Chichewa)', native: 'Nyanja', flag: '🇲🇼' },
  { code: 'lg', name: 'Luganda', native: 'Luganda', flag: '🇺🇬' },
  { code: 'ak', name: 'Akan', native: 'Akan', flag: '🇬🇭' },
  { code: 'tw', name: 'Twi', native: 'Twi', flag: '🇬🇭' },
  { code: 'ff', name: 'Fula', native: 'Fula', flag: '🇬🇳' },
  { code: 'wo', name: 'Wolof', native: 'Wolof', flag: '🇸🇳' },
  { code: 'om', name: 'Oromo', native: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', flag: '🇪🇷' },
  // Americas
  { code: 'qu', name: 'Quechua', native: 'Runasimi', flag: '🇵🇪' },
  { code: 'gn', name: 'Guarani', native: "Avañe'ẽ", flag: '🇵🇾' },
  { code: 'ay', name: 'Aymara', native: 'Aymar aru', flag: '🇧🇴' },
  { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl ayisyen', flag: '🇭🇹' },
  // Pacific
  { code: 'mi', name: 'Māori', native: 'Te Reo Māori', flag: '🇳🇿' },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', flag: '🇼🇸' },
  { code: 'to', name: 'Tongan', native: 'lea fakatonga', flag: '🇹🇴' },
  { code: 'fj', name: 'Fijian', native: 'Vosa Vakaviti', flag: '🇫🇯' },
  // Other
  { code: 'eu', name: 'Basque', native: 'Euskera', flag: '🏴' },
  { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸' },
  { code: 'oc', name: 'Occitan', native: 'Occitan', flag: '🏴' },
  { code: 'la', name: 'Latin', native: 'Latina', flag: '🏛️' },
  { code: 'eo', name: 'Esperanto', native: 'Esperanto', flag: '🌍' },
]

/* ─── 3D tilt wrapper: tracks cursor and applies perspective rotation ─── */
function Tilt({
  children,
  className = '',
  max = 10,
  scale = 1.02,
  glare = false,
}: {
  children: React.ReactNode
  className?: string
  max?: number
  scale?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, o: 0 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * max * 2
    const ry = (px - 0.5) * max * 2
    setStyle({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale},${scale},${scale})`,
      transition: 'transform 60ms linear',
    })
    if (glare) setGlarePos({ x: px * 100, y: py * 100, o: 0.18 })
  }

  function handleLeave() {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 500ms cubic-bezier(0.23,1,0.32,1)',
    })
    if (glare) setGlarePos((g) => ({ ...g, o: 0 }))
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
      className={className}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.o}), transparent 55%)`,
            transition: 'opacity 300ms ease',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  )
}

/* ─── Language Selector Component ─── */
function LanguageSelector({ onSelect }: { onSelect?: (code: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(WORLD_LANGUAGES[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = WORLD_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(lang: typeof WORLD_LANGUAGES[0]) {
    setSelected(lang)
    setOpen(false)
    setSearch('')
    onSelect?.(lang.code)
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => { setOpen(!open); setSearch('') }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 select-none ${open
          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50'
          }`}
        aria-label="Select Language"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline max-w-[80px] truncate">{selected.native}</span>
        <span className="sm:hidden text-xs font-bold uppercase tracking-wide">{selected.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[9999] overflow-hidden"
          style={{ animation: 'langDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Language list */}
          <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                No language found
              </div>
            ) : (
              <ul className="py-1.5">
                {filtered.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => handleSelect(lang)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${selected.code === lang.code
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <span className="text-base leading-none flex-shrink-0 w-6 text-center">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold leading-tight truncate ${selected.code === lang.code ? 'text-blue-700' : 'text-slate-800'}`}>
                          {lang.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium leading-tight truncate">{lang.native}</div>
                      </div>
                      {selected.code === lang.code && (
                        <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] text-slate-400 font-medium text-center">
              {filtered.length} language{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes langDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  )
}

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const step = Math.ceil(to / (duration / 16))
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + step, to)
            setCount(current)
            if (current >= to) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

/* ─── FAQ Item ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${open ? 'border-blue-300 shadow-md shadow-blue-50 -translate-y-0.5' : 'border-slate-200 hover:border-blue-200'}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 bg-white">
        <p className="text-slate-900 font-bold text-sm pr-4">{question}</p>
        <div
          style={open ? { backgroundColor: '#3b82f6' } : {}}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${open ? 'border-transparent' : 'border-slate-200'}`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-45 text-white' : 'text-slate-400'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-6 pb-5 bg-white border-t border-slate-100">
          <p className="text-slate-500 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}



const TYPEWRITER_WORDS = ['Social Media', 'LinkedIn', 'Google Maps', 'Apollo.io', 'Any Platform']

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [typeIndex, setTypeIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const stepsScrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 })

  function handleHeroMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setHeroParallax({ x: px, y: py })
  }

  function handleHeroMouseLeave() {
    setHeroParallax({ x: 0, y: 0 })
  }

  // Typewriter effect
  useEffect(() => {
    const word = TYPEWRITER_WORDS[typeIndex]
    const speed = isDeleting ? 50 : 90
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.slice(0, displayText.length + 1))
        if (displayText.length + 1 === word.length) {
          setTimeout(() => setIsDeleting(true), 1800)
        }
      } else {
        setDisplayText(word.slice(0, displayText.length - 1))
        if (displayText.length - 1 === 0) {
          setIsDeleting(false)
          setTypeIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, typeIndex])

  const scrollToStep = (index: number) => {
    if (stepsScrollRef.current) {
      const container = stepsScrollRef.current
      const card = container.children[index] as HTMLElement
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        })
        setActiveStep(index)
      }
    }
  }

  const handleStepsScroll = () => {
    if (stepsScrollRef.current) {
      const container = stepsScrollRef.current
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const index = Math.round(scrollLeft / (containerWidth || 1))
      if (index >= 0 && index < 5 && activeStep !== index) {
        setActiveStep(index)
      }
    }
  }

  const featuresList = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
      title: 'Keyword Search',
      desc: 'Search any industry or location. Our AI engine finds the right companies automatically — no configuration needed.',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />,
      title: 'Email Extraction',
      desc: 'We pull SMTP-verified emails, websites, names, and profiles across social networks simultaneously.',
      color: '#6366f1',
      bgColor: '#eef2ff',
      img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
      title: 'CSV Download',
      desc: 'Download your leads as a clean, formatted CSV file ready to import into Mailchimp, HubSpot, Apollo or any outreach tool.',
      color: '#10b981',
      bgColor: '#ecfdf5',
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      title: 'Dashboard Analytics',
      desc: 'Track total companies scraped, jobs completed, emails found and your campaign performance at a glance.',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
      title: 'Scrape History',
      desc: 'Full job history with keyword, date, result count and status. Re-run or export any past job anytime.',
      color: '#ec4899',
      bgColor: '#fdf2f8',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
      title: 'Secure Access',
      desc: 'JWT-protected sessions with Clerk authentication — supports Google, Apple and email login. Your data stays private.',
      color: '#0ea5e9',
      bgColor: '#f0f9ff',
      img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
    },
  ]

  useReveal()

  const navLinks = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
      const scrollPos = window.scrollY + 140
      let current = ''
      navLinks.forEach((link) => {
        const sec = document.getElementById(link.id)
        if (sec && sec.offsetTop <= scrollPos) current = link.id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="landing-page bg-white min-h-screen text-slate-900 overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="ScrapeEngine" width={160} height={50} className="h-10 w-auto" />
              <span className="text-xl font-black tracking-tight" style={{ color: '#3b82f6' }}>ScrapeEngine</span>
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
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <Link href="/signup" className="text-sm font-bold text-slate-700 hover:text-[#3b82f6] transition-colors">
                Sign up
              </Link>
              <Link
                href="/login"
                style={{ backgroundColor: '#3b82f6' }}
                className="inline-flex items-center gap-2 px-5 py-2.5 hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-lg hover:scale-[1.02]"
              >
                Login
              </Link>
            </div>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-[#3b82f6] py-2">
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language</p>
              <LanguageSelector />
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <Link href="/signup" className="text-sm font-bold text-center text-slate-700 border border-slate-200 rounded-xl py-2.5">Sign up</Link>
              <Link href="/login" style={{ backgroundColor: '#3b82f6' }} className="text-sm font-bold text-center text-white rounded-xl py-2.5">Login</Link>
            </div>
          </div>
        )}
      </header>

      <div className="pt-16">

        {/* ─── HERO ─── */}
        <section className="relative overflow-visible bg-white">


          {/* Ambient floating gradient orbs + particle dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="orb orb-blue absolute -top-24 left-[8%] w-72 h-72 rounded-full blur-3xl opacity-40 animate-float-slow" />
            <div className="orb orb-indigo absolute top-40 right-[4%] w-96 h-96 rounded-full blur-3xl opacity-30 animate-float-slower" />
            <div className="orb orb-blue absolute bottom-0 left-1/2 w-80 h-40 rounded-full blur-3xl opacity-20 animate-float-slow" />
            {/* Particle dots */}
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-400 opacity-20 animate-float-particle"
                style={{
                  width: `${3 + (i % 5)}px`,
                  height: `${3 + (i % 5)}px`,
                  left: `${5 + (i * 5.5) % 90}%`,
                  top: `${10 + (i * 7) % 80}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${4 + (i % 4)}s`,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-5 pb-14 lg:pt-10 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

              {/* Left: Copy */}
              <div className="space-y-7 min-w-0 pt-1 lg:pt-2">

                <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-black text-slate-900 tracking-tight leading-[1.08]">
                  Extract Verified
                  <br />
                  Leads From{' '}
                  <span className="relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] bg-[length:200%_auto] animate-gradient-x">
                      {displayText}
                    </span>
                    <span className="inline-block w-[3px] h-[0.85em] bg-blue-500 ml-1 align-middle animate-blink" />
                  </span>
                </h1>

                <p className="animate-fade-in-up delay-200 text-slate-500 text-sm sm:text-base max-w-lg font-medium leading-relaxed">
                  Find verified emails and build clean, targeted contact lists in seconds. Turn profile data into ready-to-use CSVs with <span className="text-blue-600 font-bold">zero manual effort</span>.
                </p>

                <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/login"
                    style={{ backgroundColor: '#3b82f6' }}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 hover:opacity-90 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:scale-[1.03] hover:shadow-blue-200 hover:shadow-xl overflow-hidden"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                    <span className="relative">Get started for free</span>
                    <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch how it works
                  </a>
                </div>

                {/* Social proof */}
                <div className="animate-fade-in-up delay-400 flex items-center gap-4 pt-2">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="User"
                        className="w-9 h-9 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform duration-200 relative"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Trusted by 2,400+ sales teams</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero visual with floating badges */}
              <div
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="relative animate-slide-right delay-200 min-w-0"
                style={{ perspective: '1000px' }}
              >
                {/* Stacked card deck — sits behind the main mockup for real layered depth */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                  style={{
                    transform: `translateZ(-40px) translateY(18px) rotate(${3 + heroParallax.x * 2}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1)',
                    boxShadow: '0 20px 40px -18px rgba(15,23,42,0.18)',
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                  style={{
                    transform: `translateZ(-20px) translateY(9px) rotate(${-2 + heroParallax.x * 2}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1)',
                    boxShadow: '0 16px 32px -16px rgba(15,23,42,0.15)',
                  }}
                />

                {/* Main dashboard mockup */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 flex h-[410px] text-[9px] font-sans"
                  style={{
                    transform: `translateZ(20px) rotateX(${heroParallax.y * -12}deg) rotateY(${heroParallax.x * 16}deg) scale3d(1.02,1.02,1.02)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 250ms cubic-bezier(0.23,1,0.32,1)',
                    boxShadow: '0 40px 80px -20px rgba(59,130,246,0.3), 0 15px 35px -10px rgba(15,23,42,0.2)',
                  }}
                >

                  {/* Sidebar */}
                  <aside className="w-1/4 bg-white border-r border-slate-150 p-3 flex flex-col justify-between select-none">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 px-1 py-1">
                        <Image src="/logo.png" alt="ScrapeEngine Logo" width={80} height={26} className="h-6 w-auto" />
                        <span className="font-extrabold text-slate-800 text-[11px]">ScrapeEngine</span>
                      </div>
                      <nav className="space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
                          Dashboard
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-slate-500 rounded-lg font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Scraper
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-slate-500 rounded-lg font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Result
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-slate-500 rounded-lg font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          History
                        </div>
                      </nav>
                      <div className="pt-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider px-2">Outreach</span>
                        <div className="flex items-center gap-2 px-2 py-1.5 mt-1 text-slate-500 rounded-lg font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          Whatsapp
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Main Panel */}
                  <main className="flex-1 p-3.5 overflow-hidden space-y-3 bg-slate-50 select-none text-slate-700">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <h2 className="font-extrabold text-[14px] text-slate-900 leading-tight">Welcome back</h2>
                        <p className="text-[8px] text-slate-400 font-medium leading-none mt-1">Here&apos;s what&apos;s happening with your campaigns today</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 bg-white">
                          <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 bg-white">
                          <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" /></svg>
                        </div>
                        <button style={{ backgroundColor: '#3b82f6' }} className="px-2.5 py-1 text-white font-bold text-[8px] rounded-lg shadow-sm hover:opacity-90 cursor-pointer">
                          New campaign
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { title: 'Total companies', val: '75', trend: '+12%', color: 'border-l-blue-500' },
                        { title: 'Emails extracted', val: '75', trend: '+18%', color: 'border-l-emerald-500' },
                        { title: 'Total jobs', val: '9', trend: '+12%', color: 'border-l-amber-500' },
                        { title: 'Success rate', val: '46%', trend: 'Needs attention', color: 'border-l-purple-500', isWarning: true },
                      ].map((card) => (
                        <div key={card.title} className={`bg-white p-2.5 rounded-xl border border-slate-200 border-l-4 ${card.color} shadow-sm flex flex-col justify-between h-[52px] text-left`}>
                          <span className="text-[7px] font-bold text-slate-400 leading-none">{card.title}</span>
                          <span className="text-[13px] font-extrabold text-slate-900 leading-none py-0.5">{card.val}</span>
                          <span className={`text-[6px] font-bold px-1 py-0.5 rounded-full w-max leading-none ${card.isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                            {card.trend}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-[125px]">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-extrabold text-[9px] text-slate-900">Job success rate</span>
                          <span className="text-[7px] text-slate-400 font-semibold">All time</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-0.5 flex-1">
                          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center scale-90">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="5.5" fill="transparent" />
                              <circle cx="32" cy="32" r="26" stroke="#22c55e" strokeWidth="5.5" fill="transparent" strokeDasharray="163" strokeDashoffset="88" strokeLinecap="round" />
                              <circle cx="32" cy="32" r="26" stroke="#f59e0b" strokeWidth="5.5" fill="transparent" strokeDasharray="163" strokeDashoffset="75" strokeLinecap="round" />
                            </svg>
                            <span className="absolute font-black text-slate-900 text-[10px]">46%</span>
                          </div>
                          <div className="flex-1 space-y-0.5 text-left">
                            {[
                              { label: 'Successful', val: '4', dot: 'bg-emerald-500' },
                              { label: 'Running', val: '5', dot: 'bg-amber-500' },
                              { label: 'Failed', val: '0', dot: 'bg-rose-500' },
                              { label: 'Total', val: '9', dot: 'bg-slate-400' },
                            ].map((leg) => (
                              <div key={leg.label} className="flex items-center justify-between text-[6.5px] font-semibold text-slate-500 leading-none">
                                <div className="flex items-center gap-1">
                                  <div className={`w-1 h-1 rounded-full ${leg.dot}`} />
                                  <span>{leg.label}</span>
                                </div>
                                <span className="font-bold text-slate-800">{leg.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-[125px]">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-extrabold text-[9px] text-slate-900">Emails extracted</span>
                          <span className="text-[7px] text-slate-400 font-semibold">This week</span>
                        </div>
                        <div className="flex items-end justify-between gap-1 pt-1 pb-0.5 px-0.5 border-b border-slate-100 flex-1">
                          {[
                            { day: 'Mon', h: '30%', active: false },
                            { day: 'Tue', h: '45%', active: false },
                            { day: 'Wed', h: '55%', active: false },
                            { day: 'Thu', h: '35%', active: false },
                            { day: 'Fri', h: '40%', active: false },
                            { day: 'Sat', h: '75%', active: false },
                            { day: 'Sun', h: '90%', active: true },
                          ].map((bar) => (
                            <div key={bar.day} className="flex flex-col items-center flex-1 gap-0.5">
                              <div className="w-full bg-slate-100 rounded-t-sm h-11 flex items-end">
                                <div
                                  style={{ height: bar.h, backgroundColor: bar.active ? '#3b82f6' : '#93c5fd' }}
                                  className="w-full rounded-t-sm"
                                />
                              </div>
                              <span className="text-[5.5px] text-slate-400 font-bold">{bar.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Jobs Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="flex justify-between items-center px-3 py-2 border-b border-slate-100">
                        <span className="font-extrabold text-[9px] text-slate-900">Recent Jobs</span>
                        <span className="text-[7px] text-blue-500 font-bold cursor-pointer">View all →</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {[
                          { keyword: 'IT companies USA', emails: 284, status: 'Done', statusColor: 'bg-emerald-100 text-emerald-600', time: '2m ago' },
                          { keyword: 'Marketing agencies UK', emails: 142, status: 'Running', statusColor: 'bg-amber-100 text-amber-600', time: '5m ago' },
                          { keyword: 'SaaS startups London', emails: 97, status: 'Done', statusColor: 'bg-emerald-100 text-emerald-600', time: '12m ago' },
                        ].map((job) => (
                          <div key={job.keyword} className="flex items-center justify-between px-3 py-1.5">
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="text-[7.5px] font-bold text-slate-700 truncate">{job.keyword}</p>
                              <p className="text-[6.5px] text-slate-400 font-medium">{job.emails} emails · {job.time}</p>
                            </div>
                            <span className={`text-[6px] font-bold px-1.5 py-0.5 rounded-full ${job.statusColor}`}>{job.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </main>
                </div>

                {/* Floating depth badges */}
                <div
                  className="hidden sm:flex absolute -top-6 -right-4 items-center gap-1.5 bg-white rounded-xl shadow-xl border border-slate-100 px-3 py-2 animate-float-badge"
                  style={{ transform: `translateZ(110px) translate(${heroParallax.x * 20}px, ${heroParallax.y * 20}px)`, transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1)' }}
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-900 leading-none">Email Verified</p>
                    <p className="text-[7px] text-slate-400 font-semibold">99.8% deliverability</p>
                  </div>
                </div>

                <div
                  className="hidden sm:flex absolute -bottom-6 -left-5 items-center gap-1.5 bg-white rounded-xl shadow-xl border border-slate-100 px-3 py-2 animate-float-badge-delayed"
                  style={{ transform: `translateZ(140px) translate(${heroParallax.x * -26}px, ${heroParallax.y * -26}px)`, transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1)' }}
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-900 leading-none">284 leads found</p>
                    <p className="text-[7px] text-slate-400 font-semibold">in 42 seconds</p>
                  </div>
                </div>

                {/* Soft ground shadow that breathes for depth */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-blue-500/20 blur-2xl animate-pulse-shadow -z-10" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
        </section>

        {/* ─── TRUSTED BY LOGOS BAR ─── */}
        <section className="py-10 bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Trusted by teams at leading companies
            </p>
            <div className="relative overflow-hidden">
              <div className="flex gap-12 animate-logo-scroll items-center">
                {/* Apollo.io */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#7c3aed"/>
                    <path d="M12 7L15 14H9L12 7Z" fill="white"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Apollo.io</span>
                </div>
                
                {/* Mailchimp */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#FFE01B"/>
                    <path d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14C16 15.1046 15.1046 16 14 16H10C8.89543 16 8 15.1046 8 14V10Z" fill="#241C15"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Mailchimp</span>
                </div>

                {/* Salesforce */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00A1E0"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Salesforce</span>
                </div>

                {/* LinkedIn */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">LinkedIn</span>
                </div>

                {/* Slack */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M6 15a2 2 0 01-2-2 2 2 0 012-2h2v2a2 2 0 01-2 2zm0-6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H6z" fill="#E01E5A"/>
                    <path d="M13 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2h-2zm6 0a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2z" fill="#36C5F0"/>
                    <path d="M19 13a2 2 0 01-2 2 2 2 0 01-2-2v-2h2a2 2 0 012 2zm-6 6a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2z" fill="#2EB67D"/>
                    <path d="M11 19a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2v2h2zm6-6a2 2 0 01-2 2h-2v-2a2 2 0 012-2 2 2 0 012 2z" fill="#ECB22E"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Slack</span>
                </div>

                {/* Notion */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#000000"/>
                    <path d="M6 6h12v12H6z" fill="white"/>
                    <path d="M8 8h8v2H8V8zm0 4h8v2H8v-2z" fill="#000000"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Notion</span>
                </div>

                {/* Zapier */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 12l10 10 10-10L12 2z" fill="#FF4A00"/>
                    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Zapier</span>
                </div>

                {/* Duplicate for seamless scroll */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#7c3aed"/>
                    <path d="M12 7L15 14H9L12 7Z" fill="white"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Apollo.io</span>
                </div>
                
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#FFE01B"/>
                    <path d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14C16 15.1046 15.1046 16 14 16H10C8.89543 16 8 15.1046 8 14V10Z" fill="#241C15"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Mailchimp</span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00A1E0"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Salesforce</span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">LinkedIn</span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M6 15a2 2 0 01-2-2 2 2 0 012-2h2v2a2 2 0 01-2 2zm0-6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H6z" fill="#E01E5A"/>
                    <path d="M13 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2h-2zm6 0a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2z" fill="#36C5F0"/>
                    <path d="M19 13a2 2 0 01-2 2 2 2 0 01-2-2v-2h2a2 2 0 012 2zm-6 6a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2z" fill="#2EB67D"/>
                    <path d="M11 19a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2v2h2zm6-6a2 2 0 01-2 2h-2v-2a2 2 0 012-2 2 2 0 012 2z" fill="#ECB22E"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Slack</span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#000000"/>
                    <path d="M6 6h12v12H6z" fill="white"/>
                    <path d="M8 8h8v2H8V8zm0 4h8v2H8v-2z" fill="#000000"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Notion</span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 12l10 10 10-10L12 2z" fill="#FF4A00"/>
                    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-black text-slate-700 whitespace-nowrap">Zapier</span>
                </div>
              </div>
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </section>

        {/* ─── ANIMATED STATS ─── */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl opacity-60" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 reveal">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-5 shadow-lg shadow-blue-500/30">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Real Results
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Numbers That <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Speak Louder</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
                Real metrics from real users. Our platform delivers measurable results every single day.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  val: 2400, 
                  suffix: '+', 
                  label: 'Active Sales Teams', 
                  desc: 'Companies trust ScrapeEngine daily', 
                  color: 'from-blue-600 to-blue-700', 
                  bg: 'bg-gradient-to-br from-blue-50 to-blue-100/70',
                  iconBg: 'bg-blue-500',
                  borderColor: 'border-blue-200'
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  val: 5, 
                  suffix: 'M+', 
                  label: 'Emails Verified', 
                  desc: 'SMTP-verified, bounce-proof contacts', 
                  color: 'from-purple-600 to-purple-700', 
                  bg: 'bg-gradient-to-br from-purple-50 to-purple-100/70',
                  iconBg: 'bg-purple-500',
                  borderColor: 'border-purple-200'
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  val: 42, 
                  suffix: 's', 
                  label: 'Avg. Scrape Time', 
                  desc: 'From keyword to leads in seconds', 
                  color: 'from-amber-500 to-orange-600', 
                  bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
                  iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
                  borderColor: 'border-amber-200'
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  val: 99, 
                  suffix: '.8%', 
                  label: 'Deliverability Rate', 
                  desc: 'Industry-leading email accuracy', 
                  color: 'from-emerald-600 to-teal-600', 
                  bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
                  iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
                  borderColor: 'border-emerald-200'
                },
              ].map((stat, i) => (
                <Tilt 
                  key={stat.label} 
                  max={8} 
                  scale={1.02}
                  glare
                  className={`reveal ${stat.bg} border ${stat.borderColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center group relative overflow-hidden`}
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Icon with animated background */}
                  <div className="relative mb-2 inline-flex">
                    <div className="text-slate-600 p-1.5 transform group-hover:scale-125 group-hover:-translate-y-1 group-hover:rotate-6 transition-all duration-300 animate-bounce-slow">
                      <div className="w-4 h-4">
                        {stat.icon}
                      </div>
                    </div>
                    {/* Subtle glow effect on hover */}
                    <div className={`absolute inset-0 ${stat.iconBg} rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300 animate-pulse-slow`} />
                    {/* Rotating ring */}
                    <div className={`absolute inset-0 border-2 ${stat.borderColor} rounded-full opacity-0 group-hover:opacity-50 group-hover:scale-150 transition-all duration-500`} />
                  </div>
                  
                  {/* Number with gradient */}
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1.5 relative">
                    <Counter to={stat.val} suffix={stat.suffix} />
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs font-black text-slate-800 mb-1 relative">{stat.label}</div>
                  
                  {/* Description */}
                  <div className="text-[10px] text-slate-600 font-medium leading-tight relative">{stat.desc}</div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white opacity-60 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white opacity-60 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 reveal">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 rounded-full px-4 py-1.5 text-xs font-bold text-blue-700 mb-4">
                Step-by-Step Process
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Works</span>
              </h2>
              <p className="text-slate-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed font-medium">
                Extract verified contact lists and target exact profiles in five simple, automated stages.
              </p>
            </div>

            {/* Stepper Navigation Tabs */}
            <div className="flex justify-center mb-8 max-w-4xl mx-auto border-b border-slate-200/80 px-2 reveal">
              {[
                { id: 0, label: '01. Sign In' },
                { id: 1, label: '02. Set Up Targeting' },
                { id: 2, label: '03. Scraper Runs' },
                { id: 3, label: '04. Download CSV' },
                { id: 4, label: '05. Launch Outreach' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToStep(tab.id)}
                  className={`flex-1 text-center pb-3 text-[9px] sm:text-xs font-extrabold tracking-tight transition-all relative border-b-2 -mb-[2px] cursor-pointer ${activeStep === tab.id
                    ? 'border-blue-500 text-blue-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Slider Container Wrapper */}
            <div className="relative group/slider max-w-6xl mx-auto px-2 md:px-12 reveal">
              {/* Left Arrow Button */}
              <button
                onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-slate-500 hover:text-blue-600 md:flex hidden ${activeStep === 0 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 hover:shadow-lg'
                  }`}
                aria-label="Previous Step"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={() => scrollToStep(Math.min(4, activeStep + 1))}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-slate-500 hover:text-blue-600 md:flex hidden ${activeStep === 4 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 hover:shadow-lg'
                  }`}
                aria-label="Next Step"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Snap Scroll Area */}
              <div
                ref={stepsScrollRef}
                onScroll={handleStepsScroll}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth gap-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >

                {/* STEP 1 CARD */}
                <div className="snap-center shrink-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 py-4 md:py-6">
                  {/* Left Column: text details */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white bg-blue-500">
                        STEP 01
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Access Account
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Sign Up or Login Instantly
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium font-geist">
                      Create your free account or sign in to access your lead dashboard. ScrapeEngine supports secure Google, Apple, or email magic link credentials.
                    </p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4">
                      {[
                        { title: 'Google & Apple Login', desc: 'Secure, passwordless verification inside 10 seconds.' },
                        { title: 'Dashboard Access', desc: 'Manage your credits, scraper runs, and history archives in one place.' },
                        { title: 'JWT Protection', desc: 'Sessions are protected under industry-standard Clerk encryption.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 text-blue-500">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                            <span className="text-slate-500 text-[11px] inline-block leading-normal">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Real Screenshot Image */}
                  <div className="lg:col-span-7" style={{ perspective: '900px' }}>
                    <Tilt max={12} scale={1.03} glare className="card-3d w-full h-[280px] border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 bg-white rounded-md text-[9px] text-slate-500 font-semibold select-none font-mono border border-slate-200 flex items-center gap-1.5">
                          <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          app.scrapeengine.com/login
                        </div>
                        <div className="w-10" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&auto=format&fit=crop&q=80"
                          alt="Secure login interface"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg border border-white/60">
                            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-900 leading-none">Secure Authentication</p>
                              <p className="text-[9px] text-slate-500 mt-0.5">Google · Apple · Email — JWT protected</p>
                            </div>
                            <div className="ml-auto"><span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Verified</span></div>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>

                {/* STEP 2 CARD */}
                <div className="snap-center shrink-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 py-4 md:py-6">
                  {/* Left Column: text details */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white bg-blue-500">
                        STEP 02
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Targeting Config
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Set Up Targeting Parameters
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                      Enter search keywords matching your target prospects and select geographic locations. The AI parsing engine creates optimized crawl queries.
                    </p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4">
                      {[
                        { title: 'Niche Keywords', desc: 'Search tags like "dental clinic", "SaaS startup", or "architect".' },
                        { title: 'Geographic Boundaries', desc: 'Target cities, postal codes, states, or country codes worldwide.' },
                        { title: 'Unified Input', desc: 'AI translates natural terms to scan corporate listings and pages.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 text-blue-500">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                            <span className="text-slate-500 text-[11px] inline-block leading-normal">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Real Screenshot Image */}
                  <div className="lg:col-span-7" style={{ perspective: '900px' }}>
                    <Tilt max={12} scale={1.03} glare className="card-3d w-full h-[280px] border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 bg-white rounded-md text-[9px] text-slate-500 font-semibold select-none font-mono border border-slate-200">
                          app.scrapeengine.com/scraper
                        </div>
                        <div className="w-10" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80"
                          alt="Keyword targeting setup"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/20 to-transparent" />
                        <div className="absolute top-4 left-4 right-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/60 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="text-[11px] font-bold text-slate-800 flex-1">IT companies in USA</span>
                            <span className="w-[1.5px] h-3.5 bg-blue-500 animate-pulse inline-block" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5 border border-white/60">
                            <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            <span className="text-[9px] font-bold text-slate-700">New York, CA, Texas</span>
                          </div>
                          <button style={{ backgroundColor: '#3b82f6' }} className="px-3 py-1.5 text-white font-extrabold text-[9px] rounded-lg shadow flex items-center gap-1">
                            Run Scraper
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                          </button>
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>

                {/* STEP 3 CARD */}
                <div className="snap-center shrink-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 py-4 md:py-6">
                  {/* Left Column: text details */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white bg-amber-500">
                        STEP 03
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Extraction
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      AI Automated Scraper Runs & Verifies
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                      Our scraper accesses company details, search directories, and website metadata. It finds direct email addresses and validates their deliverables in real-time.
                    </p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4">
                      {[
                        { title: 'Multi-Source Mining', desc: 'Crawls Google Maps profiles, social cards, and company landing sites.' },
                        { title: 'SMTP Validation', desc: 'Connects directly to MX servers to verify inboxes without sending emails.' },
                        { title: 'Metadata Parsing', desc: 'Harvests verified names, websites, phone numbers, and coordinates.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <div className="w-4 h-4 rounded-full bg-amber-50 border border-amber-205 flex items-center justify-center shrink-0 mt-0.5 text-amber-500">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                            <span className="text-slate-500 text-[11px] inline-block leading-normal">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Real Screenshot Image */}
                  <div className="lg:col-span-7" style={{ perspective: '900px' }}>
                    <Tilt max={12} scale={1.03} glare className="card-3d w-full h-[280px] border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 bg-white rounded-md text-[9px] text-slate-500 font-semibold select-none font-mono border border-slate-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                          app.scrapeengine.com/scraper/processing
                        </div>
                        <div className="w-10" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=900&auto=format&fit=crop&q=80"
                          alt="Data scraping in progress"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-slate-900/30 to-transparent" />
                        <div className="absolute top-3 left-3 right-3">
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-500/30 font-mono text-[8px] space-y-0.5">
                            <div className="text-slate-400">[17:31:04] Found: &apos;Vortex Tech Inc&apos; (vortextech.com)</div>
                            <div className="text-emerald-400 font-bold">[17:31:07] SMTP Handshake: info@vortextech.com ➔ VALID ✓</div>
                            <div className="text-amber-400 animate-pulse font-bold">[17:31:12] Querying MX servers for &apos;Apex Labs&apos;...</div>
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="flex gap-3">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center border border-white/60">
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Scraped</p>
                              <p className="text-[14px] font-black text-slate-900 leading-none">48</p>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center border border-white/60">
                              <p className="text-[8px] font-bold text-emerald-600 uppercase">Verified</p>
                              <p className="text-[14px] font-black text-emerald-600 leading-none">41</p>
                            </div>
                          </div>
                          <div className="bg-amber-500/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[9px] font-black text-white">64% Done</span>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>

                {/* STEP 4 CARD */}
                <div className="snap-center shrink-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 py-4 md:py-6">
                  {/* Left Column: text details */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white bg-emerald-500">
                        STEP 04
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Leads Export
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Download CSV Lead Spreadsheet
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                      Your leads are ready to download in a structured sheet. Standard formatting allows seamless imports directly into Mailchimp, HubSpot, Apollo, or outreach tools.
                    </p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4">
                      {[
                        { title: 'CSV Formatting', desc: 'Pre-mapped headers for names, corporate emails, phone numbers, and location.' },
                        { title: 'Immediate Sync ready', desc: 'Zero manual header cleaning or schema edits needed before uploads.' },
                        { title: 'Job History Archives', desc: 'Access and download past campaigns from Scrape History anytime.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-500">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                            <span className="text-slate-500 text-[11px] inline-block leading-normal">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Real Screenshot Image */}
                  <div className="lg:col-span-7" style={{ perspective: '900px' }}>
                    <Tilt max={12} scale={1.03} glare className="card-3d w-full h-[280px] border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 bg-white rounded-md text-[9px] text-slate-500 font-semibold select-none font-mono border border-slate-200">
                          app.scrapeengine.com/scraper/export
                        </div>
                        <div className="w-10" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&auto=format&fit=crop&q=80"
                          alt="CSV spreadsheet export"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-slate-900/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/60">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-[10px] font-black text-slate-900">142 Leads Export-Ready</span>
                              </div>
                              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">SMTP Verified</span>
                            </div>
                            <button className="w-full bg-emerald-500 text-white font-extrabold text-[9px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download CSV — HubSpot · Mailchimp · Apollo Ready
                            </button>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>

                {/* STEP 5 CARD */}
                <div className="snap-center shrink-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 py-4 md:py-6">
                  {/* Left Column: text details */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white bg-indigo-500 animate-pulse">
                        STEP 05
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Outreach Launch
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Launch Cold Campaigns & Track Metrics
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                      Automate outreach sequences directly using your clean lead records. Hit target prospects, follow up automatically, and monitor live deliverability and reply ratios.
                    </p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4">
                      {[
                        { title: 'Automated Cold Emails', desc: 'Sync your validated prospect list with automated sequences in lem-list or instantly.ai.' },
                        { title: 'Inbox Reputation Protection', desc: 'Verified list restricts bounces below 2%, maintaining sender domain integrity.' },
                        { title: 'Live Campaign Monitoring', desc: 'Analyze open triggers, direct replies, and booked appointments dynamically.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-indigo-500">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                            <span className="text-slate-500 text-[11px] inline-block leading-normal">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Real Screenshot Image */}
                  <div className="lg:col-span-7" style={{ perspective: '900px' }}>
                    <Tilt max={12} scale={1.03} glare className="card-3d w-full h-[280px] border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 bg-white rounded-md text-[9px] text-slate-500 font-semibold select-none font-mono border border-slate-200">
                          app.scrapeengine.com/outreach/stats
                        </div>
                        <div className="w-10" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80"
                          alt="Email outreach campaign analytics"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/20 to-transparent" />
                        <div className="absolute top-3 left-3 right-3">
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Delivered', value: '1,248', color: 'text-white', sub: '99.8% rate', subColor: 'text-emerald-400' },
                              { label: 'Open Rate', value: '68.4%', color: 'text-emerald-400', sub: '853 Opens', subColor: 'text-slate-300' },
                              { label: 'Reply Rate', value: '24.1%', color: 'text-blue-400', sub: '301 Replies', subColor: 'text-slate-300' },
                            ].map((stat) => (
                              <div key={stat.label} className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center border border-white/60">
                                <p className="text-[7px] font-bold text-slate-500 uppercase">{stat.label}</p>
                                <p className={`text-[13px] font-black leading-none mt-0.5 ${stat.color} text-slate-900`}>{stat.value}</p>
                                <p className={`text-[7px] font-semibold mt-0.5 ${stat.subColor}`}>{stat.sub}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/60 space-y-1.5">
                            <div className="flex justify-between items-center text-[8.5px]">
                              <span className="font-bold text-slate-800 truncate max-w-[160px]">Quick question about Vortex Tech</span>
                              <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full font-black text-[7px]">Replied ✓</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span className="text-[8px] font-bold text-emerald-600">Synced with Apollo.io sequences</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>

              </div>

              {/* Navigation Indicators / Dots */}
              <div className="flex justify-center gap-2.5 mt-8">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${activeStep === idx
                      ? 'bg-blue-600 w-8'
                      : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-8 reveal">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 rounded-full px-4 py-1.5 text-xs font-bold text-blue-700 mb-4">
                Core Features
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Everything You <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Need</span>
              </h2>
              <p className="text-slate-500 text-base mt-4 max-w-xl">Powerful features built for modern lead generation at scale</p>
            </div>

            <div className="overflow-hidden w-full py-4 relative" style={{ perspective: '900px' }}>
              <div className="flex gap-6 animate-infinite-scroll">
                {[...featuresList, ...featuresList].map((card, i) => (
                  <Tilt
                    key={`${card.title}-${i}`}
                    max={16}
                    scale={1.03}
                    className="card-3d group bg-white border-2 border-slate-100 hover:border-transparent rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-400 cursor-default w-[300px] sm:w-[350px] md:w-[380px] flex-shrink-0"
                  >
                    {/* Feature image */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(255,255,255,1) 100%)` }} />
                      {/* Icon chip */}
                      <div
                        className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300"
                        style={{
                          backgroundColor: card.bgColor,
                          transform: 'translateZ(30px)',
                          transformStyle: 'preserve-3d',
                          boxShadow: '0 8px 16px -6px rgba(15,23,42,0.25)',
                        }}
                      >
                        <svg className="w-5 h-5" style={{ color: card.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {card.icon}
                        </svg>
                      </div>
                    </div>
                    <div className="px-6 pt-5 pb-7">
                      <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </Tilt>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── LEAD SOURCES ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 reveal">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">Ways We Find Your Leads</h2>
              <p className="text-slate-500 text-base mt-4 max-w-xl mx-auto leading-relaxed">Three platforms. One dashboard. The most complete B2B lead data possible.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
              {[
                {
                  color: '#0a66c2',
                  badge: 'LinkedIn',
                  title: 'LinkedIn Scraper',
                  desc: 'Search company pages and decision-makers directly on LinkedIn. We extract company names, job titles, locations, websites and direct emails of key contacts.',
                  img: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&h=400&fit=crop&crop=center',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                  stats: ['Company pages', 'Decision makers', 'Direct emails'],
                },
                {
                  color: '#10b981',
                  badge: 'Google Maps',
                  title: 'Google Maps Scraper',
                  desc: 'Search any business type in any city or country. We pull business names, phone numbers, websites and emails directly from Google Maps listings.',
                  img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop&crop=center',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  stats: ['Local businesses', 'Phone & email', 'Any location'],
                },
                {
                  color: '#7c3aed',
                  badge: 'Apollo.io',
                  title: 'Apollo.io Scraper',
                  desc: "Tap into Apollo.io's database of verified B2B contacts. We extract company details, job titles, locations and direct emails for high-quality outreach.",
                  img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  stats: ['B2B contacts', 'Verified emails', 'Job titles'],
                },
              ].map((source, i) => (
                <Tilt
                  key={source.title}
                  max={14}
                  scale={1.02}
                  className={`card-3d reveal group bg-white border border-slate-200/60 hover:border-slate-300 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-400 cursor-default max-w-[340px] mx-auto w-full`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={source.img}
                      alt={source.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                        {source.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full border border-white/30">
                        {source.badge}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 bg-white border-t border-slate-100">
                    <h3 className="text-base font-black mb-2 text-slate-900 group-hover:text-blue-500 transition-colors">{source.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3.5">{source.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {source.stats.map((s) => (
                        <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50/80 px-2 py-0.5 rounded-full border border-slate-200/60">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-20 bg-white relative overflow-hidden border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14 reveal">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold text-blue-700 mb-4">
                What Our Users Say
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Loved by <span className="text-blue-600">2,400+ Teams</span>
              </h2>
              <p className="text-slate-600 text-base mt-4 max-w-lg mx-auto">
                Don&apos;t just take our word for it. Here&apos;s what sales leaders say about ScrapeEngine.
              </p>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-6 min-w-max">
                {[
                  {
                    quote: "ScrapeEngine cut our lead research time by 85%. We went from spending 3 hours building a list to having 500 verified contacts in under 5 minutes. Absolute game changer.",
                    name: 'Alex Johnson',
                    role: 'Head of Sales',
                    company: 'TechVentures Inc.',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: '85% time saved',
                  },
                  {
                    quote: "The SMTP verification is what sets it apart. Our bounce rate dropped from 12% to 0.8% overnight. HubSpot is happy, our domain reputation is healthy, and deals are flowing.",
                    name: 'Maria Chen',
                    role: 'Growth Lead',
                    company: 'ScaleHQ',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: '0.8% bounce rate',
                  },
                  {
                    quote: "We use it every week to build targeted LinkedIn lead lists for our agency clients. The Apollo.io scraper is incredibly accurate. Best ROI tool in our stack by far.",
                    name: 'Jordan Smith',
                    role: 'Agency Founder',
                    company: 'Outreach Studio',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: 'Best ROI tool',
                  },
                  {
                    quote: "Integration with our CRM was seamless. The CSV exports are perfectly formatted and ready to import. Saved us countless hours of manual data cleanup.",
                    name: 'Sarah Williams',
                    role: 'Sales Operations',
                    company: 'CloudSync',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: 'Seamless CRM',
                  },
                  {
                    quote: "The data quality is exceptional. We've seen a 3x increase in positive replies since switching. Our SDRs are now reaching actual decision makers.",
                    name: 'Michael Torres',
                    role: 'VP of Sales',
                    company: 'GrowthLabs',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: '3x more replies',
                  },
                  {
                    quote: "Customer support is outstanding. They helped us set up custom workflows and the results have been phenomenal. Highly recommend for B2B teams.",
                    name: 'Emily Rodriguez',
                    role: 'Marketing Director',
                    company: 'LeadGen Pro',
                    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
                    stars: 5,
                    highlight: 'Top Support',
                  },
                ].map((t, i) => (
                  <Tilt
                    key={t.name}
                    max={6}
                    scale={1.01}
                    glare
                    className="reveal bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 w-[380px] flex-shrink-0"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(t.stars)].map((_, si) => (
                        <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                        {t.highlight}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-slate-700 text-sm leading-relaxed flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover" />
                      <div>
                        <p className="text-slate-900 text-xs font-black leading-none">{t.name}</p>
                        <p className="text-slate-500 text-[10px] font-semibold mt-0.5">{t.role} · {t.company}</p>
                      </div>
                      <div className="ml-auto w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                    </div>
                  </Tilt>
                ))}
              </div>
            </div>

            {/* Scroll hint */}
            <div className="text-center mt-4">
              <p className="text-xs text-slate-400 font-medium">← Scroll to see more reviews →</p>
            </div>
          </div>

          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" className="py-16 bg-white relative overflow-hidden border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 reveal">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed font-medium">
                Choose the perfect plan for your lead generation needs. Start free and scale up as you grow.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${billingCycle === 'yearly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Yearly
                    <span className="bg-yellow-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      Save 43%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch" style={{ perspective: '1100px' }}>
              {[
                {
                  id: 'free',
                  name: 'Free',
                  desc: 'Try it out, no credit card needed',
                  price: { monthly: 0, yearly: 0 },
                  features: [
                    '50 emails/month',
                    '1 scraping job at a time',
                    'Basic email extraction',
                    'CSV export (limited)'
                  ],
                  cta: 'Start for Free',
                  href: '/signup',
                  popular: false
                },
                {
                  id: 'starter',
                  name: 'Starter',
                  desc: 'More leads for growing outreach',
                  price: { monthly: 29, yearly: 199 },
                  features: [
                    '500 emails/month',
                    '5 concurrent jobs',
                    'Advanced extraction',
                    'Unlimited CSV export',
                    'Email support'
                  ],
                  cta: 'Get Started',
                  href: '/pricing',
                  popular: false
                },
                {
                  id: 'plus',
                  name: 'Plus',
                  desc: 'Best for high-volume lead gen',
                  price: { monthly: 59, yearly: 399 },
                  features: [
                    'Unlimited emails',
                    '10 concurrent jobs',
                    'Advanced extraction',
                    'Unlimited CSV export',
                    'Priority support',
                    'All platforms',
                    'API access'
                  ],
                  cta: 'Upgrade to Plus',
                  href: '/pricing',
                  popular: true
                }
              ].map((plan, idx) => {
                const isPopular = plan.popular;
                const priceVal = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
                const priceFormatted = plan.id === 'free' ? 'Free' : `$${priceVal}`;
                const periodText = plan.id === 'free' ? '' : (billingCycle === 'monthly' ? '/mo' : '/yr');

                const CardInner = (
                  <div
                    className={`card-3d reveal flex flex-col justify-between bg-white rounded-2xl border p-6 duration-300 relative h-full ${isPopular
                      ? 'border-blue-500 shadow-lg shadow-blue-500/5'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                      }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm animate-float-badge">
                        Most Popular
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name & Desc */}
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                        <p className="text-slate-400 text-[11px] mt-1 font-semibold leading-normal">{plan.desc}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-0.5 pt-1">
                        <span className="text-3xl font-black tracking-tight text-slate-900">
                          {priceFormatted}
                        </span>
                        {periodText && (
                          <span className="text-slate-400 text-[10px] font-bold">{periodText}</span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-100 w-full" />

                      {/* Features List */}
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex gap-2 items-center text-[11px]">
                            <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-slate-650 font-bold leading-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6">
                      <Link
                        href={plan.href}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-black text-center transition-all inline-block hover:scale-[1.01] shadow-sm ${isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                );

                return isPopular ? (
                  <Tilt key={plan.id} max={10} scale={1.04} className="h-full">
                    {CardInner}
                  </Tilt>
                ) : (
                  <div key={plan.id} className="h-full hover:scale-[1.01] transition-transform duration-300">
                    {CardInner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-20 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-12 reveal">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 text-base mt-4 max-w-xl mx-auto">
                Have questions about ScrapeEngine? Here are answers to our most common inquiries.
              </p>
            </div>

            {/* Accordion container */}
            <div className="space-y-4 max-w-3xl mx-auto text-left reveal">
              <FAQItem
                question="What is ScrapeEngine?"
                answer="ScrapeEngine is an AI-powered B2B lead generation tool that helps you scrape and verify email addresses, phone numbers, and profile details from platforms like LinkedIn, Google Maps, and Apollo.io."
              />
              <FAQItem
                question="How do you verify emails?"
                answer="We connect directly to MX servers and perform an SMTP handshake to verify if the email inbox exists in real-time, without ever sending a real message. This ensures your bounce rate remains below 2%."
              />
              <FAQItem
                question="Can I export data to my CRM?"
                answer="Yes, all scraped lists are ready to be downloaded as clean, standardized CSV files that you can import directly into HubSpot, Mailchimp, Apollo, lem-list, or any other outreach software."
              />
              <FAQItem
                question="Is there a free trial?"
                answer="Yes! Our Free Plan includes 50 verified email extractions per month so you can try out our scrapers with zero commitments or credit cards."
              />
              <FAQItem
                question="Can I cancel my subscription anytime?"
                answer="Absolutely. You can cancel, upgrade, or downgrade your paid subscription at any time directly from your billing dashboard settings page."
              />
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="reveal">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Start Extracting<br />
                <span className="text-blue-600">Verified Leads Today</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                Join 2,400+ growth teams. Get 50 free verified emails on the house — no credit card required. Scale up when you&apos;re ready.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 text-white font-black text-sm rounded-xl transition-all hover:shadow-2xl hover:scale-[1.04] overflow-hidden shadow-lg hover:bg-blue-700"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <svg className="relative w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="relative">Get Started — It&apos;s Free</span>
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-300 hover:bg-slate-50 transition-all hover:scale-[1.02] hover:border-slate-400"
                >
                  View Pricing
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                {['✓ No credit card', '✓ Free forever plan', '✓ 50 free leads/month', '✓ Cancel anytime'].map((item) => (
                  <span key={item} className="text-slate-600 text-xs font-semibold">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          className="relative text-zinc-400 overflow-hidden bg-black border-t border-zinc-900"
        >
          {/* CTA Banner */}
          <div className="relative border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div
                className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-zinc-200"
              >
                <div>
                  <h3 className="text-xl font-black text-zinc-950 mb-1">Ready to extract your first leads?</h3>
                  <p className="text-zinc-500 text-sm font-medium">Join 2,400+ sales teams already using ScrapeEngine.</p>
                </div>
                <Link
                  href="/signup"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-sm font-extrabold rounded-xl hover:bg-black transition-all shadow-md shadow-zinc-950/10 hover:scale-[1.02]"
                >
                  Start for free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Main footer grid */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 pb-12 border-b border-zinc-900">

              {/* Brand column */}
              <div className="col-span-2 sm:col-span-3 md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" alt="ScrapeEngine" width={160} height={50} className="h-10 w-auto" />
                  <span className="text-xl font-black text-white tracking-tight">ScrapeEngine</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-[280px]">
                  The fastest way to extract verified business leads. Built for modern outreach teams who demand results.
                </p>

                {/* Social links */}
                <div className="flex items-center gap-2.5 pt-1">
                  {[
                    { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                    { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                    { label: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Scrapers links */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Scrapers</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'LinkedIn', href: '#features' },
                    { label: 'Google Maps', href: '#features' },
                    { label: 'Apollo.io', href: '#features' },
                    { label: 'Verifier', href: '#features' }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-200"
                    >
                      <span className="w-0 group-hover:w-1.5 h-px bg-white transition-all duration-200 rounded" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Product links */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Product</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Features', href: '#features' },
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Pricing', href: '#pricing' },
                    { label: 'FAQ', href: '#faq' }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-200"
                    >
                      <span className="w-0 group-hover:w-1.5 h-px bg-white transition-all duration-200 rounded" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal links */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Legal</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Privacy', href: '#' },
                    { label: 'Terms', href: '#' },
                    { label: 'GDPR', href: '#' },
                    { label: 'Cookies', href: '#' }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-200"
                    >
                      <span className="w-0 group-hover:w-1.5 h-px bg-white transition-all duration-200 rounded" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact column - Right side */}
              <div className="col-span-2 sm:col-span-3 md:col-span-1 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Contact</h4>
                <div className="space-y-3 text-xs text-zinc-400 font-medium">
                  <div className="space-y-0.5">
                    <p className="text-zinc-500 text-[9px] uppercase font-bold leading-none mb-1">Email</p>
                    <a href="mailto:support@scrapeengine.com" className="hover:text-white transition-colors block truncate">support@scrapeengine.com</a>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-zinc-500 text-[9px] uppercase font-bold leading-none mb-1">Hotline</p>
                    <a href="tel:+442079460192" className="hover:text-white transition-colors block">+44 20 7946 0192</a>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-zinc-500 text-[9px] uppercase font-bold leading-none mb-1">HQ Address</p>
                    <span className="block text-zinc-400 leading-tight">London SE1 9SG, UK</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-zinc-500 text-[10px] font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xs text-zinc-500 font-medium">
                &copy; 2026 ScrapeEngine Lead Systems. All rights reserved.
              </p>

              {/* Compliance & Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 font-semibold select-none">
                <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  GDPR Compliant
                </span>
                <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  SSL Secure 256-bit
                </span>
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* ─── Global animation keyframes ─── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.23,1,0.32,1) both; }
        .delay-100 { animation-delay: 0.05s; }
        .delay-200 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.25s; }
        .delay-400 { animation-delay: 0.35s; }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(24px) rotateY(-6deg); }
          to   { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        .animate-slide-right { animation: slideRight 0.8s cubic-bezier(0.23,1,0.32,1) both; }

        @keyframes floatSlow {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-25px) scale(1.08); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-25px,20px) scale(1.05); }
        }
        .animate-float-slow { animation: floatSlow 9s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }
        .orb-blue { background: radial-gradient(circle, #3b82f6, transparent 70%); }
        .orb-indigo { background: radial-gradient(circle, #6366f1, transparent 70%); }

        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradientX 3s ease infinite; }

        @keyframes floatBadge {
          0%, 100% { transform: translateY(0) translateZ(110px); }
          50% { transform: translateY(-10px) translateZ(110px); }
        }
        @keyframes floatBadgeDelayed {
          0%, 100% { transform: translateY(0) translateZ(140px); }
          50% { transform: translateY(10px) translateZ(140px); }
        }
        .animate-float-badge { animation: floatBadge 5s ease-in-out infinite; }
        .animate-float-badge-delayed { animation: floatBadgeDelayed 6s ease-in-out infinite 0.5s; }

        @keyframes pulseShadow {
          0%, 100% { opacity: 0.5; transform: translate(-50%,0) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%,0) scale(1.12); }
        }
        .animate-pulse-shadow { animation: pulseShadow 4s ease-in-out infinite; }

        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infiniteScroll 34s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }

        /* ─── NEW: Logo scroll animation ─── */
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-logo-scroll {
          animation: logoScroll 30s linear infinite;
        }
        .animate-logo-scroll:hover {
          animation-play-state: paused;
        }

        /* ─── NEW: Blinking cursor for typewriter ─── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 0.9s step-end infinite; }

        /* ─── NEW: Floating particles ─── */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.3); opacity: 0.4; }
        }
        .animate-float-particle { animation: floatParticle var(--duration, 5s) ease-in-out infinite; }

        /* ─── NEW: Bounce slow animation for icons ─── */
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }

        /* ─── NEW: Pulse slow animation for glow ─── */
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }

        /* ─── NEW: Text shimmer effect ─── */
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 25%, #06b6d4 50%, #8b5cf6 75%, #3b82f6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s linear infinite;
        }

        /* ─── NEW: Number count pop ─── */
        @keyframes countPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* ─── NEW: Ping animation for badge dot ─── */
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping { animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; }

        /* ─── NEW: Gradient border for section headers ─── */
        .gradient-border-b {
          border-bottom: 2px solid;
          border-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4) 1;
        }

        .reveal, .reveal-left, .reveal-right {
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1);
        }
        .reveal { transform: translateY(28px); }
        .reveal-left { transform: translateX(-28px); }
        .reveal-right { transform: translateX(28px); }
        .reveal.is-visible, .reveal-left.is-visible, .reveal-right.is-visible {
          opacity: 1;
          transform: translate(0,0);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }

        /* Resting-state 3D emboss: light top edge + soft double shadow for real thickness */
        .card-3d {
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(15,23,42,0.04) inset,
            0 2px 4px -2px rgba(15,23,42,0.06),
            0 18px 34px -16px rgba(15,23,42,0.16);
        }
        .card-3d-dark {
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 2px 6px -2px rgba(0,0,0,0.4),
            0 24px 44px -18px rgba(0,0,0,0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .animate-slide-right, .animate-float-slow, .animate-float-slower,
          .animate-gradient-x, .animate-float-badge, .animate-float-badge-delayed,
          .animate-pulse-shadow, .animate-infinite-scroll, .animate-logo-scroll,
          .animate-blink, .animate-float-particle, .animate-ping {
            animation: none !important;
          }
          .reveal, .reveal-left, .reveal-right {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}