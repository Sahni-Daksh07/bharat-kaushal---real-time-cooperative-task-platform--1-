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
  const [portalTab, setPortalTab] = useState<'DASHBOARD' | 'ORDER_CARD' | 'INCOME_HISTORY'>('DASHBOARD');
  
  // Custom Event Listeners from Header Menu
  React.useEffect(() => {
    const handleProfile = () => setIsProfileModalOpen(true);
    const handleOrderCard = () => setPortalTab('ORDER_CARD');
    const handleIncome = () => setPortalTab('INCOME_HISTORY');
    
    document.addEventListener('OPEN_PROFILE', handleProfile);
    document.addEventListener('OPEN_ORDER_CARD', handleOrderCard);
    document.addEventListener('OPEN_INCOME_HISTORY', handleIncome);
    return () => {
      document.removeEventListener('OPEN_PROFILE', handleProfile);
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
      {/* Worker Identity Header Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs dashboard-card" data-dashboard-card="true">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 w-full md:w-auto min-w-0 flex-1">
            <button
              type="button"
              id="btn-worker-avatar-profile"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0 overflow-hidden border-2 border-amber-300 transition-transform hover:scale-105 active:scale-95 group relative"
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
                <HardHat size={28} />
              )}
              <span className="absolute bottom-0 right-0 bg-stone-900/80 text-amber-300 p-0.5 rounded-tl text-[9px]">
                {t('___qjc60', `🪪`)}</span>
            </button>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xl font-black text-slate-900 hover:text-amber-800 transition-colors text-left flex items-center gap-2"
                >
                  <span>{currentWorker.name}</span>
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                    {t('View_Profile_s9jms', `View Profile`)}</span>
                </button>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentWorker.id}
                </span>

                {/* Worker Selector for Quick Testing */}
                <select
                  value={currentWorker.id}
                  onChange={(e) => setCurrentWorkerId(e.target.value)}
                  className="max-w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-slate-700 font-medium truncate"
                  title={t('Switch_worker_demo_profile_kc9u9', `Switch worker demo profile`)}
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.primaryTrade} - {w.verificationStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-blue-700">{currentWorker.primaryTrade} {t('Trade_4dutm', `Trade`)}</span>
                <span>•</span>
                <span className="text-slate-500">{currentWorker.societyName}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">{t('Aadhaar__dn70x', `Aadhaar:`)}{currentWorker.maskedAadhaar}</span>
                <span>•</span>
                <span className="text-slate-500">{currentWorker.city || 'Indore'}{t('__MP_0622c', `, MP`)}</span>
              </div>
            </div>
          </div>

          {/* Right Action: Profile Button, Availability Toggle & Auth Button */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-3 md:mt-0">
            {/* Dedicated Worker Profile & Dossier Button */}
            <button
              id="btn-worker-profile-main"
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex-1 sm:flex-initial h-9 px-3 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-2xs whitespace-nowrap"
              title={t('Open_full_worker_details__Perm_7j4za', `Open full worker details: Permanent/Temporary Address, Aadhaar card, Mobile number`)}
            >
              <HardHat size={14} className="text-amber-700 shrink-0" />
              <span>{t('Worker_Profile_f0nfw', `Worker Profile`)}</span>
            </button>

            {/* Dedicated Worker Auth / PIN Button */}
            <button
              id="btn-worker-portal-auth-trigger"
              onClick={() => openAuthModal('WORKER')}
              className={`flex-1 sm:flex-initial h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs border whitespace-nowrap ${
                isWorkerAuthenticated
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700'
              }`}
              title={t('Worker_login_with_ID___Registe_y1x7f', `Worker login with ID / Registered Mobile & Trade Security PIN`)}
            >
              <KeyRound size={14} className="shrink-0" />
              <span>{isWorkerAuthenticated ? 'Craftsman Auth' : 'Worker Login / PIN'}</span>
            </button>

            {/* Availability Switch */}
            <button
              id="worker-toggle-availability"
              onClick={() => toggleWorkerAvailability(currentWorker.id)}
              disabled={currentWorker.verificationStatus !== 'VERIFIED'}
              className={`h-9 flex items-center justify-center gap-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs whitespace-nowrap ${
                currentWorker.availability
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentWorker.availability ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
              <span>{currentWorker.availability ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Map Mode Quick Switcher */}
            <button
              id="btn-worker-map-toggle"
              onClick={() => setWorkerMapTab((prev) => (prev === 'MAP_ONLY' ? 'SPLIT' : 'MAP_ONLY'))}
              className={`h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs border whitespace-nowrap ${
                workerMapTab === 'MAP_ONLY'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
              title={t('Toggle_Live_Worker_Map___Turn__jetp5', `Toggle Live Worker Map & Turn-by-Turn GPS Navigation`)}
            >
              <MapPin size={14} className={workerMapTab === 'MAP_ONLY' ? 'text-white shrink-0' : 'text-blue-600 shrink-0'} />
              <span>{workerMapTab === 'MAP_ONLY' ? 'Exit Map' : 'Live Map'}</span>
            </button>

            {/* Skill Assessment Modal Trigger */}
            <button
              onClick={() => setIsSkillAssessmentOpen(true)}
              className="h-9 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap"
              title={t('Take_or_Retake_the_15_question_yqj11', `Take or Retake the 15-question trade skill assessment`)}
            >
              <Zap size={14} className="text-emerald-600 shrink-0" />
              <span>{t('Skill___7uzmi', `Skill (`)}{currentWorker.skillAssessmentScore ? `${currentWorker.skillAssessmentScore}%` : 'Test'})</span>
            </button>

            {/* SOS Trigger Button */}
            <button
              onClick={() => {
                if (confirm('🚨 ACTIVATE EMERGENCY SOS? This sends immediate distress alert to Society Operations & contacts Helpline 112.')) {
                  triggerSos(currentWorker.id, 'Worker triggered on-site distress signal in Indore');
                }
              }}
              className="h-9 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
              title={t('Emergency_SOS__Safety_Distress_0fp9u', `Emergency SOS (Safety Distress)`)}
            >
              <AlertOctagon size={14} className="shrink-0" />
              <span>{t('SOS_iw718', `SOS`)}</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">{t('Verification_State__rutcc', `Verification State:`)}</span>
            {currentWorker.verificationStatus === 'VERIFIED' ? (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>{t('Verified_by_Society___Authorit_12t0s', `Verified by Society & Authority`)}</span>
              </span>
            ) : currentWorker.verificationStatus === 'UNDER_REVIEW' ? (
              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={13} />
                <span>{t('Under_Review_by_Society_Admin_kd31m', `Under Review by Society Admin`)}</span>
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>{t('Rejected__0mb4q', `Rejected:`)}{currentWorker.rejectionReason || 'Document mismatch'}</span>
              </span>
            )}

            {/* Email Verification Pill */}
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className={`font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all border ${
                currentWorker.emailVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
              title={t('Click_to_manage_email_notices__lr09m', `Click to manage email notices (Optional)`)}
            >
              <Mail size={12} />
              <span>
                {currentWorker.emailVerified
                  ? `✓ ${currentWorker.email || 'Email Verified'}`
                  : currentWorker.email
                  ? `Verify ${currentWorker.email}`
                  : '+ Add Email (Optional)'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setShowTrustModal(true)}
              className="flex items-center gap-1 text-blue-700 hover:underline cursor-pointer"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>{t('Trust_Score__zwnl7', `Trust Score:`)}<strong>{currentWorker.trustScore}{t('_100_znbc2', `/100`)}</strong> {t('_Explain__ym1dr', `(Explain)`)}</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">{t('Reliability__hwpth', `Reliability:`)}<strong>{currentWorker.reliabilityScore}%</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">{t('Jobs__k5ave', `Jobs:`)}<strong>{currentWorker.completedJobs}</strong></span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs for Worker Dashboard */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200/80 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center gap-1.5">
          <button
            id="tab-worker-dashboard"
            onClick={() => setPortalTab('DASHBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              portalTab === 'DASHBOARD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Radio size={14} className={portalTab === 'DASHBOARD' ? 'text-white' : 'text-blue-600'} />
            <span>Live Radar & Active Jobs</span>
          </button>
          <button
            id="tab-worker-order-card"
            onClick={() => setPortalTab('ORDER_CARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              portalTab === 'ORDER_CARD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <ClipboardList size={14} className={portalTab === 'ORDER_CARD' ? 'text-white' : 'text-amber-600'} />
            <span>Order Card</span>
            {myBooking && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
          <button
            id="tab-worker-income-history"
            onClick={() => setPortalTab('INCOME_HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              portalTab === 'INCOME_HISTORY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Wallet size={14} className={portalTab === 'INCOME_HISTORY' ? 'text-white' : 'text-emerald-600'} />
            <span>Income History</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 px-3 hidden md:flex items-center gap-1.5 font-medium">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Indore Cooperative Trade Verification</span>
        </div>
      </div>

      {/* DASHBOARD TAB VIEW */}
      {portalTab === 'DASHBOARD' && (
        <>
          {/* Active Work Order / Job Dispatch Card */}
      {myBooking ? (
        <section className="bg-white rounded-2xl border-2 border-blue-600 p-4 sm:p-6 shadow-md space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                {myBooking.status.replace(/_/g, ' ')}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {t('Job_Dispatch__6r0md', `Job Dispatch:`)}{myBooking.serviceName} ({myBooking.id})
              </h2>
            </div>

            {/* Map / Dispatch Layout Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setWorkerMapTab('SPLIT')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  workerMapTab === 'SPLIT' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('Side_by_side_job_actions___liv_slw5a', `Side-by-side job actions & live GPS map`)}
              >
                {t('__Split_View_gi9d0', `⚡ Split View`)}</button>
              <button
                onClick={() => setWorkerMapTab('MAP_ONLY')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  workerMapTab === 'MAP_ONLY' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('Full_navigation_map_r76he', `Full navigation map`)}
              >
                {t('____Full_Map_tjaqr', `🗺️ Full Map`)}</button>
              <button
                onClick={() => setWorkerMapTab('DETAILS_ONLY')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  workerMapTab === 'DETAILS_ONLY' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('Order_details_only_578pb', `Order details only`)}
              >
                {t('___Order_Card_3330b', `📋 Order Card`)}</button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500">{t('Your_Share___i6g4a', `Your Share (`)}{policy.activeModel === 'MODEL_A' ? '94.5%' : '95.0%'})</span>
              <div className="text-lg font-black text-emerald-700">
                ₹{myBooking.pricing.workerShare}
              </div>
            </div>
          </div>

          {/* Customer Location & Contact Quick Summary Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-800">{t('Customer__c5lp7', `Customer:`)}{myBooking.customerName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">
                {t('___q2vjg', `📍`)}{myBooking.customerAddress.address}, {myBooking.customerAddress.city}
                {myBooking.customerAddress.landmark && ` (Near ${myBooking.customerAddress.landmark})`}
              </span>
            </div>
            <a
              href={`tel:${myBooking.customerPhone}`}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
            >
              <PhoneCall size={12} />
              <span>{t('Call___ylmz7', `Call (`)}{myBooking.customerPhone})</span>
            </a>
          </div>

          {/* Active Job Layout Options */}
          {workerMapTab === 'MAP_ONLY' ? (
            <div className="space-y-4">
              <div className="h-[480px] w-full">
                <WorkerJobMap
                  worker={currentWorker}
                  booking={myBooking}
                  allWorkers={workers}
                  onSimulateStep={simulateWorkerStep}
                  onWorkerArrived={workerArrived}
                  onStartJourney={startJourney}
                />
              </div>
              <div>{renderBookingStateCards()}</div>
            </div>
          ) : workerMapTab === 'SPLIT' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4">
                {renderBookingStateCards()}
              </div>
              <div className="lg:col-span-7 h-[480px] lg:sticky lg:top-4">
                <WorkerJobMap
                  worker={currentWorker}
                  booking={myBooking}
                  allWorkers={workers}
                  onSimulateStep={simulateWorkerStep}
                  onWorkerArrived={workerArrived}
                  onStartJourney={startJourney}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {renderBookingStateCards()}
            </div>
          )}
        </section>
      ) : (
        /* Standby / Idle Area Coverage & Duty Radar Map Section */
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Radio size={20} className={currentWorker.availability ? 'text-blue-600 animate-pulse' : 'text-slate-400'} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span>{t('Worker_Duty_Radar___Live_Indor_b66vw', `Worker Duty Radar & Live Indore Area Coverage`)}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentWorker.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentWorker.availability ? 'ONLINE & READY FOR JOBS' : 'OFFLINE'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Visualizing_your_live_GPS_loca_c5c2u', `Visualizing your live GPS location in Indore, service coverage perimeter, high-demand job hubs & fellow cooperative artisans.`)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleWorkerAvailability(currentWorker.id)}
                disabled={currentWorker.verificationStatus !== 'VERIFIED'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentWorker.availability
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {currentWorker.availability ? 'Pause / Go Offline' : 'Activate Live Duty'}
              </button>
            </div>
          </div>

          <div className="h-[430px] w-full">
            <WorkerJobMap
              worker={currentWorker}
              allWorkers={workers}
            />
          </div>
        </section>
      )}

      {/* Worker Financials & Welfare Fund Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 dashboard-card" data-dashboard-card="true">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">{t('Today_apos_s_Earnings__94_5___san2c', `Today&apos;s Earnings (94.5%)`)}</div>
          <div className="text-2xl font-black text-slate-900">₹{currentWorker.earnings?.today ?? 0}</div>
          <div className="text-[11px] text-emerald-600 font-medium">{t('Direct_UPI_settlement_8sawh', `Direct UPI settlement`)}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">{t('This_Month_apos_s_Earnings_w8f2v', `This Month&apos;s Earnings`)}</div>
          <div className="text-2xl font-black text-slate-900">₹{currentWorker.earnings?.thisMonth ?? 0}</div>
          <div className="text-[11px] text-slate-500">{t('Lifetime____agmrd', `Lifetime: ₹`)}{currentWorker.earnings?.total ?? 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Building2 size={13} className="text-blue-600" />
            <span>{t('Labour_Welfare_Fund__2___y6z70', `Labour Welfare Fund (2%)`)}</span>
          </div>
          <div className="text-2xl font-black text-blue-700">₹{currentWorker.welfareBalance ?? 0}</div>
          <div className="text-[11px] text-slate-500">{t('MP_Social_Security_Fund__MPSLW_mm1dq', `MP Social Security Fund (MPSLWB)`)}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1 flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">{t('Penalty_Status_kcaby', `Penalty Status`)}</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {currentWorker.penaltyStatus === 'NONE' ? (
                <span className="text-emerald-700">{t('Zero_Penalties_Active_6oi9k', `Zero Penalties Active`)}</span>
              ) : (
                <span className="text-rose-600">{currentWorker.penaltyStatus}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsAppealModalOpen(true)}
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors text-center"
          >
            {t('Submit_Penalty_Appeal_eb83w', `Submit Penalty Appeal`)}</button>
        </div>
      </section>

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
          // Update in-memory worker profile if available
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
        </>
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
