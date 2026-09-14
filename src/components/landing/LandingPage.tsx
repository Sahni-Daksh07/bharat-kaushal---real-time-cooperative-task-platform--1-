import React from 'react';
import { BharatKaushalLogo } from '../common/BharatKaushalLogo';
import { UserRole } from '../../types';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import {
  ShieldCheck,
  Zap,
  Users,
  IndianRupee,
  HeartHandshake,
  Building,
  HardHat,
  User,
  Building2,
  Sliders,
  Shield,
  ArrowRight,
  CheckCircle2,
  Globe,
  Star,
  PhoneCall,
  Search,
  ExternalLink,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: (role?: UserRole) => void;
  onOpenCustomerBooking: () => void;
  onOpenWorkerMarketplace: () => void;
  showNavigation?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onSelectLang,
  onSelectRole,
  onOpenAuth,
  onOpenCustomerBooking,
  onOpenWorkerMarketplace,
  showNavigation = false,
}) => {
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col w-full overflow-x-hidden">
      {/* 1. Optional Standalone Header Navigation Bar */}
      {showNavigation && (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <BharatKaushalLogo size="md" inline={true} showTagline={false} />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#hero" className="text-blue-600 hover:text-blue-700 transition-colors">
                {t('Home', 'Home')}
              </a>
              <button
                onClick={onOpenWorkerMarketplace}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t('Find_Work', 'Find Work')}
              </button>
              <button
                onClick={onOpenCustomerBooking}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t('Book_a_Service', 'Book a Service')}
              </button>
              <a href="#cooperatives" className="hover:text-blue-600 transition-colors">
                {t('Cooperatives', 'Cooperatives')}
              </a>
              <a href="#impact" className="hover:text-blue-600 transition-colors">
                {t('Impact', 'Impact')}
              </a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                {t('How_It_Works', 'How It Works')}
              </a>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <select
                  aria-label="Language selector"
                  value={lang}
                  onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
                  className="h-9 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3 pr-7 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName}
                    </option>
                  ))}
                </select>
                <Globe size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Login Button */}
              <button
                onClick={() => onOpenAuth('CUSTOMER')}
                className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-all border border-slate-200"
              >
                {t('Login', 'Login')}
              </button>

              {/* Get Started Primary CTA */}
              <button
                onClick={() => onOpenAuth('WORKER')}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{t('Get_Started', 'Get Started')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </nav>
      )}


      {/* 2. Hero Section */}
      <header id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/30 to-slate-50 border-b border-slate-200/80">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-2xs">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>{t('Certified_Cooperative_DPI', 'India\'s 1st Cooperative Digital Public Infrastructure')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                People. <span className="text-blue-600">Skills.</span>
                <br />
                <span className="text-slate-900">Stronger India.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                A real-time cooperative platform that connects skilled workers, communities and verified opportunities — for a self-reliant and dignified India.
              </p>

              {/* Dual Primary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="landing-hero-find-work-btn"
                  onClick={onOpenWorkerMarketplace}
                  className="h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('Find_Work', 'Find Work')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  id="landing-hero-book-service-btn"
                  onClick={onOpenCustomerBooking}
                  className="h-12 px-7 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <Search size={16} className="text-blue-600" />
                  <span>{t('Book_a_Service', 'Book a Service')}</span>
                </button>
              </div>

              {/* Citizen & Worker Trust Badges */}
              <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">RK</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">PS</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">AV</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xs">+1M</div>
                </div>
                <div>
                  <div className="font-bold text-slate-800">1M+ People Building a Stronger India</div>
                  <div className="text-[11px] text-slate-500">94.5% earnings go directly to certified artisans</div>
                </div>
              </div>
            </div>

            {/* Right Visual Composition (Matching Mockup #2) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-800 p-6 sm:p-8 text-white shadow-2xl border border-slate-700/60 overflow-hidden">
                {/* Subtle Tricolor Ribbon Effect */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-500 opacity-90" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Kaushal se Atmanirbhar Bharat
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      MP Coop Act 1960
                    </span>
                  </div>

                  {/* 6 Value Pillars Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Verified & Trusted</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Aadhaar e-KYC & Trade Certified</div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Zap size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Real-Time Dispatch</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Proximity matching within 5 km</div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Cooperative Owned</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Democratic worker dividends</div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <IndianRupee size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">94.5% Fair Share</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Zero exploitative commission</div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <HeartHandshake size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">2.0% Welfare Fund</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">MPSLWB Social Security Fund</div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Stronger Communities</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Empowering Indian labour</div>
                      </div>
                    </div>
                  </div>

                  {/* Cultural Quote Banner */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-white/15 p-3 rounded-xl text-center">
                    <p className="text-xs font-semibold text-amber-200">
                      &ldquo;हर कौशल एक बेहतर भारत की नींव है।&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      Together We Build A Stronger India • Made for People, Powered by Cooperatives
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. A Platform for Everyone (5 Roles Cards) */}
      <section id="roles" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
              {t('A_Platform_for_Everyone', 'A Platform for Everyone')}
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Different roles. One mission — A stronger India.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Whether you are an artisan looking for fair daily wages or a homeowner booking a service, Bharat Kaushal provides transparent, cooperative workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Worker / Artisan */}
            <div className="bk-card p-5 flex flex-col justify-between hover:border-amber-400 transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <HardHat size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Workers / Artisans</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Find genuine work, fair earnings (94.5%) and cooperative welfare benefits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectRole('WORKER');
                }}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <span>Join as Worker</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 2. Customer */}
            <div className="bk-card p-5 flex flex-col justify-between hover:border-blue-400 transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Customers</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Book trusted, verified professionals for your home or business at benchmark rates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectRole('CUSTOMER');
                }}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Join as Customer</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 3. Society Admin */}
            <div className="bk-card p-5 flex flex-col justify-between hover:border-emerald-400 transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Society Admin</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Manage your cooperative workforce, verify artisan e-KYC and approve rosters.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectRole('SOCIETY_ADMIN');
                }}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <span>Join as Society Admin</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4. Federation Admin */}
            <div className="bk-card p-5 flex flex-col justify-between hover:border-purple-400 transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Sliders size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Federation Admin</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Oversee apex cooperative policies, live dispatch zones and welfare pools.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectRole('FEDERATION_ADMIN');
                }}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
              >
                <span>Join as Federation Admin</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 5. Super Admin */}
            <div className="bk-card p-5 flex flex-col justify-between hover:border-slate-400 transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Super Admin</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Apex national platform governance, real-time telemetry and statutory oversight.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectRole('SUPER_ADMIN');
                }}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-900 cursor-pointer"
              >
                <span>Join as Super Admin</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Impact Metrics Bar */}
      <section id="impact" className="py-12 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 font-mono">1M+</div>
              <div className="text-xs font-semibold text-slate-300">Registered Workers</div>
              <div className="text-[10px] text-slate-500">Certified by Cooperatives</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-400 font-mono">50K+</div>
              <div className="text-xs font-semibold text-slate-300">Happy Customers</div>
              <div className="text-[10px] text-slate-500">Across Indore & MP</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 font-mono">2,500+</div>
              <div className="text-xs font-semibold text-slate-300">Active Cooperatives</div>
              <div className="text-[10px] text-slate-500">MP Cooperative Act 1960</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-400 font-mono">10M+</div>
              <div className="text-xs font-semibold text-slate-300">Jobs Completed</div>
              <div className="text-[10px] text-slate-500">100% OTP Verified</div>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-400 font-mono">28+</div>
              <div className="text-xs font-semibold text-slate-300">States & Territories</div>
              <div className="text-[10px] text-slate-500">Scaling Pan-India DPI</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Bharat Kaushal Works (Visual Stepper) */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              {t('Simple_Workflow', 'Simple & Fair Workflow')}
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              How Bharat Kaushal Works
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              From skill certification to verified task completion — in just a few transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bk-card p-6 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Create Your Profile</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Sign up and verify your identity via Aadhaar e-KYC or mobile OTP. Certified skills get mapped to standardized NSQF levels.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bk-card p-6 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Find or Book Work</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Customers choose from 140+ benchmarked Indore services. Workers receive fair proximity-based job dispatches within 5 km.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bk-card p-6 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Connect & Service</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Live GPS route tracking, doorstep Arrival OTP verification, and clear material transparency ensure absolute peace of mind.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bk-card p-6 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Grow Together</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Instant UPI/Cash settlement: 94.5% to worker, 2.0% automatically saved into the MPSLWB social welfare fund, building collective security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Building Stronger Communities (Cooperative Model) */}
      <section id="cooperatives" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
              {t('Cooperative_Model', 'Cooperative Model')}
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Building Stronger Communities
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Bharat Kaushal is not a commercial middleman taking 25-30% cuts. It is a cooperative digital infrastructure owned by the workers themselves under the Madhya Pradesh Cooperative Societies Act, 1960.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <IndianRupee size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Higher Direct Earnings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                94.5% of every rupee paid by customers goes straight into the skilled worker&apos;s bank account or digital wallet.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <HeartHandshake size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Statutory Social Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2.0% is allocated automatically to the MP Labour Welfare Fund (MPSLWB) for healthcare, accident cover, and pension safety.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">NSQF Skill Upgradation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI and rule-based trade assessments certify competencies and unlock higher wage tiers without subjective bias.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Democratic Ownership</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Workers are voting members of registered labour societies, participating in surplus dividends and platform policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. What People Say (Testimonials) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              What People Say
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Real stories from real people across Indore, Bhopal and Madhya Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bk-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Bharat Kaushal helped me get consistent work and better earnings. The cooperative benefits and instant UPI payments are truly life changing.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Rakesh Kumar</div>
                  <div className="text-[10px] text-slate-500">Electrician, Palasia, Indore</div>
                </div>
              </div>
            </div>

            <div className="bk-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Very easy to find a trusted professional. The OTP at arrival and completion made me feel completely secure. No hidden charges!&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                  PS
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Priya Sharma</div>
                  <div className="text-[10px] text-slate-500">Homeowner, Vijay Nagar, Indore</div>
                </div>
              </div>
            </div>

            <div className="bk-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Managing our society&apos;s verified artisan roster and handling maintenance requests has become completely effortless. True digital public infrastructure.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  AV
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Amit Verma</div>
                  <div className="text-[10px] text-slate-500">Society Admin, Bhopal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action Banner */}
      <section className="py-14 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to be part of a stronger India?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Join Bharat Kaushal today and build a better, dignified tomorrow — together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenAuth('WORKER')}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onOpenCustomerBooking}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Book a Service</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Statutory Footer */}
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
                <li><button onClick={onOpenWorkerMarketplace} className="hover:text-white transition-colors">Find Work</button></li>
                <li><button onClick={onOpenCustomerBooking} className="hover:text-white transition-colors">Book a Service</button></li>
                <li><a href="#cooperatives" className="hover:text-white transition-colors">Cooperative Benefits</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">National Impact</a></li>
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
