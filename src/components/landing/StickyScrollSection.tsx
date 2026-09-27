import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ShieldCheck,
  IndianRupee,
  HeartHandshake,
  HardHat,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  Star,
  Zap,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { UserRole } from '../../types';

interface StickyScrollSectionProps {
  isStarryNight: boolean;
  onOpenCustomerBooking: () => void;
  onOpenWorkerMarketplace: () => void;
  onOpenAuth: (role?: UserRole) => void;
  t?: (key: string, fallback?: string) => string;
}

export const StickyScrollSection: React.FC<StickyScrollSectionProps> = ({
  isStarryNight,
  onOpenCustomerBooking,
  onOpenWorkerMarketplace,
  onOpenAuth,
  t = (_, fallback) => fallback || '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ========================================================================= */}
      {/* 1. STACKING FULL-SCREEN STICKY SECTIONS (ui-layouts.com/components/sticky-scroll) */}
      {/* ========================================================================= */}
      <div className="wrapper">
        {/* CARD 1: Pinned Value Proposition */}
        <section className={`relative h-screen w-full grid place-content-center sticky top-0 px-4 sm:px-8 overflow-hidden transition-colors ${
          isStarryNight ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'
        }`}>
          {/* Coordinates Grid Mask (Authentic UI-Layouts signature) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Ambient Radial Spotlight */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 backdrop-blur-md">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>MP Cooperative Societies Act, 1960 • Statutory Digital Infrastructure</span>
            </div>

            {/* Giant Headline */}
            <h2 className="text-4xl sm:text-6xl 2xl:text-7xl font-extrabold tracking-tight leading-[115%]">
              Where 94.5% Belongs to the Craftsman.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                Zero Middlemen. Zero Extractive Cuts.
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Unlike commercial aggregators charging 25%–35% commissions and surge margins, Bharat Kaushal operates as registered digital public infrastructure for Indore residents and certified artisans.
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-3xl mx-auto text-left">
              {[
                { label: 'Artisan Payout', value: '94.5%', sub: 'Instant UPI Bank Credit', color: 'text-emerald-400' },
                { label: 'Welfare Cushion', value: '2.0%', sub: 'Accident & Healthcare Fund', color: 'text-rose-400' },
                { label: 'Society Admin', value: '3.5%', sub: 'Democratic Ward Auditing', color: 'text-blue-400' },
                { label: 'Public Rates', value: '146', sub: 'Standardized Indore Tariffs', color: 'text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs font-bold text-white mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-slate-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="pt-4 flex flex-col items-center gap-1.5 text-slate-400 text-xs font-semibold animate-bounce">
              <span>Scroll to explore the stacking transformation 👇</span>
            </div>
          </div>
        </section>

        {/* CARD 2: Pinned Daylight / Gold Stacking Card (Slides over Card 1) */}
        <section className="relative h-screen w-full grid place-content-center sticky top-0 px-4 sm:px-8 overflow-hidden rounded-tr-3xl rounded-tl-3xl shadow-[0_-25px_60px_rgba(0,0,0,0.6)] border-t border-amber-500/30 bg-gradient-to-b from-[#111c3a] via-[#091124] to-[#040817] text-white">
          {/* Coordinates Grid Mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Ambient Amber Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <IndianRupee size={14} className="text-amber-400" />
              <span>Cooperative Transparency Comparison</span>
            </div>

            <h2 className="text-3xl sm:text-5xl 2xl:text-6xl font-extrabold tracking-tight leading-[115%]">
              Commercial Aggregator vs. Bharat Kaushal
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                Every Rupee Audited. Every Job Protected.
              </span>
            </h2>

            {/* Live Comparison Split Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto pt-2 text-left">
              {/* Aggregator Card */}
              <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/25 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Commercial Gig App</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    28%–35% Cut
                  </span>
                </div>
                <div className="text-2xl font-black text-rose-300">₹720 / ₹1,000</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-rose-200">
                    <span className="text-rose-400 font-bold">✕</span> High algorithmic lead bidding fees
                  </div>
                  <div className="flex items-center gap-2 text-rose-200">
                    <span className="text-rose-400 font-bold">✕</span> Zero health insurance or accident fund
                  </div>
                  <div className="flex items-center gap-2 text-rose-200">
                    <span className="text-rose-400 font-bold">✕</span> Surge pricing charged to customers
                  </div>
                </div>
              </div>

              {/* Bharat Kaushal Cooperative Card */}
              <div className="p-5 rounded-3xl bg-emerald-950/25 border border-emerald-500/35 backdrop-blur-md space-y-3 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Bharat Kaushal Cooperative</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    94.5% to Artisan
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-300">₹945 / ₹1,000</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> Direct UPI bank deposit upon completion
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> 2.0% (₹20) auto-credited to Welfare Fund
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> 146 Pre-published municipal tariffs
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Audited quarterly by the Madhya Pradesh Department of Cooperation and Indore Municipal Corporation.
            </p>
          </div>
        </section>

        {/* CARD 3: Doorstep Security & Arrival Verification (Slides over Card 2) */}
        <section className="relative h-screen w-full grid place-content-center sticky top-0 px-4 sm:px-8 overflow-hidden rounded-tr-3xl rounded-tl-3xl shadow-[0_-25px_60px_rgba(0,0,0,0.7)] border-t border-emerald-500/30 bg-gradient-to-b from-[#0a1b24] via-[#051119] to-[#02090e] text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Lock size={14} className="text-emerald-400" />
              <span>Resident Security Guarantee</span>
            </div>

            <h2 className="text-3xl sm:text-5xl 2xl:text-6xl font-extrabold tracking-tight leading-[115%]">
              Doorstep 4-Digit Arrival OTP.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 bg-clip-text text-transparent">
                UIDAI Masked Identity. Zero Privacy Leaks.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Every job begins with a resident-generated 4-digit security code. The artisan enters your home only when the cryptographic handshake is confirmed.
            </p>

            {/* OTP Handshake Visual Simulation */}
            <div className="inline-flex items-center gap-3 p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Arrival Security Passcode</div>
                <div className="text-xs text-slate-300">Share with artisan on arrival</div>
              </div>
              <div className="flex items-center gap-2">
                {['4', '8', '1', '9'].map((digit, i) => (
                  <div
                    key={i}
                    className="w-10 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center font-mono font-black text-xl text-emerald-300 shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>Verified Entry</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-3">
              <button
                onClick={onOpenCustomerBooking}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Book a Verified Service in Indore</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 2. SPLIT STICKY SHOWCASE: Pinned Left Text + Skewed Scrolling Trade Figures */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-slate-950 text-white border-t border-white/10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Pinned Sticky Narrative */}
          <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-16 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 w-fit">
              <HardHat size={14} className="text-blue-400" />
              <span>Certified Frontline Guilds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[110%]">
              Master Craftsmen.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                Honest Work. Dignified Lives.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              Every worker on Bharat Kaushal is an Aadhaar-verified, NSQF-trained craftsman registered under Ward 48 Shramik Sahakari Samiti. Zero bidding fees. Zero commissions. 100% respect.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { trade: 'Master Electricians & Solar Wiremen', rate: '₹350 Standard Visit', rating: '4.98 ★' },
                { trade: 'Certified Precision Plumbers', rate: '₹280 Standard Visit', rating: '4.95 ★' },
                { trade: 'Architectural Joiners & Woodcrafters', rate: '₹420 Standard Visit', rating: '4.92 ★' },
                { trade: 'HVAC & Jet Cleaning Specialists', rate: '₹499 Standard Visit', rating: '4.96 ★' },
              ].map((item) => (
                <div
                  key={item.trade}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="font-bold text-white">{item.trade}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-mono font-bold">{item.rate}</span>
                    <span className="text-emerald-400 font-semibold">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenWorkerMarketplace}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <span>View Full Artisan Guild Roster</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: Skewed Scrolling Figure Gallery (Authentic UI-Layouts style) */}
          <div className="grid gap-6 py-12 px-6 sm:px-10 overflow-hidden">
            {[
              {
                src: '/images/service_electrician.jpg',
                alt: 'Master Electrician Ward 48 Indore',
                trade: 'Electrical & Solar Grid Specialist',
                skew: '-skew-x-6 hover:skew-x-0',
                badge: 'Indore Ward 48 Certified',
              },
              {
                src: '/images/service_plumber.jpg',
                alt: 'Certified Precision Plumber Indore',
                trade: 'High-Pressure Hydro Tech & Plumbing',
                skew: 'skew-x-6 hover:skew-x-0',
                badge: '18 min Average Arrival',
              },
              {
                src: '/images/service_carpenter.jpg',
                alt: 'Architectural Joiner & Woodcrafter',
                trade: 'Solid Timber & Architectural Hardware',
                skew: '-skew-x-6 hover:skew-x-0',
                badge: 'Master Woodcraft Guild',
              },
              {
                src: '/images/service_masonry.jpg',
                alt: 'Certified Mason & Tiler Indore',
                trade: 'Precision Structural Masonry & Tile Joinery',
                skew: 'skew-x-6 hover:skew-x-0',
                badge: 'NSQF Certified Level 4',
              },
              {
                src: '/images/service_appliance.jpg',
                alt: 'HVAC & Jet Clean Specialist',
                trade: 'Appliance Diagnostics & Inverter Circuits',
                skew: '-skew-x-6 hover:skew-x-0',
                badge: 'Digital Multimeter Bench Tested',
              },
              {
                src: '/images/hero_artisan.jpg',
                alt: 'Certified Member Artisan Receiving 94.5% Earnings',
                trade: 'Democratic Society Member Artisan',
                skew: 'skew-x-6 hover:skew-x-0',
                badge: '94.5% Instant Direct UPI',
              },
            ].map((fig, idx) => (
              <figure
                key={idx}
                className={`group relative rounded-3xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl transition-all duration-500 ease-out ${fig.skew} hover:scale-[1.02]`}
              >
                <img
                  src={fig.src}
                  alt={fig.alt}
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 border border-white/20 text-white backdrop-blur-md">
                    {fig.badge}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-blue-600/80 text-white font-bold text-xs flex items-center justify-center backdrop-blur-md">
                    0{idx + 1}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-base font-bold text-white drop-shadow-md">{fig.trade}</div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-blue-400" />
                    <span>Indore Municipal Pilot • 2026</span>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. REVERSE SPLIT STICKY SECTION: Left Sticky Photo + Right Pinned Message */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-slate-950 text-white border-t border-white/10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-8 lg:px-12">
          {/* Left Column: Scrolling Figures that Freeze & Unfreeze */}
          <div className="grid gap-6 py-12">
            {[
              {
                src: '/images/cooperative_community.jpg',
                title: 'Democratic General Assembly & Rate Governance',
                desc: 'Artisans meet monthly to vote on standardized municipal tariffs under the MP Cooperative Societies Act, 1960.',
              },
              {
                src: '/images/cooperative_command.jpg',
                title: 'Municipal Command Telemetry & Proximity Radar',
                desc: 'Real-time WebSocket dispatch matches residents to artisans within a 5 km radius, cutting travel time under 25 minutes.',
              },
              {
                src: '/images/doorstep_verified_visit.jpg',
                title: 'Verified Doorstep Completion & Resident OTP',
                desc: 'Fair, transparent service authorized directly by the homeowner with zero surprise markups.',
              },
            ].map((card, i) => (
              <figure
                key={i}
                className="lg:sticky lg:top-12 lg:h-[80vh] flex flex-col justify-center rounded-3xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl relative group my-4"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                  <div className="text-lg sm:text-xl font-bold text-white drop-shadow-md">{card.title}</div>
                  <div className="text-xs text-slate-300 drop-shadow-sm max-w-md">{card.desc}</div>
                </div>
              </figure>
            ))}
          </div>

          {/* Right Column: Sticky Pinned High-Impact Message */}
          <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 w-fit">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Indore Civic Excellence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[112%] text-white">
              Public Infrastructure.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">
                Not a Silicon Valley Middleman.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Bharat Kaushal belongs to the people of Indore. Fixed rates, cooperative ownership, and 100% digital transparency built for a dignified future of Indian labour.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onOpenCustomerBooking}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <span>Book Service Online</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onOpenAuth('WORKER')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center justify-center gap-2 border border-white/20 transition-colors cursor-pointer"
              >
                <span>Artisan Member Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
