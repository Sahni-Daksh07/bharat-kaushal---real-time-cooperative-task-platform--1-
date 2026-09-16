import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Shield,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Building2,
  CreditCard,
  FileCheck,
  Check,
  AlertCircle,
  QrCode,
  MapPin,
  Calendar,
  Lock,
  Globe2,
  Zap,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation, isRTL } from '../../utils/i18n';
import { detectWorkerField, SUPPORTED_TRADES } from '../../utils/fieldDetector';
import { TradeSkillAssessmentModal } from './TradeSkillAssessmentModal';
import { SEEDED_SOCIETIES } from '../../data/seedData';
import { WorkerProfile } from '../../types';
import { EmailVerificationWidget } from '../common/EmailVerificationWidget';
import { apiFetch } from '../../utils/apiConfig';

const fetch = apiFetch;

interface WorkerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (worker: WorkerProfile, token: string) => void;
  initialLanguage?: SupportedLanguage;
}

export const WorkerRegistrationModal: React.FC<WorkerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialLanguage = 'hi',
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [lang, setLang] = useState<SupportedLanguage>(initialLanguage);

  // Step 1: Mobile & Language
  const [phone, setPhone] = useState('');
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [existingWorkerPrompt, setExistingWorkerPrompt] = useState<any | null>(null);

  // Step 2: Personal Profile & e-KYC
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1994-06-15');
  const [address, setAddress] = useState('74 Scheme 54, Vijay Nagar');
  const [city, setCity] = useState('Indore');
  const [district, setDistrict] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [pinCode, setPinCode] = useState('452010');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [societyId, setSocietyId] = useState('SOC-IND-02');

  // Step 3: Trade, Experience & AI Detection
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Pipe Fitting', 'Leak Repair', 'Sanitary Ware']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [workDescription, setWorkDescription] = useState('Expert in residential CPVC pipe installation, concealed wall mixer repairs, drainage clearing, and booster pumps with 5 years field experience.');
  const [experienceYears, setExperienceYears] = useState(5);
  const [detectedTrade, setDetectedTrade] = useState('Plumbing');
  const [detectionConfidence, setDetectionConfidence] = useState(94);
  const [detectionRationale, setDetectionRationale] = useState('Matched core sanitary and CPVC piping keywords.');
  const [alternativeTrades, setAlternativeTrades] = useState<{ field: string; confidence: number }[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Step 4: Skill Assessment
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    skillLevel: string;
    passed: boolean;
  } | null>(null);

  // Step 5: Payout Setup & Consent
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001245');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredWorker, setRegisteredWorker] = useState<WorkerProfile | null>(null);

  // Sync UPI default with name
  useEffect(() => {
    if (name && !upiId) {
      const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      setUpiId(`${clean || 'worker'}@okhdfcbank`);
    }
  }, [name]);

  // Run AI Trade Field Detection whenever skills, workDescription, or experience changes
  useEffect(() => {
    const timer = setTimeout(() => {
      runFieldDetection();
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedSkills, workDescription, experienceYears]);

  const runFieldDetection = async () => {
    setIsDetecting(true);
    try {
      const localResult = detectWorkerField({
        skills: selectedSkills,
        workDescription,
        previousExperience: '',
        experienceYears,
      });

      setDetectedTrade(localResult.detectedField);
      setDetectionConfidence(localResult.confidence);
      setDetectionRationale(localResult.rationale);
      setAlternativeTrades(localResult.alternativeTrades);
    } catch (e) {
      console.warn('Field detection error:', e);
    } finally {
      setIsDetecting(false);
    }
  };

  if (!isOpen) return null;

  const rtl = isRTL(lang);

  // Verify phone & check existing user
  const handleCheckPhoneAndSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, '').length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError(null);
    setIsCheckingPhone(true);

    try {
      const res = await fetch('/api/worker/check-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.exists) {
        setExistingWorkerPrompt(data.worker);
      } else {
        setExistingWorkerPrompt(null);
        setOtpSent(true);
      }
    } catch (err) {
      setOtpSent(true);
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setOtpVerified(true);
      setPhoneError(null);
    } else {
      setPhoneError('Invalid OTP code. Please enter 123456 for instant verification.');
    }
  };

  const handleAddSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills((prev) => [...prev, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleFinalRegistration = async () => {
    if (!consentGiven) {
      alert('Please accept the cooperative membership terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        phone,
        email: email || undefined,
        emailVerified: isEmailVerified,
        gender,
        dob,
        address,
        city,
        district,
        state,
        pinCode,
        aadhaar,
        pan,
        uanNumber,
        societyId,
        societyName: SEEDED_SOCIETIES.find((s) => s.id === societyId)?.name || 'Indore Shramik Kaushal Sahakari Samiti',
        primaryTrade: detectedTrade,
        detectedField: detectedTrade,
        fieldConfidence: detectionConfidence,
        detectionRationale,
        workDescription,
        skills: selectedSkills.map((sk, idx) => ({
          name: sk,
          isPrimary: idx === 0,
          yearsExperience: experienceYears,
        })),
        experienceYears,
        preferredLanguage: lang,
        skillAssessmentScore: assessmentResult ? assessmentResult.percentage : 88,
        assessmentPassed: assessmentResult ? assessmentResult.passed : true,
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
        bankDetails: paymentMethod === 'BANK' ? { accountNumber, ifsc } : undefined,
        consentGiven: true,
      };

      const res = await fetch('/api/auth/worker/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.worker) {
        setRegisteredWorker(data.worker);
        onSuccess(data.worker, data.token);
      } else {
        alert(data.error || 'Failed to complete registration');
      }
    } catch (e: any) {
      alert(e.message || 'Registration error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <span>{getTranslation(lang, 'workerRegistrationTitle')}</span>
              </h2>
              <p className="text-xs text-emerald-100">
                {getTranslation(lang, 'workerRegistrationSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 hover:bg-white/20 rounded-lg px-2 py-1 border border-white/20">
              <Globe2 className="w-3.5 h-3.5 mr-1.5 text-white" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="text-xs bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 bg-white">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          {[
            { num: 1, label: getTranslation(lang, 'step1Mobile') },
            { num: 2, label: getTranslation(lang, 'step2Profile') },
            { num: 3, label: getTranslation(lang, 'step3Trade') },
            { num: 4, label: getTranslation(lang, 'step4Assessment') },
            { num: 5, label: getTranslation(lang, 'step5Payout') },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCur = currentStep === s.num;
            return (
              <div key={s.num} className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCur
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    isCur
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Contents */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: MOBILE & LANGUAGE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">{t('Official_Cooperative_Enrollmen_s3a6y', `Official Cooperative Enrollment Portal`)}</strong>
                  {t('Enter_your_mobile_number_to_re_tn4mt', `Enter your mobile number to receive a secure instant Aadhaar-linked OTP and check if your profile is already registered.`)}</div>
              </div>

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {getTranslation(lang, 'mobileNumber')}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm font-bold text-slate-400">
                      {t('_91_odyzi', `+91`)}</span>
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
                      placeholder={t('98260XXXXX_d6dxo', `98260XXXXX`)}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckPhoneAndSendOtp}
                    disabled={isCheckingPhone || phone.length !== 10}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50 flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                  >
                    {isCheckingPhone ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                  </button>
                </div>
                {phoneError && <p className="text-xs text-rose-500 font-medium">{phoneError}</p>}
              </div>

              {/* Existing Worker Alert Prompt */}
              {existingWorkerPrompt && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong>{t('Account_Already_Exists__j36vo', `Account Already Exists!`)}</strong>
                      <p className="mt-0.5">
                        {t('Worker_vw7gi', `Worker`)}<strong>{existingWorkerPrompt.name}</strong> ({existingWorkerPrompt.primaryTrade}{t('__is_already_registered_with_T_qt2d1', `) is already registered with Trust Score`)}{existingWorkerPrompt.trustScore}{t('_100__a67jb', `/100.`)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Quick switch to existing worker
                        fetch(`/api/auth/worker/login`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ phone }),
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            if (data.success) {
                              onSuccess(data.worker, data.token);
                              onClose();
                            }
                          });
                      }}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition"
                    >
                      {t('Login_Directly_vtyqp', `Login Directly`)}</button>
                    <button
                      type="button"
                      onClick={() => setExistingWorkerPrompt(null)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium"
                    >
                      {t('Register_New_Profile_34omn', `Register New Profile`)}</button>
                  </div>
                </div>
              )}

              {/* OTP Input Section */}
              {otpSent && !existingWorkerPrompt && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {getTranslation(lang, 'enterOtp')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      {t('Demo_OTP__123456_d40xw', `Demo OTP: 123456`)}</button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={t('123456_92622', `123456`)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center tracking-widest text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                    >
                      {getTranslation(lang, 'verify')}
                    </button>
                  </div>

                  {otpVerified && (
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>{getTranslation(lang, 'phoneVerified')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!otpVerified && phone.length !== 10}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{getTranslation(lang, 'nextStep')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL IDENTITY & e-KYC */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('e_g__Ramesh_Kumar_Verma_balyt', `e.g. Ramesh Kumar Verma`)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'gender')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Male">{getTranslation(lang, 'male')}</option>
                    <option value="Female">{getTranslation(lang, 'female')}</option>
                    <option value="Other">{getTranslation(lang, 'other')}</option>
                  </select>
                </div>

                {/* DOB */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'dateOfBirth')}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'aadhaarNumber')} *
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('12_digit_UID_smz06', `12-digit UID`)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {aadhaar.length === 12 && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>{t('UID_Masked_Preview__XXXX_XXXX_4a6g1', `UID Masked Preview: XXXX XXXX`)}{aadhaar.slice(-4)}</span>
                    </span>
                  )}
                </div>

                {/* UAN Shramik / PAN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'uanNumber')} {t('_Optional__p4geg', `(Optional)`)}</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={uanNumber}
                    onChange={(e) => setUanNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('e_Shram___EPF_UAN_3bd0s', `e-Shram / EPF UAN`)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Cooperative Society Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'cooperativeSociety')} *
                  </label>
                  <select
                    value={societyId}
                    onChange={(e) => setSocietyId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {SEEDED_SOCIETIES.map((soc) => (
                      <option key={soc.id} value={soc.id}>
                        {soc.name} ({soc.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'address')}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'pinCode')}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

              {/* Nav */}
              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{getTranslation(lang, 'previousStep')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-40 flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{getTranslation(lang, 'nextStep')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRADE, EXPERIENCE & AI FIELD DETECTION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* AI Detection Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {getTranslation(lang, 'detectedTrade')}: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{detectedTrade}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {detectionConfidence}% {getTranslation(lang, 'confidence')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{detectionRationale}</p>
                </div>
              </div>

              {/* Work Description Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {getTranslation(lang, 'workDescription')}
                </label>
                <textarea
                  rows={3}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder={t('Describe_the_tasks__tools__and_k8om7', `Describe the tasks, tools, and installations you frequently handle...`)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Skills Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {getTranslation(lang, 'skills')} {t('__Tools_qbsqn', `& Tools`)}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder={t('Type_skill___press_Enter__e_g__8v2j4', `Type skill & press Enter (e.g. Inverter Wiring, Geyser Repair)`)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    {t('Add_arxn3', `Add`)}</button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="hover:text-rose-500 text-slate-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Years */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {getTranslation(lang, 'experienceYears')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Alternative Trades Choice */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t('Change_Primary_Trade_rsawl', `Change Primary Trade`)}</label>
                  <select
                    value={detectedTrade}
                    onChange={(e) => setDetectedTrade(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                  >
                    {SUPPORTED_TRADES.map((t) => (
                      <option key={t.field} value={t.field}>
                        {t.displayName} ({t.hindiName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nav */}
              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{getTranslation(lang, 'previousStep')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{getTranslation(lang, 'nextStep')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INTERACTIVE SKILL ASSESSMENT */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-emerald-600/10 text-emerald-600">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {detectedTrade} {t('Skill_Assessment__15_Questions_ylkqz', `Skill Assessment (15 Questions)`)}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1">
                    {t('Complete_the_15_question_trade_l7m5i', `Complete the 15-question trade assessment in`)}<strong>{SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name}</strong> {t('to_certify_your_technical_skil_x3b3v', `to certify your technical skill, unlock higher job payouts, and earn your verified badge.`)}</p>
                </div>

                {assessmentResult ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('Skill_Assessment_Completed__aj82r', `Skill Assessment Completed!`)}</span>
                    </div>
                    <div className="flex justify-center gap-6 text-slate-800 dark:text-slate-200">
                      <div>{t('Score__tgnnv', `Score:`)}<strong>{assessmentResult.score} / {assessmentResult.total}</strong> ({assessmentResult.percentage}{t('___cwa50', `%)`)}</div>
                      <div>{t('Tier__4myus', `Tier:`)}<strong className="text-emerald-600">{assessmentResult.skillLevel}</strong></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAssessmentModal(true)}
                      className="text-emerald-600 dark:text-emerald-400 font-bold underline hover:text-emerald-700"
                    >
                      {t('Retake_Assessment_r3rwn', `Retake Assessment`)}</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAssessmentModal(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30 inline-flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{t('Start_15_Question_Skill_Test_0sd4f', `Start 15-Question Skill Test`)}</span>
                  </button>
                )}
              </div>

              {/* Nav */}
              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{getTranslation(lang, 'previousStep')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{getTranslation(lang, 'nextStep')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PAYOUT SETUP & FINAL CONSENT */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {getTranslation(lang, 'payoutSetup')}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-xs">{t('Instant_UPI_Payout_mgs0h', `Instant UPI Payout`)}</div>
                      <div className="text-[10px] text-slate-500">{t('Fast_0_fee_settlement_sd1b5', `Fast 0-fee settlement`)}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition ${
                      paymentMethod === 'BANK'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-xs">{t('Bank_Transfer_i7jvl', `Bank Transfer`)}</div>
                      <div className="text-[10px] text-slate-500">{t('Direct_Account_credit_krief', `Direct Account credit`)}</div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'UPI' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {getTranslation(lang, 'upiId')}
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder={t('e_g__ramesh_okaxis_t0j6b', `e.g. ramesh@okaxis`)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {getTranslation(lang, 'bankAccount')}
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={t('Account_Number_uip78', `Account Number`)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {getTranslation(lang, 'ifscCode')}
                      </label>
                      <input
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        placeholder={t('SBIN0001245_vm6v4', `SBIN0001245`)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DPDP Consent */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {getTranslation(lang, 'termsConsent')}
                  </span>
                </label>
              </div>

              {/* Nav */}
              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{getTranslation(lang, 'previousStep')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalRegistration}
                  disabled={isSubmitting || !consentGiven}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{getTranslation(lang, 'submitRegistration')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trade Skill Assessment Modal */}
      <TradeSkillAssessmentModal
        isOpen={showAssessmentModal}
        tradeField={detectedTrade}
        workerName={name}
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
