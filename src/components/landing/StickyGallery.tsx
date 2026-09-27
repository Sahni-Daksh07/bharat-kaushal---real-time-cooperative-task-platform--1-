import React from 'react';
import { ShieldCheck, HardHat, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

interface StickyGalleryProps {
  isStarryNight: boolean;
  onOpenCustomerBooking?: () => void;
  onOpenWorkerMarketplace?: () => void;
  onOpenAuth?: (role?: UserRole) => void;
}

export const StickyGallery: React.FC<StickyGalleryProps> = ({
  isStarryNight,
  onOpenCustomerBooking,
  onOpenWorkerMarketplace,
  onOpenAuth,
}) => {
  return (
    <section className="relative w-full bg-slate-950 text-white py-16 sm:py-24 border-t border-white/10 overflow-hidden">
      {/* Background ambient grid mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 backdrop-blur-md">
          <Sparkles size={14} className="text-blue-400" />
          <span>Statutory Visual Archive • Indore Municipal Pilot</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[112%]">
          Real Artisans. Real Wards.
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
            Captured In Living Digital Action.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Scroll down to experience the 3-column sticky gallery. The center command and guild pillars remain pinned while the artisan field photography glides smoothly on both flanks.
        </p>
      </div>

      {/* 3-Column Sticky Gallery Layout (Authentic ui-layouts.com/components/sticky-scroll) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
          
          {/* ========================================================= */}
          {/* LEFT PART: 5 Vertical Scrolling Trade Cards (Col-span-4) */}
          {/* ========================================================= */}
          <div className="grid gap-3 lg:gap-4 lg:col-span-4">
            {[
              {
                src: '/images/service_electrician.jpg',
                title: 'Phase Distribution & Panel Wiring',
                tag: 'Master Electricians Guild',
                rate: '₹350 Standard Visit',
              },
              {
                src: '/images/service_plumber.jpg',
                title: 'High-Pressure CPVC Line Balancing',
                tag: 'Precision Hydro Guild',
                rate: '₹280 Standard Visit',
              },
              {
                src: '/images/service_carpenter.jpg',
                title: 'Hydraulic Soft-Close & Timber Repair',
                tag: 'Woodcraft Guild',
                rate: '₹420 Standard Visit',
              },
              {
                src: '/images/service_masonry.jpg',
                title: 'Precision Tiling & Structural Mortar',
                tag: 'Masonry & Civil Guild',
                rate: '₹450 Standard Visit',
              },
              {
                src: '/images/service_appliance.jpg',
                title: 'Inverter Diagnostics & Jet Clean',
                tag: 'HVAC Specialists',
                rate: '₹499 Standard Visit',
              },
            ].map((card, i) => (
              <figure
                key={i}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl transition-all duration-300 hover:border-blue-400/50"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                    {card.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                  <div className="text-sm font-bold text-white drop-shadow-md">{card.title}</div>
                  <div className="text-[11px] font-mono text-amber-300 font-bold">{card.rate}</div>
                </div>
              </figure>
            ))}
          </div>

          {/* ========================================================= */}
          {/* CENTER PART: Pinned Sticky 3-Card Stack (Col-span-4)     */}
          {/* ========================================================= */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] w-full lg:col-span-4 gap-3 grid grid-rows-3 my-4 lg:my-0">
            {/* Center Row 1: Democratic Ward Hub */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-950/80 to-slate-950 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Pillar 01 • Democratic Hub
                </span>
                <ShieldCheck size={18} className="text-blue-400" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black text-white">Ward 48 Shramik Sahakari Samiti</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Direct worker ownership under MP Cooperative Societies Act, 1960. Artisans hold 1 vote per member.
                </div>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Zero Corporate Intermediary</span>
              </div>
            </div>

            {/* Center Row 2: Real-Time Telemetry & Proximity Radar */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-950/80 to-slate-950 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Pillar 02 • Proximity Radar
                </span>
                <MapPin size={18} className="text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black text-white">5 km High-Precision Matching</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Dispatches closest available artisan in Indore. Average doorstep arrival in 18–32 minutes.
                </div>
              </div>
              <div className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>146 Fixed Benchmark Tariffs</span>
              </div>
            </div>

            {/* Center Row 3: Social Security Welfare Cushion */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 to-slate-950 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Pillar 03 • Welfare Shield
                </span>
                <HardHat size={18} className="text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black text-white">2.0% Social Welfare Cushion</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Automatic statutory contributions fund worker accident coverage, family medical care, and tools insurance.
                </div>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>MPSLWB Certified Scheme</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PART: 5 Vertical Scrolling Civic Cards (Col-span-4) */}
          {/* ========================================================= */}
          <div className="grid gap-3 lg:gap-4 lg:col-span-4">
            {[
              {
                src: '/images/cooperative_community.jpg',
                title: 'Indore Ward 48 General Assembly Meeting',
                tag: 'Democratic Governance',
                rate: 'Active Member Quorum',
              },
              {
                src: '/images/cooperative_command.jpg',
                title: 'Municipal Real-Time Operations Telemetry',
                tag: 'Command Center',
                rate: '100% On-Chain Audit',
              },
              {
                src: '/images/doorstep_verified_visit.jpg',
                title: 'Doorstep 4-Digit Resident OTP Authorization',
                tag: 'Citizen Security',
                rate: 'Zero Leakage Handshake',
              },
              {
                src: '/images/hero_artisan.jpg',
                title: 'Direct 94.5% Bank Transfer Settlement',
                tag: 'Instant UPI Payout',
                rate: 'T+0 Settlement Speed',
              },
              {
                src: '/images/cooperative_voting.jpg',
                title: 'Annual Tariff Ratification Ballot',
                tag: 'Cooperative Ballot',
                rate: '1 Member • 1 Vote',
              },
            ].map((card, i) => (
              <figure
                key={i}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl transition-all duration-300 hover:border-emerald-400/50"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    {card.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                  <div className="text-sm font-bold text-white drop-shadow-md">{card.title}</div>
                  <div className="text-[11px] font-mono text-emerald-300 font-bold">{card.rate}</div>
                </div>
              </figure>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
