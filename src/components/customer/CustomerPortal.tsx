import React, { useState, useMemo } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import { ServiceIcon } from '../common/ServiceIcon';
import { INDORE_SERVICES_DATASET, SERVICE_CATEGORIES } from '../../data/servicesData';
import { RealtimeWorkerMapView } from './RealtimeWorkerMapView';
import { IdentityVerifiedBadge } from '../common/IdentityVerifiedBadge';
import { EmailVerificationModal } from '../common/EmailVerificationModal';
import { initAuth, googleSignIn, getAccessToken } from '../../auth';
import { sendInvoiceEmail } from '../../lib/gmail';
import { CustomerProfileModal } from './CustomerProfileModal';
import { PaymentReconciliationModal } from './PaymentReconciliationModal';
import { InvoiceViewModal } from './InvoiceViewModal';
import { CustomerCancelBookingModal } from './CustomerCancelBookingModal';
import { DynamicWorkerScopeConfig } from './DynamicWorkerScopeConfig';
import { TeamMembersDisplay } from '../common/TeamMembersDisplay';
import { ServiceItem, Booking, WorkerProfile, BookingScopeDetails, WorkerRequirementResult } from '../../types';
import {
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Info,
  ChevronRight,
  ThumbsUp,
  PhoneCall,
  X,
  UserCheck,
  User,
  LogIn,
  Radio,
  Layers,
  Compass,
  Mail,
  ArrowLeft,
  History,
  Receipt,
  FileText,
  Ban,
  XCircle,
} from 'lucide-react';

interface CustomerPortalProps {
  lang: SupportedLanguage;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ lang }) => {
  const {
    services,
    bookings,
    workers,
    currentCustomer,
    policy,
    createBooking,
    respondMaterialCharge,
    rateWorker,
    cancelBooking,
    updateCustomerProfile,
  } = useRealtime();

  const {
    customerUser,
    isCustomerAuthenticated,
    openAuthModal,
  } = useAuth();

  const effectiveCustomer = customerUser || currentCustomer;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [portalTab, setPortalTab] = useState<'SERVICES' | 'MAP' | 'HISTORY'>('SERVICES');
  const [preselectedWorker, setPreselectedWorker] = useState<WorkerProfile | null>(null);

  // Dynamic Multi-Worker Booking Scope State
  const [scopeDetails, setScopeDetails] = useState<BookingScopeDetails>({});
  const [requirementResult, setRequirementResult] = useState<WorkerRequirementResult | null>(null);
  const [calculatedPricing, setCalculatedPricing] = useState<any>(null);
  const [teamUnavailableError, setTeamUnavailableError] = useState<{
    isTeamUnavailable: boolean;
    minRequired: number;
    selectedWorkers: number;
    availableCount: number;
    missingCount: number;
    alternativeSlots: string[];
  } | null>(null);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Payment Reconciliation & Automated Invoice State
  const [reconciliationBooking, setReconciliationBooking] = useState<Booking | null>(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    await cancelBooking(bookingId, reason, 'CUSTOMER');
    setCancellingBooking(null);
  };

  // Custom Event Listeners from Header Menu
  React.useEffect(() => {
    const handleProfile = () => setIsProfileModalOpen(true);
    const handleHistory = () => setPortalTab('HISTORY');
    const handleInvoices = () => {
      setPortalTab('HISTORY');
      const invoiceBooking = bookings.find(
        (b) => (b.customerId === effectiveCustomer.id || b.id === 'SS-1042') && (b.invoiceNumber || b.status === 'COMPLETED' || b.status === 'PAID' || b.status === 'SETTLED')
      );
      if (invoiceBooking) {
        setSelectedInvoiceBooking(invoiceBooking);
        setIsInvoiceModalOpen(true);
      }
    };
    const handleReconciliation = () => {
      const pending = bookings.find((b) => b.status === 'PAYMENT_PENDING');
      if (pending) {
        setReconciliationBooking(pending);
      } else {
        setPortalTab('HISTORY');
      }
    };
    
    document.addEventListener('OPEN_PROFILE', handleProfile);
    document.addEventListener('OPEN_HISTORY', handleHistory);
    document.addEventListener('OPEN_INVOICES', handleInvoices);
    document.addEventListener('OPEN_RECONCILIATION', handleReconciliation);
    return () => {
      document.removeEventListener('OPEN_PROFILE', handleProfile);
      document.removeEventListener('OPEN_HISTORY', handleHistory);
      document.removeEventListener('OPEN_INVOICES', handleInvoices);
      document.removeEventListener('OPEN_RECONCILIATION', handleReconciliation);
    };
  }, [bookings, effectiveCustomer]);

  // Rating Modal
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Email Verification Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  const isSearching = searchTerm.trim().length > 0;
  const showCategories = selectedCategory === 'ALL' && !isSearching;

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchQuery =
        s.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [services, selectedCategory, searchTerm]);

  // Active or most recent customer booking (strictly non-completed and non-cancelled)
  const activeBooking = useMemo(() => {
    const userActive = bookings.find(
      (b) => b.customerId === effectiveCustomer.id && b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
    );
    if (userActive) return userActive;

    const fallbackActive = bookings.find(
      (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
    );
    return fallbackActive || null;
  }, [bookings, effectiveCustomer]);

  // Most recent cancelled booking for feedback banner
  const lastCancelledBooking = useMemo(() => {
    return bookings.find(
      (b) => (b.customerId === effectiveCustomer.id || b.id === 'SS-1042') && b.status === 'CANCELLED'
    );
  }, [bookings, effectiveCustomer]);

  const pastBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
    );
  }, [bookings]);

  const handleOpenBooking = (service: ServiceItem) => {
    setPreselectedWorker(null);
    setSelectedService(service);
    setTeamUnavailableError(null);
    setScopeDetails({});
    setIsBookingModalOpen(true);
  };

  const handleSelectWorkerFromMap = (trade: string, worker?: WorkerProfile) => {
    if (worker) {
      setPreselectedWorker(worker);
    }
    const tradeLower = trade.toLowerCase();
    const matched =
      services.find(
        (s) =>
          s.category.toLowerCase() === tradeLower ||
          s.service_name.toLowerCase().includes(tradeLower) ||
          tradeLower.includes(s.category.toLowerCase())
      ) || services[0];

    setSelectedService(matched);
    setTeamUnavailableError(null);
    setScopeDetails({});
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    setIsSubmittingBooking(true);
    setTeamUnavailableError(null);
    try {
      const address = effectiveCustomer.addresses[selectedAddressIndex] || effectiveCustomer.addresses[0];
      await createBooking(
        selectedService.record_id,
        address,
        scopeDetails,
        preselectedWorker?.id
      );
      setIsBookingModalOpen(false);
    } catch (e: any) {
      console.error('Booking failed', e);
      if (e?.response?.data?.isTeamUnavailable || e?.data?.isTeamUnavailable) {
        setTeamUnavailableError(e?.response?.data || e?.data);
      } else {
        alert(e?.message || 'Booking could not be confirmed. Please check crew availability.');
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleRateSubmit = async () => {
    if (!ratingBooking) return;
    await rateWorker(ratingBooking.id, stars, feedback);
    setRatingBooking(null);
    setFeedback('');
  };

  const scrollToServices = () => {
    setPortalTab('SERVICES');
    setTimeout(() => {
      const el = document.getElementById('services-catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <div className="space-y-6 relative dashboard-container" data-dashboard-container="true">
      {/* Welcome & Search Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-lg relative overflow-hidden dashboard-card" data-dashboard-card="true">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/20">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>{t('coopPlatformNote', '100% Cooperative-Owned Platform • 94.5% Earnings Go To Labour')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('findTrustedWorkers', 'Find Trusted Cooperative Workers Near You')}
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t('heroDescription', "Benchmarked against Indore's authentic local trade prices. Every worker is verified by registered labour societies with explainable trust scores and OTP arrival protection.")}
          </p>

          {/* Search Box & Action Controls */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                id="customer-service-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder', 'Search 140+ verified local trade services in Indore...')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2">
              {/* Dedicated View Services Button */}
              <button
                id="btn-hero-view-services"
                type="button"
                onClick={scrollToServices}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 border ${
                  portalTab === 'SERVICES'
                    ? 'bg-white text-blue-900 border-white shadow-blue-950/30'
                    : 'bg-blue-700/80 hover:bg-blue-700 text-white border-blue-400/40'
                }`}
                title={t('viewAllServices', 'View Full Catalog (140 Services)')}
              >
                <Layers size={16} className={portalTab === 'SERVICES' ? 'text-blue-700' : 'text-blue-200'} />
                <span>{t('services', 'Services')} ({filteredServices.length})</span>
              </button>

              <button
                id="btn-hero-open-map"
                type="button"
                onClick={() => setPortalTab('MAP')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 border ${
                  portalTab === 'MAP'
                    ? 'bg-white text-blue-900 border-white shadow-blue-950/30'
                    : 'bg-blue-600/80 hover:bg-blue-600 text-white border-blue-400/40'
                }`}
              >
                <Radio size={16} className="text-emerald-300 animate-pulse" />
                <span>{t('liveWorkerMap', 'Live Worker Map')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Task Immediate Payment Reconciliation Alert Banner */}
      {activeBooking && activeBooking.status === 'PAYMENT_PENDING' && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300 dashboard-card" data-dashboard-card="true">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Receipt size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Task Signoff Completed
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {activeBooking.id}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {activeBooking.serviceName} is complete! Reconcile Payment
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Artisan: <strong className="text-white">{activeBooking.workerName || 'Certified Artisan'}</strong> • Total Reconciled Due: <strong className="text-emerald-400 text-sm">₹{activeBooking.pricing.netPayable}</strong> (94.5% direct labour realization)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReconciliationBooking(activeBooking)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-102"
          >
            <Receipt size={18} />
            <span>Open Payment Reconciliation (₹{activeBooking.pricing.netPayable})</span>
          </button>
        </div>
      )}

      {/* Citizen Authentication & Profile Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 dashboard-card" data-dashboard-card="true">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="btn-customer-avatar-profile"
            onClick={() => setIsProfileModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 border border-emerald-300 overflow-hidden shadow-xs transition-all hover:scale-105 active:scale-95 group relative"
            title={t('Click_to_view_and_edit_Citizen_ggscv', `Click to view and edit Citizen Profile`)}
          >
            {effectiveCustomer.photoUrl ? (
              <img
                src={effectiveCustomer.photoUrl}
                alt={effectiveCustomer.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{effectiveCustomer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>
            )}
            <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-tl">
              <User size={10} />
            </span>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors text-left flex items-center gap-1.5"
              >
                <span>{effectiveCustomer.name}</span>
                <span className="text-xs text-blue-600 underline font-normal">{t('_View_Profile__fagfe', `(View Profile)`)}</span>
              </button>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isCustomerAuthenticated
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isCustomerAuthenticated ? 'Aadhaar e-KYC Verified' : 'Guest Citizen'}
              </span>

              {/* Email Verification Status Pill */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 transition-all ${
                  effectiveCustomer.emailVerified
                    ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
                title={t('Click_to_manage_email_notices__q9fa4', `Click to manage email notices (Optional)`)}
              >
                <Mail size={11} />
                <span>
                  {effectiveCustomer.emailVerified
                    ? `✓ ${effectiveCustomer.email || 'Email Verified'}`
                    : effectiveCustomer.email
                    ? `Verify ${effectiveCustomer.email}`
                    : '+ Add Email (Optional)'}
                </span>
              </button>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
              <span>{t('_91_ruhr0', `+91`)}{effectiveCustomer.phone}</span>
              {effectiveCustomer.alternatePhone && (
                <>
                  <span>•</span>
                  <span>{t('Alt___91_dsr9h', `Alt: +91`)}{effectiveCustomer.alternatePhone}</span>
                </>
              )}
              <span>•</span>
              <span className="truncate max-w-[280px]">
                {effectiveCustomer.addresses[0]?.line1 || 'Indore'}, {effectiveCustomer.addresses[0]?.locality || 'MP'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 mt-3 sm:mt-0">
          {/* Customer Profile Button */}
          <button
            type="button"
            id="btn-customer-profile-main"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <User size={14} className="text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">{t('Customer_Profile_fynkc', `Customer Profile`)}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-all"
          >
            <Mail size={14} className="text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">{t('Email_Settings_b2rky', `Email Settings`)}</span>
          </button>

          <button
            id="btn-customer-portal-auth-trigger"
            onClick={() => openAuthModal('CUSTOMER')}
            className={`w-full sm:w-auto h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              isCustomerAuthenticated
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isCustomerAuthenticated ? <UserCheck size={14} className="shrink-0" /> : <LogIn size={14} className="shrink-0" />}
            <span className="whitespace-nowrap">{isCustomerAuthenticated ? t('switchCitizen', 'Switch Citizen / Re-verify') : t('citizenLogin', 'Citizen OTP Login')}</span>
          </button>
        </div>
      </section>

      {/* Dedicated Mobile Quick Switcher Bar for Customer View */}
      <section className="sm:hidden grid grid-cols-2 gap-2 bg-slate-900/5 p-1.5 rounded-2xl border border-slate-200 shadow-2xs dashboard-card" data-dashboard-card="true">
        <button
          id="btn-mobile-services-toggle"
          type="button"
          onClick={scrollToServices}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            portalTab === 'SERVICES'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
          title={t('viewAllServices', 'View Full Catalog (140 Services)')}
        >
          <Layers size={15} />
          <span>{t('services', 'Services')} ({filteredServices.length})</span>
        </button>
        <button
          id="btn-mobile-map-toggle"
          type="button"
          onClick={() => setPortalTab('MAP')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            portalTab === 'MAP'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Radio size={15} className={portalTab === 'MAP' ? 'text-emerald-300 animate-pulse' : 'text-emerald-600'} />
          <span>{t('liveWorkerMap', 'Live Worker Map')}</span>
        </button>
      </section>

      {/* Active Booking Live Monitor Card (if ongoing) */}
      {activeBooking && activeBooking.status !== 'CANCELLED' && (activeBooking.status !== 'COMPLETED' || !activeBooking.rating) && (
        <section className="bg-white rounded-2xl border-2 border-blue-500/40 p-4 sm:p-6 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-top-3 dashboard-card" data-dashboard-card="true">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
                <span>{t('Live_Active_Booking__ioje7', `Live Active Booking:`)}</span>
                <span className="text-blue-700 font-bold">{activeBooking.serviceName}</span>
                <span className="text-slate-500 font-medium text-xs sm:text-sm">({activeBooking.id})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {activeBooking.workerLocation && (
                <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>{activeBooking.workerLocation.etaMinutes} min • {activeBooking.workerLocation.distanceKm} km</span>
                </div>
              )}
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeBooking.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            {/* Status Steps Flow */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stepper with strict baseline and connector alignment */}
              <div className="w-full flex items-start justify-between gap-0 text-[11px] font-semibold text-slate-500 overflow-x-auto pb-1 pt-1">
                {[
                  { id: 1, label: t('Matched_dc332', `Matched`), activeKeys: ['MATCHING', 'WORKER_OFFERED', 'CONFIRMED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED'] },
                  { id: 2, label: t('Accepted_a0rbu', `Accepted`), activeKeys: ['CONFIRMED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED'] },
                  { id: 3, label: t('On_Way_sbg94', `On Way`), activeKeys: ['TRAVELLING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED'] },
                  { id: 4, label: t('Arrived_g7zom', `Arrived`), activeKeys: ['ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED'] },
                  { id: 5, label: t('In_Progress_ex8rv', `In Progress`), activeKeys: ['IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED'] },
                  { id: 6, label: t('Done_xkl3f', `Done`), activeKeys: ['COMPLETED'] },
                ].map((step, idx, arr) => {
                  const isStepActive = step.activeKeys.includes(activeBooking.status);
                  const isNextActive = idx < arr.length - 1 && arr[idx + 1].activeKeys.includes(activeBooking.status);
                  const isCompleted = activeBooking.status === 'COMPLETED';

                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center min-w-[52px] text-center">
                      {/* Circle & Center-Aligned Connecting Lines */}
                      <div className="w-full flex items-center">
                        <div
                          className={`h-0.5 flex-1 transition-colors ${
                            idx === 0
                              ? 'invisible'
                              : isStepActive
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                        />
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                            step.id === 6 && isCompleted
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isStepActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {step.id}
                        </div>
                        <div
                          className={`h-0.5 flex-1 transition-colors ${
                            idx === arr.length - 1
                              ? 'invisible'
                              : isNextActive
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                        />
                      </div>

                      {/* Label with uniform top margin and height baseline */}
                      <span
                        className={`mt-2 text-[11px] font-semibold leading-tight text-center min-h-[28px] flex items-start justify-center px-0.5 transition-colors ${
                          step.id === 6 && isCompleted
                            ? 'text-emerald-700 font-bold'
                            : isStepActive
                            ? 'text-blue-700 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* OTP Banners (Crucial Security Checkpoints) */}
              {activeBooking.status === 'ARRIVED' && activeBooking.arrivalOtp && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-amber-600" />
                      <span>{t('arrivalOtpLabel', 'Arrival Verification OTP')}</span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1">
                      {t('shareOtpNote', 'Share this 4-digit OTP with the worker only after they arrive at your premises.')}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-amber-400 rounded-xl px-5 py-2 text-center shadow-xs">
                    <div className="text-2xl font-mono font-black tracking-widest text-amber-900">
                      {activeBooking.arrivalOtp}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">{t('Arrival_Code_uv35z', `Arrival Code`)}</span>
                  </div>
                </div>
              )}

              {activeBooking.status === 'COMPLETION_PENDING' && activeBooking.completionOtp && (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>{t('completionOtpLabel', 'Completion & Payment Release OTP')}</span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      {t('Inspect_the_completed_work__Wh_wt4cg', `Inspect the completed work. When satisfied, share this OTP with the worker to confirm settlement.`)}</p>
                  </div>
                  <div className="bg-white border-2 border-emerald-500 rounded-xl px-5 py-2 text-center shadow-xs">
                    <div className="text-2xl font-mono font-black tracking-widest text-emerald-900">
                      {activeBooking.completionOtp}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">{t('Completion_Code_69cs1', `Completion Code`)}</span>
                  </div>
                </div>
              )}

              {/* Material Charge Review Notice if pending */}
              {activeBooking.materials.some((m) => m.status === 'PENDING') && (
                <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-purple-600" />
                      <span>{t('Worker_Requested_Extra_Materia_hxi1r', `Worker Requested Extra Material / Spare Part`)}</span>
                    </div>
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-semibold">
                      {t('Action_Required_p38b5', `Action Required`)}</span>
                  </div>

                  {activeBooking.materials
                    .filter((m) => m.status === 'PENDING')
                    .map((m) => (
                      <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200 text-xs">
                        <div>
                          <div className="font-semibold text-slate-900">{m.name}</div>
                          <div className="text-slate-500">{t('Requested_at_4ut7i', `Requested at`)}{new Date(m.requestedAt).toLocaleTimeString()}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-sm text-slate-900">₹{m.amount}</span>
                          <button
                            onClick={() => respondMaterialCharge(activeBooking.id, m.id, true)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition-colors"
                          >
                            {t('Approve_ulyr1', `Approve`)}</button>
                          <button
                            onClick={() => respondMaterialCharge(activeBooking.id, m.id, false)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold text-xs transition-colors"
                          >
                            {t('Reject_dgyvm', `Reject`)}</button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Team Members Display (Multi-Worker Crew or Single Certified Artisan) */}
              <TeamMembersDisplay
                booking={activeBooking}
                title={
                  activeBooking.teamMembers && activeBooking.teamMembers.length > 1
                    ? `Active Cooperative Crew (${activeBooking.teamMembers.length} Artisans En Route)`
                    : 'Assigned Certified Artisan'
                }
              />

              {/* Worker & Job Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">{t('Assigned_Worker_lixhy', `Assigned Worker`)}</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeBooking.workerName || 'Allocating...'}</div>
                  
                  {/* Worker Identity Verified Badge or fallback */}
                  {(() => {
                    const assignedWorker = workers.find(
                      (w) => w.name === activeBooking.workerName || w.id === activeBooking.workerId
                    );
                    if (assignedWorker) {
                      return (
                        <div className="mt-1.5">
                          <IdentityVerifiedBadge
                            worker={assignedWorker}
                            variant="badge"
                            showAadhaarSnippet={true}
                            showCompletedJobs={true}
                            interactive={true}
                          />
                        </div>
                      );
                    }
                    return (
                      <div className="text-slate-600 mt-1 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                          {activeBooking.workerTrade || activeBooking.category}
                        </span>
                        {activeBooking.workerTrustScore && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <ShieldCheck size={13} />
                            {t('Trust__3bhyf', `Trust:`)}{activeBooking.workerTrustScore}{t('_100_57rad', `/100`)}</span>
                        )}
                      </div>
                    );
                  })()}

                  <div className="text-slate-500 mt-2">
                    {t('Phone__shwql', `Phone:`)}<span className="font-mono text-slate-800">{activeBooking.workerPhone || 'Provided upon dispatch'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">{t('Location___Estimated_Arrival_90ou5', `Location & Estimated Arrival`)}</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-600" />
                    <span>{activeBooking.customerAddress.locality}{t('__Indore_sdrks', `, Indore`)}</span>
                  </div>
                  <div className="text-slate-600 mt-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {activeBooking.workerLocation
                        ? `${activeBooking.workerLocation.distanceKm} km away • ETA ${activeBooking.workerLocation.etaMinutes} mins`
                        : 'Worker calculating route'}
                    </span>
                  </div>
                  <div className="mt-2 text-slate-500 text-[11px]">
                    {t('Created__mj85f', `Created:`)}{new Date(activeBooking.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Settlement Breakdown Card */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {t('Cooperative_Fare_Transparency_82q60', `Cooperative Fare Transparency`)}</div>
                <div className="text-2xl font-black text-white mt-1">
                  ₹{activeBooking.pricing.netPayable}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  {t('Direct_labour_pricing_benchmar_s3nat', `Direct labour pricing benchmark (Zero commercial surcharge)`)}</div>

                <div className="divide-y divide-slate-800 text-xs mt-4 pt-2">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">{t('Base_Labour_Rate_atull', `Base Labour Rate`)}</span>
                    <span className="font-medium text-slate-200">₹{activeBooking.pricing.baseLabour}</span>
                  </div>
                  {activeBooking.pricing.materialsTotal > 0 && (
                    <div className="py-1.5 flex justify-between text-purple-300">
                      <span>{t('Approved_Spare_Parts_i7vw4', `Approved Spare Parts`)}</span>
                      <span className="font-medium">₹{activeBooking.pricing.materialsTotal}</span>
                    </div>
                  )}
                  <div className="py-1.5 flex justify-between text-emerald-400 font-semibold">
                    <span>{t('Worker_Payout__94_5___pt930', `Worker Payout (94.5%)`)}</span>
                    <span>₹{activeBooking.pricing.workerShare}</span>
                  </div>
                  <div className="py-1.5 flex justify-between text-slate-400 text-[11px]">
                    <span>{t('Society_Operations__3_5___pqu9w', `Society Operations (3.5%)`)}</span>
                    <span>₹{activeBooking.pricing.societyShare}</span>
                  </div>
                  <div className="py-1.5 flex justify-between text-slate-400 text-[11px]">
                    <span>{t('Labour_Welfare_Fund__2_0___p97yk', `Labour Welfare Fund (2.0%)`)}</span>
                    <span>₹{activeBooking.pricing.welfareShare}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {activeBooking.status === 'PAYMENT_PENDING' && (
                  <button
                    onClick={() => setReconciliationBooking(activeBooking)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    <Receipt size={15} />
                    <span>Reconcile Payment (₹{activeBooking.pricing.netPayable}) & Generate Invoice</span>
                  </button>
                )}

                {['PAID', 'SETTLED', 'COMPLETED'].includes(activeBooking.status) && (
                  <button
                    onClick={() => {
                      setSelectedInvoiceBooking(activeBooking);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/30"
                  >
                    <FileText size={14} />
                    <span>View Reconciled Tax Invoice</span>
                  </button>
                )}

                {['PAID', 'SETTLED', 'COMPLETION_OTP_VERIFIED', 'COMPLETED'].includes(activeBooking.status) && !activeBooking.rating && (
                  <button
                    onClick={() => setRatingBooking(activeBooking)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Star size={14} />
                    <span>{t('Rate_Worker_Performance_msxr4', `Rate Worker Performance`)}</span>
                  </button>
                )}

                {['REQUESTED', 'MATCHING', 'WORKER_OFFERED', 'ACCEPTED', 'CONFIRMED', 'TRAVELLING', 'ARRIVED'].includes(activeBooking.status) && (
                  <button
                    id="btn-customer-cancel-active-booking"
                    type="button"
                    onClick={() => setCancellingBooking(activeBooking)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-rose-500/20"
                  >
                    <Ban size={14} />
                    <span>{t('Cancel_Booking_oo96c', `Cancel Booking`)} (₹0 Penalty)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Cancelled Reassurance Banner */}
      {!activeBooking && lastCancelledBooking && (
        <section
          id="banner-cancelled-booking-reassurance"
          className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in shadow-2xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
              <Ban size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide bg-rose-200/80 px-2 py-0.5 rounded-md">
                  Booking Cancelled
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  ID: {lastCancelledBooking.id}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ₹0 Penalty
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {lastCancelledBooking.serviceName}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Reason: <span className="italic">{lastCancelledBooking.cancellationReason || 'Customer requested cancellation'}</span>. Our cooperative redirected nearby artisans without penalty.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              id="btn-cancelled-view-history"
              type="button"
              onClick={() => setPortalTab('HISTORY')}
              className="flex-1 sm:flex-initial text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-colors shadow-2xs text-center"
            >
              View In History
            </button>
            <button
              id="btn-cancelled-book-another"
              type="button"
              onClick={() => {
                setPortalTab('SERVICES');
                const el = document.getElementById('services-grid-heading');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-initial text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-xs text-center"
            >
              Book Another Service
            </button>
          </div>
        </section>
      )}

      {/* Primary Customer Portal Navigation Tabs */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs dashboard-card" data-dashboard-card="true">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tab-btn-services-catalog"
            onClick={() => setPortalTab('SERVICES')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              portalTab === 'SERVICES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers size={16} />
            <span>{t('Services_Catalog__140_Trades__g4ler', `Services Catalog (140 Trades)`)}</span>
          </button>
          <button
            id="tab-btn-realtime-map"
            onClick={() => setPortalTab('MAP')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              portalTab === 'MAP'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Radio size={16} className={portalTab === 'MAP' ? 'text-white' : 'text-emerald-500'} />
            <span>{t('Live_Nearby_Workers_Map_nd86q', `Live Nearby Workers Map`)}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 px-3 hidden md:flex items-center gap-1.5 font-medium">
          <Compass size={14} className="text-blue-600" />
          <span>{t('Real_time_GPS_Dispatch___5_km__v204t', `Real-time GPS Dispatch • 5 km Standard Radius`)}</span>
        </div>
      </section>

      {/* View Mode: Live Nearby Workers Map View */}
      {portalTab === 'HISTORY' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300 dashboard-card" data-dashboard-card="true">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <History size={22} className="text-blue-600" /> 
                {t('bookingHistory', 'Booking History & Reconciled Invoices')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full cooperative reconciliation trail, transparent splits, and GST compliant receipts.
              </p>
            </div>
            <button onClick={() => setPortalTab('SERVICES')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            {bookings.filter(b => b.customerId === effectiveCustomer.id).length === 0 ? (
              <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <History size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-semibold text-slate-600">No Booking History Found</p>
                <p className="text-sm">Your past and current bookings will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.filter(b => b.customerId === effectiveCustomer.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
                  <div key={b.id} className="p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between gap-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                            ${b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 
                              b.status === 'PAYMENT_PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {b.id.substring(0,8)}</span>
                          {b.invoiceNumber && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded font-semibold">
                              {b.invoiceNumber}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-slate-800 text-lg leading-tight">{b.serviceName}</h3>
                        {b.workerName && <p className="text-xs text-slate-600 mt-1 font-medium">Worker: <strong className="text-slate-800">{b.workerName}</strong></p>}
                        {b.cancellationReason && (
                          <p className="text-[11px] text-rose-700 mt-0.5 font-medium">
                            Reason: {b.cancellationReason} (₹0 penalty applied)
                          </p>
                        )}
                        {b.paymentDetails && (
                          <p className="text-[11px] text-emerald-700 mt-0.5 font-semibold">
                            Paid via {b.paymentDetails.method} • Ref: {b.paymentDetails.transactionId.substring(0, 14)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">₹{b.pricing.netPayable}</p>
                        <p className="text-[10px] text-slate-400">94.5% to labour</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-xs text-slate-500 font-medium">
                        {new Date(b.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2">
                        {['REQUESTED', 'MATCHING', 'WORKER_OFFERED', 'ACCEPTED', 'CONFIRMED', 'TRAVELLING', 'ARRIVED'].includes(b.status) && (
                          <button
                            type="button"
                            onClick={() => setCancellingBooking(b)}
                            className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <Ban size={14} />
                            <span>Cancel Booking</span>
                          </button>
                        )}
                        {b.status === 'PAYMENT_PENDING' && (
                          <button
                            type="button"
                            onClick={() => setReconciliationBooking(b)}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                          >
                            <Receipt size={14} />
                            <span>Reconcile & Pay</span>
                          </button>
                        )}
                        {(b.status === 'COMPLETED' || b.status === 'PAID' || b.status === 'SETTLED' || b.invoiceNumber) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoiceBooking(b);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <FileText size={14} />
                            <span>Tax Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {portalTab === 'MAP' && (
        <section className="space-y-3 animate-in fade-in">
          {/* Quick Return to Services Bar (Prominent on Mobile & Desktop) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Layers size={16} />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block sm:inline mr-2">
                  {t('exploreFixedPrices', 'Want to explore fixed prices or book a standard trade?')}
                </span>
                <span className="text-xs text-slate-600">
                  {t('switchToCatalog', 'Switch to our 140+ benchmarked service catalog.')}
                </span>
              </div>
            </div>
            <button
              id="btn-map-switch-to-services"
              type="button"
              onClick={scrollToServices}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Layers size={14} />
              <span>{t('services', 'Services')} ({filteredServices.length}{t('____88vz7', `) →`)}</span>
            </button>
          </div>

          <RealtimeWorkerMapView
            onSelectWorkerService={handleSelectWorkerFromMap}
            customerAddresses={effectiveCustomer.addresses}
          />
        </section>
      )}

      {/* View Mode: Traditional Services Catalog */}
      {portalTab === 'SERVICES' && (
        <>
          {/* Quick Banner to Live Map */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Radio size={16} className="animate-pulse text-emerald-300" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block sm:inline mr-2">
                  {t('Need_an_urgent_artisan_right_a_4tbkw', `Need an urgent artisan right away?`)}</span>
                <span className="text-slate-600">
                  {t('Track_live_GPS_positions__arri_jgkj5', `Track live GPS positions, arrival ETAs, and verified status on our interactive city radar.`)}</span>
              </div>
            </div>
            <button
              onClick={() => setPortalTab('MAP')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-2xs"
            >
              {t('Open_Live_Worker_Map___8z0t3', `Open Live Worker Map →`)}</button>
          </div>

          {/* Nearby Verified Artisans on Duty Spotlight */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t('Nearby_Verified_Artisans_on_Du_b9nuj', `Nearby Verified Artisans on Duty (Indore)`)}</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {t('Aadhaar_e_KYC_Certified_mlb2z', `Aadhaar e-KYC Certified`)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('Identity_authenticated_coopera_nh9r0', `Identity-authenticated cooperative workers nearby. Click any shield to inspect Aadhaar verification and completed job history.`)}</p>
              </div>
              <button
                onClick={() => setPortalTab('MAP')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>{t('View_All_on_Radar_Map_9mltp', `View All on Radar Map`)}</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {workers
                .filter((w) => w.availability)
                .slice(0, 3)
                .map((worker) => (
                  <div
                    key={worker.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {worker.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{worker.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <span className="font-semibold text-blue-700">
                                {worker.primaryTrade}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[130px]">
                                {worker.currentLocation?.address?.split(',')[0] || 'Indore'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {t('Available_4aooa', `Available`)}</span>
                      </div>

                      {/* Visual Identity Verified Badge Component */}
                      <div className="mt-3">
                        <IdentityVerifiedBadge
                          worker={worker}
                          variant="badge"
                          showAadhaarSnippet={true}
                          showCompletedJobs={true}
                          interactive={true}
                          className="w-full justify-between bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleSelectWorkerFromMap(worker.primaryTrade, worker)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>{t('Direct_Dispatch_g3xeq', `Direct Dispatch`)}</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Drill-down Catalog View */}
          <section id="services-catalog-section" className="space-y-4 scroll-mt-6">
            {showCategories ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Layers size={18} className="text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      {t('allServiceCategories', 'All Service Categories')}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500">
                    {t('twelveCategories', '12 Trade Categories')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 pt-2">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="bg-white rounded-3xl border border-slate-100 p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all flex flex-col items-start text-left gap-3 group relative overflow-hidden"
                    >
                      {cat.popular && (
                        <span className="absolute top-0 right-0 bg-blue-800 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                          {t('popular', 'Popular')}
                        </span>
                      )}
                      {cat.urgent && (
                        <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                          {t('urgent', 'Urgent')}
                        </span>
                      )}
                      
                      <div className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform origin-bottom-left">
                        {cat.emoji}
                      </div>
                      <div className="w-full">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {t(`cat_${cat.id.replace(/[^a-zA-Z0-9]/g, '_')}_name`, lang === 'hi' ? cat.hindiName : cat.name)}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {t(`cat_${cat.id.replace(/[^a-zA-Z0-9]/g, '_')}_subtitle`, cat.subtitle)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {isSearching ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Search size={16} className="text-blue-600" />
                      <span>{t('searchResultsFor', 'Search Results for')} "{searchTerm}"</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedCategory('ALL')}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <ArrowLeft size={16} />
                      <span>{t('backToCategories', 'Back to Categories')}</span>
                    </button>
                  )}
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    {filteredServices.length} {t('servicesFound', 'Services Found')}
                  </span>
                </div>
                
                {/* Services Grid (From 140 Indore Dataset) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
                  {filteredServices.map((service) => {
                    const workerEarningsEst = Math.round(
                      (service.suggested_display_price_inr * (policy.activeModel === 'MODEL_A' ? 0.945 : 0.95))
                    );
                    return (
                      <div
                        key={service.record_id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ServiceIcon category={service.category} size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {service.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    {service.service_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {service.notes}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Clock size={12} />
                  <span>{t('Est__jl3tu', `Est:`)}{service.estimated_duration_hours} {t('hr_k122o', `hr`)}</span>
                  <span>•</span>
                  <span>{service.pricing_unit}</span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500">{t('fromPrice', 'From')}</span>
                    <div className="text-lg font-black text-slate-900">
                      ₹{service.suggested_display_price_inr}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">{t('Market_Range_2oz8k', `Market Range`)}</span>
                    <div className="text-xs font-semibold text-slate-600">
                      ₹{service.min_price_inr} {t('____h87yr', `- ₹`)}{service.max_price_inr}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-1.5 text-[11px] text-emerald-800 flex items-center justify-between font-medium">
                  <span>{t('Worker_direct_earn__hct6x', `Worker direct earn:`)}</span>
                  <span className="font-bold">₹{workerEarningsEst} {t('_94_5___s5t62', `(94.5%)`)}</span>
                </div>

                <button
                  id={`btn-book-${service.record_id}`}
                  onClick={() => handleOpenBooking(service)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>{t('Book_Service_duanc', `Book Service`)}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
      )}
      </section>
    </>
  )}

      {/* Booking Confirmation Modal */}
      
      {/* Payment Reconciliation Modal */}
      <PaymentReconciliationModal
        isOpen={!!reconciliationBooking}
        onClose={() => setReconciliationBooking(null)}
        booking={reconciliationBooking}
        lang={lang}
        onPaymentSuccess={(updatedBooking) => {
          setReconciliationBooking(null);
          setSelectedInvoiceBooking(updatedBooking);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* Automated Post-Task Tax Invoice Modal */}
      <InvoiceViewModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceBooking(null);
        }}
        booking={selectedInvoiceBooking}
        lang={lang}
        customerEmail={effectiveCustomer.email}
      />

      {/* Customer Cancel Booking Modal */}
      <CustomerCancelBookingModal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        booking={cancellingBooking}
        onConfirmCancel={handleConfirmCancel}
        lang={lang}
      />

      {isBookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            {/* Sticky Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <ServiceIcon category={selectedService.category} size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {t('Confirm_Cooperative_Booking_5xfao', `Confirm Cooperative Booking`)}
                  </h3>
                  <span className="text-xs text-slate-500">{selectedService.service_name}</span>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 overscroll-contain">
              {/* Dynamic Worker Requirement & Scope Configurator */}
              <DynamicWorkerScopeConfig
                service={selectedService}
                policy={policy}
                onScopeChange={(scope, res, prc) => {
                  setScopeDetails(scope);
                  setRequirementResult(res);
                  setCalculatedPricing(prc);
                }}
                unavailableTeamError={teamUnavailableError}
                onSelectAlternativeSlot={(slot) => {
                  alert(`Alternative slot confirmed: ${slot}. The cooperative dispatcher has reserved your crew.`);
                  setIsBookingModalOpen(false);
                }}
              />

              {/* Targeted Dispatch Worker Badge (if selected from Map or Spotlight) */}
              {preselectedWorker && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                      {t('Targeted_Direct_Dispatch_Artis_ckrc9', `Targeted Direct Dispatch Artisan`)}
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      {t('GPS_Locked_4fn3h', `GPS Locked`)}
                    </span>
                  </div>
                  <IdentityVerifiedBadge
                    worker={preselectedWorker}
                    variant="badge"
                    showAadhaarSnippet={true}
                    showCompletedJobs={true}
                    interactive={true}
                    className="w-full justify-between bg-white"
                  />
                </div>
              )}

              {/* Address Selection */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">
                  {t('Service_Location_in_Indore__gedi7', `Service Location in Indore:`)}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {effectiveCustomer.addresses.map((addr, idx) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressIndex === idx
                          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{addr.label}</span>
                        {selectedAddressIndex === idx && <CheckCircle2 size={14} className="text-blue-600" />}
                      </div>
                      <div className="text-slate-600 text-[11px] mt-1 leading-snug">
                        {addr.line1}, {addr.locality}{t('__Indore___6p3ua', `, Indore - `)}{addr.pincode || addr.pinCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 p-3 rounded-xl text-[11px] text-blue-900 flex items-start gap-2 border border-blue-200">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{t('Zero_Prepayment_Required__ix6xw', `Zero Prepayment Required:`)}</strong>{' '}
                  {t(
                    'You_pay_after_the_job_is_compl_b5s1g',
                    `You pay after the job is completed. Work is protected by mandatory 4-digit arrival and completion OTPs.`
                  )}
                </span>
              </div>
            </div>

            {/* Sticky Modal Footer with Pricing & Dispatch Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 shrink-0 bg-slate-50/90">
              <div className="flex items-baseline gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs text-slate-500 font-medium">Estimated Total:</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{calculatedPricing?.grossAmount || selectedService.suggested_display_price_inr}
                </span>
                {requirementResult && requirementResult.selected_workers > 1 && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {requirementResult.selected_workers} Crew
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                >
                  {t('Cancel_o9zie', `Cancel`)}
                </button>
                <button
                  id="btn-submit-booking-confirm"
                  onClick={handleConfirmBooking}
                  disabled={isSubmittingBooking}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                >
                  {isSubmittingBooking
                    ? 'Dispatching...'
                    : requirementResult && requirementResult.selected_workers > 1
                    ? `Dispatch Crew of ${requirementResult.selected_workers} (5 km)`
                    : 'Dispatch Nearest Artisan (5 km)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating & Feedback Modal */}
      {ratingBooking && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Rate_Worker_Performance_a6uzd', `Rate Worker Performance`)}</h3>
            <p className="text-xs text-slate-500">
              {t('Your_feedback_contributes_dire_pv3uo', `Your feedback contributes directly to worker trust score and society recognition.`)}</p>

            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStars(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star size={32} fill={star <= stars ? '#F59E0B' : 'none'} />
                </button>
              ))}
            </div>

            <textarea
              placeholder={t('Write_a_brief_comment_regardin_0dceg', `Write a brief comment regarding punctuality, technical skill, and behavior...`)}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRatingBooking(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                {t('Skip_qles4', `Skip`)}</button>
              <button
                onClick={handleRateSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {t('Submit_Rating_33byy', `Submit Rating`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mobile Button for Quick Service Viewing */}
      <div className="sm:hidden fixed bottom-5 right-4 z-40">
        <button
          id="btn-floating-mobile-view-services"
          type="button"
          onClick={scrollToServices}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-95 text-white px-4 py-3 rounded-full font-bold text-xs shadow-xl w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 border-2 border-white/90 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3"
        >
          <Layers size={16} />
          <span>{t('services', 'Services')} ({filteredServices.length})</span>
        </button>
      </div>

      {/* Customer Profile & Address Management Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        customer={effectiveCustomer}
        lang={lang}
        onUpdateProfile={(data) => updateCustomerProfile(effectiveCustomer.id, data)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* Optional Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        role="CUSTOMER"
        currentEmail={effectiveCustomer.email || ''}
        isVerified={!!effectiveCustomer.emailVerified}
        entityId={effectiveCustomer.id}
        entityName={effectiveCustomer.name}
      />
    </div>
  );
};
