import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  UserX,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Scale,
  X,
} from 'lucide-react';
import { FRAUD_SIGNALS_SEEDED } from '../../../data/superAdminSeedData';
import { FraudSignal } from '../../../types/superAdmin';

export const FraudRiskView: React.FC = () => {
  const [signals, setSignals] = useState<FraudSignal[]>(FRAUD_SIGNALS_SEEDED);
  const [selectedSignal, setSelectedSignal] = useState<FraudSignal | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredSignals = signals.filter(
    (s) => filterCategory === 'ALL' || s.category === filterCategory
  );

  const handleResolveSignal = (signalId: string, actionTaken: 'DISMISSED' | 'FLAGGED') => {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === signalId
          ? {
              ...s,
              status: actionTaken,
              reviewedBy: 'Dr. Amitabh Verma, IAS',
              reviewNotes: reviewNote || `Human review completed. Action taken: ${actionTaken}`,
            }
          : s
      )
    );
    setSelectedSignal(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Active_Fraud_Signals_iftky', `Active Fraud Signals`)}</div>
          <div className="text-3xl font-black text-rose-600 mt-1">
            {signals.filter((s) => s.status === 'OPEN' || s.status === 'INVESTIGATING').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Awaiting_Human_Review_rdfy1', `Awaiting Human Review`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Critical_Risk_Items_wxto3', `Critical Risk Items`)}</div>
          <div className="text-3xl font-black text-amber-700 mt-1">
            {signals.filter((s) => s.severity === 'CRITICAL').length}
          </div>
          <div className="text-[11px] text-rose-600 font-bold mt-0.5">{t('Biometric___Identity_collision_pgxtu', `Biometric / Identity collision`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Resolved_This_Week_4utyu', `Resolved This Week`)}</div>
          <div className="text-3xl font-black text-emerald-700 mt-1">{t('18_0aat6', `18`)}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('Zero_wrongful_terminations_5504t', `Zero wrongful terminations`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Human_Review_Compliance_71ruy', `Human Review Compliance`)}</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{t('100__a33dl', `100%`)}</div>
          <div className="text-[11px] text-blue-800 font-medium mt-0.5">{t('Automated_ban_strictly_disable_1c9cu', `Automated ban strictly disabled`)}</div>
        </div>
      </div>

      {/* 2. Fraud Signals Table & Review Console */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-600" />
              <span>{t('National_Fraud_Detection___Hum_8lw02', `National Fraud Detection & Human Review Verification Console`)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('Cooperative_natural_justice_po_pec6t', `Cooperative natural justice policy: Artificial intelligence flags statistical anomalies; statutory officer review is mandatory before any account limitation.`)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">{t('All_Threat_Categories_b4j8t', `All Threat Categories`)}</option>
              <option value="DUPLICATE_IDENTITY">{t('Duplicate_Identity___Biometric_ckol8', `Duplicate Identity / Biometrics`)}</option>
              <option value="LOCATION_FRAUD">{t('Location_Fraud___Fake_GPS_lg31o', `Location Fraud / Fake GPS`)}</option>
              <option value="RATING_MANIPULATION">{t('Rating_Manipulation_Cluster_llvnb', `Rating Manipulation Cluster`)}</option>
              <option value="BOOKING_ABUSE">{t('Booking_Abuse___Doorstep_Cance_pbgjn', `Booking Abuse & Doorstep Cancellation`)}</option>
              <option value="SUSPICIOUS_PAYMENT">{t('Suspicious_Payment___Price_Inf_568d1', `Suspicious Payment / Price Inflation`)}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3">{t('Signal_ID___Category_pn10u', `Signal ID & Category`)}</th>
                <th className="py-3 px-3">{t('Target_Subject_3pssv', `Target Subject`)}</th>
                <th className="py-3 px-3">{t('Risk_Score_t6s2t', `Risk Score`)}</th>
                <th className="py-3 px-3">{t('Location_shxgn', `Location`)}</th>
                <th className="py-3 px-3">{t('Anomaly_Detection_Reason_8x8t0', `Anomaly Detection Reason`)}</th>
                <th className="py-3 px-3">{t('Status_0rjdf', `Status`)}</th>
                <th className="py-3 px-3 text-right">{t('Action_o4xcg', `Action`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSignals.map((sig) => (
                <tr key={sig.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-[11px] font-bold text-slate-900">{sig.id}</div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {sig.category.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{sig.targetName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {sig.targetType}: {sig.targetId}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="w-10 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            sig.riskScore > 85
                              ? 'bg-rose-600'
                              : sig.riskScore > 70
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${sig.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{sig.riskScore}{t('_100_awh5v', `/100`)}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase ${
                        sig.severity === 'CRITICAL' ? 'text-rose-700' : 'text-amber-700'
                      }`}
                    >
                      {sig.severity} {t('SEVERITY_xwvyf', `SEVERITY`)}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{sig.city}</div>
                    <div className="text-[10px] text-slate-400">{sig.state}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 max-w-xs">
                    <p className="line-clamp-2">{sig.reason}</p>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sig.status === 'OPEN'
                          ? 'bg-rose-100 text-rose-800'
                          : sig.status === 'INVESTIGATING'
                          ? 'bg-amber-100 text-amber-800'
                          : sig.status === 'FLAGGED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sig.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedSignal(sig)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      {t('Adjudicate_Case_gaja4', `Adjudicate Case`)}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detailed Fraud Adjudication Modal */}
      {selectedSignal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded">
                    {selectedSignal.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedSignal.id}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedSignal.targetName}</h3>
                <div className="text-xs text-slate-500">
                  {t('Target__chtn3', `Target:`)}{selectedSignal.targetType} ({selectedSignal.targetId}{t('____7em2j', `) •`)}{selectedSignal.city}, {selectedSignal.state}
                </div>
              </div>
              <button
                onClick={() => setSelectedSignal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Evidence items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">{t('Forensic_Evidence_Telemetry__26tzi', `Forensic Evidence Telemetry:`)}</h4>
              <div className="space-y-1.5">
                {selectedSignal.evidence.map((ev, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-snug">
              <strong>{t('Statutory_Recommended_Action__ow6g2', `Statutory Recommended Action:`)}</strong> {selectedSignal.recommendedAction}
            </div>

            {/* Officer Review Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Adjudication_Officer_Findings__p3aus', `Adjudication Officer Findings & Directive:`)}</label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder={t('Enter_mandatory_supervisory_re_shf5g', `Enter mandatory supervisory reasoning, summon directives, or verification requirements...`)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                {t('Audited_Under_National_Coopera_q9ift', `Audited Under National Cooperative Act`)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveSignal(selectedSignal.id, 'DISMISSED')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Dismiss_as_False_Positive_3mgnb', `Dismiss as False Positive`)}</button>
                <button
                  onClick={() => handleResolveSignal(selectedSignal.id, 'FLAGGED')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Confirm_Flag___Summon_for_Audi_4qxkk', `Confirm Flag & Summon for Audit`)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
