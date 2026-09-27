import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ReactLenis } from 'lenis/react';
import { StickyScrollSection } from './StickyScrollSection';
import { StickyGallery } from './StickyGallery';
import { BharatKaushalLogo } from '../common/BharatKaushalLogo';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import { INDORE_SERVICES_DATASET, SERVICE_CATEGORIES } from '../../data/servicesData';
import {
  ShieldCheck,
  IndianRupee,
  HeartHandshake,
  HardHat,
  User,
  Building2,
  Sliders,
  Shield,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Globe,
  Star,
  Search,
  Check,
  Clock,
  Menu,
  X,
  FileCheck,
  Lock,
  Compass,
  PhoneCall,
  LayoutDashboard,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  TrendingUp,
  Play,
  Pause,
  Video,
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
  const { isStarryNight } = useTheme();
  const isLoggedIn = isAccountLoggedIn !== undefined ? isAccountLoggedIn : (auth?.isAccountLoggedIn ?? false);
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Service Discovery State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  // Interactive Economic Calculator & Pillar Slide State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [activeEconomicPillar, setActiveEconomicPillar] = useState<number>(0);

  // Interactive Frontline Guild Image Accordion State (ui-layouts.com/components/image-accordions)
  const [activeTradeAccordion, setActiveTradeAccordion] = useState<number>(0);

  // Interactive 5-Role Dashboard Preview Tab
  const [activeDashboardTab, setActiveDashboardTab] = useState<UserRole>('CUSTOMER');

  // Interactive Sticky Scrolling Step State (ui-layouts.com/components/sticky-scroll)
  const [activeStickyStep, setActiveStickyStep] = useState<number>(1);
  const stickyScrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stickyScrollProgress } = useScroll({
    target: stickyScrollContainerRef,
    offset: ['start 15%', 'end 85%'],
  });

  useMotionValueEvent(stickyScrollProgress, 'change', (latest) => {
    const breakpoints = [0, 0.25, 0.5, 0.75];
    const closestIndex = breakpoints.reduce((acc, bp, index) => {
      return Math.abs(latest - bp) < Math.abs(latest - breakpoints[acc]) ? index : acc;
    }, 0);
    setActiveStickyStep(closestIndex + 1);
  });

  useEffect(() => {
    const handleScrollMilestones = () => {
      const container = stickyScrollContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const milestones = [1, 2, 3, 4].map((step) => {
        const el = document.getElementById(`sticky-step-${step}`);
        if (!el) return { step, distance: Infinity };
        const elRect = el.getBoundingClientRect();
        const distance = Math.abs(elRect.top + elRect.height / 2 - window.innerHeight / 2);
        return { step, distance };
      });

      milestones.sort((a, b) => a.distance - b.distance);
      if (milestones[0] && milestones[0].distance !== Infinity) {
        setActiveStickyStep(milestones[0].step);
      }
    };

    window.addEventListener('scroll', handleScrollMilestones, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollMilestones);
  }, []);

  // Photographic & Video Showcase State in Section 7
  const [activeShowcaseImage, setActiveShowcaseImage] = useState<number>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Frontline Artisans & Civic Documentary Gallery Modal State (ui-layouts.com/components/gallery-modal)
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isGalleryOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGalleryOpen]);

  // Apple/Linear-Grade Lenis Butter-Smooth Physics Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Diverse service selection across categories with clear featured vs all toggle
  const displayedServices = useMemo(() => {
    let list = INDORE_SERVICES_DATASET;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (s) =>
          s.service_name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    if (selectedCategory === 'ALL') {
      if (showAllServices) {
        return list;
      }
      // Pick balanced featured items across all 12 categories (16 items total)
      const featuredCategories = [
        'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'AC Service',
        'Appliance Repair', 'Masonry', 'Welding', 'Deep Cleaning', 'Pest Control'
      ];
      const diverseItems: typeof INDORE_SERVICES_DATASET = [];
      featuredCategories.forEach((cat) => {
        const matching = list.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
        const countToTake = ['Plumbing', 'Electrical', 'Appliance Repair', 'Carpentry'].includes(cat) ? 2 : 1;
        diverseItems.push(...matching.slice(0, countToTake));
      });
      return diverseItems.length > 0 ? diverseItems.slice(0, 16) : list.slice(0, 16);
    }

    // Specific category selected: show ALL items in that trade
    return list.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, searchQuery, showAllServices]);

  // Economic calculations guaranteed to sum to 100% without rounding drifts
  const welfareEarning = Math.round(calcAmount * 0.020);
  const societyEarning = Math.round(calcAmount * 0.035);
  const workerEarning = calcAmount - societyEarning - welfareEarning;
  const typicalAggregatorWorker = Math.round(calcAmount * 0.72);
  const typicalAggregatorCommission = calcAmount - typicalAggregatorWorker;

  // Horizontal scroll refs for smooth navigation
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingScrollRef.current) {
      trendingScrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  // Curated Doorstep Services for Indore Carousel
  const trendingIndoreServices = [
    {
      id: 'tr-1',
      name: 'Bathroom Tap & Sink Leakage Repair',
      category: 'Plumbing',
      price: 249,
      duration: '30 mins',
      image: '/images/service_plumber.jpg',
      artisanPayout: 235,
      rating: '4.95',
      reviewCount: 312,
      badge: 'Quick 30m Arrival',
    },
    {
      id: 'tr-2',
      name: 'Standard Switchboard & MCB Repair',
      category: 'Electrical',
      price: 350,
      duration: '45 mins',
      image: '/images/service_electrician.jpg',
      artisanPayout: 331,
      rating: '4.98',
      reviewCount: 428,
      badge: 'Most Popular',
    },
    {
      id: 'tr-3',
      name: 'AC Jet Cleaning & Filter Wash',
      category: 'AC Service',
      price: 499,
      duration: '60 mins',
      image: '/images/service_appliance.jpg',
      artisanPayout: 472,
      rating: '4.96',
      reviewCount: 289,
      badge: 'Certified Master',
    },
    {
      id: 'tr-4',
      name: 'Ceiling Fan Installation & Speed Check',
      category: 'Electrical',
      price: 199,
      duration: '35 mins',
      image: '/images/service_electrician.jpg',
      artisanPayout: 188,
      rating: '4.94',
      reviewCount: 195,
      badge: 'Fixed Tariff',
    },
    {
      id: 'tr-5',
      name: 'Main Door Deadbolt & Lock Repair',
      category: 'Carpentry',
      price: 299,
      duration: '45 mins',
      image: '/images/service_carpenter.jpg',
      artisanPayout: 283,
      rating: '4.92',
      reviewCount: 164,
      badge: 'Security Hardware',
    },
    {
      id: 'tr-6',
      name: 'RO Water Purifier Deep Servicing',
      category: 'Appliance Repair',
      price: 399,
      duration: '45 mins',
      image: '/images/service_appliance.jpg',
      artisanPayout: 377,
      rating: '4.97',
      reviewCount: 220,
      badge: 'Health Standard',
    },
  ];

  // Statutory Artisan Guilds Dataset for Image Accordion (ui-layouts.com/components/image-accordions)
  const tradeGuilds = [
    {
      id: 'guild-elec',
      shortTitle: 'Electrical Guild',
      title: 'Master Electricians & Solar Wiremen Guild',
      tag: 'Guild 01 • Electrical & Solar',
      image: '/images/service_electrician.jpg',
      activeCount: 48,
      benchmarkRate: '₹350 / Standard Visit',
      desc: 'Certified wiremen trained in heavy residential load balancing, inverter wiring, MCB distribution boards, and solar photovoltaic junction setups.',
      skills: ['Phase Balancing', 'MCB Panel Diagnostics', 'Inverter Wiring', 'Concealed Conduit'],
    },
    {
      id: 'guild-plumb',
      shortTitle: 'Plumbing Guild',
      title: 'Certified Precision Plumbers & Hydro-Techs',
      tag: 'Guild 02 • Plumbing & Hydro-Tech',
      image: '/images/service_plumber.jpg',
      activeCount: 42,
      benchmarkRate: '₹280 / Standard Visit',
      desc: 'Specialized plumbing artisans handling overhead municipal tank lines, high-pressure CPVC piping, concealed valve leakage rectification, and motor pump repairs.',
      skills: ['Overhead Line Pressure', 'CPVC Joint Welding', 'Concealed Leak Detection', 'Sanitary Fittings'],
    },
    {
      id: 'guild-carp',
      shortTitle: 'Woodcraft Guild',
      title: 'Architectural Woodcrafters & Joiners Guild',
      tag: 'Guild 03 • Carpentry & Woodcraft',
      image: '/images/service_carpenter.jpg',
      activeCount: 35,
      benchmarkRate: '₹420 / Standard Visit',
      desc: 'Master woodworkers skilled in solid timber repair, hydraulic soft-close cabinetry hinges, architectural door alignment, and custom furniture restoration.',
      skills: ['Hydraulic Hardware', 'Modular Alignment', 'Hardwood Restoration', 'Deadbolt Mortise'],
    },
    {
      id: 'guild-app',
      shortTitle: 'Appliance Guild',
      title: 'Smart Home Appliances & HVAC Systems Guild',
      tag: 'Guild 04 • Appliance Systems',
      image: '/images/service_appliance.jpg',
      activeCount: 50,
      benchmarkRate: '₹490 / Standard Visit',
      desc: 'Expert technicians certified for inverter split AC deep jet servicing, PCB electronic troubleshooting, compressor diagnostics, and high-efficiency RO filtration deep care.',
      skills: ['Inverter PCB Diagnosis', 'Jet Pressure Cleaning', 'Compressor Calibration', 'RO Membrane Flush'],
    },
    {
      id: 'guild-mason',
      shortTitle: 'Masonry Guild',
      title: 'Civic Structural Masons & Civil Craftsmen Guild',
      tag: 'Guild 05 • Structural & Civil',
      image: '/images/service_masonry.jpg',
      activeCount: 28,
      benchmarkRate: '₹550 / Standard Visit',
      desc: 'Civil trade veterans specializing in precision brickwork, dampness barrier waterproofing, tile grouting alignment, and residential structural masonry restorations.',
      skills: ['Damp Proofing Barrier', 'Tile Precision Alignment', 'Civil Plaster Rectification', 'Structural Joint Sealing'],
    },
  ];

  // Statutory Frontline Artisans & Civic Proof Documentary Archive (ui-layouts.com/components/gallery-modal)
  const galleryItems = [
    {
      id: 'gal-1',
      url: '/images/service_electrician.jpg',
      category: 'Electrical Trade Guild',
      badge: 'Certified Master Wireman',
      title: 'Master Wireman & Solar Grid Installation',
      description: 'Certified electrical artisan performing MCB panel phase balancing and rooftop solar inverter diagnostics under Indore Ward 48 standards.',
      tags: ['Phase Balancing', 'MCB Diagnostics', 'Solar Inverter', 'Concealed Conduit'],
      rate: '₹350 / Standard Visit',
      payout: '₹331 (94.5% Direct to Artisan)',
      artisan: 'Rameshwar Patidar • Ward 48, Indore',
      status: 'Aadhaar e-KYC Verified',
    },
    {
      id: 'gal-2',
      url: '/images/service_plumber.jpg',
      category: 'Hydro-Tech & Plumbing Guild',
      badge: 'Municipal Hydro-Tech',
      title: 'Precision Municipal Hydro-Tech & CPVC Line Service',
      description: 'Specialist technician troubleshooting high-pressure municipal overhead lines, concealed valve rectification, and smart water pump alignments.',
      tags: ['Overhead Pressure', 'CPVC Joint Welding', 'Concealed Leak Detection', 'Sanitary Fittings'],
      rate: '₹280 / Standard Visit',
      payout: '₹265 (94.5% Direct to Artisan)',
      artisan: 'Dinesh Solanki • Palasia Ward, Indore',
      status: 'Aadhaar e-KYC Verified',
    },
    {
      id: 'gal-3',
      url: '/images/service_carpenter.jpg',
      category: 'Architectural Woodcraft Guild',
      badge: 'Master Joiner',
      title: 'Precision Architectural Joinery & Cabinetry Engineering',
      description: 'Master woodworker installing heavy hydraulic soft-close cabinetry hinges, solid teakwood architectural fittings, and security mortise deadbolts.',
      tags: ['Hydraulic Hardware', 'Modular Alignment', 'Hardwood Restoration', 'Deadbolt Mortise'],
      rate: '₹420 / Standard Visit',
      payout: '₹397 (94.5% Direct to Artisan)',
      artisan: 'Mohan Sharma • Rajwada Ward, Indore',
      status: 'Aadhaar e-KYC Verified',
    },
    {
      id: 'gal-4',
      url: '/images/service_appliance.jpg',
      category: 'Smart HVAC & Appliance Guild',
      badge: 'HVAC Specialist',
      title: 'Inverter AC Jet Pressure Service & Circuit Calibration',
      description: 'Certified cooling technician conducting dual-jet high-pressure coil decontamination, microcontroller PCB diagnostics, and RO membrane flushing.',
      tags: ['Inverter PCB Diagnosis', 'Jet Pressure Cleaning', 'Compressor Calibration', 'RO Membrane Flush'],
      rate: '₹490 / Standard Visit',
      payout: '₹463 (94.5% Direct to Artisan)',
      artisan: 'Sunil Verma • Annapurna Ward, Indore',
      status: 'Aadhaar e-KYC Verified',
    },
    {
      id: 'gal-5',
      url: '/images/service_masonry.jpg',
      category: 'Civil & Masonry Guild',
      badge: 'Structural Mason',
      title: 'Structural Civil Restorations & Waterproof Damp Proofing',
      description: 'Senior civil mason applying crystalline damp-proof barriers, precision laser-aligned floor tiling, and structural brickwork reinforcement.',
      tags: ['Damp Proofing Barrier', 'Tile Precision Alignment', 'Civil Plastering', 'Structural Grouting'],
      rate: '₹550 / Standard Visit',
      payout: '₹520 (94.5% Direct to Artisan)',
      artisan: 'Gopal Meena • Vijay Nagar, Indore',
      status: 'Aadhaar e-KYC Verified',
    },
    {
      id: 'gal-6',
      url: '/images/doorstep_verified_visit.jpg',
      category: 'Resident Doorstep Security',
      badge: '2-Factor OTP Gate',
      title: '4-Digit Arrival OTP & Safe Doorstep Authentication',
      description: 'Every Bharat Kaushal doorstep service begins with two-factor OTP verification. Residents authenticate the artisan before work starts, ensuring total peace of mind.',
      tags: ['Arrival OTP', 'Aadhaar e-KYC', 'UIDAI Masked', 'Zero Impersonation'],
      rate: 'Included Free on All Visits',
      payout: '100% Resident Privacy Guaranteed',
      artisan: 'Indore Municipal Pilot Protocol',
      status: 'Statutory Safety Guarantee',
    },
    {
      id: 'gal-7',
      url: '/images/cooperative_command.jpg',
      category: 'Municipal Telemetry Command',
      badge: 'Live Operations Screen',
      title: 'Live Ward Telemetry & Municipal Rate Audit Screen',
      description: 'Real-time telemetry command tracking 146 published municipal tariffs, monitoring proximity dispatch within 5 km, and enforcing zero surge pricing.',
      tags: ['Ward Telemetry', 'Zero Surge Pricing', 'Fixed Public Tariffs', '5 km Proximity Radius'],
      rate: 'Public Transparency Dashboard',
      payout: '146 Benchmarked Rates',
      artisan: 'Indore Municipal Corporation Oversight',
      status: 'Civic Operations Center',
    },
    {
      id: 'gal-8',
      url: '/images/cooperative_community.jpg',
      category: 'Democratic Cooperative Hub',
      badge: 'Ward Society Camp',
      title: 'Ward 48 Society Registration & Skills Evaluation',
      description: 'Local unorganized workers participating in trade competency verification and digital onboarding at the registered Shramik Sahakari Samiti hub.',
      tags: ['Democratic Governance', 'Trade Skills Camp', 'Aadhaar e-KYC', 'MP Cooperative Act'],
      rate: 'Democratic Worker Membership',
      payout: 'Equal Voting Rights',
      artisan: 'Shramik Sahakari Samiti Ward 48',
      status: 'Registered Civic Society',
    },
    {
      id: 'gal-9',
      url: '/images/cooperative_voting.jpg',
      category: 'Member Governance & AGM',
      badge: 'One Member One Vote',
      title: 'Democratic Annual General Meeting & Surplus Dividend Voting',
      description: 'Worker-members gather to inspect statutory audit books, vote on cooperative welfare allocations, and elect guild representatives under the 1960 Act.',
      tags: ['One Member One Vote', 'Surplus Dividend', 'Statutory Audit', 'Welfare Allocation'],
      rate: 'Annual Member Dividend',
      payout: 'Democratic Surplus Sharing',
      artisan: 'General Body of Artisan Members',
      status: 'Democratic Sovereign Body',
    },
    {
      id: 'gal-10',
      url: '/images/hero_artisan.jpg',
      category: 'Direct Payout & Dignity',
      badge: '94.5% Bank Payout',
      title: 'Instant 94.5% UPI Payout & Social Welfare Security',
      description: 'Certified artisan receives direct bank credit within seconds of completion authorization, while 2.0% automatically funds health and disability welfare.',
      tags: ['Instant UPI Credit', 'Zero Platform Margin', '2% Welfare Fund', 'Dignity of Labour'],
      rate: 'Direct Bank Settlement',
      payout: '94.5% Straight to Craftsman',
      artisan: 'All Certified Member Artisans',
      status: 'Dignified Civic Livelihood',
    },
  ];

  // Advanced Scroll Tracking & Parallax Transforms (Framer Motion)
  const { scrollY, scrollYProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowBackToTop(latest > 350);
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  // Balanced, physically grounded parallax transforms (not distracting or jittery)
  const heroY = useTransform(scrollY, [0, 500], [0, 45]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -18]);
  const heroNebulaY = useTransform(scrollY, [0, 600], [0, 90]);
  const heroBadgeFloatY = useTransform(scrollY, [0, 450], [0, -25]);

  // Smooth scroll progress indicator with spring physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Sticky Hero Section 3D Peeling & Shrink Transforms (ui-layouts.com/components/sticky-scroll)
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.90]);
  const heroRotate = useTransform(heroScrollProgress, [0, 1], [0, -2]);
  const heroBorderRadius = useTransform(heroScrollProgress, [0, 1], ['0px', '32px']);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.15, smoothWheel: true }}>
      <div className={`min-h-screen font-sans flex flex-col overflow-x-hidden transition-colors duration-300 ${
        isStarryNight
          ? 'theme-starry-night starry-stars-bg text-slate-100 selection:bg-blue-600/40 selection:text-blue-200'
          : 'theme-daylight bg-[#f8f7f4] text-slate-900 selection:bg-amber-100 selection:text-amber-900'
      }`}>
      {/* Scroll Progress Bar — Dynamic Theme Gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[60] pointer-events-none"
        style={{
          scaleX,
          background: isStarryNight
            ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #fbbf24 100%)'
            : 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #d97706 100%)',
        }}
      />

      {/* 1. FLOATING PILL NAVBAR — Adaptive Frosted Glass */}
      {!isLoggedIn && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <header
            className="w-full max-w-5xl rounded-[22px] h-[60px] flex items-center justify-between px-5 shadow-2xl relative transition-all duration-300"
            style={{
              background: isStarryNight ? 'rgba(7, 13, 30, 0.85)' : 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: isStarryNight ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: isStarryNight
                ? '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
                : '0 12px 36px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <BharatKaushalLogo size="md" inline={true} showTagline={false} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold" aria-label="Main Navigation">
              <a
                href="#hero"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('Home', 'Home')}
              </a>
              <a
                href="#services-showcase"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('Explore_Services', 'Rates')}
              </a>
              <a
                href="#economics"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('Cooperative_Economics', 'Economics')}
              </a>
              <a
                href="#dashboards-preview"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('Portals_Preview', 'Portals')}
              </a>
              <a
                href="#how-it-works"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('How_It_Works', 'How It Works')}
              </a>
              <a
                href="#gallery-showcase"
                className={`transition-colors ${isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t('Gallery', 'Gallery')}
              </a>
            </nav>

            {/* Desktop Action Tools */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {/* Theme Toggle Button */}
              <ThemeSwitcher variant="icon" />

              {/* Language Selector */}
              <div className="relative">
                <select
                  aria-label="Select interface language"
                  value={lang}
                  onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
                  className={`h-8 rounded-xl pl-3 pr-7 text-xs font-medium cursor-pointer appearance-none transition-colors focus:outline-none ${
                    isStarryNight
                      ? 'bg-slate-800/80 text-slate-200 border border-white/15'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      style={{ background: isStarryNight ? '#070d1e' : '#ffffff', color: isStarryNight ? '#fff' : '#000' }}
                    >
                      {l.nativeName}
                    </option>
                  ))}
                </select>
                <Globe size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Sign In */}
              <button
                onClick={() => onOpenAuth('CUSTOMER')}
                className={`h-8 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isStarryNight
                    ? 'bg-slate-800/80 text-slate-200 hover:text-white border border-white/15'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300'
                }`}
              >
                {t('Login', 'Sign In')}
              </button>

              {/* Primary Action Button */}
              <button
                onClick={onOpenCustomerBooking}
                className={`h-8 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isStarryNight
                    ? 'starry-btn-glossy text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                <span>Book Now</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex sm:hidden items-center gap-2">
              <ThemeSwitcher variant="icon" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                  isStarryNight ? 'bg-slate-800/80 text-slate-200 border border-white/12' : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                className="sm:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{
                  background: isStarryNight ? 'rgba(7,13,30,0.96)' : 'rgba(255,255,255,0.97)',
                  border: isStarryNight ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(226,232,240,0.9)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div className={`px-5 py-3 border-b flex items-center justify-between ${isStarryNight ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className={`text-xs font-semibold ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Theme Mode</span>
                  <ThemeSwitcher variant="segmented" />
                </div>
                <div className="px-5 py-4 space-y-1">
                  {[
                    { href: '#hero', label: t('Home', 'Home') },
                    { href: '#services-showcase', label: t('Explore_Services', 'Services & Rates') },
                    { href: '#economics', label: t('Cooperative_Economics', 'Economics (94.5%)') },
                    { href: '#dashboards-preview', label: t('Portals_Preview', 'Role Portals') },
                    { href: '#how-it-works', label: t('How_It_Works', 'How It Works') },
                    { href: '#gallery-showcase', label: t('Gallery', 'Documentary Gallery') },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                        isStarryNight
                          ? 'text-slate-300 hover:text-white hover:bg-white/5'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className={`px-5 pb-5 pt-2 border-t flex flex-col gap-2 ${isStarryNight ? 'border-white/10' : 'border-slate-200'}`}>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenCustomerBooking(); }}
                    className={`w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                      isStarryNight ? 'starry-btn-glossy text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Search size={15} />
                    Book a Verified Service
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenWorkerMarketplace(); }}
                    className={`w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      isStarryNight ? 'starry-pill text-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <HardHat size={14} />
                    Join as an Artisan
                  </button>
                </div>
              </motion.div>
            )}
          </header>
        </div>
      )}

      {/* Spacer for floating nav */}
      {!isLoggedIn && <div className="h-20" />}

      {/* 2. CELESTIAL / ARCHITECTURAL HERO (With UI-Layouts Sticky Motion & 3D Peeling) */}
      <div ref={heroContainerRef} className="relative w-full">
        <motion.section
          id="hero"
          style={{ scale: heroScale, rotate: heroRotate, borderRadius: heroBorderRadius }}
          className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 origin-top transition-all duration-300 shadow-2xl"
        >
        {/* Parallax Ambient Glow Spotlight & Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Architectural Coordinate Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, black 30%, transparent 80%)',
            }}
          />

          {/* Layered Cosmic Radial Spotlights */}
          <motion.div
            style={{ y: heroNebulaY }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[680px] pointer-events-none"
          >
            <div
              className="w-full h-full"
              style={{
                background: isStarryNight
                  ? 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(59, 130, 246, 0.32) 0%, rgba(37, 99, 235, 0.16) 35%, rgba(245, 158, 11, 0.08) 60%, transparent 80%)'
                  : 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(37, 99, 235, 0.16) 0%, rgba(59, 130, 246, 0.08) 35%, rgba(217, 119, 6, 0.04) 60%, transparent 80%)',
              }}
            />
          </motion.div>

          {/* Secondary Golden/Amber Spotlight */}
          <div
            className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
            style={{
              background: isStarryNight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(217, 119, 6, 0.06)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Large editorial copy with progressive blur reveal */}
            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroTextY }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                  isStarryNight
                    ? 'starry-pill text-blue-300'
                    : 'bg-white/90 text-blue-900 border border-blue-200/90 shadow-2xs'
                }`}
                style={isStarryNight ? { borderColor: 'rgba(96, 165, 250, 0.35)', color: '#93c5fd' } : {}}
              >
                <ShieldCheck size={14} className={isStarryNight ? 'text-blue-400' : 'text-blue-700'} />
                <span>MP Cooperative Societies Act, 1960 &bull; Registered Civic Labour Network</span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={`font-extrabold tracking-tight leading-[1.05] ${
                  isStarryNight ? 'text-slate-100' : 'text-slate-900'
                }`}
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)' }}
              >
                Fair, verified services
                <span className={`block ${isStarryNight ? 'starry-text-gradient' : 'text-blue-700'}`}>in Indore.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={`text-base sm:text-lg leading-relaxed max-w-lg ${
                  isStarryNight ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Aadhaar-verified artisans. Fixed public tariffs.{' '}
                <strong className={isStarryNight ? 'text-blue-400 font-extrabold' : 'text-blue-700 font-extrabold'}>
                  94.5%
                </strong>{' '}
                of every rupee goes directly to the craftsman &mdash; zero middlemen.
              </motion.p>

              {/* Civic Trust Stat Pill Bar */}
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-2 pt-1"
              >
                <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                  isStarryNight ? 'bg-slate-900/70 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>94.5% Direct to Artisan</span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                  isStarryNight ? 'bg-slate-900/70 border-white/10 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <ShieldCheck size={13} className="text-blue-400" />
                  <span>146 Fixed Public Rates</span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                  isStarryNight ? 'bg-slate-900/70 border-white/10 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <Star size={13} className="text-amber-400" />
                  <span>0% Middleman Cut</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenCustomerBooking}
                  className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    isStarryNight
                      ? 'starry-btn-glossy text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  }`}
                >
                  <Search size={15} />
                  <span>Book a Verified Service</span>
                  <ArrowRight size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenWorkerMarketplace}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    isStarryNight
                      ? 'starry-pill text-amber-300 border-amber-500/40'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs'
                  }`}
                >
                  <HardHat size={15} />
                  <span>Join as Artisan</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href="#services-showcase"
                  className={`flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl font-semibold text-xs transition-all ${
                    isStarryNight
                      ? 'starry-pill text-slate-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 shadow-2xs'
                  }`}
                >
                  <LayoutDashboard size={13} />
                  <span>Explore 146 Rates</span>
                </motion.a>
              </motion.div>

              {/* Live pilot note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`flex items-center gap-2 text-xs ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span><strong className={isStarryNight ? 'text-slate-200' : 'text-slate-800'}>Indore Pilot:</strong> Vijay Nagar &bull; Palasia &bull; Rajwada &bull; Annapurna</span>
              </motion.div>
            </motion.div>

            {/* Right: Tariff & Artisan Card (Parallax Float & Blur Reveal) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroY }}
              className="lg:col-span-5 relative"
            >
              <div
                className={`relative rounded-3xl overflow-hidden shadow-2xl group transition-all ${
                  isStarryNight
                    ? 'apple-glass-card specular-border-top ui-shadow-glow'
                    : 'bg-white border border-slate-200/90 shadow-xl'
                }`}
                style={{ borderRadius: '1.5rem' }}
              >
                {/* Artisan photograph */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
                  <img
                    src="/images/hero_artisan.jpg"
                    alt="Ramesh Patidar, Master Electrician with Indore Shramik Cooperative"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isStarryNight
                      ? 'from-[#020817] via-[#020817]/40 to-transparent'
                      : 'from-slate-950/90 via-slate-950/30 to-transparent'
                  }`} />

                  {/* Floating badges with Parallax */}
                  <motion.div
                    className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm"
                    style={{
                      y: heroBadgeFloatY,
                      background: isStarryNight ? 'rgba(2, 8, 23, 0.85)' : 'rgba(255, 255, 255, 0.92)',
                      borderColor: isStarryNight ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[11px] font-bold ${isStarryNight ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      Live &bull; 12 Min Arrival
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border shadow-sm"
                    style={{
                      background: isStarryNight ? 'rgba(2, 8, 23, 0.85)' : 'rgba(255, 255, 255, 0.92)',
                      borderColor: isStarryNight ? 'rgba(251, 191, 36, 0.4)' : 'rgba(217, 119, 6, 0.4)',
                    }}
                  >
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className={`text-[11px] font-bold ${isStarryNight ? 'text-amber-300' : 'text-amber-900'}`}>4.98</span>
                    <span className={`text-[10px] ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}>(840+)</span>
                  </motion.div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-base text-white">Ramesh Patidar</span>
                          <CheckCircle2 size={15} className="text-blue-400" />
                        </div>
                        <p className="text-xs text-slate-200">Master Electrician &bull; Samiti #402</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600/90 text-white border border-blue-400/40 shadow-sm">
                        Aadhaar ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tariff breakdown */}
                <div
                  className="p-5 space-y-4"
                  style={{
                    background: isStarryNight
                      ? 'linear-gradient(180deg, rgba(10, 16, 33, 0.95) 0%, rgba(2, 8, 23, 0.98) 100%)'
                      : '#ffffff',
                  }}
                >
                  <div className={`flex items-start justify-between pb-3 border-b ${
                    isStarryNight ? 'border-white/10' : 'border-slate-100'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isStarryNight ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        Public Tariff &bull; Electrical
                      </span>
                      <h3 className={`font-bold text-sm ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                        Switchboard &amp; MCB Repair
                      </h3>
                      <p className={`text-xs ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        Inspection, rewire &amp; socket check
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black font-mono ${isStarryNight ? 'text-blue-400' : 'text-blue-700'}`}>₹350</div>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Fixed Public Rate</div>
                    </div>
                  </div>

                  {/* Earnings breakdown card */}
                  <div className={`rounded-2xl p-3.5 space-y-1.5 text-xs border ${
                    isStarryNight
                      ? 'bg-blue-950/40 border-blue-500/20 text-slate-200'
                      : 'bg-blue-50/80 border-blue-100 text-slate-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold flex items-center gap-1.5 ${isStarryNight ? 'text-blue-300' : 'text-blue-900'}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        Direct to Artisan (94.5%):
                      </span>
                      <span className={`font-black font-mono text-sm ${isStarryNight ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        ₹330.75
                      </span>
                    </div>
                    <div className={`flex justify-between text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>Cooperative Operations (3.5%):</span>
                      <span className={`font-mono ${isStarryNight ? 'text-slate-300' : 'text-slate-800'}`}>₹12.25</span>
                    </div>
                    <div className={`flex justify-between text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>MP Labour Welfare Fund (2.0%):</span>
                      <span className={`font-mono font-bold ${isStarryNight ? 'text-amber-300' : 'text-amber-700'}`}>₹7.00</span>
                    </div>
                  </div>

                  {/* Book button */}
                  <div className="space-y-2 pt-1">
                    <div className={`flex items-center justify-between text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className={`flex items-center gap-1 font-medium ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>
                        <Lock size={11} className="text-emerald-500" />
                        Doorstep 4-Digit Arrival OTP
                      </span>
                      <span className={`font-semibold ${isStarryNight ? 'text-blue-400' : 'text-blue-700'}`}>₹0 Middleman</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onOpenCustomerBooking}
                      className={`w-full h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isStarryNight
                          ? 'starry-btn-glossy text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      <Sparkles size={14} />
                      <span>Book Ramesh — ₹350 Fixed</span>
                      <ArrowRight size={13} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>

      {/* 3. CIVIC STATS BAND (With Progressive Blur Reveal & Specular Glass) */}
      <section className={`relative overflow-hidden py-10 border-y backdrop-blur-xl transition-colors duration-300 ${
        isStarryNight ? 'border-white/10 bg-[#070d1e]/80' : 'border-slate-200/80 bg-white/70'
      }`}>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '146', label: 'Standardized Rates', sub: 'Public tariffs for Indore', accent: isStarryNight ? '#60a5fa' : '#2563eb' },
              { val: '94.5%', label: 'Direct Artisan Share', sub: 'Zero middleman cuts', accent: isStarryNight ? '#34d399' : '#059669' },
              { val: '100%', label: 'Verified & Skill-Tested', sub: 'Aadhaar e-KYC', accent: isStarryNight ? '#93c5fd' : '#1d4ed8' },
              { val: '2.0%', label: 'Social Welfare Fund', sub: 'MPSLWB Healthcare', accent: isStarryNight ? '#fbbf24' : '#d97706' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-5 text-center space-y-1.5 rounded-2xl border transition-all ${
                  isStarryNight
                    ? 'apple-glass-card specular-border-top'
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: stat.accent }}>
                  {stat.val}
                </div>
                <div className={`text-xs sm:text-sm font-bold ${isStarryNight ? 'text-slate-100' : 'text-slate-900'}`}>
                  {stat.label}
                </div>
                <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3b. CIVIC TRUST TICKER */}
      <div className={`overflow-hidden py-3 border-b backdrop-blur-md transition-colors duration-300 ${
        isStarryNight ? 'border-white/10 bg-[#020817]/70' : 'border-slate-200 bg-slate-50/80'
      }`}>
        <div className="animate-marquee flex items-center">
          {[
            { icon: ShieldCheck, text: 'Aadhaar e-KYC Verified Artisans', color: 'text-blue-400' },
            { icon: Clock, text: '18-35 Min Proximity Arrival in Indore', color: 'text-amber-400' },
            { icon: IndianRupee, text: '₹0 Platform Commission', color: 'text-emerald-400' },
            { icon: FileCheck, text: '146 Fixed Public Tariff Rates', color: 'text-blue-400' },
            { icon: Lock, text: 'Doorstep 4-Digit Arrival OTP', color: 'text-purple-400' },
            { icon: TrendingUp, text: '94.5% Paid Directly to Artisan', color: 'text-emerald-400' },
            { icon: Building2, text: 'MP Cooperative Societies Act, 1960', color: 'text-blue-400' },
            { icon: Star, text: '4.97 Pilot Satisfaction Rating', color: 'text-amber-400' },
            { icon: Sparkles, text: 'Zero Middleman Surge Pricing', color: 'text-indigo-400' },
            { icon: HeartHandshake, text: '2.0% Labour Welfare Protection', color: 'text-rose-400' },
            { icon: ShieldCheck, text: 'Aadhaar e-KYC Verified Artisans', color: 'text-blue-400' },
            { icon: Clock, text: '18-35 Min Proximity Arrival in Indore', color: 'text-amber-400' },
            { icon: IndianRupee, text: '₹0 Platform Commission', color: 'text-emerald-400' },
            { icon: FileCheck, text: '146 Fixed Public Tariff Rates', color: 'text-blue-400' },
            { icon: Lock, text: 'Doorstep 4-Digit Arrival OTP', color: 'text-purple-400' },
            { icon: TrendingUp, text: '94.5% Paid Directly to Artisan', color: 'text-emerald-400' },
            { icon: Building2, text: 'MP Cooperative Societies Act, 1960', color: 'text-blue-400' },
            { icon: Star, text: '4.97 Pilot Satisfaction Rating', color: 'text-amber-400' },
            { icon: Sparkles, text: 'Zero Middleman Surge Pricing', color: 'text-indigo-400' },
            { icon: HeartHandshake, text: '2.0% Labour Welfare Protection', color: 'text-rose-400' },
          ].map((item, i) => {
            const IconComp = item.icon;
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-2 mx-6 text-[11px] font-semibold whitespace-nowrap ${
                  isStarryNight ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <IconComp size={13} className={`${item.color} shrink-0`} />
                <span>{item.text}</span>
                <span className={`w-1 h-1 rounded-full inline-block ml-2 ${isStarryNight ? 'bg-blue-500/50' : 'bg-blue-600/40'}`} />
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. Discover Services & Benchmark Rates */}
      <section id="services-showcase" className={`py-14 sm:py-16 border-b transition-colors duration-300 ${
        isStarryNight ? 'bg-[#020817]/70 border-white/10 backdrop-blur-md' : 'bg-white border-slate-200'
      }`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header with Prominent Location Context */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 ${
            isStarryNight ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div className="space-y-2 max-w-3xl">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-800'
              }`}>
                <MapPin size={13} className="text-blue-400" />
                <span>Indore Municipal Pilot • Zones 1–4</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight underline-reveal visible ${
                isStarryNight ? 'text-white' : 'text-slate-900'
              }`}>
                146 Standardized Service Rates in Indore
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isStarryNight ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Published public tariffs established under the MP Cooperative Societies Act, 1960. 
                Labor rates are fixed upfront with zero dynamic surge pricing. Materials and spare parts are billed at actual invoice cost upon resident approval.
              </p>
            </div>

            {/* Quick Location Badge — glossy glass */}
            <div className={`rounded-2xl p-4 shrink-0 text-xs space-y-1.5 ${
              isStarryNight
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'glass-emerald soft-glow-emerald'
            }`} role="status" aria-label="Active pilot zones">
              <div className={`font-bold flex items-center gap-1.5 ${isStarryNight ? 'text-emerald-300' : 'text-emerald-900'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 badge-pulse" aria-hidden="true" />
                <span>Indore Proximity Dispatch</span>
              </div>
              <div className={`text-[11px] ${isStarryNight ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Vijay Nagar &bull; Palasia &bull; Rajwada &bull; Annapurna
              </div>
            </div>
          </div>

          {/* Search & Quick Suggestions Bar */}
          <div className="space-y-3">
            <div className="relative max-w-2xl">
              <label htmlFor="service-search-input" className="sr-only">Search services by name or category</label>
              <input
                id="service-search-input"
                type="search"
                role="searchbox"
                aria-label="Search 146 service rates"
                placeholder="Search services — tap, switchboard, fan, AC, carpentry, drain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-20 text-xs sm:text-sm rounded-2xl transition-all focus:outline-none"
                style={{
                  background: isStarryNight ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: isStarryNight ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(15,15,15,0.12)',
                  boxShadow: isStarryNight ? '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(15,15,15,0.05)',
                  color: isStarryNight ? '#f8fafc' : '#0f0f0f',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = isStarryNight ? '1.5px solid rgba(96,165,250,0.8)' : '1.5px solid rgba(5,150,105,0.5)';
                  e.currentTarget.style.boxShadow = isStarryNight ? '0 0 0 3px rgba(59,130,246,0.25)' : '0 0 0 3px rgba(5,150,105,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = isStarryNight ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(15,15,15,0.12)';
                  e.currentTarget.style.boxShadow = isStarryNight ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(15,15,15,0.05)';
                }}
              />
              <Search size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${isStarryNight ? 'text-blue-400' : 'text-slate-400'}`} aria-hidden="true" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-all focus:outline-none ${
                    isStarryNight ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Search Chips — glass-pill with keyboard focus */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]" role="group" aria-label="Popular service searches">
              <span className={`font-medium mr-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Popular in Indore:</span>
              {[
                { label: 'Tap leakage', q: 'tap' },
                { label: 'Switchboard', q: 'switchboard' },
                { label: 'Ceiling fan', q: 'fan' },
                { label: 'AC filter', q: 'ac' },
                { label: 'Door lock', q: 'door' },
                { label: 'RO purifier', q: 'purifier' },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery(item.q);
                    setSelectedCategory('ALL');
                  }}
                  role="button"
                  aria-label={`Search for ${item.label}`}
                  className={`px-3 py-1.5 rounded-full cursor-pointer font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isStarryNight ? 'starry-pill' : 'glass-pill bg-white/70 text-slate-700'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Blinkit/Apple Style Horizontal Trending Services Carousel */}
          {!searchQuery && selectedCategory === 'ALL' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isStarryNight ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-lg font-extrabold tracking-tight ${
                      isStarryNight ? 'text-white' : 'text-slate-900'
                    }`}>
                      Popular at Doorsteps in Indore
                    </h3>
                    <p className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                      Top booked services with 12–30 min arrival in Palasia & Vijay Nagar
                    </p>
                  </div>
                </div>

                {/* Left / Right Scroll Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollTrending('left')}
                    aria-label="Scroll trending services left"
                    className={`w-8 h-8 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                      isStarryNight
                        ? 'border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollTrending('right')}
                    aria-label="Scroll trending services right"
                    className={`w-8 h-8 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                      isStarryNight
                        ? 'border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Tray */}
              <div
                ref={trendingScrollRef}
                className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {trendingIndoreServices.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25, ease: [0.16,1,0.3,1] } }}
                    className={`w-64 sm:w-72 shrink-0 rounded-3xl flex flex-col justify-between overflow-hidden group transition-all border ${
                      isStarryNight
                        ? 'apple-glass-card specular-border-top hover:border-blue-400/50 shadow-xl'
                        : 'daylight-glass-card hover:shadow-2xl'
                    }`}
                    role="article"
                    aria-label={`${service.name} — ₹${service.price} fixed rate`}
                  >
                    {/* Visual Photo Header */}
                    <div className="relative h-36 w-full overflow-hidden bg-slate-900/40">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Top Badges — frosted glass */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-bold shimmer-scan" style={{ background: 'rgba(255,255,255,0.88)', color: '#1e293b' }}>
                          {service.badge}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full glass-pill" style={{ background: 'rgba(10,10,12,0.8)' }}>
                        <Star size={11} className="text-amber-400 fill-amber-400" aria-hidden="true" />
                        <span className="text-[10px] font-bold text-white">{service.rating}</span>
                      </div>

                      {/* Trade Pill */}
                      <div className="absolute bottom-2 left-2.5">
                        <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(37,99,235,0.85)', color: '#fff' }}>
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className={`font-bold text-xs sm:text-sm line-clamp-2 leading-snug ${
                          isStarryNight ? 'text-white' : 'text-slate-900'
                        }`}>
                          {service.name}
                        </h4>
                        <div className={`flex items-center gap-2 text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Clock size={12} className="text-slate-400" />
                          <span>~{service.duration}</span>
                          <span>•</span>
                          <span className={isStarryNight ? 'text-emerald-400 font-medium' : 'text-emerald-700 font-medium'}>
                            94.5% to Artisan: ₹{service.artisanPayout}
                          </span>
                        </div>
                      </div>

                      {/* Price & Book Button */}
                      <div className={`pt-2 border-t flex items-center justify-between gap-2 ${
                        isStarryNight ? 'border-white/10' : 'border-slate-100'
                      }`}>
                        <div>
                          <div className={`text-base font-extrabold font-mono ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                            ₹{service.price}
                          </div>
                          <div className={`text-[10px] leading-none ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Fixed Rate</div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={onOpenCustomerBooking}
                          aria-label={`Book ${service.name}`}
                          className={`h-8 px-4 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer focus:outline-none ${
                            isStarryNight ? 'starry-btn-glossy' : 'glossy-btn-dark text-white'
                          }`}
                        >
                          <span>Book</span>
                          <ArrowRight size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Category Navigation Scroll Tray with Left / Right Buttons */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isStarryNight ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Explore by Trade Category (12 Trades)
              </span>

              {/* Scroll arrow buttons for categories */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollCategories('left')}
                  aria-label="Scroll categories left"
                  className={`w-7 h-7 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                    isStarryNight
                      ? 'border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => scrollCategories('right')}
                  aria-label="Scroll categories right"
                  className={`w-7 h-7 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                    isStarryNight
                      ? 'border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Horizontally Scrollable Category Bar */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              role="tablist"
              aria-label="Service Trade Categories"
            >
              <motion.button
                id="cat-tab-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'ALL' && !searchQuery
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isStarryNight
                    ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                All Categories (146)
              </motion.button>

              {SERVICE_CATEGORIES.map((cat) => {
                const count = INDORE_SERVICES_DATASET.filter(
                  (s) => s.category.toLowerCase() === cat.id.toLowerCase()
                ).length;
                const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase() && !searchQuery;

                return (
                  <motion.button
                    key={cat.id}
                    id={`cat-tab-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                      setShowAllServices(true);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isStarryNight
                        ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/10'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-blue-700 text-blue-100' : isStarryNight ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar with Explanatory Scope & Toggle */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t ${
            isStarryNight ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
                {searchQuery ? (
                  `Showing ${displayedServices.length} ${displayedServices.length === 1 ? 'service' : 'services'} matching "${searchQuery}" (across 146 Indore catalog rates)`
                ) : selectedCategory !== 'ALL' ? (
                  `Showing all ${displayedServices.length} ${selectedCategory} rates in Indore (from ₹${Math.min(...displayedServices.map(s => s.suggested_display_price_inr || s.min_price_inr))})`
                ) : showAllServices ? (
                  `Showing all 146 benchmarked services in Indore across 12 trades`
                ) : (
                  `Showing 16 featured sample rates across 12 trades (out of 146 total services in Indore)`
                )}
              </span>
            </div>

            {/* Toggle between Featured (16) vs All (146) when on ALL categories */}
            {selectedCategory === 'ALL' && !searchQuery && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAllServices(!showAllServices)}
                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                    isStarryNight
                      ? 'border-blue-500/40 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300'
                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  {showAllServices ? 'Show Featured Sample (16)' : 'Browse Complete Catalog (146 Services)'}
                </motion.button>
              </div>
            )}
          </div>

          {/* Service Cards Grid */}
          {displayedServices.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {displayedServices.map((service) => {
                  const displayPrice = service.suggested_display_price_inr || service.min_price_inr;
                  const durationMins = service.estimated_duration_hours ? Math.round(service.estimated_duration_hours * 60) : 45;
                  const artisanPayout = Math.round(displayPrice * 0.945);
                  const hasVisitAdjustment = service.notes?.toLowerCase().includes('adjust') || service.notes?.toLowerCase().includes('labour/visit only');

                  return (
                    <motion.div
                      key={service.record_id}
                      layout
                      initial={{ opacity: 0, scale: 0.94, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -10 }}
                      transition={{ duration: 0.22 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all group border ${
                        isStarryNight
                          ? 'apple-glass-card specular-border-top hover:border-blue-400/50 shadow-md'
                          : 'daylight-glass-card hover:border-blue-400 hover:shadow-lg'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                            isStarryNight
                              ? 'text-blue-300 bg-blue-500/20 border-blue-500/30'
                              : 'text-blue-700 bg-blue-50 border-blue-100'
                          }`}>
                            {service.category}
                          </span>
                          <span className={`text-[11px] flex items-center gap-1 font-medium ${
                            isStarryNight ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <Clock size={12} className="text-slate-400" />
                            {durationMins} mins
                          </span>
                        </div>

                        {/* Service Title */}
                        <div>
                          <h3 className={`font-bold text-sm leading-snug transition-colors ${
                            isStarryNight ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'
                          }`}>
                            {service.service_name}
                          </h3>
                          <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                            isStarryNight ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {service.notes || `${service.pricing_unit} • Public cooperative tariff`}
                          </p>
                        </div>

                        {/* Adjustment Note Badge if applicable */}
                        {hasVisitAdjustment && (
                          <div className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${
                            isStarryNight
                              ? 'text-blue-200 bg-blue-900/40 border-blue-500/40'
                              : 'text-blue-800 bg-blue-50/90 border-blue-200/70'
                          }`}>
                            ✓ Visit fee adjusted against final repair
                          </div>
                        )}

                        {/* Transparent Price & Split Breakdown */}
                        <div className={`rounded-xl p-3 border space-y-1.5 ${
                          isStarryNight ? 'bg-slate-900/70 border-white/10' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className={isStarryNight ? 'text-slate-300 font-medium' : 'text-slate-600 font-medium'}>Labor Benchmark:</span>
                            <span className={`font-extrabold font-mono text-base ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>₹{displayPrice}</span>
                          </div>
                          <div className={`flex items-center justify-between text-[11px] pt-0.5 border-t ${
                            isStarryNight ? 'border-white/10' : 'border-slate-200/60'
                          }`}>
                            <span className={isStarryNight ? 'text-slate-400' : 'text-slate-500'}>94.5% to Artisan:</span>
                            <span className={`font-bold font-mono ${isStarryNight ? 'text-emerald-400' : 'text-emerald-700'}`}>
                              ₹{artisanPayout}
                            </span>
                          </div>
                        </div>

                        <p className={`text-[10px] leading-tight ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                          * Standard labor benchmark. Replacement materials billed at actuals upon approval.
                        </p>
                      </div>

                      {/* Card Footer Action */}
                      <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                        isStarryNight ? 'border-white/10' : 'border-slate-100'
                      }`}>
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                          isStarryNight ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>
                          <CheckCircle2 size={13} />
                          <span>Verified</span>
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={onOpenCustomerBooking}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                        >
                          <span>Book</span>
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Friendly Empty State */
            <div className={`border rounded-2xl p-10 text-center space-y-3 ${
              isStarryNight ? 'bg-slate-900/60 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                isStarryNight ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'
              }`}>
                <Search size={20} />
              </div>
              <h3 className={`font-bold text-base ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                No services found matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                We couldn&apos;t find any service matching your query in the 146 Indore catalog items. Try searching for &ldquo;tap&rdquo;, &ldquo;switchboard&rdquo;, &ldquo;fan&rdquo;, or &ldquo;pipe&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isStarryNight
                    ? 'bg-slate-800 border-white/10 text-white hover:bg-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Clear Search & View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4b. Verified Trades in Action — Interactive Image Accordion (ui-layouts.com/components/image-accordions) */}
      <section id="guilds-showcase" className={`py-16 sm:py-20 border-b transition-colors duration-300 ${
        isStarryNight ? 'bg-[#030718]/95 border-white/10' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isStarryNight ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              <HardHat size={13} />
              <span>Statutory Cooperative Guilds</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              Frontline Trades in Action
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Hover or tap each guild to inspect certified trade standards, real-time artisan availability across Indore, and statutory benchmark rates.
            </p>
          </motion.div>

          {/* Desktop & Tablet Interactive Image Accordion */}
          <div className="hidden md:flex h-[460px] gap-3 items-stretch perspective-1000">
            {tradeGuilds.map((guild, idx) => {
              const isActive = activeTradeAccordion === idx;
              return (
                <div
                  key={guild.id}
                  onClick={() => setActiveTradeAccordion(idx)}
                  onMouseEnter={() => setActiveTradeAccordion(idx)}
                  className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-[0.16,1,0.3,1] border ${
                    isActive
                      ? isStarryNight
                        ? 'flex-[3.5] border-blue-400/60 shadow-[0_0_35px_rgba(59,130,246,0.35)]'
                        : 'flex-[3.5] border-blue-400 shadow-xl'
                      : isStarryNight
                      ? 'flex-1 border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
                      : 'flex-1 border-slate-200/80 hover:border-slate-300 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* High-Res Guild Photograph */}
                  <img
                    src={guild.image}
                    alt={guild.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  {/* Cinematic Gradient & Vignette Overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30'
                      : 'bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-950/50'
                  }`} />

                  {/* Active Card Content */}
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 p-6 flex flex-col justify-between z-10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 backdrop-blur-md">
                          {guild.tag}
                        </span>
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{guild.activeCount} Artisans Online</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-2xl font-extrabold text-white tracking-tight">
                            {guild.title}
                          </h3>
                          <p className="text-xs text-slate-200/90 leading-relaxed max-w-lg">
                            {guild.desc}
                          </p>
                        </div>

                        {/* Guild Benchmarks Pill Bar */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-white font-mono font-bold text-xs">
                            {guild.benchmarkRate}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                            94.5% Direct UPI
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-300 font-bold text-xs">
                            MP Welfare Covered
                          </span>
                        </div>

                        {/* Competencies Chips */}
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <div className="text-[11px] text-slate-300 font-semibold">Standardized Competencies:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {guild.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-white/10 text-white text-[11px] font-medium backdrop-blur-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-slate-300 font-mono">Indore Municipal Federation • Guild Verified</span>
                          <button
                            onClick={onOpenCustomerBooking}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105"
                          >
                            <span>Book Guild Artisan</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Inactive Collapsed Card Content */
                    <div className="absolute inset-0 p-5 flex flex-col justify-between items-center z-10">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 text-xs font-bold">
                        0{idx + 1}
                      </span>
                      <div className="writing-vertical-rl rotate-180 text-white font-bold text-sm tracking-wide line-clamp-1">
                        {guild.shortTitle}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {guild.activeCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Accordion View (< md) */}
          <div className="md:hidden space-y-3">
            {tradeGuilds.map((guild, idx) => {
              const isActive = activeTradeAccordion === idx;
              return (
                <div
                  key={guild.id}
                  onClick={() => setActiveTradeAccordion(idx)}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isActive
                      ? isStarryNight ? 'bg-slate-900 border-blue-500/40 shadow-lg' : 'bg-white border-blue-300 shadow-md'
                      : isStarryNight ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className={`font-bold text-xs ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>{guild.title}</div>
                        <div className="text-[10px] text-emerald-500 font-semibold">{guild.activeCount} Artisans Online • {guild.benchmarkRate}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-500">{isActive ? '−' : '+'}</span>
                  </div>

                  {isActive && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                      <div className="h-40 rounded-xl overflow-hidden relative">
                        <img src={guild.image} alt={guild.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] leading-tight font-medium">
                          {guild.desc}
                        </div>
                      </div>
                      <button
                        onClick={onOpenCustomerBooking}
                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <span>Book Verified Artisan</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Transparent Cooperative Economics — Aligned Split Experience & Stacking Card 3D Flip */}
      <section id="economics" className={`py-16 sm:py-20 border-b transition-colors duration-300 ${
        isStarryNight ? 'bg-[#020817]/90 border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header with Blur Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isStarryNight ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <IndianRupee size={13} />
              <span>Cooperative Revenue Model</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              Where Does Every Rupee Go?
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Unlike corporate gig aggregators that extract 25–30% in hidden platform fees, Bharat Kaushal operates under statutory cooperative rules with transparent direct settlement.
            </p>
          </motion.div>

          {/* Synchronously Aligned Grid (Both Columns Share Exact Header & Card Heights) */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-stretch">
            {/* Left Column: Fixed Simulation Console */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4 mb-8 lg:mb-0">
              {/* Left Top Matching Header Bar (Exact h-[58px] matching right tabs) */}
              <div className={`h-[58px] px-4 rounded-2xl border flex items-center justify-between transition-all ${
                isStarryNight ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-xs font-bold ${isStarryNight ? 'text-slate-200' : 'text-slate-800'}`}>
                    Live Telemetry Simulator
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  isStarryNight ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  94.5% Statutory
                </span>
              </div>

              {/* Left Interactive Calculator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-3xl p-6 sm:p-7 border flex-1 flex flex-col justify-between space-y-5 ${
                  isStarryNight
                    ? 'apple-glass-card specular-border-top ui-shadow-glow'
                    : 'bg-white border-slate-200 ui-shadow-ambient'
                }`}
              >
                <div className="space-y-4">
                  {/* Amount Display & Slider */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className={`text-xs font-semibold ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>Selected Service Amount:</span>
                      <motion.span
                        key={calcAmount}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className={`text-2xl sm:text-3xl font-black font-mono ${isStarryNight ? 'text-blue-400' : 'text-blue-700'}`}
                      >
                        ₹{calcAmount.toLocaleString('en-IN')}
                      </motion.span>
                    </div>

                    <input
                      id="calc-slider"
                      type="range"
                      min="300"
                      max="10000"
                      step="50"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
                        isStarryNight ? 'bg-slate-800' : 'bg-slate-200'
                      }`}
                    />

                    {/* Preset Buttons */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      {[
                        { amount: 350, label: '₹350 (Repair)' },
                        { amount: 1200, label: '₹1.2k (Deep Service)' },
                        { amount: 5000, label: '₹5k (Major Work)' },
                      ].map((p) => (
                        <button
                          key={p.amount}
                          onClick={() => setCalcAmount(p.amount)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                            calcAmount === p.amount
                              ? 'bg-blue-600 text-white shadow-xs'
                              : isStarryNight
                              ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proportional Division Visualizer Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={isStarryNight ? 'text-slate-300' : 'text-slate-700'}>Statutory Division:</span>
                      <span className="text-[10px] text-emerald-400 font-bold">100% Direct Settlement</span>
                    </div>
                    <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-900/40 p-0.5 border border-white/10">
                      <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-300" style={{ width: '94.5%' }} title="Artisan Direct (94.5%)" />
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: '3.5%' }} title="Cooperative Ops (3.5%)" />
                      <div className="h-full bg-amber-400 rounded-r-full transition-all duration-300" style={{ width: '2.0%' }} title="Labour Welfare Fund (2.0%)" />
                    </div>
                  </div>

                  {/* 3 Telemetry Split Tags */}
                  <div className="space-y-2">
                    <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                      isStarryNight ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold">Direct to Artisan (94.5%)</div>
                          <div className="text-[10px] opacity-80">Instant bank credit via UPI</div>
                        </div>
                      </div>
                      <span className="text-base font-black font-mono">₹{workerEarning.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
                      isStarryNight ? 'bg-blue-950/30 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <span>Cooperative Society Admin (3.5%)</span>
                      </div>
                      <span className="font-bold font-mono">₹{societyEarning.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
                      isStarryNight ? 'bg-amber-950/30 border-amber-500/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span>MP Labour Welfare Fund (2.0%)</span>
                      </div>
                      <span className="font-bold font-mono">₹{welfareEarning.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Difference Highlight Banner */}
                  <div className={`p-3 rounded-2xl border flex items-center gap-3 text-xs ${
                    isStarryNight ? 'bg-slate-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <div className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                        +₹{(workerEarning - typicalAggregatorWorker).toLocaleString('en-IN')} Extra for the Artisan
                      </div>
                      <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        compared to typical 28% private aggregator deduction
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenCustomerBooking}
                  className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                    isStarryNight ? 'starry-btn-glossy text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>Book at Benchmark Tariff</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>

            {/* Right Column: Sliding & Flipping Stacking Card Stage */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              {/* Right Top Matching Header Bar: 3 Interactive Tabs (Exact h-[58px]) */}
              <div className="grid grid-cols-3 gap-2 h-[58px]">
                {[
                  { id: 0, label: '1. Direct Payout', badge: '94.5% Direct' },
                  { id: 1, label: '2. Social Security', badge: '2.0% Welfare' },
                  { id: 2, label: '3. Worker Voice', badge: '1 Vote Share' },
                ].map((p) => {
                  const isActive = activeEconomicPillar === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveEconomicPillar(p.id)}
                      className={`p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-center cursor-pointer ${
                        isActive
                          ? isStarryNight
                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                            : 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                          : isStarryNight
                          ? 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold opacity-80">{p.badge}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Stacking Card Deck Stage with 3D Flip */}
              <div className="relative flex-1 perspective-1200 flex flex-col">
                {/* Physical Stacking Card Layers Behind Active Card (ui-layouts stacking-card effect) */}
                <div className={`absolute -bottom-2 inset-x-3 h-full rounded-3xl border transition-all duration-300 pointer-events-none -z-10 scale-[0.985] ${
                  isStarryNight ? 'bg-slate-900/60 border-white/5 shadow-lg' : 'bg-slate-100 border-slate-200/80 shadow-xs'
                }`} />
                <div className={`absolute -bottom-4 inset-x-6 h-full rounded-3xl border transition-all duration-300 pointer-events-none -z-20 scale-[0.97] ${
                  isStarryNight ? 'bg-slate-950/40 border-white/5 shadow-md' : 'bg-slate-200/50 border-slate-200/50 shadow-2xs'
                }`} />

                <AnimatePresence mode="wait">
                  {(() => {
                    const cards = [
                      {
                        id: 'pillar-1',
                        badge: 'Pillar 1 • Direct Payout',
                        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                        image: '/images/service_electrician.jpg',
                        imgCaption: 'Certified Electrician with Instant UPI Credit',
                        title: '94.5% Direct Labor Payout vs 28% Aggregator Commission',
                        desc: 'Traditional commercial apps deduct 20% to 30% from every booking under lead charges, platform service fees, and commission penalties. In Bharat Kaushal, 94.5% transfers directly to the artisan\'s bank account upon resident OTP authorization.',
                        points: [
                          'Zero lead-buying fees: Artisans never have to pay upfront to receive customer requests.',
                          'Zero dynamic surge deductions: Public rate tariff ensures residents pay standard rates while artisans keep the full value.',
                          'Direct UPI settlement: No 15-day platform holding periods or escrow delays.',
                        ],
                        highlight: `Direct Payout on ₹${calcAmount.toLocaleString('en-IN')}: ₹${workerEarning.toLocaleString('en-IN')} vs ~₹${typicalAggregatorWorker.toLocaleString('en-IN')} on commercial apps`,
                      },
                      {
                        id: 'pillar-2',
                        badge: 'Pillar 2 • Social Security',
                        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                        image: '/images/service_masonry.jpg',
                        imgCaption: 'Registered Civil Works Artisan Under State Protection',
                        title: '2.0% Statutory Social Welfare Fund vs Zero Protection',
                        desc: 'Gig economy workers frequently face medical emergencies, on-duty accidents, and retirement instability with zero safety net. Bharat Kaushal automatically allocates 2.0% of every completed service into the Madhya Pradesh Unorganized Workers Social Security reserve.',
                        points: [
                          'Registered under the MP Unorganized Workers Social Security Act, 2008.',
                          'Accident insurance and medical hospitalization assistance for registered artisan families.',
                          'Old-age cooperative welfare corpus managed with tripartite state oversight.',
                        ],
                        highlight: `Welfare Contribution Accumulated: ₹${welfareEarning.toLocaleString('en-IN')} on this single booking`,
                      },
                      {
                        id: 'pillar-3',
                        badge: 'Pillar 3 • Democratic Dignity',
                        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                        image: '/images/cooperative_voting.jpg',
                        imgCaption: 'Artisan Cooperative Democratic General Body Assembly',
                        title: 'Democratic Worker Voice vs Black-Box Algorithmic De-activation',
                        desc: 'Corporate gig workers can be blocked or de-activated overnight by rating algorithms without human recourse. In Bharat Kaushal, every artisan is a voting shareholder in their local cooperative society with legal standing under the MP Cooperative Societies Act, 1960.',
                        points: [
                          '1 Artisan = 1 Democratic Vote: Officers and society management are elected democratically.',
                          'Peer review and fair grievance arbitration: No arbitrary computerized terminations.',
                          'Cooperative dividend sharing: Annual operating surpluses distributed back to member artisans as patronage dividends.',
                        ],
                        highlight: 'Governance Model: Registered Cooperative Society (Indore Ward 48 Hub)',
                      },
                    ];
                    const card = cards[activeEconomicPillar];
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95, rotateY: -10 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className={`rounded-3xl p-6 sm:p-7 border flex-1 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                          isStarryNight ? 'apple-glass-card specular-border-top ui-shadow-glow' : 'bg-white border-slate-200 ui-shadow-ambient'
                        }`}
                      >
                        <div className="space-y-4">
                          {/* Photographic Documentary Banner Inside Pillar Card */}
                          <div className="h-32 sm:h-36 w-full rounded-2xl overflow-hidden relative group">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${card.badgeColor}`}>
                                {card.badge}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
                                0{activeEconomicPillar + 1} of 03
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold drop-shadow-md">
                              {card.imgCaption}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                              {card.title}
                            </h3>
                            <p className={`text-xs leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                              {card.desc}
                            </p>
                          </div>

                          <div className={`space-y-2 pt-2 border-t ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                            {card.points.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5 text-xs">
                                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span className={isStarryNight ? 'text-slate-200' : 'text-slate-700'}>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Highlight & Navigation Controls */}
                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/10">
                          <div className={`p-3 rounded-2xl border text-xs font-semibold ${
                            isStarryNight ? 'bg-slate-900/60 border-white/10 text-emerald-300' : 'bg-slate-50 border-slate-200 text-emerald-800'
                          }`}>
                            {card.highlight}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => setActiveEconomicPillar((prev) => (prev > 0 ? prev - 1 : 2))}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isStarryNight ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              <ChevronLeft size={14} />
                              <span>Previous Pillar</span>
                            </button>
                            <div className="flex items-center gap-1.5">
                              {[0, 1, 2].map((dot) => (
                                <button
                                  key={dot}
                                  onClick={() => setActiveEconomicPillar(dot)}
                                  className={`h-2 rounded-full transition-all cursor-pointer ${
                                    activeEconomicPillar === dot ? 'w-6 bg-blue-500' : 'w-2 bg-slate-400/40 hover:bg-slate-400'
                                  }`}
                                  aria-label={`Go to pillar ${dot + 1}`}
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => setActiveEconomicPillar((prev) => (prev < 2 ? prev + 1 : 0))}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isStarryNight ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              <span>Next Pillar</span>
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Multi-Role Portals Preview (Role-Based Task Previews) */}
      {/* 6. Multi-Role Portals Preview (Role-Based Task Previews) */}
      <section id="dashboards-preview" className={`py-16 border-b transition-colors duration-300 ${
        isStarryNight ? 'bg-[#020817]/70 border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-800'
            }`}>
              <LayoutDashboard size={13} />
              <span>Multi-Portal Ecosystem</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              Tailored Tools for Every Stakeholder
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Explore the dedicated interfaces built for citizens, artisans, cooperative society officers, and administrators.
            </p>
          </motion.div>

          {/* Role Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2" role="tablist">
            {[
              { role: 'CUSTOMER' as UserRole, label: 'Citizen / Resident', icon: User },
              { role: 'WORKER' as UserRole, label: 'Skilled Artisan', icon: HardHat },
              { role: 'SOCIETY_ADMIN' as UserRole, label: 'Society Admin', icon: Building2 },
              { role: 'FEDERATION_ADMIN' as UserRole, label: 'Federation Command', icon: Sliders },
              { role: 'SUPER_ADMIN' as UserRole, label: 'Regulatory Oversight', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDashboardTab === tab.role;
              return (
                <motion.button
                  key={tab.role}
                  id={`tab-role-${tab.role.toLowerCase().replace(/_/g, '-')}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveDashboardTab(tab.role)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isStarryNight
                      ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/10'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className={`rounded-3xl p-6 sm:p-8 ${
            isStarryNight ? 'starry-card' : 'bg-slate-50 border border-slate-200'
          }`}>
            <AnimatePresence mode="wait">
              {activeDashboardTab === 'CUSTOMER' && (
                <motion.div
                  key="CUSTOMER"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Resident & Citizen Experience
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-black ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                      Book Certified Local Trades at Published Public Rates
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                      Indore residents can browse 140+ benchmarked home services, match with certified artisans within a 5 km radius, verify worker identity at the doorstep using a 4-digit Arrival OTP, and receive instant digital receipts.
                    </p>
                    <ul className={`space-y-2 text-xs ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>Proximity matching connecting you to neighborhood artisans in Indore</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>Two-factor OTP security: Arrival verification and Completion authorization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>Transparent rate itemization with labor separate from approved materials</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        id="launch-portal-customer"
                        onClick={() => (isLoggedIn ? onSelectRole('CUSTOMER') : onOpenAuth('CUSTOMER'))}
                        className={`h-11 px-6 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isStarryNight ? 'starry-btn-glossy' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <span>Open Citizen Portal</span>
                        <ArrowRight size={14} />
                      </motion.button>
                      {!isLoggedIn && (
                        <span className={`text-[11px] block mt-1.5 font-medium flex items-center gap-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Lock size={11} className="text-slate-400 shrink-0" />
                          <span>Sign-in required • Opens Citizen authentication</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Honest Interface Preview */}
                  <div className={`lg:col-span-5 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs border ${
                    isStarryNight ? 'bg-slate-900/90 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className={`flex items-center justify-between pb-2 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Active Service Request</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        Matched
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>Water Purifier & RO Filter Service</div>
                      <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Vijay Nagar Ward, Indore • Scheduled for Today</div>
                    </div>
                    <div className={`rounded-xl p-3 border space-y-1.5 ${isStarryNight ? 'bg-slate-950/60 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between">
                        <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Assigned Artisan:</span>
                        <strong className={isStarryNight ? 'text-white' : 'text-slate-900'}>Suresh Patidar</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Doorstep Arrival OTP:</span>
                        <span className="font-mono font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-500/30">•••• (Sample Demo Code)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Benchmark Labor Rate:</span>
                        <span className={`font-mono font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>₹299.00</span>
                      </div>
                    </div>
                    <div className={`text-[10px] text-center ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Sample citizen booking interface
                    </div>
                  </div>
                </motion.div>
              )}

            {activeDashboardTab === 'WORKER' && (
              <motion.div
                key="WORKER"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    Artisan & Skilled Worker Experience
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                    Receive Local Job Requests and Keep 94.5% of Your Earnings
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                    Artisans receive neighborhood service requests within 5 km, confirm doorstep arrival with secure OTPs, track daily earnings deposited directly into their bank accounts via UPI, and build automatic healthcare cushions through the MP Labour Welfare Fund.
                  </p>
                  <ul className={`space-y-2 text-xs ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Instant proximity alerts with complete freedom to accept or decline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Trade skill evaluation & competency certification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Transparent digital wallet showing 94.5% earnings and 2.0% welfare balance</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="launch-portal-worker"
                      onClick={() => (isLoggedIn ? onSelectRole('WORKER') : onOpenAuth('WORKER'))}
                      className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Open Artisan Portal</span>
                      <ArrowRight size={14} />
                    </motion.button>
                    {!isLoggedIn && (
                      <span className={`text-[11px] block mt-1.5 font-medium flex items-center gap-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Lock size={11} className="text-slate-400 shrink-0" />
                        <span>Sign-in required • Opens Artisan authentication</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Honest Interface Preview */}
                <div className={`lg:col-span-5 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs border ${
                  isStarryNight ? 'bg-slate-900/90 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Artisan Daily Summary</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      On Duty
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className={`p-3 rounded-xl border ${isStarryNight ? 'bg-slate-950/60 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                      <div className={`text-[10px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Net Realization (94.5%)</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">₹1,890.00</div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isStarryNight ? 'bg-slate-950/60 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                      <div className={`text-[10px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Welfare Accrued (2%)</div>
                      <div className="text-lg font-bold text-amber-400 font-mono">₹40.00</div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isStarryNight ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50/60 border-blue-200/80'
                  }`}>
                    <div className={`font-bold ${isStarryNight ? 'text-blue-300' : 'text-blue-900'}`}>Next Service Assigned</div>
                    <div className={`text-[11px] ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>Fan Replacement • Old Palasia (1.4 km away)</div>
                  </div>
                  <div className={`text-[10px] text-center ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sample artisan operational dashboard
                  </div>
                </div>
              </motion.div>
            )}

            {activeDashboardTab === 'SOCIETY_ADMIN' && (
              <motion.div
                key="SOCIETY_ADMIN"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Local Cooperative Administration
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                    Artisan Skill Verification & Member Welfare Oversight
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                    Society administrators conduct trade competency checks, verify Aadhaar e-KYC submissions, administer the 3.5% cooperative operations pool, and arbitrate resident queries transparently under the MP Cooperative Societies Act, 1960.
                  </p>
                  <ul className={`space-y-2 text-xs ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Review and approve artisan identity credentials and trade assessments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Administer local society operational funds and member welfare claims</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Handle consumer inquiries with fair, structured dispute resolution</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="launch-portal-society-admin"
                      onClick={() => (isLoggedIn ? onSelectRole('SOCIETY_ADMIN') : onOpenAuth('SOCIETY_ADMIN'))}
                      className="h-11 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Open Society Admin Portal</span>
                      <ArrowRight size={14} />
                    </motion.button>
                    {!isLoggedIn && (
                      <span className={`text-[11px] block mt-1.5 font-medium flex items-center gap-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Lock size={11} className="text-slate-400 shrink-0" />
                        <span>Authorized sign-in required • Opens Society Admin authentication</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Honest Interface Preview */}
                <div className={`lg:col-span-5 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs border ${
                  isStarryNight ? 'bg-slate-900/90 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Indore Shramik Samiti</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                      Society Registry
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Active Registered Artisans:</span>
                      <strong className={isStarryNight ? 'text-white' : 'text-slate-900'}>48 Craftsmen</strong>
                    </div>
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Pending KYC Verifications:</span>
                      <strong className="text-amber-400 font-semibold">3 Pending</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Operations Fund Balance (3.5%):</span>
                      <strong className="text-emerald-400 font-mono">₹4,200.00</strong>
                    </div>
                  </div>
                  <div className={`text-[10px] text-center ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sample cooperative society management roster
                  </div>
                </div>
              </motion.div>
            )}

            {activeDashboardTab === 'FEDERATION_ADMIN' && (
              <motion.div
                key="FEDERATION_ADMIN"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    District & State Cooperative Command
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                    District Trade Supply, Demand Balance & Welfare Reserves
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                    Apex cooperative officers monitor trade demand across municipal zones, maintain price benchmark guidelines, oversee district welfare reserve allocations, and coordinate trade skill training workshops.
                  </p>
                  <ul className={`space-y-2 text-xs ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Cross-ward trade distribution monitoring across Indore municipal zones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>District-level social security reserve tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Cooperative training triggers for trades facing local shortages</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="launch-portal-federation-admin"
                      onClick={() => (isLoggedIn ? onSelectRole('FEDERATION_ADMIN') : onOpenAuth('FEDERATION_ADMIN'))}
                      className="h-11 px-6 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Open Federation Command</span>
                      <ArrowRight size={14} />
                    </motion.button>
                    {!isLoggedIn && (
                      <span className={`text-[11px] block mt-1.5 font-medium flex items-center gap-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Lock size={11} className="text-slate-400 shrink-0" />
                        <span>Authorized sign-in required • Opens Federation Command authentication</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Honest Interface Preview */}
                <div className={`lg:col-span-5 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs border ${
                  isStarryNight ? 'bg-slate-900/90 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>District Apex Overview</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px]">
                      Indore District
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Active Municipal Zones:</span>
                      <strong className={isStarryNight ? 'text-white' : 'text-slate-900'}>4 Zones (Indore)</strong>
                    </div>
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>District Welfare Reserve:</span>
                      <strong className="text-emerald-400 font-mono">₹1,48,250.00</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Primary Trade Demand:</span>
                      <span className={`font-medium ${isStarryNight ? 'text-slate-200' : 'text-slate-800'}`}>Electrical (36%), Plumbing (32%)</span>
                    </div>
                  </div>
                  <div className={`text-[10px] text-center ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sample federation monitoring interface
                  </div>
                </div>
              </motion.div>
            )}

            {activeDashboardTab === 'SUPER_ADMIN' && (
              <motion.div
                key="SUPER_ADMIN"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                    Statutory & Regulatory Oversight
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>
                    Statutory Compliance & Welfare Fund Transparency
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                    Government regulators and auditors inspect adherence to the MP Cooperative Societies Act 1960 and the Unorganized Workers&apos; Social Security Act 2008, verify UIDAI Aadhaar masking compliance, and oversee welfare fund disbursements.
                  </p>
                  <ul className={`space-y-2 text-xs ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Independent statutory audit logs and verifiable financial transparency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>UIDAI compliance review ensuring no plain-text citizen identity storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Oversight of statutory welfare disbursements for unorganized workers</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="launch-portal-super-admin"
                      onClick={() => (isLoggedIn ? onSelectRole('SUPER_ADMIN') : onOpenAuth('SUPER_ADMIN'))}
                      className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                    >
                      <span>Open Regulatory Portal</span>
                      <ArrowRight size={14} />
                    </motion.button>
                    {!isLoggedIn && (
                      <span className={`text-[11px] block mt-1.5 font-medium flex items-center gap-1 ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Lock size={11} className="text-slate-400 shrink-0" />
                        <span>Statutory clearance required • Opens Regulatory Oversight authentication</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Honest Interface Preview */}
                <div className={`lg:col-span-5 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs border ${
                  isStarryNight ? 'bg-slate-900/90 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className={`font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Regulatory Audit Status</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      Compliant
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Statutory Act:</span>
                      <strong className={isStarryNight ? 'text-white' : 'text-slate-900'}>MP Cooperative Act, 1960</strong>
                    </div>
                    <div className={`flex justify-between py-1 border-b ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Data Minimization:</span>
                      <span className="text-emerald-400 font-semibold">100% UIDAI Masked</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Welfare Ledger Audit:</span>
                      <span className={`font-mono ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Reconciled (₹1,48,250)</span>
                    </div>
                  </div>
                  <div className={`text-[10px] text-center ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sample regulatory compliance oversight view
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </section>

      {/* 7. How Bharat Kaushal Works — Sticky Scrolling Experience */}
      <section id="how-it-works" className={`py-16 border-b transition-colors duration-300 ${isStarryNight ? 'border-white/10' : 'border-slate-200'}`} style={{
        background: isStarryNight
          ? 'linear-gradient(180deg, rgba(2,8,23,0.95) 0%, rgba(7,13,30,0.95) 50%, rgba(2,8,23,0.95) 100%)'
          : 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 50%, #f8faff 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-800'
            }`}>
              <span>Civic Service Journey</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              How Bharat Kaushal Works
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}>
              From artisan verification through doorstep service to instant, transparent settlement.
            </p>
          </motion.div>

          {/* Photographic Cooperative Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 ${
              isStarryNight ? 'starry-card' : 'bg-white border border-slate-200/90'
            }`}
          >
            {/* Visual Multi-Perspective Media Showcase Column */}
            <div className="lg:col-span-6 relative flex flex-col justify-between overflow-hidden bg-slate-950 min-h-[360px] sm:min-h-[420px]">
              {/* Active Image */}
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeShowcaseImage}
                    src={
                      activeShowcaseImage === 0
                        ? '/images/cooperative_community.jpg'
                        : activeShowcaseImage === 1
                        ? '/images/cooperative_command.jpg'
                        : '/images/hero_artisan.jpg'
                    }
                    alt="Bharat Kaushal Cooperative Operations in Indore"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/20" />

                {/* Video Play / Story Reel Trigger Button */}
                <div className="absolute top-4 right-4 z-10">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVideoModalOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs shadow-lg border border-blue-400/40 cursor-pointer"
                  >
                    <Play size={12} className="fill-white" />
                    <span>Watch Story</span>
                  </motion.button>
                </div>

                {/* Live Contextual Badge */}
                <div className="absolute bottom-4 left-4 right-4 z-10 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border bg-[#070d1e]/90 border-white/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {activeShowcaseImage === 0
                            ? 'Indore Shramik Sahakari Samiti Hub'
                            : activeShowcaseImage === 1
                            ? 'IMC Cooperative Operations Command'
                            : 'On-Site Doorstep Certified Work'}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {activeShowcaseImage === 0
                            ? 'Ward 48 Skills Verification & Aadhaar e-KYC'
                            : activeShowcaseImage === 1
                            ? 'Live Ward Telemetry & Municipal Rate Audit'
                            : '4-Digit Arrival OTP Confirmed Delivery'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Interactive Tab Switchers */}
              <div className="p-3 bg-slate-900/95 border-t border-white/10 grid grid-cols-3 gap-2">
                {[
                  { id: 0, label: '1. Society Hub' },
                  { id: 1, label: '2. Command' },
                  { id: 2, label: '3. Doorstep' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveShowcaseImage(tab.id)}
                    className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeShowcaseImage === tab.id
                        ? 'bg-blue-600 text-white shadow-sm border border-blue-400/50'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Informational Columns */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  isStarryNight ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <HeartHandshake size={14} />
                  <span>Democratic Worker Ownership</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${
                  isStarryNight ? 'text-white' : 'text-slate-900'
                }`}>
                  Built on Dignity, Democratic Voice & Direct Public Trust
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isStarryNight ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Unlike corporate gig apps that treat artisans as disposable algorithm leads, Bharat Kaushal operates as digital public infrastructure where every artisan is a voting member of their local cooperative society.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                      <Check size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Zero Middleman Extractive Markups</div>
                      <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>94.5% of what you pay is paid directly to the artisan&apos;s linked bank account.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <Check size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Aadhaar e-KYC & Arrival Security OTP</div>
                      <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Every doorstep visit requires resident OTP confirmation. Privacy is 100% UIDAI masked.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                      <Check size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>Social Healthcare & Pension Savings</div>
                      <div className={`text-[11px] ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>2.0% automatically funds accident insurance and family healthcare under state labor welfare rules.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`pt-2 border-t flex items-center justify-between ${
                isStarryNight ? 'border-white/10' : 'border-slate-100'
              }`}>
                <span className={`text-xs font-semibold ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Indore Municipal Pilot • 2026</span>
                <button
                  onClick={onOpenCustomerBooking}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                    isStarryNight ? 'starry-btn-glossy' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>Book Verified Service</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>

                  </div>
      </section>

      {/* 7b. AUTHENTIC UI-LAYOUTS STICKY SCROLL SECTION (ui-layouts.com/components/sticky-scroll) */}
      <StickyScrollSection
        isStarryNight={isStarryNight}
        onOpenCustomerBooking={onOpenCustomerBooking}
        onOpenWorkerMarketplace={onOpenWorkerMarketplace}
        onOpenAuth={onOpenAuth}
        t={t}
      />

      {/* 7b. FRONTLINE ARTISANS & CIVIC DOCUMENTARY GALLERY MODAL (ui-layouts.com/components/gallery-modal) */}
      <section id="gallery-showcase" className={`py-16 sm:py-20 border-b transition-colors duration-300 relative overflow-hidden ${
        isStarryNight ? 'bg-[#03091e]/90 border-white/10' : 'bg-[#f4f7fc] border-slate-200'
      }`}>
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] pointer-events-none blur-[140px] opacity-40 -z-10"
          style={{
            background: isStarryNight
              ? 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(245,158,11,0.15) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(217,119,6,0.08) 50%, transparent 80%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto space-y-2.5"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              <Sparkles size={13} className="text-blue-400" />
              <span>Statutory Documentary Archive</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              Frontline Artisans & Civic Proof
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Hover or slide across any documentary card to expand. Click to inspect verified credentials, statutory tariffs, and democratic governance in action.
            </p>
          </motion.div>

          {/* Interactive Expandable Filmstrip (ui-layouts.com/components/gallery-modal) */}
          <div className="relative">
            <div className="flex items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto pb-6 pt-2 px-2 no-scrollbar">
              {galleryItems.map((item, i) => {
                const isActive = galleryIndex === i;
                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    whileTap={{ scale: 0.96 }}
                    onMouseEnter={() => setGalleryIndex(i)}
                    onClick={() => {
                      setGalleryIndex(i);
                      setIsGalleryOpen(true);
                    }}
                    className={`rounded-2xl shrink-0 overflow-hidden relative cursor-pointer border transition-[width,border-color,box-shadow] duration-500 ease-out select-none ${
                      isActive
                        ? isStarryNight
                          ? 'w-[280px] sm:w-[320px] md:w-[360px] border-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.35)]'
                          : 'w-[280px] sm:w-[320px] md:w-[360px] border-blue-600 shadow-xl'
                        : isStarryNight
                        ? 'w-[44px] sm:w-[52px] md:w-[60px] border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        : 'w-[44px] sm:w-[52px] md:w-[60px] border-slate-200/90 hover:border-slate-400 opacity-80 hover:opacity-100'
                    } h-[240px] sm:h-[280px]`}
                  >
                    {/* Background Image */}
                    <img
                      src={item.url}
                      alt={item.title}
                      className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                        isActive ? 'scale-105' : 'scale-100 grayscale-[0.25]'
                      }`}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      isActive
                        ? 'bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20'
                        : 'bg-slate-950/60 hover:bg-slate-950/40'
                    }`} />

                    {/* Expanded Content View */}
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 p-4 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                            isStarryNight ? 'bg-blue-900/70 border-blue-400/50 text-blue-200' : 'bg-blue-600 border-blue-400 text-white'
                          }`}>
                            {item.category}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center">
                            0{i + 1}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug drop-shadow-md line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed drop-shadow-sm">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-amber-300 font-mono font-bold">{item.rate}</span>
                            <span className="text-blue-300 font-semibold flex items-center gap-1">
                              <span>Inspect Proof</span>
                              <ArrowRight size={11} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Compact Vertical Strip View */
                      <div className="absolute inset-0 flex flex-col items-center justify-between py-3">
                        <span className="w-6 h-6 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center border border-white/20">
                          {i + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-300 tracking-wider [writing-mode:vertical-lr] rotate-180 line-clamp-1">
                          {item.badge}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Filmstrip Controls & Helper */}
            <div className="flex items-center justify-between pt-3 max-w-3xl mx-auto px-4">
              <button
                onClick={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isStarryNight ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft size={14} />
                <span>Previous Photo</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}>
                  Photo <strong className={isStarryNight ? 'text-white' : 'text-slate-900'}>{galleryIndex + 1}</strong> of {galleryItems.length}
                </span>
                <span className="text-slate-500">•</span>
                <span className={`text-[11px] ${isStarryNight ? 'text-blue-400' : 'text-blue-700'} font-medium`}>
                  Click any card to inspect full case
                </span>
              </div>

              <button
                onClick={() => setGalleryIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isStarryNight ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Next Photo</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

                  {/* Authentic 3-Column Sticky Gallery (ui-layouts.com/components/sticky-scroll) */}
          <div className="pt-8">
            <StickyGallery
              isStarryNight={isStarryNight}
              onOpenCustomerBooking={onOpenCustomerBooking}
              onOpenWorkerMarketplace={onOpenWorkerMarketplace}
              onOpenAuth={onOpenAuth}
            />
          </div>

          {/* Shared Layout Modal (ui-layouts.com/components/gallery-modal) */}
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              key="gallery-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsGalleryOpen(false)}
              className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            >
              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl my-auto">
                <motion.div
                  layoutId={galleryItems[galleryIndex].id}
                  className={`w-full rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col ${
                    isStarryNight ? 'bg-[#070d1e] border-blue-500/40 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {/* Photo Header with Controls */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
                    <img
                      src={galleryItems[galleryIndex].url}
                      alt={galleryItems[galleryIndex].title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

                    {/* Top Badges & Close Button */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md border border-blue-400/50">
                          {galleryItems[galleryIndex].category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                          {galleryItems[galleryIndex].status}
                        </span>
                      </div>

                      <button
                        onClick={() => setIsGalleryOpen(false)}
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md cursor-pointer transition-colors"
                        aria-label="Close modal"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Step Switchers right on image */}
                    <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <button
                        onClick={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                        className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/20 backdrop-blur-md pointer-events-auto cursor-pointer transition-all hover:scale-105"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setGalleryIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                        className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/20 backdrop-blur-md pointer-events-auto cursor-pointer transition-all hover:scale-105"
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Bottom Caption on Image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-xs font-semibold text-slate-300">
                        {galleryItems[galleryIndex].artisan}
                      </div>
                      <div className="text-sm font-bold text-white drop-shadow-md">
                        {galleryItems[galleryIndex].badge}
                      </div>
                    </div>
                  </div>

                  {/* Modal Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="space-y-2">
                      <motion.h3
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-xl sm:text-2xl font-black tracking-tight ${
                          isStarryNight ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {galleryItems[galleryIndex].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isStarryNight ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {galleryItems[galleryIndex].description}
                      </motion.p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {galleryItems[galleryIndex].tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                            isStarryNight
                              ? 'bg-slate-900/80 border-white/10 text-slate-300'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Statutory Tariff & Economics Box */}
                    <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                      isStarryNight ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Published Municipal Tariff:</span>
                        <strong className="text-amber-400 font-mono font-bold text-sm">
                          {galleryItems[galleryIndex].rate}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isStarryNight ? 'text-slate-400' : 'text-slate-600'}>Artisan Direct Bank Realization:</span>
                        <strong className="text-emerald-400 font-mono font-bold">
                          {galleryItems[galleryIndex].payout}
                        </strong>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsGalleryOpen(false);
                          onOpenCustomerBooking();
                        }}
                        className={`w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                          isStarryNight ? 'starry-btn-glossy text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Search size={14} />
                        <span>Book Verified Service in Indore</span>
                        <ArrowRight size={14} />
                      </motion.button>

                      <button
                        onClick={() => setIsGalleryOpen(false)}
                        className={`w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-xs border cursor-pointer transition-colors ${
                          isStarryNight ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 8. Verified Testimonials from Indore Pilot */}
      <section className={`py-16 border-b transition-colors duration-300 ${
        isStarryNight ? 'bg-[#020817]/70 border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-xl mx-auto space-y-2"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isStarryNight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-800'
            }`}>
              <ShieldCheck size={13} />
              <span>Indore Citizen & Artisan Trust</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}>
              Feedback from the Indore Pilot
            </h2>
            <p className={`text-xs sm:text-sm ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
              Voices of residents, artisans, and society administrators participating in the Indore cooperative rollout.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "On private apps, up to 30% of my earnings disappeared into platform fees and lead charges. In Bharat Kaushal, 94.5% comes straight into my bank account, plus the welfare fund gives my family health protection.",
                initials: "RK",
                avatarBg: "bg-amber-100 text-amber-800",
                name: "Rakesh Kumar",
                sub: "Certified Electrician, Palasia, Indore",
              },
              {
                quote: "Knowing the price upfront before booking made the whole experience simple and stress-free. The arrival OTP verification gave us complete peace of mind, and the plumber arrived right on time.",
                initials: "PS",
                avatarBg: "bg-blue-100 text-blue-800",
                name: "Priya Sharma",
                sub: "Resident, Vijay Nagar, Indore",
              },
              {
                quote: "The cooperative platform allows our registered society to verify artisan trade skills digitally while preserving democratic governance and collective dividend sharing under the MP Cooperative Societies Act.",
                initials: "AV",
                avatarBg: "bg-emerald-100 text-emerald-800",
                name: "Amit Verma",
                sub: "Officer, Indore Shramik Sahakari Samiti",
              },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                className={`rounded-3xl p-6 sm:p-7 border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5 relative overflow-hidden ${
                  isStarryNight ? 'apple-glass-card specular-border-top' : 'daylight-glass-card'
                }`}
              >
                {/* Subtle gradient accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-80" />
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className={`text-sm leading-relaxed ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className={`pt-4 border-t flex items-center gap-3.5 ${
                  isStarryNight ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className={`w-11 h-11 rounded-2xl ${review.avatarBg} font-bold text-sm flex items-center justify-center shadow-sm`}>
                    {review.initials}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>{review.name}</div>
                    <div className={`text-[11px] font-medium ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>{review.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HIGH-END THEME-ADAPTIVE CTA SECTION */}
      <section className={`relative py-24 overflow-hidden border-b transition-colors duration-300 ${
        isStarryNight
          ? 'bg-[#030919] border-white/10'
          : 'bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-white border-slate-200'
      }`}>
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none rounded-full blur-3xl opacity-40"
          style={{
            background: isStarryNight
              ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.35) 0%, rgba(16,185,129,0.15) 50%, transparent 100%)'
              : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.2) 0%, rgba(245,158,11,0.12) 50%, transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 ${
              isStarryNight
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                : 'bg-blue-100 border border-blue-200 text-blue-900 shadow-sm'
            }`}
          >
            <HeartHandshake size={15} />
            <span>Digital Public Infrastructure for Fair Labour</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${
              isStarryNight ? 'text-white' : 'text-slate-900'
            }`}
          >
            Ready to experience
            <br />
            <span className={isStarryNight ? 'aurora-text' : 'daylight-text-gradient'}>
              fair, cooperative labour?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto font-medium ${
              isStarryNight ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Join Bharat Kaushal today — as an Indore resident seeking verified quality at benchmark rates, or an artisan building a secure career with democratic dignity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: isStarryNight ? '0 0 50px rgba(59,130,246,0.6)' : '0 12px 30px rgba(37,99,235,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCustomerBooking}
              className={`w-full sm:w-auto h-14 px-8 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isStarryNight
                  ? 'starry-btn-glossy text-white shadow-2xl'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl'
              }`}
            >
              <span>Book a Verified Service</span>
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenWorkerMarketplace}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HardHat size={16} />
              <span>Join as an Artisan</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* 10. Statutory & Legal Footer */}
      <footer className="group bg-slate-950 text-slate-400 text-xs pt-8 pb-8 border-t border-slate-900 relative overflow-hidden">
        {/* UI-Layouts Signature Giant Typography Reveal */}
        <div className="overflow-hidden select-none pointer-events-none pb-4">
          <h1 className="text-[14vw] tracking-tighter group-hover:translate-y-2 translate-y-8 leading-[90%] uppercase font-black text-center bg-gradient-to-r from-neutral-500 via-neutral-200 to-neutral-600 bg-clip-text text-transparent transition-transform duration-700 ease-out opacity-40 group-hover:opacity-80">
            BHARAT KAUSHAL
          </h1>
        </div>

        <div className="bg-black/90 rounded-tr-3xl rounded-tl-3xl border-t border-white/10 pt-10 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" />
                <span>Bharat Kaushal Cooperative Platform</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Operating under the Madhya Pradesh Cooperative Societies Act, 1960. 
                94.5% direct labor realization. Verified in cooperation with registered labor societies.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigation</div>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={onOpenCustomerBooking} className="hover:text-white transition-colors cursor-pointer">Book a Service</button></li>
                <li><button onClick={onOpenWorkerMarketplace} className="hover:text-white transition-colors cursor-pointer">Join as an Artisan</button></li>
                <li><a href="#economics" className="hover:text-white transition-colors">94.5% Economics</a></li>
                <li><a href="#dashboards-preview" className="hover:text-white transition-colors">Portals Preview</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Statutory Helplines</div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500">National Consumer Helpline: </span>
                  <a href="tel:1915" className="text-amber-400 font-bold hover:underline">1915</a>
                  <span className="text-slate-500"> (8 AM - 8 PM)</span>
                </div>
                <div>
                  <span className="text-slate-500">Emergency Police / SOS: </span>
                  <a href="tel:112" className="text-rose-400 font-bold hover:underline">112</a>
                </div>
                <div className="text-slate-500 pt-1">
                  IMC Cooperative Operations Command, Indore, MP - 452001
                </div>
              </div>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Statutory Compliance</div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• MP Cooperative Societies Act, 1960</li>
                <li>• Unorganized Workers&apos; Social Security Act, 2008</li>
                <li>• 2.0% Allocation to MP Labour Welfare Fund</li>
                <li>• UIDAI Masked Aadhaar Data Minimization</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© 2026 Bharat Kaushal. Digital Public Infrastructure for Fair Skilled Labour.</div>
            <div className="flex items-center gap-4">
              <span>Indore Pilot: Vijay Nagar • Palasia • Rajwada • Annapurna</span>
            </div>
          </div>
        </div>
              </div>
      </footer>

      {/* 11. Mobile App Floating Dock (Blinkit/iOS-Grade Experience) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t shadow-2xl py-2 px-3 flex items-center justify-around transition-colors duration-300 ${
          isStarryNight ? 'bg-[#020817]/95 border-white/10' : 'bg-white/95 border-slate-200/90'
        }`}
      >
        <a
          href="#hero"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isStarryNight ? 'bg-slate-900 text-blue-400 border border-white/10' : 'bg-slate-100 text-blue-600'
          }`}>
            <Compass size={16} />
          </div>
          <span>Home</span>
        </a>

        <a
          href="#services-showcase"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-600'
          }`}>
            <Search size={16} />
          </div>
          <span>146 Rates</span>
        </a>

        <a
          href="#economics"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isStarryNight ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-800 hover:text-emerald-900'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isStarryNight ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <IndianRupee size={16} />
          </div>
          <span>94.5% Split</span>
        </a>

        <a
          href="#dashboards-preview"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isStarryNight ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isStarryNight ? 'bg-slate-900 text-slate-300 border border-white/10' : 'bg-slate-100 text-slate-700'
          }`}>
            <LayoutDashboard size={16} />
          </div>
          <span>Portals</span>
        </a>

        <button
          onClick={() => (isLoggedIn ? onSelectRole('CUSTOMER') : onOpenAuth('CUSTOMER'))}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            isStarryNight ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <User size={16} />
          </div>
          <span>{isLoggedIn ? 'Account' : 'Sign In'}</span>
        </button>
      </nav>

      {/* Floating Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hidden sm:flex fixed bottom-8 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl items-center justify-center cursor-pointer border border-blue-500/50"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cooperative Documentary / Video Story Reel Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#090f23]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-sm text-white">Bharat Kaushal Cooperative Field Story</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Indore Ward 48 Hub
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Video Player Showcase */}
              <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                <img
                  src={
                    activeShowcaseImage === 1
                      ? '/images/cooperative_command.jpg'
                      : activeShowcaseImage === 2
                      ? '/images/hero_artisan.jpg'
                      : '/images/cooperative_community.jpg'
                  }
                  alt="Cooperative Operations"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Center Cinematic Play Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.7)] border border-blue-400/50">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-extrabold text-white">
                      Indore Municipal Cooperative Digital Labour Network
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Watch how 146 standardized rate tariffs, Aadhaar biometric verification, and instant 94.5% UPI settlement operate under the MP Cooperative Societies Act, 1960.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      MP Cooperative Act 1960
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      2.0% Welfare Fund
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Zero Surge Pricing
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border-t border-white/10">
                <span className="text-xs text-slate-400">Indore Pilot Rollout • Vijay Nagar, Palasia, Rajwada, Annapurna</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsVideoModalOpen(false);
                      onOpenCustomerBooking();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                  >
                    Book a Service Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ReactLenis>
  );
};
