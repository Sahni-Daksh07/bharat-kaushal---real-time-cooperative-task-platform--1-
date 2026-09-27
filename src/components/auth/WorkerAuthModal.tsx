import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  ShieldCheck,
  Award,
  Phone,
  ArrowRight,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Building2,
  Wallet,
  Sparkles,
  IdCard,
  UserPlus,
  Search,
  Check,
  FileCheck,
  User,
  CreditCard,
  GraduationCap,
  RefreshCw,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { WorkerProfile } from '../../types';
import { SEEDED_SOCIETIES } from '../../data/seedData';
import { EmailVerificationWidget } from '../common/EmailVerificationWidget';
import { TradeSkillAssessmentModal } from '../worker/TradeSkillAssessmentModal';
import { SupportedLanguage, getTranslation, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { detectWorkerField, SUPPORTED_TRADES } from '../../utils/fieldDetector';
import { apiFetch } from '../../utils/apiConfig';

const fetch = apiFetch;

interface WorkerAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'DEMO' | 'REGISTER';
  onClose: () => void;
  onOpenRegistration?: () => void;
  onSuccess?: () => void;
}

export const WorkerAuthModal: React.FC<WorkerAuthModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  onOpenRegistration,
  onSuccess,
}) => {
  const {
    workerUser,
    isWorkerAuthenticated,
    loginWorker,
    registerWorker,
    logoutWorker,
    switchWorker,
    availableAccounts,
  } = useAuth();
  const { setCurrentWorkerId, currentWorker } = useRealtime();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'DEMO' | 'REGISTER'>(initialTab || 'LOGIN');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Form states - Login (strictly empty initial values without hardcoded prefill)
  const [workerIdOrPhone, setWorkerIdOrPhone] = useState('');
  const [tradePin, setTradePin] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search in DEMO tab
  const [searchQuery, setSearchQuery] = useState('');

  // Form states - Multi-Step Craftsman Registration
  const [regStep, setRegStep] = useState(1);
  const [lang, setLang] = useState<SupportedLanguage>('hi');

  // Step 1: Mobile & Language
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [existingWorkerPrompt, setExistingWorkerPrompt] = useState<{ id: string; name: string; primaryTrade: string; trustScore: number } | null>(null);

  // Step 2: Personal Profile & e-KYC
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1994-06-15');
  const [aadhaar, setAadhaar] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [societyId, setSocietyId] = useState('SOC-IND-02');
  const [address, setAddress] = useState('Indore, Madhya Pradesh');
  const [pinCode, setPinCode] = useState('452001');
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Step 3: Trade, Experience & AI Field Detection
  const [workDescription, setWorkDescription] = useState('Residential and commercial plumbing, pipe repairs, bathroom fitting, sanitary installations, water tank cleaning');
  const [experienceYears, setExperienceYears] = useState(4);
  const [detectedTrade, setDetectedTrade] = useState('Plumbing');
  const [detectionConfidence, setDetectionConfidence] = useState(94);
  const [detectionRationale, setDetectionRationale] = useState('Detected based on pipe repair and sanitary keywords');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Pipe Fitting',
    'Leakage Repair',
    'Sanitary Installation',
    'Water Tank Cleaning',
  ]);

  // Step 4: Interactive Skill Assessment
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    skillLevel: string;
    passed?: boolean;
    tradeField?: string;
  } | null>(null);

  // Step 5: Direct Payout Setup & Consent
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001245');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-run AI field detection when work description changes
  useEffect(() => {
    if (workDescription.trim().length > 8) {
      const detection = detectWorkerField({
        workDescription,
        skills: selectedSkills,
        experienceYears,
      });
      setDetectedTrade(detection.detectedField);
      setDetectionConfidence(detection.confidence);
      setDetectionRationale(detection.rationale);
    }
  }, [workDescription, experienceYears]);

  if (!isOpen) return null;

  const handleWorkerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const isId = workerIdOrPhone.toUpperCase().startsWith('BH-');
    const params = isId ? { workerId: workerIdOrPhone.trim() } : { phone: workerIdOrPhone.trim() };

    const res = await loginWorker(params);
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Worker successfully authenticated!' });
      const matched = availableAccounts.workers.find(
        (w) => (isId && w.id === workerIdOrPhone) || (!isId && w.phone === workerIdOrPhone)
      );
      if (matched) {
        setCurrentWorkerId(matched.id);
      }
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Worker verification failed' });
    }
  };

  const handleSelectWorker = (worker: WorkerProfile) => {
    const safeWorker: WorkerProfile = {
      ...worker,
      earnings: worker.earnings || { today: 0, thisWeek: 0, thisMonth: 16200, total: 45000 },
      welfareBalance: worker.welfareBalance ?? 1800,
      trustScore: worker.trustScore ?? 86,
      trustBreakdown: worker.trustBreakdown || {
        identityScore: 20,
        societyScore: 15,
        skillScore: 18,
        experienceScore: 8,
        performanceScore: 5,
        ratingScore: 10,
        reliabilityScore: 10,
        total: worker.trustScore || 86,
        notes: ['Verified cooperative credentials'],
      },
    };
    switchWorker(safeWorker);
    setCurrentWorkerId(safeWorker.id);
    setFeedback({ type: 'success', message: `Craftsman session activated: ${safeWorker.name} (${safeWorker.primaryTrade})` });
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 500);
  };

  // Step 1: Mobile check & OTP handlers
  const handleCheckPhoneAndSendOtp = async () => {
    if (phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError(null);
    setIsCheckingPhone(true);

    try {
      const res = await fetch(`/api/worker/check-mobile?phone=${phone}`);
      const data = await res.json();
      if (data.exists && data.worker) {
        setExistingWorkerPrompt({
          id: data.worker.id,
          name: data.worker.name,
          primaryTrade: data.worker.primaryTrade,
          trustScore: data.worker.trustScore || 85,
        });
      } else {
        setExistingWorkerPrompt(null);
        setOtpSent(true);
        setOtp('123456'); // Pre-fill demo OTP
      }
    } catch {
      setOtpSent(true);
      setOtp('123456');
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setOtpVerified(true);
      setPhoneError(null);
    } else {
      setPhoneError('Invalid OTP. Use demo OTP 123456');
    }
  };

  const handleAddSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== sk));
  };

  // Final Registration submission
  const handleFinalCraftsmanRegistration = async () => {
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Craftsman full name is required.' });
      setRegStep(2);
      return;
    }
    if (!consentGiven) {
      setFeedback({ type: 'error', message: 'Please accept cooperative membership terms and DPDP consent.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const soc = SEEDED_SOCIETIES.find((s) => s.id === societyId);
    const finalScore = assessmentResult?.percentage || 88;
    const finalLevel: 'Expert' | 'Advanced' | 'Intermediate' =
      (assessmentResult?.skillLevel as any) ||
      (finalScore >= 90 ? 'Expert' : finalScore >= 70 ? 'Advanced' : 'Intermediate');

    try {
      const res = await registerWorker({
        name: name.trim(),
        phone: phone.trim() || '9826011223',
        email: email.trim() || undefined,
        emailVerified: isEmailVerified,
        gender: (gender as any) || 'Male',
        dob,
        primaryTrade: detectedTrade,
        experienceYears: Number(experienceYears) || 3,
        societyId: societyId || 'SOC-IND-02',
        societyName: soc?.name || 'Indore Shramik Kaushal Sahakari Samiti',
        address: address.trim() || 'Indore, Madhya Pradesh',
        city: 'Indore',
        district: 'Indore',
        pinCode: pinCode.trim() || '452001',
        aadhaar: aadhaar.trim() || undefined,
        maskedAadhaar: aadhaar.length >= 4 ? `XXXX XXXX ${aadhaar.slice(-4)}` : 'XXXX XXXX 8912',
        maskedPan: uanNumber ? `UAN-${uanNumber.slice(-4)}` : undefined,
        skillAssessmentScore: finalScore,
        skillLevel: finalLevel,
        skills: selectedSkills.map((sk, idx) => ({
          name: sk,
          isPrimary: idx === 0,
          yearsExperience: experienceYears,
        })),
        upiId: paymentMethod === 'UPI' ? (upiId.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@upi`) : undefined,
      });

      setIsSubmitting(false);

      if (res.success && res.worker) {
        setCurrentWorkerId(res.worker.id);
        setFeedback({
          type: 'success',
          message: `Craftsman successfully registered & certified! Welcome ${res.worker.name} (${res.worker.id}) - Skill Level: ${finalLevel}`,
        });
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Registration failed. Please verify details.',
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        message: err?.message || 'Error occurred while submitting registration.',
      });
    }
  };

  const filteredWorkers = availableAccounts.workers.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.primaryTrade.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      (w.societyName && w.societyName.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="worker-auth-modal"
      className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 max-w-2xl w-full overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Wrench className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                {t('MP_State_Cooperative_Federatio_x3sh4', `MP State Cooperative Federation`)}</div>
              <h2 className="text-lg font-bold">{t('Verified_Craftsman_Authenticat_lbsg1', `Verified Craftsman Authentication`)}</h2>
            </div>
          </div>
          <button
            id="close-worker-auth-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Authenticated Status Bar */}
        <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200/70 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isWorkerAuthenticated ? 'bg-amber-600 ring-4 ring-amber-100' : 'bg-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                {isWorkerAuthenticated ? workerUser?.name : 'Worker Session Inactive'}
                {isWorkerAuthenticated && (
                  <>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-medium">
                      {workerUser?.primaryTrade}
                    </span>
                    {workerUser?.email && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${workerUser.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {workerUser.emailVerified ? '✓ Email Verified' : 'Email Unverified'}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-600">
                {isWorkerAuthenticated
                  ? `${workerUser?.societyName || 'Cooperative Society'} • ${workerUser?.email || 'No email registered'} • Trust: ${workerUser?.trustScore || 85}/100 • Welfare: ₹${workerUser?.welfareBalance ?? 0}`
                  : 'Enter Worker ID / PIN, select a craftsman, or register new craftsman'}
              </div>
            </div>
          </div>
          {isWorkerAuthenticated && (
            <button
              id="worker-logout-btn"
              onClick={logoutWorker}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 border border-rose-200 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('Sign_Out_wkrdk', `Sign Out`)}</button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5 gap-1 text-xs font-medium">
          <button
            id="wkr-tab-login"
            onClick={() => { setActiveTab('LOGIN'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-white text-amber-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Worker_Login___PIN_sl93f', `Worker Login / PIN`)}</button>
          <button
            id="wkr-tab-demo"
            onClick={() => { setActiveTab('DEMO'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-all ${
              activeTab === 'DEMO'
                ? 'bg-white text-amber-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Switch_Active_Craftsman___m3bbo', `Switch Active Craftsman (`)}{availableAccounts.workers.length})
          </button>
          <button
            id="wkr-tab-register"
            onClick={() => { setActiveTab('REGISTER'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'REGISTER'
                ? 'bg-white text-amber-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('Register_New_Craftsman_x2nzz', `Register New Craftsman`)}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1">{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: WORKER CREDENTIAL LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleWorkerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Worker_ID__e_Shram_UAN__or_Reg_npa91', `Worker ID, e-Shram UAN, or Registered Mobile`)}</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={workerIdOrPhone}
                    onChange={(e) => setWorkerIdOrPhone(e.target.value)}
                    placeholder={t('e_g__BH_KAUSHAL_WKR_000124_or__xfz4v', `e.g. BH-KAUSHAL-WKR-000124 or 9826198765`)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Demo_IDs__u7d4q', `Demo IDs:`)}<span className="font-mono text-amber-700 font-medium">{t('BH_KAUSHAL_WKR_000124_yjltq', `BH-KAUSHAL-WKR-000124`)}</span> {t('_Ramesh_Verma__or_p9tce', `(Ramesh Verma) or`)}<span className="font-mono text-amber-700 font-medium">{t('BH_KAUSHAL_WKR_000125_kp7xh', `BH-KAUSHAL-WKR-000125`)}</span> {t('_Suresh_Patel__19nrd', `(Suresh Patel)`)}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('4_Digit_Cooperative_Security_P_e9gsq', `4-Digit Cooperative Security PIN`)}</label>
                <input
                  type="password"
                  maxLength={4}
                  value={tradePin}
                  onChange={(e) => setTradePin(e.target.value)}
                  placeholder={t('_____leqkm', `••••`)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-center tracking-widest text-base"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Default_Demo_PIN__qkx0i', `Default Demo PIN:`)}<span className="font-mono font-medium">{t('1234_0xnb5', `1234`)}</span>
                </p>
              </div>

              <button
                type="submit"
                id="wkr-submit-login-btn"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying Cooperative Credentials...' : 'Authenticate as Cooperative Craftsman'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-900">{t('Are_you_a_new_skilled_worker_i_tbqy3', `Are you a new skilled worker in MP?`)}</div>
                  <div className="text-[11px] text-amber-700">{t('Enroll_with_Aadhaar___Trade_Sk_auw1w', `Enroll with Aadhaar & Trade Skill Assessment in 2 mins`)}</div>
                </div>
                <button
                  type="button"
                  id="wkr-open-reg-btn"
                  onClick={() => {
                    setActiveTab('REGISTER');
                    setFeedback(null);
                    onOpenRegistration?.();
                  }}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {t('Register_New_Craftsman_jvzz7', `Register New Craftsman`)}</button>
              </div>
            </form>
          )}

          {/* TAB 2: SWITCH ACTIVE CRAFTSMAN */}
          {activeTab === 'DEMO' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  {t('Switch_instantly_between_verif_dhy0q', `Switch instantly between verified cooperative workers across trades and societies:`)}</p>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search_craftsman_by_name__trad_eiufo', `Search craftsman by name, trade (Plumbing, Electrical...), or ID...`)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5">
                {filteredWorkers.map((w) => {
                  const isCurrent = (workerUser?.id === w.id || currentWorker?.id === w.id) && isWorkerAuthenticated;
                  const monthlyEarnings = w.earnings?.thisMonth ?? (w.completedJobs ? w.completedJobs * 750 : 16200);
                  const societyShortName = (w.societyName || 'Indore Society').split(' ')[0];
                  const initials = (w.name || 'W')
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={w.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500/20'
                          : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs border border-amber-200">
                            {initials}
                          </div>
                          {isCurrent && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center">
                              <Check className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{w.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-semibold">
                              {w.primaryTrade}
                            </span>
                            {w.emailVerified && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                                {t('__Email_xrtur', `✓ Email`)}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px]">{w.id}</span>
                            <span>•</span>
                            <span>{societyShortName}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">₹{monthlyEarnings.toLocaleString('en-IN')}{t('_mo_79990', `/mo`)}</span>
                            <span>•</span>
                            <span className="text-amber-800 font-medium">{t('Trust_ce7ur', `Trust`)}{w.trustScore ?? 85}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectWorker(w)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                          isCurrent
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Select'}
                      </button>
                    </div>
                  );
                })}

                {filteredWorkers.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    {t('No_craftsmen_found_matching__l_v34m7', `No craftsmen found matching &ldquo;`)}{searchQuery}{t('_rdquo___x46x5', `&rdquo;.`)}</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER NEW CRAFTSMAN (COMPREHENSIVE MULTI-STEP WIZARD) */}
          {activeTab === 'REGISTER' && (
            <div className="space-y-4">
              {/* Language Selection Header */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>{getTranslation(lang, 'selectLanguage', 'Select Registration Language')}:</span>
                </div>
                <div className="flex gap-1 overflow-x-auto max-w-[340px]">
                  {SUPPORTED_LANGUAGES.slice(0, 5).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                        lang === l.code
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                {[
                  { num: 1, label: getTranslation(lang, 'step1Mobile', '1. Mobile & OTP') },
                  { num: 2, label: getTranslation(lang, 'step2Profile', '2. e-KYC') },
                  { num: 3, label: getTranslation(lang, 'step3Trade', '3. Trade Skill') },
                  { num: 4, label: getTranslation(lang, 'step4Assessment', '4. 15-Q Test') },
                  { num: 5, label: getTranslation(lang, 'step5Payout', '5. Payout') },
                ].map((s) => {
                  const isDone = regStep > s.num;
                  const isCur = regStep === s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (isDone || (s.num === 2 && (otpVerified || phone.length === 10))) {
                          setRegStep(s.num);
                        }
                      }}
                      className="flex items-center space-x-1.5 focus:outline-none"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                          isDone
                            ? 'bg-amber-600 text-white'
                            : isCur
                            ? 'bg-amber-600 text-white ring-4 ring-amber-500/20'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3" /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] font-medium hidden sm:inline ${
                          isCur ? 'text-amber-800 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* STEP 1: MOBILE & LANGUAGE */}
              {regStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">{t('Official_MP_Cooperative_Crafts_tp9sd', `Official MP Cooperative Craftsman Enrollment`)}</strong>
                      {t('Enter_your_mobile_number_to_re_kjyic', `Enter your mobile number to receive a secure OTP and check for existing cooperative records.`)}</div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {getTranslation(lang, 'mobileNumber', 'Mobile Number (Aadhaar / e-Shram linked)')}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                          {t('_91_6jr4a', `+91`)}</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, ''));
                            setExistingWorkerPrompt(null);
                            setOtpSent(false);
                            setOtpVerified(false);
                          }}
                          placeholder={t('98260XXXXX_yzdmv', `98260XXXXX`)}
                          className="w-full pl-11 pr-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckPhoneAndSendOtp}
                        disabled={isCheckingPhone || phone.length !== 10}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition disabled:opacity-50 flex items-center space-x-1.5 shadow-xs"
                      >
                        {isCheckingPhone ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Phone className="w-3.5 h-3.5" />
                        )}
                        <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                      </button>
                    </div>
                    {phoneError && <p className="text-xs text-rose-500 font-medium">{phoneError}</p>}
                  </div>

                  {/* Existing Craftsman Alert Prompt */}
                  {existingWorkerPrompt && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2.5">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>{t('Existing_Craftsman_Found__g7o34', `Existing Craftsman Found!`)}</strong>
                          <p className="mt-0.5 text-[11px]">
                            {t('Craftsman_cmsxl', `Craftsman`)}<strong>{existingWorkerPrompt.name}</strong> ({existingWorkerPrompt.primaryTrade}{t('__is_already_enrolled_with_Tru_sdsay', `) is already enrolled with Trust Score`)}{existingWorkerPrompt.trustScore}{t('_100__t5vwi', `/100.`)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const found = availableAccounts.workers.find((w) => w.id === existingWorkerPrompt.id || w.phone === phone);
                            if (found) {
                              handleSelectWorker(found);
                            } else {
                              loginWorker({ phone }).then(() => {
                                onSuccess?.();
                                onClose();
                              });
                            }
                          }}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition"
                        >
                          {t('Login_Directly_i4bp8', `Login Directly`)}</button>
                        <button
                          type="button"
                          onClick={() => setExistingWorkerPrompt(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded-lg text-xs font-medium"
                        >
                          {t('Register_New_Profile_tqyul', `Register New Profile`)}</button>
                      </div>
                    </div>
                  )}

                  {/* OTP Input Section */}
                  {otpSent && !existingWorkerPrompt && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-700">
                          {getTranslation(lang, 'enterOtp', 'Enter 6-Digit Verification OTP')}
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtp('123456')}
                          className="text-amber-700 font-bold hover:underline text-[11px]"
                        >
                          {t('Demo_OTP__123456_eynj0', `Demo OTP: 123456`)}</button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder={t('123456_s3y2g', `123456`)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-center tracking-widest text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs"
                        >
                          {getTranslation(lang, 'verify', 'Verify OTP')}
                        </button>
                      </div>

                      {otpVerified && (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('Mobile_verified_successfully__ss1c3', `Mobile verified successfully!`)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      disabled={!otpVerified && phone.length !== 10}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition disabled:opacity-40 flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{getTranslation(lang, 'nextStep', 'Next: e-KYC Identity')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL IDENTITY & e-KYC */}
              {regStep === 2 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'fullName', 'Full Name (as per Aadhaar)')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('e_g__Ramesh_Kumar_Verma_4ai89', `e.g. Ramesh Kumar Verma`)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'gender', 'Gender')}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      >
                        <option value="Male">{getTranslation(lang, 'male', 'Male')}</option>
                        <option value="Female">{getTranslation(lang, 'female', 'Female')}</option>
                        <option value="Other">{getTranslation(lang, 'other', 'Other')}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'dateOfBirth', 'Date of Birth')}
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'aadhaarNumber', 'Aadhaar Number')}
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                        placeholder={t('12_digit_UID_fssry', `12-digit UID`)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      {aadhaar.length === 12 && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>{t('UID_Masked_Preview__XXXX_XXXX_y7jh8', `UID Masked Preview: XXXX XXXX`)}{aadhaar.slice(-4)}</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'uanNumber', 'e-Shram UAN / PAN')} {t('_Optional__ae42q', `(Optional)`)}</label>
                      <input
                        type="text"
                        maxLength={12}
                        value={uanNumber}
                        onChange={(e) => setUanNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={t('e_Shram___EPF_UAN_yu514', `e-Shram / EPF UAN`)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'cooperativeSociety', 'Affiliated MP Society')} *
                      </label>
                      <select
                        value={societyId}
                        onChange={(e) => setSocietyId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                      >
                        {SEEDED_SOCIETIES.map((soc) => (
                          <option key={soc.id} value={soc.id}>
                            {soc.name} ({soc.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'address', 'Residential Address in MP')}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t('e_g__14_Bholaram_Marg__Indore_pawty', `e.g. 14 Bholaram Marg, Indore`)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'pinCode', 'PIN Code')}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Optional Email & Verification Widget */}
                  <div className="pt-1">
                    <EmailVerificationWidget
                      role="WORKER"
                      initialEmail={email}
                      onVerificationSuccess={(verifiedEmail) => {
                        setEmail(verifiedEmail);
                        setIsEmailVerified(true);
                      }}
                      onUnlink={() => {
                        setEmail('');
                        setIsEmailVerified(false);
                      }}
                      compact={false}
                      showBenefits={true}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'previousStep', 'Previous')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      disabled={!name.trim()}
                      className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition disabled:opacity-40 flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{getTranslation(lang, 'nextStep', 'Next: Trade Skill')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TRADE, EXPERIENCE & AI FIELD DETECTION */}
              {regStep === 3 && (
                <div className="space-y-3.5">
                  {/* AI Detection Banner */}
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-bold text-slate-900">
                          {getTranslation(lang, 'detectedTrade', 'AI Detected Trade')}: <span className="text-amber-800 font-extrabold text-sm">{detectedTrade}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                          {detectionConfidence}% {getTranslation(lang, 'confidence', 'Confidence')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 text-[11px]">{detectionRationale}</p>
                    </div>
                  </div>

                  {/* Work Description Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {getTranslation(lang, 'workDescription', 'Work Description & Technical Tools Handled')}
                    </label>
                    <textarea
                      rows={2}
                      value={workDescription}
                      onChange={(e) => setWorkDescription(e.target.value)}
                      placeholder={t('Describe_the_tasks__tools__and_qgzaz', `Describe the tasks, tools, and installations you frequently handle...`)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Skills Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {getTranslation(lang, 'skills', 'Specific Skills')} {t('__Tools_coaoc', `& Tools`)}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        placeholder={t('Type_skill___press_Enter__e_g__v9hsq', `Type skill & press Enter (e.g. Inverter Wiring, Geyser Repair)`)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        {t('Add_zyesn', `Add`)}</button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium"
                        >
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="hover:text-rose-500 text-slate-400 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Years & Primary Trade Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {getTranslation(lang, 'experienceYears', 'Years of Experience')}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t('Primary_Trade_Category_axwh5', `Primary Trade Category`)}</label>
                      <select
                        value={detectedTrade}
                        onChange={(e) => setDetectedTrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold bg-white"
                      >
                        {SUPPORTED_TRADES.map((t) => (
                          <option key={t.field} value={t.field}>
                            {t.displayName} ({t.hindiName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'previousStep', 'Previous')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(4)}
                      className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{getTranslation(lang, 'nextStep', 'Next: Skill Test')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: INTERACTIVE SKILL ASSESSMENT */}
              {regStep === 4 && (
                <div className="space-y-4">
                  <div className="text-center p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="inline-flex p-3 rounded-2xl bg-amber-600/10 text-amber-700">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {detectedTrade} {t('Skill_Assessment__15_Questions_l0u4x', `Skill Assessment (15 Questions)`)}</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                        {t('Take_the_15_question_trade_ass_skivm', `Take the 15-question trade assessment in`)}<strong>{SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name}</strong> {t('to_certify_your_technical_skil_owboy', `to certify your technical skill and calibrate your starting trust score.`)}</p>
                    </div>

                    {assessmentResult ? (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-amber-800 font-bold">
                          <CheckCircle className="w-4 h-4 text-amber-600" />
                          <span>{t('Skill_Assessment_Completed__cudrw', `Skill Assessment Completed!`)}</span>
                        </div>
                        <div className="flex justify-center gap-6 text-slate-800 text-xs">
                          <div>{t('Score__xscms', `Score:`)}<strong>{assessmentResult.score} / {assessmentResult.total}</strong> ({assessmentResult.percentage}{t('___00dx3', `%)`)}</div>
                          <div>{t('Tier__qyu3y', `Tier:`)}<strong className="text-amber-700">{assessmentResult.skillLevel}</strong></div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAssessmentModal(true)}
                          className="text-amber-700 font-bold underline hover:text-amber-800 text-xs"
                        >
                          {t('Retake_15_Question_Test_53cyj', `Retake 15-Question Test`)}</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAssessmentModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs hover:from-amber-700 hover:to-amber-800 transition shadow-xs inline-flex items-center space-x-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{t('Start_15_Question_Skill_Test_8f7fb', `Start 15-Question Skill Test`)}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'previousStep', 'Previous')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(5)}
                      className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{getTranslation(lang, 'nextStep', 'Next: Payout Setup')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYOUT SETUP & STATUTORY CONSENT */}
              {regStep === 5 && (
                <div className="space-y-3.5">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {getTranslation(lang, 'payoutSetup', 'Direct Daily Earnings Payout Setup')}
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                          paymentMethod === 'UPI'
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <div className="font-bold text-xs">{t('Instant_UPI_Payout_8achb', `Instant UPI Payout`)}</div>
                          <div className="text-[10px] text-slate-500">{t('Fast_0_fee_settlement_v69w1', `Fast 0-fee settlement`)}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('BANK')}
                        className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                          paymentMethod === 'BANK'
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <div className="font-bold text-xs">{t('Bank_Transfer_k2nkl', `Bank Transfer`)}</div>
                          <div className="text-[10px] text-slate-500">{t('Direct_account_credit_hevkr', `Direct account credit`)}</div>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'UPI' ? (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                          {getTranslation(lang, 'upiId', 'Direct UPI VPA ID')}
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder={t('e_g__ramesh_okaxis_or_98260112_6oa8w', `e.g. ramesh@okaxis or 9826011223@paytm`)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700">
                            {getTranslation(lang, 'bankAccount', 'Bank Account Number')}
                          </label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder={t('Account_Number_46gxx', `Account Number`)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700">
                            {getTranslation(lang, 'ifscCode', 'IFSC Code')}
                          </label>
                          <input
                            type="text"
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                            placeholder={t('SBIN0001245_6ntld', `SBIN0001245`)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DPDP and Statutory Cooperative Consent */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
                      />
                      <span className="text-[11px] text-slate-600 leading-relaxed">
                        {getTranslation(
                          lang,
                          'termsConsent',
                          'I agree to enroll in the MP Cooperative Society under the MP Cooperative Societies Act 1960. I understand that I receive 94.5% of all job earnings directly, with 2% credited to my worker welfare fund.'
                        )}
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(4)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'previousStep', 'Previous')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalCraftsmanRegistration}
                      disabled={isSubmitting || !consentGiven}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold hover:from-amber-700 hover:to-amber-800 transition disabled:opacity-50 flex items-center space-x-2 shadow-xs"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      <span>{getTranslation(lang, 'submitRegistration', 'Enroll Craftsman & Activate')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            {t('Registered_under_MP_Cooperativ_fnw0z', `Registered under MP Cooperative Societies Act, 1960 • e-Shram & Social Security Integration`)}</p>
        </div>
      </div>

      {/* Trade Skill Assessment Modal */}
      <TradeSkillAssessmentModal
        isOpen={showAssessmentModal}
        tradeField={detectedTrade}
        workerName={name || 'New Craftsman'}
        language={lang}
        onClose={() => setShowAssessmentModal(false)}
        onComplete={(res) => {
          setAssessmentResult(res);
          setShowAssessmentModal(false);
        }}
      />
    </div>
  );
};
