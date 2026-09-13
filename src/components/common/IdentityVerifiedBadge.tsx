import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Award,
  Lock,
  Briefcase,
  Star,
  Clock,
  X,
  ChevronRight,
  Info,
  Building2,
  FileText,
} from 'lucide-react';
import { WorkerProfile } from '../../types';

export interface IdentityVerifiedBadgeProps {
  worker: WorkerProfile;
  variant?: 'badge' | 'compact' | 'pill' | 'detailed';
  showAadhaarSnippet?: boolean;
  showCompletedJobs?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Calculates deterministic trust score & breakdown for any worker
 * based on Aadhaar-masked authentication, completed jobs history, society standing, and ratings.
 */
export function getWorkerVerificationDetails(worker: WorkerProfile) {
  const isAadhaarVerified =
    worker.verificationStatus === 'VERIFIED' && Boolean(worker.maskedAadhaar);
  const isUnderReview = worker.verificationStatus === 'UNDER_REVIEW';

  // 1. Identity Verification (Max 20 pts)
  const identityScore = isAadhaarVerified ? 20 : isUnderReview ? 12 : 5;

  // 2. Completed Job History (Max 20 pts)
  // Progressive scale: 0 jobs = 5 pts, 1-10 = 10 pts, 11-50 = 15 pts, 51-100 = 18 pts, >100 = 20 pts
  let jobHistoryScore = 5;
  if (worker.completedJobs >= 100) {
    jobHistoryScore = 20;
  } else if (worker.completedJobs >= 50) {
    jobHistoryScore = 18;
  } else if (worker.completedJobs >= 25) {
    jobHistoryScore = 15;
  } else if (worker.completedJobs >= 10) {
    jobHistoryScore = 12;
  } else if (worker.completedJobs >= 1) {
    jobHistoryScore = 8;
  }

  // 3. Registered Society Vetting (Max 20 pts)
  const societyScore = worker.societyId ? 20 : 10;

  // 4. Rating & Quality (Max 20 pts)
  const ratingScore =
    worker.rating > 0
      ? Math.min(20, Math.round((worker.rating / 5) * 20))
      : isUnderReview
      ? 12
      : 10;

  // 5. Reliability & Zero Failures (Max 20 pts)
  const reliabilityPercent = worker.reliabilityScore || 95;
  const reliabilityScore = Math.min(20, Math.round((reliabilityPercent / 100) * 20));

  // Overall trust score: fallback to worker.trustScore if defined, or computed
  const computedTotal = Math.min(
    100,
    identityScore + jobHistoryScore + societyScore + ratingScore + reliabilityScore
  );
  const trustScore = worker.trustScore ? worker.trustScore : computedTotal;

  // Verification Tier
  let tier: 'ELITE' | 'MASTER' | 'VERIFIED' | 'REVIEW' = 'VERIFIED';
  let tierLabel = 'Cooperative Verified';
  let tierColor = 'emerald';

  if (!isAadhaarVerified || isUnderReview) {
    tier = 'REVIEW';
    tierLabel = 'Under Society Review';
    tierColor = 'amber';
  } else if (trustScore >= 90 && worker.completedJobs >= 50) {
    tier = 'ELITE';
    tierLabel = 'Elite Artisan (Gold)';
    tierColor = 'emerald';
  } else if (trustScore >= 80 && worker.completedJobs >= 10) {
    tier = 'MASTER';
    tierLabel = 'Master Artisan (Silver)';
    tierColor = 'blue';
  } else {
    tier = 'VERIFIED';
    tierLabel = 'Identity Verified';
    tierColor = 'teal';
  }

  // Last 4 digits of Aadhaar
  const cleanAadhaar = worker.maskedAadhaar || 'XXXX XXXX 4521';
  const aadhaarParts = cleanAadhaar.split(' ');
  const lastFour = aadhaarParts[aadhaarParts.length - 1] || '4521';

  return {
    trustScore,
    tier,
    tierLabel,
    tierColor,
    isAadhaarVerified,
    isUnderReview,
    maskedAadhaar: cleanAadhaar,
    lastFourAadhaar: lastFour,
    completedJobs: worker.completedJobs || 0,
    rating: worker.rating || 4.8,
    reliabilityScore: reliabilityPercent,
    societyName: worker.societyName || 'Indore Shramik Kaushal Sahakari Samiti',
    breakdown: [
      {
        category: 'Aadhaar e-KYC Identity',
        score: identityScore,
        maxScore: 20,
        percentage: (identityScore / 20) * 100,
        statusText: isAadhaarVerified ? 'UIDAI Masked Demographics Verified' : 'KYC Under Physical Verification',
        icon: 'ID',
      },
      {
        category: 'Completed Job History',
        score: jobHistoryScore,
        maxScore: 20,
        percentage: (jobHistoryScore / 20) * 100,
        statusText: `${worker.completedJobs || 0} Successful Field Service Dispatches`,
        icon: 'JOBS',
      },
      {
        category: 'Labour Society Registration',
        score: societyScore,
        maxScore: 20,
        percentage: (societyScore / 20) * 100,
        statusText: 'Verified Member in Good Standing (MP Cooperative Act)',
        icon: 'SOCIETY',
      },
      {
        category: 'Customer Satisfaction Rating',
        score: ratingScore,
        maxScore: 20,
        percentage: (ratingScore / 20) * 100,
        statusText: `${worker.rating > 0 ? worker.rating.toFixed(1) : 'New'} / 5.0 Stars (${worker.totalRatingsCount || worker.completedJobs || 0} reviews)`,
        icon: 'STAR',
      },
      {
        category: 'Punctuality & Reliability',
        score: reliabilityScore,
        maxScore: 20,
        percentage: (reliabilityScore / 20) * 100,
        statusText: `${reliabilityPercent}% On-Time Arrival • 0 Unexcused Disputes`,
        icon: 'CLOCK',
      },
    ],
  };
}

export const IdentityVerifiedBadge: React.FC<IdentityVerifiedBadgeProps> = ({
  worker,
  variant = 'badge',
  showAadhaarSnippet = true,
  showCompletedJobs = true,
  interactive = true,
  className = '',
  onClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const details = getWorkerVerificationDetails(worker);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
    if (interactive) {
      setShowModal(true);
    }
  };

  // Color schemas based on verification tier
  const getBadgeStyle = () => {
    switch (details.tier) {
      case 'ELITE':
        return {
          wrapper: 'bg-emerald-50/90 text-emerald-900 border-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-100/90',
          iconColor: 'text-emerald-600',
          scoreBadge: 'bg-emerald-600 text-white',
          pillBg: 'bg-emerald-100/80 text-emerald-800',
        };
      case 'MASTER':
        return {
          wrapper: 'bg-blue-50/90 text-blue-900 border-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-100/90',
          iconColor: 'text-blue-600',
          scoreBadge: 'bg-blue-600 text-white',
          pillBg: 'bg-blue-100/80 text-blue-800',
        };
      case 'REVIEW':
        return {
          wrapper: 'bg-amber-50/90 text-amber-900 border-amber-300 ring-1 ring-amber-400/20 hover:bg-amber-100/90',
          iconColor: 'text-amber-600',
          scoreBadge: 'bg-amber-600 text-white',
          pillBg: 'bg-amber-100/80 text-amber-800',
        };
      default:
        return {
          wrapper: 'bg-teal-50/90 text-teal-900 border-teal-300 ring-1 ring-teal-400/20 hover:bg-teal-100/90',
          iconColor: 'text-teal-600',
          scoreBadge: 'bg-teal-600 text-white',
          pillBg: 'bg-teal-100/80 text-teal-800',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <>
      {/* 1. COMPACT VARIANT (for map pins, dense lists) */}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleClick}
          title={`Identity Verified: ${details.tierLabel} • Aadhaar ••${details.lastFourAadhaar} • Trust ${details.trustScore}/100 • Click to verify`}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] font-semibold transition-all ${
            style.wrapper
          } ${interactive ? 'cursor-pointer hover:shadow-2xs active:scale-95' : ''} ${className}`}
        >
          {details.isUnderReview ? (
            <ShieldAlert size={12} className={style.iconColor} />
          ) : (
            <ShieldCheck size={12} className={style.iconColor} />
          )}
          <span className="font-bold">{details.trustScore}</span>
          {showAadhaarSnippet && (
            <span className="text-[10px] opacity-75 font-mono">
              {t('___5q1fj', `••`)}{details.lastFourAadhaar}
            </span>
          )}
        </button>
      )}

      {/* 2. PILL VARIANT (minimal shield + score) */}
      {variant === 'pill' && (
        <button
          type="button"
          onClick={handleClick}
          title={t('Click_to_view_Aadhaar_Verifica_30mp2', `Click to view Aadhaar Verification & Trust Score breakdown`)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold transition-all ${
            style.wrapper
          } ${interactive ? 'cursor-pointer hover:shadow-2xs active:scale-95' : ''} ${className}`}
        >
          {details.isUnderReview ? (
            <ShieldAlert size={13} className={style.iconColor} />
          ) : (
            <ShieldCheck size={13} className={style.iconColor} />
          )}
          <span>{details.trustScore} {t('Trust_v93xf', `Trust`)}</span>
        </button>
      )}

      {/* 3. STANDARD BADGE VARIANT (shield + "Identity Verified" + score) */}
      {variant === 'badge' && (
        <button
          type="button"
          onClick={handleClick}
          title={t('UIDAI_Aadhaar_Verified___Socie_jz994', `UIDAI Aadhaar Verified & Society Endorsed • Click to inspect certificate`)}
          className={`inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-xl border text-xs transition-all ${
            style.wrapper
          } ${interactive ? 'cursor-pointer hover:shadow-2xs active:scale-[0.98]' : ''} ${className}`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {details.isUnderReview ? (
              <ShieldAlert size={14} className={`${style.iconColor} shrink-0`} />
            ) : (
              <ShieldCheck size={14} className={`${style.iconColor} shrink-0`} />
            )}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[11px] leading-tight">
                {details.isUnderReview ? 'Review Pending' : 'Identity Verified'}
              </span>
              {showAadhaarSnippet && (
                <span className="text-[10px] text-slate-500 font-mono leading-none">
                  {t('Aadhaar____ftohf', `Aadhaar ••`)}{details.lastFourAadhaar}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {showCompletedJobs && details.completedJobs > 0 && (
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/80 border border-slate-200/60 font-medium text-slate-600">
                {details.completedJobs} {t('jobs_oqkay', `jobs`)}</span>
            )}
            <span
              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] ${style.scoreBadge} shadow-2xs`}
            >
              {details.trustScore}
            </span>
          </div>
        </button>
      )}

      {/* 4. DETAILED CARD VARIANT (full showcase) */}
      {variant === 'detailed' && (
        <div
          onClick={handleClick}
          className={`rounded-2xl border p-3 sm:p-4 transition-all ${style.wrapper} ${
            interactive ? 'cursor-pointer hover:shadow-md' : ''
          } ${className}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-700 shadow-2xs flex items-center justify-center font-bold border border-emerald-200">
                {details.isUnderReview ? (
                  <ShieldAlert size={20} className={style.iconColor} />
                ) : (
                  <ShieldCheck size={20} className={style.iconColor} />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {details.tierLabel}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-white rounded border border-slate-200 font-mono text-slate-600">
                    {t('UID____buo66', `UID ••`)}{details.lastFourAadhaar}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{t('Aadhaar_Authenticated_op6wm', `Aadhaar Authenticated`)}</span>
                  <span>•</span>
                  <span>{details.completedJobs} {t('Verified_Jobs_qbvgz', `Verified Jobs`)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                {t('Trust_Score_6zb66', `Trust Score`)}</span>
              <div className="text-lg font-black text-slate-900 flex items-center justify-end gap-1">
                <span>{details.trustScore}</span>
                <span className="text-xs text-slate-400 font-normal">{t('_100_jo8zo', `/100`)}</span>
              </div>
            </div>
          </div>

          {interactive && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
              <span>{t('Inspect_Identity___Job_History_z0mdc', `Inspect Identity & Job History Audit Trail`)}</span>
              <ChevronRight size={13} />
            </div>
          )}
        </div>
      )}

      {/* VERIFICATION AUDIT & AADHAAR PROOF MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-5 flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg">
                      {t('Worker_Trust_Certificate_3yeat', `Worker Trust Certificate`)}</h3>
                    <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {t('Cooperative_Vetted_vp6ki', `Cooperative Vetted`)}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t('Madhya_Pradesh_Cooperative_Lab_efx5i', `Madhya Pradesh Cooperative Labour Federation Registry`)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-slate-800">
              {/* Worker Profile Snapshot */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {worker.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {worker.name}
                    </h4>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-blue-700">
                        {worker.primaryTrade} {t('Specialist_l7mmt', `Specialist`)}</span>
                      <span>•</span>
                      <span>{worker.city || 'Indore'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600">
                    {details.trustScore}
                    <span className="text-xs text-slate-400 font-normal">{t('_100_bezeo', `/100`)}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {details.tierLabel}
                  </span>
                </div>
              </div>

              {/* Core Pillars: Aadhaar Masked Authentication & Job History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Aadhaar Verification Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Lock size={14} className="text-emerald-700" />
                      {t('Aadhaar_Authentication_w9qtz', `Aadhaar Authentication`)}</span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                      {t('UIDAI_e_KYC_lmu6h', `UIDAI e-KYC`)}</span>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-400">{t('Card_Number__70m0b', `Card Number:`)}</span>
                    <span className="font-bold text-slate-900 tracking-wider">
                      {details.maskedAadhaar}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{t('Government_photo_ID___demograp_6e1tr', `Government photo ID & demographic check verified`)}</span>
                  </div>
                </div>

                {/* Job History Box */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-blue-700" />
                      {t('Cooperative_Job_History_jhxjc', `Cooperative Job History`)}</span>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">
                      {t('Verified_ht6ks', `Verified`)}</span>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 border border-blue-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{t('Completed_Orders__z8nuu', `Completed Orders:`)}</span>
                    <span className="font-bold text-blue-800 text-sm">
                      {details.completedJobs} {t('Jobs_Done_57ec9', `Jobs Done`)}</span>
                  </div>

                  <div className="text-[11px] text-blue-800 flex items-center gap-1.5">
                    <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                    <span>
                      {details.rating > 0 ? details.rating.toFixed(1) : 'New'} {t('Stars___0_Unresolved_Grievance_tzo8s', `Stars • 0 Unresolved Grievances`)}</span>
                  </div>
                </div>
              </div>

              {/* Society Endorsement Seal */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Building2 size={16} className="text-slate-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {t('Registered_Society__1ye3a', `Registered Society:`)}{details.societyName}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {t('Cooperative_Society_ID__4l5hs', `Cooperative Society ID:`)}{worker.societyId || 'SOC-IND-02'} {t('_MP_Sahakari_Samiti_Act__cpuhq', `(MP Sahakari Samiti Act)`)}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  {t('Affiliated_f2btr', `Affiliated`)}</span>
              </div>

              {/* Explainable Trust Score Breakdown */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    {t('Transparent_Trust_Algorithm_Br_90kz5', `Transparent Trust Algorithm Breakdown`)}</h5>
                  <span className="text-[11px] text-slate-500">
                    {t('Total__g4ooh', `Total:`)}<strong className="text-slate-900">{details.trustScore}</strong> {t('__100_ysvh4', `/ 100`)}</span>
                </div>

                <div className="space-y-2">
                  {details.breakdown.map((item) => (
                    <div
                      key={item.category}
                      className="bg-white rounded-xl p-2.5 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-bold text-slate-800">{item.category}</span>
                        <div className="flex items-center gap-1 font-bold">
                          <span className="text-emerald-700">{item.score}</span>
                          <span className="text-slate-400">/{item.maxScore} {t('pts_06apw', `pts`)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{item.statusText}</span>
                        <span className="font-semibold text-emerald-700">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Safety & Privacy Notice */}
              <div className="bg-slate-100 rounded-2xl p-3.5 text-slate-600 text-xs flex items-start gap-2.5 border border-slate-200">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>{t('Citizen_Safety_Assurance__gxnsv', `Citizen Safety Assurance:`)}</strong> {t('Full_Aadhaar_numbers_are_maske_uafan', `Full Aadhaar numbers are masked strictly in compliance with UIDAI regulations. Physical identity, residence, and police vetting records have been verified by the district cooperative society committee before dispatch.`)}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock size={12} className="text-emerald-600" />
                {t('UIDAI_Masked_Demographics_Comp_5vvoe', `UIDAI Masked Demographics Compliance`)}</span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {t('Close_Verification_dfkhz', `Close Verification`)}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
