import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Sparkles, XCircle, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface EmailVerificationWidgetProps {
  initialEmail?: string;
  isVerified?: boolean;
  role: UserRole;
  entityId?: string;
  entityName?: string;
  onVerificationSuccess?: (email: string) => void;
  onUnlink?: () => void;
  compact?: boolean;
  showBenefits?: boolean;
  customClassName?: string;
}

const ROLE_BENEFITS: Record<UserRole, { title: string; desc: string; tag: string }> = {
  CUSTOMER: {
    title: 'Digital Invoices & Service Receipts',
    desc: 'Receive GST-compliant digital tax invoices, booking confirmations, and arrival notifications directly in your inbox.',
    tag: 'Citizen Benefit',
  },
  WORKER: {
    title: 'Wage Slips & Welfare Statements',
    desc: 'Receive automated weekly payout slips, MPSLWB welfare fund contribution records, and annual cooperative dividend summaries.',
    tag: 'Craftsman Benefit',
  },
  SOCIETY_ADMIN: {
    title: 'Daily Dispatch Sheets & Audit Digests',
    desc: 'Receive daily labour dispatch registers, artisan verification alerts, and registrar statutory compliance reports.',
    tag: 'Registrar Benefit',
  },
  FEDERATION_ADMIN: {
    title: 'Apex State Circulars & KPI Reports',
    desc: 'Receive inter-district price ceiling notifications, state grievance escalations, and executive operational summaries.',
    tag: 'Command Clearance',
  },
  SUPER_ADMIN: {
    title: 'National Sovereign Briefs & Audit Logs',
    desc: 'Receive central statutory audit clearances, ministerial policy circulars, and national mission performance digests.',
    tag: 'Apex Clearance',
  },
};

export const EmailVerificationWidget: React.FC<EmailVerificationWidgetProps> = ({
  initialEmail = '',
  isVerified = false,
  role,
  entityId,
  entityName,
  onVerificationSuccess,
  onUnlink,
  compact = false,
  showBenefits = true,
  customClassName = '',
}) => {
  const { sendEmailVerificationOtp, verifyEmailOtp, unlinkEmail } = useAuth();

  const [emailInput, setEmailInput] = useState<string>(initialEmail);
  const [otpInput, setOtpInput] = useState<string>('');
  const [step, setStep] = useState<'IDLE' | 'OTP_SENT' | 'VERIFIED'>(isVerified ? 'VERIFIED' : 'IDLE');
  const [activeVerifiedEmail, setActiveVerifiedEmail] = useState<string>(initialEmail);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const roleMeta = ROLE_BENEFITS[role] || ROLE_BENEFITS.CUSTOMER;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await sendEmailVerificationOtp(emailInput, role, entityId, entityName);
      if (res.success) {
        setStep('OTP_SENT');
        setSimulatedOtp(res.otp || '742918');
        setSuccessMessage(res.message);
        setCountdown(60);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyEmailOtp(emailInput, otpInput.trim(), role, entityId);
      if (res.success) {
        setStep('VERIFIED');
        setActiveVerifiedEmail(emailInput);
        setSuccessMessage('✓ Email address successfully verified and linked!');
        if (onVerificationSuccess) {
          onVerificationSuccess(emailInput);
        }
      } else {
        setErrorMessage(res.message || 'Invalid verification code');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (confirm('Unlink this verified email address from your cooperative profile?')) {
      setIsLoading(true);
      try {
        if (entityId) {
          await unlinkEmail(role, entityId);
        }
        setStep('IDLE');
        setActiveVerifiedEmail('');
        setEmailInput('');
        setOtpInput('');
        setSimulatedOtp(null);
        setSuccessMessage('Email unlinked.');
        if (onUnlink) onUnlink();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        step === 'VERIFIED'
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-slate-50/90 border-slate-200 text-slate-900'
      } ${compact ? 'p-3 sm:p-4 text-xs' : 'p-4 sm:p-5'} ${customClassName}`}
    >
      {/* Header & Optional Tag */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              step === 'VERIFIED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {step === 'VERIFIED' ? <ShieldCheck size={18} /> : <Mail size={16} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900">
                {step === 'VERIFIED' ? 'Verified Email Address' : 'Email Address'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                {t('Optional_ne08g', `Optional`)}</span>
              {step === 'VERIFIED' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {t('Verified_waub6', `Verified`)}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {step === 'VERIFIED'
                ? 'Linked to your cooperative identity for secure digital notices'
                : 'Add an optional email for digital wage slips, invoices & statutory circulars'}
            </p>
          </div>
        </div>

        {step === 'VERIFIED' && (
          <button
            type="button"
            onClick={() => setStep('IDLE')}
            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0"
          >
            {t('Change_tx9jd', `Change`)}</button>
        )}
      </div>

      {/* Role Benefits Callout (if showBenefits is true and not verified) */}
      {showBenefits && step !== 'VERIFIED' && !compact && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-2 text-xs">
          <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-blue-900">{roleMeta.title} ({roleMeta.tag})</span>
            <p className="text-blue-800/80 text-[11px] leading-relaxed">{roleMeta.desc}</p>
          </div>
        </div>
      )}

      {/* State 1: IDLE - Email Input & Send OTP Button */}
      {step === 'IDLE' && (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendOtp();
                  }
                }}
                placeholder={t('e_g__name_example_com__Optiona_f1aj9', `e.g. name@example.com (Optional)`)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSendOtp()}
              disabled={isLoading || !emailInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{t('Sending_Code____e0wa3', `Sending Code...`)}</span>
                </>
              ) : (
                <>
                  <span>{t('Verify_Email__Optional__fnse9', `Verify Email (Optional)`)}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            {t('Email_verification_is_complete_np45r', `Email verification is completely optional. You can skip this step at any time or verify later in your profile.`)}</p>
        </div>
      )}

      {/* State 2: OTP_SENT - Enter 6-digit Code */}
      {step === 'OTP_SENT' && (
        <div className="space-y-3 bg-white p-3.5 rounded-xl border border-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-700 font-medium">
              {t('Enter_6_digit_verification_cod_griai', `Enter 6-digit verification code sent to`)}<strong className="text-slate-900">{emailInput}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setStep('IDLE');
                setErrorMessage(null);
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold shrink-0"
            >
              {t('Change_Email_kaeap', `Change Email`)}</button>
          </div>

          {/* Interactive Simulated OTP Helper Pill for quick testing */}
          {simulatedOtp && (
            <div
              onClick={() => {
                setOtpInput(simulatedOtp);
                setErrorMessage(null);
              }}
              className="cursor-pointer p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-900 hover:bg-amber-100 transition-colors"
              title={t('Click_to_automatically_fill_co_kr1qy', `Click to automatically fill code`)}
            >
              <div className="flex items-center gap-1.5 font-mono">
                <Sparkles size={13} className="text-amber-600" />
                <span>{t('Simulated_Demo_Code__dx56n', `Simulated Demo Code:`)}<strong>{simulatedOtp}</strong></span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
                {t('Click_to_Auto_fill_hzp6g', `Click to Auto-fill`)}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value.replace(/\D/g, ''));
                setErrorMessage(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleVerifyOtp();
                }
              }}
              placeholder={t('Enter_6_digit_OTP__e_g__742918_1ohdz', `Enter 6-digit OTP (e.g. 742918)`)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm tracking-widest font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otpInput.length < 4}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{t('Verifying____rzhr9', `Verifying...`)}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>{t('Confirm___Link_edp4b', `Confirm & Link`)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold shrink-0"
              >
                {t('Resend_x19kn', `Resend`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: VERIFIED - Display Active Verified Email */}
      {step === 'VERIFIED' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-3 rounded-xl border border-emerald-200">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs sm:text-sm text-emerald-950">
                {activeVerifiedEmail || emailInput}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {t('100__Verified_wpqo0', `100% Verified`)}</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              {t('Enabled_for_automated_e_invoic_9a9hu', `Enabled for automated e-invoices, notifications, and monthly statements.`)}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUnlink}
              disabled={isLoading}
              className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50"
            >
              {t('Unlink_1kd3i', `Unlink`)}</button>
          </div>
        </div>
      )}

      {/* Error and Success Feedback Messages */}
      {errorMessage && (
        <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && step !== 'VERIFIED' && (
        <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
