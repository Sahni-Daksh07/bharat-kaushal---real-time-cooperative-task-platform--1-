import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import { SKILL_ASSESSMENT_BANK, SEEDED_SOCIETIES } from '../../data/seedData';
import { WorkerProfile, Booking } from '../../types';
import { WorkerWelfareBenefitsPanel } from './WorkerWelfareBenefitsPanel';
import { WorkerJobMap } from './WorkerJobMap';
import { TradeSkillAssessmentModal } from './TradeSkillAssessmentModal';
import { EmailVerificationModal } from '../common/EmailVerificationModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { WorkerOrderCardView } from './WorkerOrderCardView';
import { WorkerIncomeHistoryView } from './WorkerIncomeHistoryView';
import {
  HardHat,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  PhoneCall,
  Zap,
  Play,
  KeyRound,
  FileCheck,
  Wallet,
  Building2,
  Navigation,
  PlusCircle,
  HelpCircle,
  X,
  Send,
  AlertOctagon,
  Lock,
  UserCheck,
  Layers,
  Radio,
  Compass,
  Mail,
  ClipboardList,
  Star,
  MessageSquare,
  Calendar,
  ChevronRight,
  TrendingUp,
  Heart,
  Search,
  Filter,
  ArrowRight,
  Check,
  Briefcase,
  Users,
  Award,
  HeartHandshake,
} from 'lucide-react';

interface WorkerPortalProps {
  lang: SupportedLanguage;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({ lang }) => {
  const {
    workers,
    currentWorker,
    setCurrentWorkerId,
    bookings,
    policy,
    acceptBooking,
    startJourney,
    simulateWorkerStep,
    workerArrived,
    verifyArrivalOtp,
    requestMaterialCharge,
    completeJob,
    verifyCompletionOtp,
    cancelBooking,
    submitAppeal,
    submitWorkerRegistration,
    toggleWorkerAvailability,
    triggerSos,
    updateWorkerProfile,
  } = useRealtime();

  const {
    workerUser,
    isWorkerAuthenticated,
    openAuthModal,
    switchWorker,
  } = useAuth();

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'DASHBOARD' | 'FIND_WORK' | 'ORDER_CARD' | 'INCOME_HISTORY'>('DASHBOARD');
  
  // Selected Job Details Modal State (Mockup #1 Screen 5)
  const [selectedJobDetails, setSelectedJobDetails] = useState<any | null>(null);
  
  // Custom Event Listeners from Header Menu
  React.useEffect(() => {
    const handleProfile = () => setIsProfileModalOpen(true);
    const handleDashboard = () => setPortalTab('DASHBOARD');
    const handleFindWork = () => setPortalTab('FIND_WORK');
    const handleOrderCard = () => setPortalTab('ORDER_CARD');
    const handleIncome = () => setPortalTab('INCOME_HISTORY');
    
    document.addEventListener('OPEN_PROFILE', handleProfile);
    document.addEventListener('OPEN_WORKER_DASHBOARD', handleDashboard);
    document.addEventListener('OPEN_FIND_WORK', handleFindWork);
    document.addEventListener('OPEN_ORDER_CARD', handleOrderCard);
    document.addEventListener('OPEN_INCOME_HISTORY', handleIncome);
    return () => {
      document.removeEventListener('OPEN_PROFILE', handleProfile);
      document.removeEventListener('OPEN_WORKER_DASHBOARD', handleDashboard);
      document.removeEventListener('OPEN_FIND_WORK', handleFindWork);
      document.removeEventListener('OPEN_ORDER_CARD', handleOrderCard);
      document.removeEventListener('OPEN_INCOME_HISTORY', handleIncome);
    };
  }, []);

  // OTP inputs
  const [arrivalOtpInput, setArrivalOtpInput] = useState('');
  const [completionOtpInput, setCompletionOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Material request state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialAmount, setMaterialAmount] = useState('150');

  // Appeal Modal
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('Flat tyre on motorcycle while travelling near Vijay Nagar');
  const [appealCategory, setAppealCategory] = useState<'VEHICLE_BREAKDOWN' | 'HEALTH_EMERGENCY' | 'ACCIDENT' | 'SAFETY_THREAT' | 'FORCE_MAJEURE'>('VEHICLE_BREAKDOWN');

  // Email Verification Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Trust Score Breakdown Modal
  const [showTrustModal, setShowTrustModal] = useState(false);

  // Skill Assessment Modal
  const [isSkillAssessmentOpen, setIsSkillAssessmentOpen] = useState(false);

  // Worker Map View Mode: Split, Map Only, or Details Only
  const [workerMapTab, setWorkerMapTab] = useState<'SPLIT' | 'MAP_ONLY' | 'DETAILS_ONLY'>('SPLIT');

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Find active booking assigned to this worker
  const myBooking: Booking | undefined = bookings.find(
    (b) =>
      b.workerId === currentWorker.id &&
      b.status !== 'CANCELLED' &&
      b.status !== 'COMPLETED'
  ) || bookings.find((b) => b.workerId === currentWorker.id);

  const handleVerifyArrival = async () => {
    if (!myBooking) return;
    setOtpError(null);
    try {
      await verifyArrivalOtp(myBooking.id, arrivalOtpInput);
      setArrivalOtpInput('');
    } catch (e: any) {
      setOtpError(e.message || 'Invalid Arrival OTP');
    }
  };

  const handleVerifyCompletion = async () => {
    if (!myBooking) return;
    setOtpError(null);
    try {
      await verifyCompletionOtp(myBooking.id, completionOtpInput);
      setCompletionOtpInput('');
    } catch (e: any) {
      setOtpError(e.message || 'Invalid Completion OTP');
    }
  };

  const handleSendMaterialRequest = async () => {
    if (!myBooking || !materialName || !materialAmount) return;
    await requestMaterialCharge(myBooking.id, materialName, Number(materialAmount));
    setIsMaterialModalOpen(false);
    setMaterialName('');
  };

  const handleTriggerAppeal = async () => {
    if (!myBooking) return;
    await submitAppeal(currentWorker.id, myBooking.id, appealReason, appealCategory);
    setIsAppealModalOpen(false);
  };

  // Render active booking state cards
  const renderBookingStateCards = () => {
    if (!myBooking) return null;
    return (
      <div className="space-y-4">
        {/* Job Offer State: Accept or Decline */}
        {myBooking.status === 'WORKER_OFFERED' && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3 animate-pulse">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                <Zap size={18} className="text-amber-600" />
                <span>{t('Incoming_Fair_Job_Offer_Alloca_qqiv8', `Incoming Fair Job Offer Allocated to You!`)}</span>
              </div>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-semibold">
                {t('Action_Required_kpzfa', `Action Required`)}</span>
            </div>
            <p className="text-xs text-amber-800">
              {t('Customer__onvbi', `Customer:`)}<strong>{myBooking.customerName}</strong> • {myBooking.customerAddress.address}{t('__Indore________________Gross__ohe4o', `, Indore.
              Gross Price: ₹`)}{myBooking.pricing.grossAmount} {t('__You_Earn__jeg4g', `• You Earn:`)}<strong>₹{myBooking.pricing.workerShare}</strong>.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                id="btn-worker-accept-job"
                onClick={() => acceptBooking(myBooking.id)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                {t('Accept_Job_Offer_ru7dq', `Accept Job Offer`)}</button>
              <button
                onClick={() => cancelBooking(myBooking.id, 'Worker declined offer', 'WORKER')}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                {t('Decline_1wkm3', `Decline`)}</button>
            </div>
          </div>
        )}

        {/* Confirmed / Travelling State: Start Journey & Step Simulator */}
        {myBooking.status === 'CONFIRMED' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-800">{t('Job_Confirmed__Ready_to_travel_8l8p0', `Job Confirmed. Ready to travel?`)}</div>
            <button
              id="btn-worker-start-journey"
              onClick={() => startJourney(myBooking.id)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Navigation size={15} />
              <span>{t('Start_Journey_Towards_Customer_y3nz9', `Start Journey Towards Customer`)}</span>
            </button>
          </div>
        )}

        {myBooking.status === 'TRAVELLING' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-2">
                <Navigation size={16} className="text-blue-600 animate-bounce" />
                <span>{t('On_the_way_to_customer_premise_yndok', `On the way to customer premises`)}</span>
              </div>
              <span className="text-xs font-semibold text-blue-700">
                {myBooking.workerLocation?.distanceKm} {t('km_away___ETA_5b4ce', `km away • ETA`)}{myBooking.workerLocation?.etaMinutes} {t('mins_a8ura', `mins`)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => simulateWorkerStep(myBooking.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Play size={13} />
                <span>{t('Simulate_GPS_Step___0_4_km__080w7', `Simulate GPS Step (-0.4 km)`)}</span>
              </button>

              <button
                id="btn-worker-arrived"
                onClick={() => workerArrived(myBooking.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <MapPin size={14} />
                <span>{t('I_Have_Arrived_at_Doorstep_qafot', `I Have Arrived at Doorstep`)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Arrived State: Enter Arrival OTP provided by Customer */}
        {myBooking.status === 'ARRIVED' && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <KeyRound size={18} className="text-amber-600" />
              <span>{t('Step_4__Enter_Customer_Arrival_1p0hb', `Step 4: Enter Customer Arrival OTP to Unlock Work`)}</span>
            </div>
            <p className="text-xs text-amber-800">
              {t('Ask_customer_for_the_4_digit_c_crdy3', `Ask customer for the 4-digit code displayed on their screen. Work cannot start without verification.`)}</p>

            <div className="flex items-center gap-3 pt-1">
              <input
                id="worker-arrival-otp-input"
                type="text"
                maxLength={4}
                placeholder={t('e_g__4827_oi92x', `e.g. 4827`)}
                value={arrivalOtpInput}
                onChange={(e) => setArrivalOtpInput(e.target.value)}
                className="w-32 px-3 py-2 text-lg font-mono font-bold tracking-widest text-center border-2 border-amber-400 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                id="btn-verify-arrival-otp"
                onClick={handleVerifyArrival}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                {t('Verify___Start_Service_Work_f24sa', `Verify & Start Service Work`)}</button>
            </div>
            {otpError && <p className="text-xs text-rose-600 font-semibold">{otpError}</p>}
          </div>
        )}

        {/* In Progress State: Add Material & Mark Job Completed */}
        {myBooking.status === 'IN_PROGRESS' && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>{t('Job_In_Progress_at_Customer_Pr_lt4vl', `Job In Progress at Customer Premises`)}</span>
              </div>
              <span className="text-xs text-emerald-800 font-medium">{t('Workmanship_Warranty_Active_s4aqc', `Workmanship Warranty Active`)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsMaterialModalOpen(true)}
                className="px-4 py-2 border border-blue-600 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>{t('Request_Extra_Spare_Part___Mat_oyw9x', `Request Extra Spare Part / Material Bill`)}</span>
              </button>

              <button
                id="btn-worker-complete-job"
                onClick={() => completeJob(myBooking.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>{t('Work_Finished__Request_Custome_qe95z', `Work Finished (Request Customer Completion OTP)`)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Completion Pending State: Enter Completion OTP */}
        {myBooking.status === 'COMPLETION_PENDING' && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>{t('Enter_Completion_OTP_to_Author_4x40i', `Enter Completion OTP to Authorize Payment Release`)}</span>
            </div>
            <p className="text-xs text-emerald-800">
              {t('Customer_has_reviewed_the_fini_gfi97', `Customer has reviewed the finished work. Ask them for their 4-digit Completion OTP to instantly credit ₹`)}{myBooking.pricing.workerShare} {t('to_your_account__r6tah', `to your account.`)}</p>

            <div className="flex items-center gap-3 pt-1">
              <input
                id="worker-completion-otp-input"
                type="text"
                maxLength={4}
                placeholder={t('e_g__8192_lrtk0', `e.g. 8192`)}
                value={completionOtpInput}
                onChange={(e) => setCompletionOtpInput(e.target.value)}
                className="w-32 px-3 py-2 text-lg font-mono font-bold tracking-widest text-center border-2 border-emerald-500 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                id="btn-verify-completion-otp"
                onClick={handleVerifyCompletion}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                {t('Verify_OTP___Collect___nd9dp', `Verify OTP & Collect ₹`)}{myBooking.pricing.workerShare}
              </button>
            </div>
            {otpError && <p className="text-xs text-rose-600 font-semibold">{otpError}</p>}
          </div>
        )}

        {/* Completed State */}
        {myBooking.status === 'COMPLETED' && (
          <div className="bg-emerald-100/60 border border-emerald-300 rounded-xl p-4 text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-bold">{t('Job_Completed___Settled__6kqqw', `Job Completed & Settled!`)}</span>
              <p className="mt-0.5">
                {t('Worker_share_of___fyygm', `Worker share of ₹`)}{myBooking.pricing.workerShare} {t('has_been_credited__2__welfare__2awo1', `has been credited. 2% welfare contribution (₹`)}{myBooking.pricing.welfareShare}{t('__transferred_to_MPSLWB__ez1ry', `) transferred to MPSLWB.`)}</p>
            </div>
          </div>
        )}

        {/* Cancellation Option with Penalty Test */}
        {['CONFIRMED', 'TRAVELLING'].includes(myBooking.status) && (
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">
              {t('Cancellation_policy__Free_with_0c048', `Cancellation policy: Free within 5 mins. After grace period, ₹20 unexcused penalty applies.`)}</span>
            <button
              onClick={() => {
                if (confirm('Cancel this active booking? If after 5 min grace window, a ₹20 cooperative penalty applies (appealable).')) {
                  cancelBooking(myBooking.id, 'Worker unable to reach due to delay', 'WORKER');
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-semibold"
            >
              {t('Cancel_Booking_fd5r6', `Cancel Booking`)}</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 dashboard-container" data-dashboard-container="true">
      {/* 1. Worker Identity & Context Header (Desktop Mockup #4) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs dashboard-card" data-dashboard-card="true">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Welcome Greeting & Availability Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-worker-avatar-profile"
                onClick={() => setIsProfileModalOpen(true)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0 overflow-hidden border-2 border-amber-300 transition-transform hover:scale-105 active:scale-95 group relative"
                title={t('Click_to_view_full_Craftsman_D_e86f4', `Click to view full Craftsman Dossier & Aadhaar Details`)}
              >
                {currentWorker.photoUrl ? (
                  <img
                    src={currentWorker.photoUrl}
                    alt={currentWorker.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <HardHat size={24} />
                )}
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Namaste, {currentWorker.name}!</span>
                  <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs text-slate-500 font-normal">
                  Good to see you back. Skilled people build stronger communities.
                </p>
              </div>
            </div>

            {/* Availability Pill & Change Button (Mockup #4) */}
            <div className="flex items-center gap-2 pt-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                currentWorker.availability
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${currentWorker.availability ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>{currentWorker.availability ? 'Available for Work' : 'Currently Offline'}</span>
              </div>

              <button
                id="worker-toggle-availability"
                onClick={() => toggleWorkerAvailability(currentWorker.id)}
                disabled={currentWorker.verificationStatus !== 'VERIFIED'}
                className="h-8 px-3 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              >
                Change
              </button>

              <span className="text-slate-300 hidden sm:inline">|</span>

              <span className="text-xs text-slate-600 hidden sm:inline">
                {currentWorker.primaryTrade} • {currentWorker.city || 'Indore'}, MP
              </span>
            </div>
          </div>

          {/* Right Cultural Quote Banner & Quick Actions (Mockup #4) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-blue-500/10 border border-amber-200/80 rounded-2xl p-3 sm:px-4 text-center sm:text-right">
              <p className="text-xs font-bold text-amber-950 font-serif">
                &ldquo;हर कौशल एक बेहतर भारत की नींव है।&rdquo;
              </p>
              <div className="h-0.5 w-16 bg-amber-500/60 rounded-full mx-auto sm:ml-auto sm:mr-0 my-1" />
              <p className="text-[10px] text-slate-500 font-medium">
                — Bharat Kaushal
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="h-9 px-3.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <HardHat size={14} className="text-amber-700" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('🚨 ACTIVATE EMERGENCY SOS? This sends immediate distress alert to Society Operations & contacts Helpline 112.')) {
                    triggerSos(currentWorker.id, 'Worker triggered on-site distress signal in Indore');
                  }
                }}
                className="h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                title="Emergency SOS"
              >
                <AlertOctagon size={14} />
                <span>SOS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Grid (Desktop Mockup #4) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 dashboard-card" data-dashboard-card="true">
        {/* Metric 1: Today's Earnings */}
        <div className="bk-card p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Today&apos;s Earnings</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{currentWorker.earnings?.today || 1850}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp size={12} />
              <span>+12% from yesterday</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Wallet size={18} />
          </div>
        </div>

        {/* Metric 2: Active Jobs */}
        <div className="bk-card p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Active Jobs</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {myBooking ? '2' : '1'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              1 in progress, 1 scheduled
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Briefcase size={18} />
          </div>
        </div>

        {/* Metric 3: Rating */}
        <div className="bk-card p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Rating</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-1.5">
              <span>{currentWorker.rating || 4.8}</span>
              <Star size={20} className="text-amber-500 fill-amber-500" />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              From {currentWorker.totalRatingsCount || 28} completed jobs
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
            <Star size={18} />
          </div>
        </div>

        {/* Metric 4: Cooperative Share */}
        <div className="bk-card p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Cooperative Share</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{currentWorker.welfareBalance || 4320}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Member since Jan 2025
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Users size={18} />
          </div>
        </div>
      </section>

      {/* 3. Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200/80 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            id="tab-worker-dashboard"
            onClick={() => setPortalTab('DASHBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              portalTab === 'DASHBOARD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Radio size={14} className={portalTab === 'DASHBOARD' ? 'text-white' : 'text-blue-600'} />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-worker-find-work"
            onClick={() => setPortalTab('FIND_WORK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              portalTab === 'FIND_WORK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Search size={14} className={portalTab === 'FIND_WORK' ? 'text-white' : 'text-blue-600'} />
            <span>Find Work</span>
          </button>

          <button
            id="tab-worker-order-card"
            onClick={() => setPortalTab('ORDER_CARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              portalTab === 'ORDER_CARD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <ClipboardList size={14} className={portalTab === 'ORDER_CARD' ? 'text-white' : 'text-amber-600'} />
            <span>My Jobs</span>
            {myBooking && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            id="tab-worker-income-history"
            onClick={() => setPortalTab('INCOME_HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              portalTab === 'INCOME_HISTORY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Wallet size={14} className={portalTab === 'INCOME_HISTORY' ? 'text-white' : 'text-emerald-600'} />
            <span>Earnings</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 px-3 hidden md:flex items-center gap-1.5 font-medium">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Indore Cooperative Trade Verification Active</span>
        </div>
      </div>

      {/* DASHBOARD TAB VIEW (Desktop Mockup #4) */}
      {portalTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Active Work Order if exists */}
          {myBooking && (
            <section className="bg-white rounded-2xl border-2 border-blue-600 p-4 sm:p-6 shadow-md space-y-4 dashboard-card" data-dashboard-card="true">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                    {myBooking.status.replace(/_/g, ' ')}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Active Job: {myBooking.serviceName} ({myBooking.id})
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500">Your Share (94.5%)</span>
                  <div className="text-lg font-black text-emerald-700">₹{myBooking.pricing.workerShare}</div>
                </div>
              </div>

              {renderBookingStateCards()}
            </section>
          )}

          {/* Main 3-Column Middle Grid (Mockup #4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Column 1: Nearby Opportunities (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Nearby Opportunities</h3>
                    <p className="text-[11px] text-slate-500">Real-time jobs near you based on skills</p>
                  </div>
                  <button
                    onClick={() => setPortalTab('FIND_WORK')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Job Card 1 */}
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Fan Installation (2 units)</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} />
                          <span>1.2 km • Vijay Nagar, Indore</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">₹600</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      92% Match
                    </span>
                    <span className="text-slate-500 text-[10px]">~2 hours</span>
                    <button
                      onClick={() => {
                        setSelectedJobDetails({
                          title: 'Fan Installation (2 units)',
                          serviceName: 'Fan Installation',
                          location: 'Vijay Nagar, Indore',
                          distance: '1.2 km',
                          duration: '~2 hours',
                          earnings: 600,
                          trade: 'Electrical',
                          match: '92%',
                          customer: 'Rahul Sharma',
                          preferredTime: 'Today, 2:00 PM - 5:00 PM',
                          description: 'Need ceiling fan installation in 2 BHK apartment. All materials provided.',
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>

                {/* Job Card 2 */}
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <HardHat size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Wiring Repair</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} />
                          <span>2.8 km • Scheme 78, Indore</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">₹1,200</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      86% Match
                    </span>
                    <span className="text-slate-500 text-[10px]">~4 hours</span>
                    <button
                      onClick={() => {
                        setSelectedJobDetails({
                          title: 'Wiring Repair',
                          serviceName: 'Wiring Repair',
                          location: 'Scheme 78, Indore',
                          distance: '2.8 km',
                          duration: '~4 hours',
                          earnings: 1200,
                          trade: 'Electrical',
                          match: '86%',
                          customer: 'Anil Gupta',
                          preferredTime: 'Today, 3:30 PM - 7:30 PM',
                          description: 'Short circuit fault tracing and MCB distribution board wiring repair.',
                        });
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-[11px]"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Job Card 3 */}
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Ceiling Fan Installation</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} />
                          <span>4.1 km • Palasia, Indore</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">₹500</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                      78% Match
                    </span>
                    <span className="text-slate-500 text-[10px]">~2 hours</span>
                    <button
                      onClick={() => {
                        setSelectedJobDetails({
                          title: 'Ceiling Fan Installation',
                          serviceName: 'Ceiling Fan Installation',
                          location: 'Palasia, Indore',
                          distance: '4.1 km',
                          duration: '~2 hours',
                          earnings: 500,
                          trade: 'Electrical',
                          match: '78%',
                          customer: 'Siddharth Rao',
                          preferredTime: 'Tomorrow, 10:00 AM',
                          description: 'Standard ceiling fan unboxing and secure anchor mounting in living room.',
                        });
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-[11px]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Jobs Near You Interactive Map (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Jobs Near You</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Indore Zone
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">All Jobs</span>
                </div>

                <div className="h-[340px] w-full rounded-xl overflow-hidden border border-slate-200">
                  <WorkerJobMap
                    worker={currentWorker}
                    booking={myBooking}
                    allWorkers={workers}
                    onSimulateStep={(bookingId) => simulateWorkerStep(bookingId)}
                    onWorkerArrived={(bookingId) => workerArrived(bookingId)}
                    onStartJourney={(bookingId) => startJourney(bookingId)}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Available Job</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Urgent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300" />
                    <span>Your Location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Your Next Job & Cooperative Benefits (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Your Next Job Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">Your Next Job</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">AC Repair & Filter Clean</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      <span>Today, 3:00 PM</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />
                      <span>Vijay Nagar, Indore</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPortalTab('ORDER_CARD')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Job Details
                </button>
              </div>

              {/* Cooperative Benefits Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">Cooperative Benefits</h3>
                  <button
                    onClick={() => setPortalTab('INCOME_HISTORY')}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="font-medium text-slate-800">Health Insurance</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-blue-600" />
                      <span className="font-medium text-slate-800">Skill Development</span>
                    </div>
                    <button
                      onClick={() => setIsSkillAssessmentOpen(true)}
                      className="text-[10px] font-bold text-blue-700 hover:underline"
                    >
                      Enroll
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <HeartHandshake size={14} className="text-purple-600" />
                      <span className="font-medium text-slate-800">Welfare Fund</span>
                    </div>
                    <span className="text-[11px] font-bold text-purple-800">
                      ₹{currentWorker.welfareBalance || 4320}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <HardHat size={14} className="text-amber-600" />
                      <span className="font-medium text-slate-800">Tools Support</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700">
                      Apply
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3-Column Grid (Mockup #4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Today's Schedule Timeline */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Today&apos;s Schedule</h3>
                <span className="text-xs font-bold text-blue-600 cursor-pointer">View Full Day</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Schedule Item 1 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">AC Repair</span>
                      <span className="font-bold text-slate-800">₹1,200</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Completed • 10:00 AM - 12:00 PM</div>
                  </div>
                </div>

                {/* Schedule Item 2 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Wiring at Sharma Residence</span>
                      <span className="font-bold text-slate-800">₹650</span>
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium">In Progress • 1:00 PM - 3:00 PM</div>
                  </div>
                </div>

                {/* Schedule Item 3 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">LED Installation</span>
                      <span className="font-bold text-slate-800">₹500</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Scheduled • 5:00 PM - 7:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Earnings Overview Weekly Bar Chart */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Earnings Overview</h3>
                  <p className="text-[11px] text-slate-500">Weekly breakdown</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">₹2,450</span>
                  <div className="text-[10px] text-slate-500">5 jobs this week</div>
                </div>
              </div>

              {/* Simplified weekly bar visualization (Mon to Sun) */}
              <div className="pt-2 flex items-end justify-between h-32 gap-2 text-center">
                {[
                  { day: 'Mon', h: '35%', val: '₹400' },
                  { day: 'Tue', h: '55%', val: '₹650' },
                  { day: 'Wed', h: '45%', val: '₹500' },
                  { day: 'Thu', h: '65%', val: '₹750' },
                  { day: 'Fri', h: '90%', val: '₹1,200', active: true },
                  { day: 'Sat', h: '50%', val: '₹600' },
                  { day: 'Sun', h: '70%', val: '₹850' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
                    <div
                      style={{ height: item.h }}
                      className={`w-full rounded-t-lg transition-all ${
                        item.active ? 'bg-blue-600' : 'bg-blue-200 hover:bg-blue-300'
                      }`}
                      title={`${item.day}: ${item.val}`}
                    />
                    <span className="text-[10px] text-slate-500 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Recent Messages with Unread Counter */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Messages</h3>
                <span className="text-xs font-bold text-blue-600 cursor-pointer">View All</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                    AY
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">Amit Yadav (Customer)</span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">Can you come 15 mins earlier?</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                    BK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">Bharat Kaushal</span>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">Your welfare benefit credit ₹48 has been updated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    SA
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">Society Admin</span>
                      <span className="text-[10px] text-slate-400">5h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">New maintenance task batch available in Scheme 78.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIND WORK MARKETPLACE TAB VIEW (Mockup #1 Screen 4) */}
      {portalTab === 'FIND_WORK' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Find Work Marketplace</h2>
                <p className="text-xs text-slate-500">Real opportunities across Indore with verified cooperative realization</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search trade, skill, or location..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              {['All', 'Electrical', 'Plumbing', 'Carpentry', 'Painting', 'AC Repair'].map((cat, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'LED Light Installation', loc: 'Palasia, Indore', dist: '1.2 km', dur: '~2 hours', price: 500, match: '78%', trade: 'Electrical' },
              { title: 'AC Repair & Gas Refill', loc: 'Vijay Nagar, Indore', dist: '2.4 km', dur: '~3 hours', price: 1500, match: '88%', trade: 'HVAC' },
              { title: 'Switch Board Repair', loc: 'Lal Bagh, Indore', dist: '3.1 km', dur: '~2 hours', price: 700, match: '80%', trade: 'Electrical' },
              { title: 'Ceiling Fan Installation', loc: 'Bhawarkuan, Indore', dist: '4.0 km', dur: '~2 hours', price: 600, match: '76%', trade: 'Electrical' },
              { title: 'Water Tank Leakage Fix', loc: 'Rajwada, Indore', dist: '1.8 km', dur: '~2.5 hours', price: 850, match: '84%', trade: 'Plumbing' },
              { title: 'Door Lock Replacement', loc: 'Geeta Bhawan, Indore', dist: '3.5 km', dur: '~1.5 hours', price: 450, match: '82%', trade: 'Carpentry' },
            ].map((job, idx) => (
              <div key={idx} className="bk-card p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      {job.trade}
                    </span>
                    <button className="text-slate-400 hover:text-rose-500">
                      <Heart size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{job.title}</h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{job.loc} • {job.dist}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-base font-black text-slate-900">₹{job.price}</span>
                    <span className="text-[11px] text-slate-500">{job.dur}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {job.match} Match
                  </span>

                  <button
                    onClick={() => {
                      setSelectedJobDetails({
                        title: job.title,
                        serviceName: job.title,
                        location: job.loc,
                        distance: job.dist,
                        duration: job.dur,
                        earnings: job.price,
                        trade: job.trade,
                        match: job.match,
                        customer: 'Verified Customer',
                        preferredTime: 'Today, 2:00 PM - 5:00 PM',
                        description: `Standard cooperative task requirement for ${job.title} in Indore. Full equipment support provided.`,
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Job Details Modal (Mockup #1 Screen 5) */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  {selectedJobDetails.trade}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {selectedJobDetails.match} Match
                </span>
              </div>
              <button
                onClick={() => setSelectedJobDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">{selectedJobDetails.title}</h3>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <MapPin size={13} className="text-blue-600" />
                <span>{selectedJobDetails.distance} • {selectedJobDetails.location}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Estimated Earnings (94.5%)</span>
                <div className="text-2xl font-black text-emerald-700">₹{selectedJobDetails.earnings}</div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <div>Duration: <strong>{selectedJobDetails.duration}</strong></div>
                <div className="text-slate-400 text-[11px]">Preferred: {selectedJobDetails.preferredTime}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Job Description:</div>
              <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedJobDetails.description}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Job "${selectedJobDetails.title}" accepted! Transitioning to live navigation.`);
                  setSelectedJobDetails(null);
                  setPortalTab('DASHBOARD');
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all text-center cursor-pointer"
              >
                Accept Job
              </button>
              <button
                onClick={() => setSelectedJobDetails(null)}
                className="px-5 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-xs text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welfare & Benefits Summary Panel (MPSLWB & Social Security Projections) */}
      <WorkerWelfareBenefitsPanel lang={lang} />

      {/* 15-Question Trade Skill Assessment Modal */}
      <TradeSkillAssessmentModal
        isOpen={isSkillAssessmentOpen}
        tradeField={currentWorker.primaryTrade || 'Plumbing'}
        workerName={currentWorker.name}
        language={lang}
        workerId={currentWorker.id}
        onClose={() => setIsSkillAssessmentOpen(false)}
        onComplete={(res) => {
          if (currentWorker) {
            currentWorker.skillAssessmentScore = res.percentage;
            currentWorker.skillLevel = res.skillLevel as any;
            currentWorker.verificationStatus = 'VERIFIED';
          }
          setIsSkillAssessmentOpen(false);
        }}
      />

      {/* Material Extra Charge Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Add_Extra_Material___Spare_Par_idjzr', `Add Extra Material / Spare Part Charge`)}</h3>
            <p className="text-xs text-slate-500">
              {t('This_request_will_be_sent_to_t_0vv05', `This request will be sent to the customer for immediate live approval before being added to the bill.`)}</p>

            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('Item_Description_dktyx', `Item Description`)}</label>
              <input
                type="text"
                placeholder={t('e_g__Brass_Angle_Valve_1_2_inc_jsqda', `e.g. Brass Angle Valve 1/2 inch or 15A Switch`)}
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('Actual_Cost__INR__qdd8a', `Actual Cost (INR)`)}</label>
              <input
                type="number"
                value={materialAmount}
                onChange={(e) => setMaterialAmount(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                {t('Cancel_wf9oh', `Cancel`)}</button>
              <button
                onClick={handleSendMaterialRequest}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {t('Send_Request_to_Customer_exsvd', `Send Request to Customer`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Penalty Appeal Modal */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Submit_Exemption_Appeal___20_P_v6ysj', `Submit Exemption Appeal (₹20 Penalty)`)}</h3>
            <p className="text-xs text-slate-500">
              {t('Appeals_are_reviewed_by_the_So_sz8mm', `Appeals are reviewed by the Society Admin Tribunal. Verified emergencies result in automatic penalty reversal and reliability restoration.`)}</p>

            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('Emergency_Reason_Category_18gu0', `Emergency Reason Category`)}</label>
              <select
                value={appealCategory}
                onChange={(e) => setAppealCategory(e.target.value as any)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="VEHICLE_BREAKDOWN">{t('Vehicle___Conveyance_Breakdown_9qqo6', `Vehicle / Conveyance Breakdown`)}</option>
                <option value="HEALTH_EMERGENCY">{t('Sudden_Medical___Health_Emerge_ivr2d', `Sudden Medical / Health Emergency`)}</option>
                <option value="SAFETY_THREAT">{t('On_site_Safety___Hazard_Threat_7qhxo', `On-site Safety / Hazard Threat`)}</option>
                <option value="ACCIDENT">{t('Traffic_Accident_or_Road_Block_pfunx', `Traffic Accident or Road Blockage`)}</option>
                <option value="FORCE_MAJEURE">{t('Severe_Weather___Force_Majeure_odqv9', `Severe Weather / Force Majeure`)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('Detailed_Explanation_jnkxl', `Detailed Explanation`)}</label>
              <textarea
                rows={3}
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAppealModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                {t('Cancel_fw4a5', `Cancel`)}</button>
              <button
                onClick={handleTriggerAppeal}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {t('Submit_Appeal_to_Society_Admin_4qxbm', `Submit Appeal to Society Admin`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER CARD TAB VIEW */}
      {portalTab === 'ORDER_CARD' && (
        <WorkerOrderCardView
          currentWorker={currentWorker}
          activeBooking={myBooking}
          allBookings={bookings}
          language={lang}
          policy={policy}
          onStartJourney={startJourney}
          onWorkerArrived={workerArrived}
          onSimulateStep={(bookingId) => simulateWorkerStep(bookingId)}
          onVerifyArrivalOtp={async (bookingId, otp) => {
            const b = await verifyArrivalOtp(bookingId, otp);
            return !!b;
          }}
          onCompleteJob={completeJob}
          onVerifyCompletionOtp={async (bookingId, otp) => {
            const b = await verifyCompletionOtp(bookingId, otp);
            return !!b;
          }}
          onRequestMaterialCharge={(bookingId, cost, desc) => {
            requestMaterialCharge(bookingId, desc, cost);
          }}
          onCancelBooking={(bookingId, reason, by) => cancelBooking(bookingId, reason, by)}
          onBackToDashboard={() => setPortalTab('DASHBOARD')}
        />
      )}

      {/* INCOME HISTORY TAB VIEW */}
      {portalTab === 'INCOME_HISTORY' && (
        <WorkerIncomeHistoryView
          currentWorker={currentWorker}
          bookings={bookings}
          language={lang}
          policy={policy}
          onBackToDashboard={() => setPortalTab('DASHBOARD')}
        />
      )}

      {/* Trust Score Breakdown Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {t('Bharat_Kaushal_Trust_Score_Bre_qmb3d', `Bharat Kaushal Trust Score Breakdown`)}</h3>
              <button onClick={() => setShowTrustModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-black text-blue-700">{currentWorker.trustScore} {t('__100_pfz1x', `/ 100`)}</div>
              <span className="text-xs text-slate-500">{t('100__Explainable_Algorithmic_F_mym3f', `100% Explainable Algorithmic Formula`)}</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Identity_Verification__UIDAI___g1xbg', `Identity Verification (UIDAI / PAN):`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.identityScore ?? 20} {t('__20_nk8k6', `/ 20`)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Society_Affiliation___Standing_d0qfo', `Society Affiliation & Standing:`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.societyScore ?? 15} {t('__15_y7vsh', `/ 15`)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Certified_Skill_Assessment_Tes_1dktl', `Certified Skill Assessment Test:`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.skillScore ?? 18} {t('__20_11vdk', `/ 20`)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Trade_Experience__cp56h', `Trade Experience:`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.experienceScore ?? 8} {t('__10_waq3q', `/ 10`)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Job_Completion___Reliability__dk155', `Job Completion & Reliability:`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.reliabilityScore ?? 14} {t('__15_n9kvx', `/ 15`)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">{t('Customer_Ratings___vwcw0', `Customer Ratings (`)}{currentWorker.rating ?? 4.9}{t('____dnqal', `★):`)}</span>
                <span className="font-bold text-slate-900">{currentWorker.trustBreakdown?.ratingScore ?? 10} {t('__10_exmy9', `/ 10`)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowTrustModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              {t('Close_brtbk', `Close`)}</button>
          </div>
        </div>
      )}

      {/* Craftsman Dossier & Profile Modal */}
      <WorkerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        worker={currentWorker}
        lang={lang}
        onUpdateProfile={(data) => updateWorkerProfile(currentWorker.id, data)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onOpenAssessmentModal={() => setIsSkillAssessmentOpen(true)}
      />

      {/* Optional Email Verification Modal for Worker */}
      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        role="WORKER"
        currentEmail={currentWorker.email || ''}
        isVerified={!!currentWorker.emailVerified}
        entityId={currentWorker.id}
        entityName={currentWorker.name}
      />
    </div>
  );
};
