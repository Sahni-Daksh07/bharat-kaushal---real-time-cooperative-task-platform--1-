import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BharatKaushalLogo } from '../common/BharatKaushalLogo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import { INDORE_SERVICES_DATASET, SERVICE_CATEGORIES } from '../../data/servicesData';
import {
  ShieldCheck,
  Zap,
  Users,
  IndianRupee,
  HeartHandshake,
  HardHat,
  User,
  Building2,
  Sliders,
  Shield,
  ArrowRight,
  CheckCircle2,
  Globe,
  Star,
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Radio,
  Check,
  Cpu,
  Lock,
  Compass,
  FileCheck,
  Flame,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: (role?: UserRole) => void;
  onOpenCustomerBooking: () => void;
  onOpenWorkerMarketplace: () => void;
  isAccountLoggedIn?: boolean;
}

// Live Co-operative Activity Feed for the infinite marquee
const LIVE_TICKER_ITEMS = [
  { text: 'Plumbing task matched in Vijay Nagar, Indore', amount: '₹350', share: '94.5% to Ramesh K.', tag: 'MATCHED' },
  { text: 'Electrical wiring completed in Palasia', amount: '₹620', share: '₹12.40 saved to MP Welfare Fund', tag: 'SETTLED' },
  { text: 'Appliance technician dispatched in Annapurna', eta: '12 min ETA', tag: 'EN ROUTE' },
  { text: 'Carpentry duo assigned for modular kitchen in AB Road', amount: '₹1,450', share: '94.5% to Artisan Team', tag: 'VERIFIED' },
  { text: 'Indore Shramik Samiti approved 18 verified worker profiles', tag: 'SOCIETY KYC' },
  { text: 'Masonry restoration certified in Rajwada', amount: '₹890', share: 'Zero Middleman Commission', tag: 'COOPERATIVE' },
  { text: 'NSQF Level-4 Trade Assessment passed by Suresh M.', tag: 'SKILL CERTIFIED' },
  { text: 'Air Conditioner servicing matched in Bhawarkua', amount: '₹480', share: '94.5% to Suresh P.', tag: 'LIVE' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onSelectLang,
  onSelectRole,
  onOpenAuth,
  onOpenCustomerBooking,
  onOpenWorkerMarketplace,
  isAccountLoggedIn,
}) => {
  const auth = useAuth();
  const isLoggedIn = isAccountLoggedIn !== undefined ? isAccountLoggedIn : (auth?.isAccountLoggedIn ?? false);
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Horizontal Carousel scroll ref and category filter
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedServiceCat, setSelectedServiceCat] = useState<string>('ALL');

  // Interactive Economic Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(1000);

  // Interactive 5-Role Dashboard Preview Tab
  const [activeDashboardTab, setActiveDashboardTab] = useState<UserRole>('CUSTOMER');

  // Horizontal scroll controls
  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollOffset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  // Filtered services for horizontal showcase
  const featuredServices = selectedServiceCat === 'ALL'
    ? INDORE_SERVICES_DATASET.slice(0, 14)
    : INDORE_SERVICES_DATASET.filter((s) => s.category.toLowerCase() === selectedServiceCat.toLowerCase()).slice(0, 14);

  // Economic calculations
  const workerEarning = Math.round(calcAmount * 0.945);
  const societyEarning = Math.round(calcAmount * 0.035);
  const welfareEarning = Math.round(calcAmount * 0.020);
  const gigWorkerEarning = Math.round(calcAmount * 0.72);
  const gigCommission = calcAmount - gigWorkerEarning;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col overflow-x-hidden">
      {/* 1. Header Navigation Bar (When not logged in) */}
      {!isLoggedIn && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <BharatKaushalLogo size="md" inline={true} showTagline={false} />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
              <a href="#hero" className="text-blue-600 hover:text-blue-700 transition-colors">
                {t('Home', 'Home')}
              </a>
              <a href="#services-showcase" className="hover:text-blue-600 transition-colors">
                {t('Explore_Services', '140+ Services')}
              </a>
              <a href="#economics" className="hover:text-blue-600 transition-colors">
                {t('Cooperative_Economics', '94.5% Fair Economics')}
              </a>
              <a href="#dashboards-preview" className="hover:text-blue-600 transition-colors">
                {t('Portals_Preview', 'Portals & Dashboards')}
              </a>
              <a href="#tech-architecture" className="hover:text-blue-600 transition-colors">
                {t('DPI_Tech_Stack', 'DPI Tech Stack')}
              </a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                {t('How_It_Works', 'How It Works')}
              </a>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Language Switcher */}
              <div className="relative">
                <select
                  aria-label="Language selector"
                  value={lang}
                  onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
                  className="h-9 bg-slate-100/90 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3 pr-8 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none transition-colors"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName}
                    </option>
                  ))}
                </select>
                <Globe size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Login CTA */}
              <button
                onClick={() => onOpenAuth('CUSTOMER')}
                className="h-9 px-3.5 sm:px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-all border border-slate-200 whitespace-nowrap cursor-pointer"
              >
                {t('Login', 'Sign In')}
              </button>

              {/* Primary Launch Portal CTA */}
              <button
                onClick={() => onOpenAuth('WORKER')}
                className="h-9 px-3.5 sm:px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>{t('Get_Started', 'Get Started')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* 2. Hero Section with Framer Motion, Parallax Ambient Light & Glass Panels */}
      <header id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/30 to-slate-50 border-b border-slate-200/70">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[36rem] h-[36rem] rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[36rem] h-[36rem] rounded-full bg-blue-600/12 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Copy & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-md text-emerald-800 text-xs font-bold border border-emerald-300/80 shadow-2xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>MP Cooperative Societies Act, 1960 • Digital Public Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
                People. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Skills.</span>
                <br />
                <span className="text-slate-900">Stronger India.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                A real-time cooperative task platform for India&apos;s skilled trade workforce. 
                Zero private middlemen cuts — 
                <strong className="text-slate-900 font-bold"> 94.5% of every rupee </strong>
                goes directly to verified artisans, with 2.0% automatically saved in the MP Labour Welfare Fund.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenCustomerBooking}
                  className="h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer glass-sheen"
                >
                  <Search size={16} />
                  <span>Book a Verified Service</span>
                  <ArrowRight size={15} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenWorkerMarketplace}
                  className="h-12 px-7 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer glass-sheen"
                >
                  <HardHat size={16} />
                  <span>Join as Skilled Artisan</span>
                </motion.button>

                <a
                  href="#dashboards-preview"
                  className="h-12 px-5 rounded-xl bg-white/90 backdrop-blur-md hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300/80 shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard size={14} className="text-blue-600" />
                  <span>Explore Portals</span>
                </a>
              </div>

              {/* Citizen & Worker Trust Badges */}
              <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">RK</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">PS</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">AV</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xs">+1M</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">1,000,000+ Certified Artisans & Citizens</div>
                  <div className="text-[11px] text-slate-500">Aadhaar e-KYC Verified • Zero De-platforming • Transparent Pricing</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Card Mockup with Glassmorphism & Live Telemetry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl glass-panel-dark p-6 sm:p-7 text-white shadow-2xl overflow-hidden">
                {/* Subtle Tricolor Ribbon Effect */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-500" />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold tracking-wide text-emerald-400 uppercase font-mono">
                        Live WebSocket Telemetry
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Indore Zone • ws://localhost:3001/ws
                    </span>
                  </div>

                  {/* Active Job Preview Card */}
                  <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 space-y-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 font-mono text-[11px] font-bold border border-amber-400/20">
                          SS-1042
                        </span>
                        <span className="font-semibold text-slate-200">Main Line Leakage Repair</span>
                      </div>
                      <span className="text-emerald-400 font-bold font-mono">₹250.00</span>
                    </div>

                    <div className="flex items-center gap-3 pt-1 border-t border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                        RK
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Ramesh Kumar</span>
                          <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                            <Star size={10} fill="currentColor" /> 4.9
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Master Plumber • Indore Shramik Samiti
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Arrival OTP: 4821
                      </span>
                    </div>

                    {/* Transparent Revenue Split Mini Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>Worker (94.5%): <strong className="text-emerald-400">₹236.25</strong></span>
                        <span>Coop (3.5%): ₹8.75</span>
                        <span>Welfare (2.0%): ₹5.00</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: '94.5%' }} />
                        <div className="h-full bg-blue-500" style={{ width: '3.5%' }} />
                        <div className="h-full bg-amber-500" style={{ width: '2.0%' }} />
                      </div>
                    </div>
                  </div>

                  {/* 4 Value Pillars Mini Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Aadhaar e-KYC</div>
                        <div className="text-[10px] text-slate-400">UIDAI Masked</div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                      <Zap size={18} className="text-amber-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">5 km Proximity</div>
                        <div className="text-[10px] text-slate-400">Geoapify Spatial</div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                      <Building2 size={18} className="text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Cooperative Owned</div>
                        <div className="text-[10px] text-slate-400">MP Act 1960</div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                      <HeartHandshake size={18} className="text-rose-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">MPSLWB Welfare</div>
                        <div className="text-[10px] text-slate-400">Healthcare Cover</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 3. Horizontal Infinite Marquee Ticker */}
      <div className="bg-slate-900 border-y border-slate-800 py-3 overflow-hidden select-none">
        <div className="flex items-center">
          <div className="px-4 shrink-0 flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider border-r border-slate-800">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span>Live Cooperative Telemetry</span>
          </div>
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee flex items-center gap-8">
              {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-300 whitespace-nowrap">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-blue-400 border border-slate-700">
                    {item.tag}
                  </span>
                  <span>{item.text}</span>
                  {item.amount && (
                    <span className="font-bold text-emerald-400 font-mono">{item.amount}</span>
                  )}
                  {item.share && (
                    <span className="text-slate-400 text-[11px]">({item.share})</span>
                  )}
                  <span className="text-slate-600 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Horizontal Scrolling Service Showcase (Interactive Carousel with Edge Fade) */}
      <motion.section
        id="services-showcase"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-white border-b border-slate-200 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-blue-600" />
                <span>140+ Benchmarked Indore Services</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Transparent Rates. Certified Craftsmen.
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Scroll horizontally through verified trade categories. Every service price is public and governed by cooperative benchmark guidelines.
              </p>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => handleScrollCarousel('left')}
                className="w-10 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScrollCarousel('right')}
                className="w-10 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedServiceCat('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedServiceCat === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedServiceCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedServiceCat.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Horizontal Snap Scroll Carousel with Glass Sheen */}
          <div className="relative">
            {/* Left/Right Edge Gradient Fade Masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 hidden sm:block" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 hidden sm:block" />

            <div
              ref={carouselRef}
              className="horizontal-scroll-snap gap-5 no-scrollbar py-2"
            >
              {featuredServices.map((service) => {
                const displayPrice = service.suggested_display_price_inr || service.min_price_inr;
                const durationMins = service.estimated_duration_hours ? Math.round(service.estimated_duration_hours * 60) : 45;
                return (
                  <div
                    key={service.record_id}
                    className="w-[285px] sm:w-[325px] bk-card glass-sheen p-5 flex flex-col justify-between hover:border-blue-400 transition-all group shadow-sm shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {service.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {durationMins} mins
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.service_name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {service.notes || `${service.pricing_unit} • Transparent cooperative rate`}
                        </p>
                      </div>

                      {/* Benchmark Comparison */}
                      <div className="bg-slate-50/80 backdrop-blur-xs p-3 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Cooperative Rate:</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">₹{displayPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Worker Payout (94.5%):</span>
                          <span className="font-semibold text-emerald-600 font-mono">
                            ₹{Math.round(displayPrice * 0.945)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Verified Artisans
                      </span>
                      <button
                        onClick={onOpenCustomerBooking}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book Now</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Interactive Economics Calculator Section with Glassmorphic Container */}
      <motion.section
        id="economics"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
              <IndianRupee size={12} />
              <span>Transparent Cooperative Arithmetic</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Where Does Every Rupee Go?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Slide below to see the direct financial comparison between commercial gig platforms vs. the Bharat Kaushal cooperative standard.
            </p>
          </div>

          {/* Calculator Glass Card */}
          <div className="max-w-4xl mx-auto glass-panel-dark rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {/* Slider Control */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-slate-200">
                  Select Task / Booking Amount:
                </label>
                <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                  ₹{calcAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹300 (Minor Repair)</span>
                <span>₹2,500 (Home Maintenance)</span>
                <span>₹10,000 (Renovation Task)</span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Bharat Kaushal (Cooperative) */}
              <div className="bg-emerald-950/30 border border-emerald-500/35 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck size={16} />
                    Bharat Kaushal (Cooperative)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    MP Act 1960
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Worker Direct Share (94.5%):</span>
                    <span className="font-bold text-emerald-400 font-mono text-base">₹{workerEarning.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Cooperative Society (3.5%):</span>
                    <span className="text-slate-300 font-mono">₹{societyEarning.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">MP Social Welfare Fund (2.0%):</span>
                    <span className="text-amber-400 font-mono">₹{welfareEarning.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-300 leading-relaxed">
                  ✓ Instant UPI settlement to worker bank account.<br />
                  ✓ 2.0% builds healthcare and accidental security.
                </div>
              </div>

              {/* Private Commercial Aggregators */}
              <div className="bg-rose-950/20 border border-rose-500/25 rounded-2xl p-5 space-y-4 opacity-85">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Private Gig Platforms (Urban Company / Aggregators)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                    Private VC
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Worker Payout (~72%):</span>
                    <span className="font-bold text-rose-300 font-mono text-base">₹{gigWorkerEarning.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Platform Commission (~28%):</span>
                    <span className="text-rose-400 font-mono font-bold">-₹{gigCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Worker Welfare Fund:</span>
                    <span className="text-slate-500 font-mono">₹0.00 (Zero)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-900/40 text-[11px] text-slate-400 leading-relaxed">
                  ✗ Arbitrary de-platforming & rating penalties.<br />
                  ✗ Zero long-term social security or healthcare cushion.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Interactive 5-Role Dashboard Preview with Sliding Pill Animation */}
      <motion.section
        id="dashboards-preview"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-slate-50 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <LayoutDashboard size={12} className="text-blue-600" />
              <span>Multi-Portal Ecosystem</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Dedicated Portals for Every Stakeholder
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Click below to explore each portal&apos;s UI and jump straight into its full live interface.
            </p>
          </div>

          {/* Interactive Role Tabs with Smooth Sliding Pill */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { role: 'CUSTOMER' as UserRole, label: 'Citizen / Customer', icon: User, color: 'text-blue-600' },
              { role: 'WORKER' as UserRole, label: 'Skilled Artisan / Worker', icon: HardHat, color: 'text-amber-600' },
              { role: 'SOCIETY_ADMIN' as UserRole, label: 'Society Admin', icon: Building2, color: 'text-emerald-600' },
              { role: 'FEDERATION_ADMIN' as UserRole, label: 'Federation Command', icon: Sliders, color: 'text-purple-600' },
              { role: 'SUPER_ADMIN' as UserRole, label: 'Super Admin (Govt)', icon: Shield, color: 'text-slate-900' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDashboardTab === tab.role;
              return (
                <button
                  key={tab.role}
                  onClick={() => setActiveDashboardTab(tab.role)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {/* Sliding Pill Background with Framer Motion layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-300/80 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon size={16} className={isActive ? tab.color : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDashboardTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bk-card glass-panel-light p-6 sm:p-8 shadow-md"
            >
              {activeDashboardTab === 'CUSTOMER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Customer & Resident Experience
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Verified On-Demand Home Services with Live GPS
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Browse 140+ benchmarked Indore services. Match proximity craftsmen within 5 km, track their live route on Leaflet maps, and authorize work with two-stage OTPs.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Interactive Leaflet + Geoapify map tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Arrival & Completion two-factor OTP security</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Automated PDF & Gmail invoice generation</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectRole('CUSTOMER')}
                        className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer glass-sheen"
                      >
                        <span>Launch Customer Portal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="text-emerald-400 font-bold flex items-center justify-between">
                      <span>CUSTOMER_PORTAL_ACTIVE</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Live</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-amber-400 font-bold">Active Booking: #SS-1042</div>
                      <div className="text-slate-300">Worker: Ramesh Kumar (Plumber)</div>
                      <div className="text-slate-400">Status: EN_ROUTE • 8 min away</div>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Connected to ws://localhost:3001/ws with instant state synchronization.
                    </div>
                  </div>
                </div>
              )}

              {activeDashboardTab === 'WORKER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Skilled Worker & Artisan Experience
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Real-Time Job Queue, 94.5% Earnings & Social Security
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Workers receive instant proximity job alerts, verify client doorstep arrival with secure OTPs, track digital wallet earnings, and complete 15-question trade skill assessments.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Instant job dispatch alerts with Accept / Decline flow</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>15-Question Trade Competency Exam engine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>MPSLWB Welfare Fund savings accumulator</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectRole('WORKER')}
                        className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer glass-sheen"
                      >
                        <span>Launch Worker Portal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="text-amber-400 font-bold flex items-center justify-between">
                      <span>WORKER_WALLET_FEED</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">Online</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-slate-300">Total Net Balance: <strong className="text-emerald-400">₹4,280.00</strong></div>
                      <div className="text-slate-400">MPSLWB Welfare Accrued: ₹92.00</div>
                      <div className="text-amber-300">NSQF Certified Level 4</div>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Instant settlement to linked UPI VPAs with zero processing fees.
                    </div>
                  </div>
                </div>
              )}

              {activeDashboardTab === 'SOCIETY_ADMIN' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Cooperative Society Administration
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Local Labour Society Governance & KYC Verification
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Admins verify incoming artisan credentials, validate trade qualifications under the MP Cooperative Societies Act 1960, and mediate customer disputes transparently.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Worker e-KYC approval & physical verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>3.5% Cooperative operational dividend management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Member grievance handling & dispute arbitration</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectRole('SOCIETY_ADMIN')}
                        className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer glass-sheen"
                      >
                        <span>Launch Society Admin Portal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="text-emerald-400 font-bold flex items-center justify-between">
                      <span>SOCIETY_COMMAND_ROSTER</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Verified</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-slate-300">Society: Indore Shramik Kaushal Samiti</div>
                      <div className="text-emerald-400">48 Active Artisans On Duty</div>
                      <div className="text-slate-400">Grievances: 0 Pending • 1 Resolved</div>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboardTab === 'FEDERATION_ADMIN' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      District & State Federation Command
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Real-Time Demand Forecasting & Policy Control
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Apex cooperative officers monitor cross-district trade supply heatmaps, tune surge limits, inspect welfare reserves, and analyze trade demand forecasting with Recharts.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Interactive Recharts demand telemetry & trade distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Statewide cooperative policy & commission tuning</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>District-level trade deficit & skill training triggers</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectRole('FEDERATION_ADMIN')}
                        className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer glass-sheen"
                      >
                        <span>Launch Federation Command</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="text-purple-400 font-bold flex items-center justify-between">
                      <span>FEDERATION_TELEMETRY</span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded">Recharts Active</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-slate-300">Peak Demand Zone: Vijay Nagar (38%)</div>
                      <div className="text-emerald-400">Total Welfare Fund: ₹1,48,250.00</div>
                      <div className="text-amber-300">Surge Multiplier: 1.0x (Normal)</div>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboardTab === 'SUPER_ADMIN' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                      National DPI & Statutory Governance
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Regulatory Audit Logs & Social Security Oversight
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Government regulators inspect algorithmic transparency, audit financial ledgers, oversee cooperative compliance, and sanction welfare fund disbursements.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Immutable event audit logs and UIDAI masking compliance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>MPSLWB Social Welfare Fund disbursement authorizations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span>Systemic emergency controls and anti-fraud protocols</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectRole('SUPER_ADMIN')}
                        className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer glass-sheen"
                      >
                        <span>Launch Super Admin Portal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="text-amber-400 font-bold flex items-center justify-between">
                      <span>GOVT_AUDIT_STREAM</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Audited</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-emerald-400">All 140 Services Benchmarked</div>
                      <div className="text-slate-300">Statutory Compliance: 100%</div>
                      <div className="text-slate-400">Audit Checksum: 0x9AF831...OK</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 7. Dedicated DPI Tech Stack & Architecture Badges Section */}
      <motion.section
        id="tech-architecture"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-white border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Cpu size={12} className="text-blue-600" />
              <span>Verified Standards & Architecture</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Cooperative DPI Technology Stack
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Engineered with national digital public infrastructure standards, open specifications, and statutory legal backing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bk-card p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Radio size={20} />
              </div>
              <div className="font-mono text-xs font-bold text-blue-600 uppercase">Real-Time WebSocket Protocol</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bi-directional WebSocket server at <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">/ws</code> synchronizing dispatch, tracking, and settlements in sub-50ms.
              </p>
            </div>

            <div className="bk-card p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <div className="font-mono text-xs font-bold text-emerald-600 uppercase">Geoapify Spatial Routing</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live interactive Leaflet vector mapping with sub-5 km Euclidean and street distance matching algorithms.
              </p>
            </div>

            <div className="bk-card p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <div className="font-mono text-xs font-bold text-amber-600 uppercase">Google Gemini 2.5 Flash AI</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated trade classifier and 15-question trade competency generator powered by Google GenAI SDK.
              </p>
            </div>

            <div className="bk-card p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <div className="font-mono text-xs font-bold text-purple-600 uppercase">UIDAI Masked Aadhaar e-KYC</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero plain-text PII storage. Dual-stage cryptographic OTP verification ensuring complete consumer and artisan safety.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. How Bharat Kaushal Works (4-Step Visual Pathway) */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-slate-50 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <span>Transparent 4-Step Architecture</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              How Bharat Kaushal Works
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              From verified certification to door-step task execution and instant settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bk-card p-6 relative space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Profile & e-KYC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in with mobile OTP or Google. Workers complete Aadhaar masking e-KYC and pass 15-question trade competency assessments.
              </p>
            </div>

            <div className="bk-card p-6 relative space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Proximity Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers pick from 140+ benchmark services. Geoapify spatial matching locates the nearest certified artisan within 5 km.
              </p>
            </div>

            <div className="bk-card p-6 relative space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Live GPS & OTP Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live interactive Leaflet route tracking, doorstep Arrival OTP verification, and transparent spare part pricing guarantee safety.
              </p>
            </div>

            <div className="bk-card p-6 relative space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Fair Split Settlement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant UPI transfer: 94.5% to the artisan, 3.5% to local cooperative society, and 2.0% automatically saved in social welfare.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 9. Citizen & Artisan Testimonials */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Trusted by Citizens & Craftsmen
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Voices from Indore, Bhopal and across Madhya Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bk-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;On private apps, 25-30% of my hard work was taken away by middlemen. Here I get 94.5% straight into my bank account, plus health cover from the welfare fund.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Rakesh Kumar</div>
                  <div className="text-[10px] text-slate-500">Master Electrician, Palasia, Indore</div>
                </div>
              </div>
            </div>

            <div className="bk-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Booking was seamless. The arrival OTP gave my family total peace of mind, and the transparent pricing showed exactly where my money went.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                  PS
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Priya Sharma</div>
                  <div className="text-[10px] text-slate-500">Resident, Vijay Nagar, Indore</div>
                </div>
              </div>
            </div>

            <div className="bk-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Our cooperative society can now digitally verify artisan skills, maintain attendance, and ensure democratic dividend sharing under the MP Cooperative Act.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  AV
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Amit Verma</div>
                  <div className="text-[10px] text-slate-500">Indore Shramik Sahakari Samiti</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="py-14 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to experience fair, cooperative labour?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join Bharat Kaushal today as a customer, artisan, or cooperative administrator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenAuth('WORKER')}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer glass-sheen"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onOpenCustomerBooking}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Book a Service</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Statutory Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" />
                <span>Bharat Kaushal Cooperative Labour Platform</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Operating under the MP Cooperative Societies Act, 1960. 94.5% direct labor realization. Certified by registered labor societies.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform</div>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={onOpenWorkerMarketplace} className="hover:text-white transition-colors cursor-pointer">Find Work</button></li>
                <li><button onClick={onOpenCustomerBooking} className="hover:text-white transition-colors cursor-pointer">Book a Service</button></li>
                <li><a href="#economics" className="hover:text-white transition-colors">94.5% Economics</a></li>
                <li><a href="#dashboards-preview" className="hover:text-white transition-colors">Portals Preview</a></li>
                <li><a href="#tech-architecture" className="hover:text-white transition-colors">DPI Architecture</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Statutory Helplines</div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Consumer Helpline: </span>
                  <a href="tel:1915" className="text-amber-400 font-bold hover:underline">1915</a>
                </div>
                <div>
                  <span className="text-slate-500">Emergency SOS: </span>
                  <a href="tel:112" className="text-rose-400 font-bold hover:underline">112</a>
                </div>
                <div className="text-slate-500 pt-1">
                  IMC Cooperative Operations Command, Indore, MP - 452001
                </div>
              </div>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance</div>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>• Unorganized Workers&apos; Social Security Act, 2008</li>
                <li>• 2.0% Allocation to MP Labour Welfare Fund</li>
                <li>• UIDAI Masked Aadhaar & Data Minimization</li>
                <li>• 100% Explainable Trust Scores</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© 2026 Bharat Kaushal. Digital Public Infrastructure for Fair Skilled Labour.</div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live WebSockets Active
              </span>
              <span>140 Indore Service Rates Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
