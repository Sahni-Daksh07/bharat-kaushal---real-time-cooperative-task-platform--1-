import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage } from '../../utils/i18n';
import { FederationDataVisualization } from './FederationDataVisualization';
import { EmailVerificationModal } from '../common/EmailVerificationModal';
import { ServiceWorkerRequirementAdmin } from '../admin/ServiceWorkerRequirementAdmin';
import {
  Sliders,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  Shield,
  KeyRound,
  Lock,
  Mail,
} from 'lucide-react';

interface FederationCommandPortalProps {
  lang?: SupportedLanguage;
}

export const FederationCommandPortal: React.FC<FederationCommandPortalProps> = ({ lang: _lang }) => {
  const {
    policy,
    updatePolicy,
    ledger,
    welfareRecords,
    demandForecast,
    workers,
    bookings,
    societies,
  } = useRealtime();

  const {
    federationAdminUser,
    isFederationAdminAuthenticated,
    openAuthModal,
  } = useAuth();

  const [activeModel, setActiveModel] = useState<'MODEL_A' | 'MODEL_B'>(policy.activeModel);
  const [initialRadius, setInitialRadius] = useState(policy.dispatchPolicy.standardInitialRadiusKm);
  const [maxRadius, setMaxRadius] = useState(policy.dispatchPolicy.maxRadiusKm);
  const [graceWindow, setGraceWindow] = useState(policy.cancellationPolicy.graceWindowMinutes);
  const [penaltyAmount, setPenaltyAmount] = useState(policy.cancellationPolicy.unexcusedPenaltyInr);
  const [isSaved, setIsSaved] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleSavePolicy = async () => {
    await updatePolicy({
      activeModel,
      dispatchPolicy: {
        ...policy.dispatchPolicy,
        standardInitialRadiusKm: Number(initialRadius),
        maxRadiusKm: Number(maxRadius),
      },
      cancellationPolicy: {
        ...policy.cancellationPolicy,
        graceWindowMinutes: Number(graceWindow),
        unexcusedPenaltyInr: Number(penaltyAmount),
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const totalGrossSettled = ledger.reduce((acc, l) => acc + l.customerPaid, 0);
  const totalWorkerDisbursed = ledger.reduce((acc, l) => acc + l.workerCredit, 0);
  const totalWelfareAccrued = welfareRecords.reduce((acc, w) => acc + w.contributionAmount, 0);

  return (
    <div className="space-y-6 dashboard-container" data-dashboard-container="true">
      {/* Realtime Command Operations Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl h-44 sm:h-52 w-full group">
        <img
          src="/images/cooperative_command.jpg"
          alt="Indore Municipal Cooperative Command Operations"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/95 via-[#020817]/75 to-transparent" />
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 backdrop-blur-md border border-purple-500/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Live Operations Telemetry &bull; Ward 1–85 Hub
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Indore Municipal Cooperative Labour GIS Command Center
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Real-time WebSocket telemetry tracking 146 standardized doorstep services across 4 civic labour zones under MP Cooperative Societies Act, 1960.
            </p>
          </div>
        </div>
      </div>

      {/* Federation Command Header */}
      <section className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 dashboard-card" data-dashboard-card="true">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-900 border border-purple-500/40 text-purple-200 font-black text-xl flex items-center justify-center shadow-md shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black">
                {t('Madhya_Pradesh_Cooperative_Lab_2y0v9', `Madhya Pradesh Cooperative Labour Federation Command`)}</h1>
              <span className="text-xs bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded border border-purple-500/30">
                {federationAdminUser?.clearanceLevel || 'LEVEL_4_EXECUTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('Statutory_oversight_for_Indore_umejv', `Statutory oversight for Indore Municipal Corporation (IMC) territory • Dynamic Policy & Welfare Fund Distribution`)}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="font-semibold text-slate-200">
                {t('Commanding_Officer__c78sm', `Commanding Officer:`)}{federationAdminUser?.name || 'Dr. Anand Verma, IAS (Retd.)'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-300 font-medium">
                {federationAdminUser?.officialDesignation || 'Executive Managing Director'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> {t('Clearance_Verified_jr2d6', `Clearance Verified`)}</span>
              <span className="text-slate-600">•</span>
              {/* Optional Email Verification Pill */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className={`font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all border text-[11px] ${
                  federationAdminUser?.emailVerified
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                    : 'bg-purple-950/60 text-purple-300 border-purple-500/40 hover:bg-purple-900/60'
                }`}
                title={t('Command_Email_Notification_Set_nz6yo', `Command Email Notification Settings (Optional)`)}
              >
                <Mail size={12} />
                <span>
                  {federationAdminUser?.emailVerified
                    ? `✓ ${federationAdminUser?.email || 'Verified'}`
                    : federationAdminUser?.email
                    ? `Verify ${federationAdminUser?.email}`
                    : '+ Add Email (Optional)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Stats & Auth Action */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2 text-xs mt-3 lg:mt-0 w-full lg:w-auto">
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400">{t('Total_Settled_r5jx5', `Total Settled`)}</div>
            <div className="text-sm sm:text-base font-bold text-white">₹{totalGrossSettled}</div>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400">{t('Labour_Disbursed_wvlrf', `Labour Disbursed`)}</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400">₹{totalWorkerDisbursed}</div>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400">{t('MPSLWB_Welfare_ks1hs', `MPSLWB Welfare`)}</div>
            <div className="text-sm sm:text-base font-bold text-blue-400">₹{totalWelfareAccrued}</div>
          </div>
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="h-9 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Mail size={14} className="text-purple-400 shrink-0" />
            <span>{t('Email_j6ra3', `Email`)}</span>
          </button>
        </div>
      </section>

      {/* Policy Engine Configurator */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5 dashboard-card" data-dashboard-card="true">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('Cooperative_Economic_Model___D_bxa9c', `Cooperative Economic Model & Dispatch Radius Rules`)}</h2>
            <p className="text-xs text-slate-500">
              {t('Changes_applied_here_take_imme_er5qj', `Changes applied here take immediate real-time effect across all Indore worker and customer portals via WebSocket broadcast.`)}</p>
          </div>

          <button
            onClick={handleSavePolicy}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2"
          >
            <CheckCircle2 size={15} />
            <span>{isSaved ? 'Policy Broadcasted!' : 'Save & Broadcast Policy'}</span>
          </button>
        </div>

        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setActiveModel('MODEL_A')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              activeModel === 'MODEL_A'
                ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-sm text-slate-900">{t('Cooperative_Model_A__Standard__7t5pd', `Cooperative Model A (Standard)`)}</span>
              {activeModel === 'MODEL_A' && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('ACTIVE_12lyb', `ACTIVE`)}</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-2 border-t border-slate-200 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Worker_Payout_gs4ii', `Worker Payout`)}</span>
                <div className="font-black text-emerald-700 text-base">{t('94_5__u4pqw', `94.5%`)}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Society_Ops_g7bqt', `Society Ops`)}</span>
                <div className="font-black text-slate-800 text-base">{t('3_5__4wwxi', `3.5%`)}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Welfare_Fund_64dct', `Welfare Fund`)}</span>
                <div className="font-black text-blue-700 text-base">{t('2_0__1q2zr', `2.0%`)}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {t('Optimized_for_sustainable_soci_059bx', `Optimized for sustainable society operations with strong welfare allocation to MP Unorganized Workers Fund.`)}</p>
          </div>

          <div
            onClick={() => setActiveModel('MODEL_B')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              activeModel === 'MODEL_B'
                ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-sm text-slate-900">{t('Platform_Model_B__High_Worker__20ji1', `Platform Model B (High Worker Yield)`)}</span>
              {activeModel === 'MODEL_B' && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('ACTIVE_h8te5', `ACTIVE`)}</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-2 border-t border-slate-200 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Worker_Payout_u7hn5', `Worker Payout`)}</span>
                <div className="font-black text-emerald-700 text-base">{t('95_0__8ffh9', `95.0%`)}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Society_Ops_eokkq', `Society Ops`)}</span>
                <div className="font-black text-slate-800 text-base">{t('2_5__i654q', `2.5%`)}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px]">{t('Welfare_Fund_w7gp1', `Welfare Fund`)}</span>
                <div className="font-black text-blue-700 text-base">{t('2_5__h45ya', `2.5%`)}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {t('Maximum_take_home_worker_share_rsdwr', `Maximum take-home worker share with lean society administration and higher social security contributions.`)}</p>
          </div>
        </div>

        {/* Dispatch & Penalty Tuning */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
          <div>
            <label className="font-semibold text-slate-700">{t('Initial_Search_Radius__km__k034t', `Initial Search Radius (km)`)}</label>
            <input
              type="number"
              value={initialRadius}
              onChange={(e) => setInitialRadius(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">{t('Max_Radius_Expansion__km__okr81', `Max Radius Expansion (km)`)}</label>
            <input
              type="number"
              value={maxRadius}
              onChange={(e) => setMaxRadius(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">{t('Cancellation_Grace_Window__min_s8rpf', `Cancellation Grace Window (mins)`)}</label>
            <input
              type="number"
              value={graceWindow}
              onChange={(e) => setGraceWindow(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">{t('Unexcused_Penalty__INR__rsd8s', `Unexcused Penalty (INR)`)}</label>
            <input
              type="number"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Worker Requirement & Cooperative Crew Policy Admin */}
      <ServiceWorkerRequirementAdmin />

      {/* Real-time Labour Pricing Analytics & Workforce Distribution */}
      <FederationDataVisualization />

      {/* Indore City Live Operations & Heatmap */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t('Indore_City_Real_time_Geograph_6f3o8', `Indore City Real-time Geographic Coverage`)}</h2>
          </div>
          <span className="text-xs text-slate-500">{t('6_Major_IMC_Zones_jadh2', `6 Major IMC Zones`)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Palasia / Old Palasia', workers: 14, active: 4, demand: 'High' },
            { name: 'Vijay Nagar & Scheme 54', workers: 18, active: 6, demand: 'Very High' },
            { name: 'Bhawarkua / Univ', workers: 9, active: 2, demand: 'Medium' },
            { name: 'Rajwada & Sarafa', workers: 11, active: 3, demand: 'High' },
            { name: 'Rau & Silicon City', workers: 6, active: 1, demand: 'Medium' },
            { name: 'Super Corridor / Airport', workers: 5, active: 1, demand: 'Low' },
          ].map((zone, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{zone.name}</div>
              <div className="text-slate-500 text-[11px]">{zone.workers} {t('Registered_Workers_30ovm', `Registered Workers`)}</div>
              <div className="text-blue-700 font-semibold">{zone.active} {t('Jobs_Live_iqo8e', `Jobs Live`)}</div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                zone.demand === 'Very High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {zone.demand} {t('Demand_0zh76', `Demand`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 24-Hour Demand Forecast vs Worker Supply */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t('Trade_Demand_Forecasting___Lab_5xcve', `Trade Demand Forecasting & Labour Equilibrium (Next 24 Hours)`)}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {demandForecast.map((item, idx) => {
            const growthRate = item.changePercent || Math.round(((item.predictedDemand - item.currentDemand) / (item.currentDemand || 1)) * 100);
            return (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-slate-900">{item.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.urgencyColor || 'bg-amber-100 text-amber-900'}`}>
                    +{growthRate}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">{item.seasonLabel}</div>

                <div className="flex items-center justify-between text-slate-600 pt-1">
                  <span>{t('Current_Volume__jmh5l', `Current Volume:`)}</span>
                  <strong className="text-slate-800">{item.currentDemand}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('Predicted_Peak__acciu', `Predicted Peak:`)}</span>
                  <strong className="text-blue-700 font-bold">{item.predictedDemand} {t('requests_57230', `requests`)}</strong>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${Math.min(100, (item.currentDemand / (item.predictedDemand || 1)) * 100)}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>{t('Key_Hotspots__31m7x', `Key Hotspots:`)}</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[120px]">{item.topDistricts?.[0] || 'Indore'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Financial Ledger & Audit Trail */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t('Statutory_Financial_Ledger___W_d5kgw', `Statutory Financial Ledger & Welfare Fund Allocations`)}</h2>
          </div>
          <span className="text-xs text-slate-500">{ledger.length} {t('immutable_records_2nkzl', `immutable records`)}</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-xs min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Ledger_ID_2paz3', `Ledger ID`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Booking_56szh', `Booking`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Customer_Paid_aqgiz', `Customer Paid`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Worker_Share_pl4pt', `Worker Share`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Society_Operations_nynr8', `Society Operations`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('MPSLWB_Welfare__2___i45ql', `MPSLWB Welfare (2%)`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Policy_Model_1z07m', `Policy Model`)}</th>
                <th className="py-2.5 px-3 whitespace-nowrap">{t('Timestamp_2uap9', `Timestamp`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">{item.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{item.bookingId}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">₹{item.customerPaid}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 whitespace-nowrap">₹{item.workerCredit}</td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">₹{item.societyCredit}</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700 whitespace-nowrap">₹{item.welfareCredit}</td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">{item.policySnapshot}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Optional Email Verification Modal for Federation Admin */}
      {federationAdminUser && (
        <EmailVerificationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          role="FEDERATION_ADMIN"
          currentEmail={federationAdminUser.email || ''}
          isVerified={!!federationAdminUser.emailVerified}
          entityId={federationAdminUser.id}
          entityName={federationAdminUser.name}
        />
      )}
    </div>
  );
};
