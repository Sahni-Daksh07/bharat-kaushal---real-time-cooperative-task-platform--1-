import React from 'react';
import {
  Users,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  IndianRupee,
  Activity,
  MapPin,
  Clock,
  ArrowUpRight,
  Flame,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { NATIONAL_IMPACT_KPIS, STATE_METRICS, PREDICTIVE_DEMAND_FORECAST } from '../../../data/superAdminSeedData';
import { useRealtime } from '../../../context/RealtimeContext';

const REVENUE_TREND_DATA = [
  { month: 'Apr 2026', totalRevenue: 84.2, workerPayout: 79.5, welfarePool: 1.68 },
  { month: 'May 2026', totalRevenue: 96.5, workerPayout: 91.2, welfarePool: 1.93 },
  { month: 'Jun 2026', totalRevenue: 108.4, workerPayout: 102.4, welfarePool: 2.16 },
  { month: 'Jul 2026', totalRevenue: 118.2, workerPayout: 111.7, welfarePool: 2.36 },
  { month: 'Aug 2026', totalRevenue: 122.9, workerPayout: 116.1, welfarePool: 2.45 },
  { month: 'Sep 2026', totalRevenue: 128.45, workerPayout: 121.38, welfarePool: 2.56 },
];

const HOURLY_DISPATCH_ACTIVITY = [
  { hour: '06 AM', bookings: 420 },
  { hour: '08 AM', bookings: 2150 },
  { hour: '10 AM', bookings: 4890 },
  { hour: '12 PM', bookings: 3410 },
  { hour: '02 PM', bookings: 2980 },
  { hour: '04 PM', bookings: 4120 },
  { hour: '06 PM', bookings: 6240 },
  { hour: '08 PM', bookings: 5100 },
  { hour: '10 PM', bookings: 1890 },
];

export const NationalDashboardView: React.FC<{
  onNavigateSection: (section: any) => void;
}> = ({ onNavigateSection }) => {
  const { workers, bookings, appeals } = useRealtime();

  const totalWorkers = NATIONAL_IMPACT_KPIS.workersDigitized;
  const verifiedWorkers = NATIONAL_IMPACT_KPIS.workersVerified;
  const activeWorkers = Math.round(totalWorkers * 0.68);
  const availableWorkers = Math.round(activeWorkers * 0.72);
  const busyWorkers = activeWorkers - availableWorkers;
  const needsVerification = totalWorkers - verifiedWorkers;
  const needsSkillUpgrade = 18450;

  return (
    <div className="space-y-6">
      {/* Top Banner: National Governance Pulse */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none flex items-center justify-center font-black text-9xl">
          {t('_____lqzdi', `🇮🇳`)}</div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                {t('Apex_Command_Clearance__Level__le04e', `Apex Command Clearance: Level 5`)}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-300 font-medium">{t('Pan_India_Realtime_Telemetry_S_s1mt1', `Pan-India Realtime Telemetry Synced`)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('National_Workforce_Governance__i7dcj', `National Workforce Governance & Cooperative Intelligence System`)}</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('Government_of_India___Ministry_xk9xw', `Government of India • Ministry of Labour & Employment • NCUI Apex Cooperative Network Monitoring.
              Tracking 184,500+ digitized gig artisans across 168 districts and 14 states.`)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateSection('IMPACT')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Award size={15} />
              <span>{t('Government_Impact_Report_omz59', `Government Impact Report`)}</span>
            </button>
            <button
              onClick={() => onNavigateSection('NATIONAL_MAP')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur"
            >
              <MapPin size={15} className="text-blue-400" />
              <span>{t('Interactive_India_Map_4ykni', `Interactive India Map`)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Workforce Health Real-time KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span>{t('National_Workforce_Registry_Te_587yg', `National Workforce Registry Telemetry`)}</span>
          </h2>
          <button
            onClick={() => onNavigateSection('WORKFORCE')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <span>{t('Explore_All_184_520_Artisans_cwmh8', `Explore All 184,520 Artisans`)}</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Total_Workers_562yv', `Total Workers`)}</div>
            <div className="text-xl font-black text-slate-900 mt-1">{totalWorkers.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{t('___18_4__YoY_s4pjg', `↑ +18.4% YoY`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Verified_Artisans_juqp1', `Verified Artisans`)}</div>
            <div className="text-xl font-black text-emerald-700 mt-1">{verifiedWorkers.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{t('93_4__e_Shram_synced_4sbxk', `93.4% e-Shram synced`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Active_Workers_sbvmn', `Active Workers`)}</div>
            <div className="text-xl font-black text-blue-700 mt-1">{activeWorkers.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{t('Online_within_24h_donb8', `Online within 24h`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Available_on_Duty_ksgsp', `Available on Duty`)}</div>
            <div className="text-xl font-black text-teal-700 mt-1">{availableWorkers.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-teal-600 font-bold mt-0.5">{t('Ready_for_dispatch_4v21u', `Ready for dispatch`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Currently_Busy_4gsnr', `Currently Busy`)}</div>
            <div className="text-xl font-black text-amber-700 mt-1">{busyWorkers.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">{t('Onsite_active_jobs_1vogy', `Onsite active jobs`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Pending_Verification_z9aax', `Pending Verification`)}</div>
            <div className="text-xl font-black text-rose-600 mt-1">{needsVerification.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5">{t('DigiLocker_queue_kg0cq', `DigiLocker queue`)}</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold">{t('Needs_Skill_Upgrade_kblme', `Needs Skill Upgrade`)}</div>
            <div className="text-xl font-black text-indigo-700 mt-1">{needsSkillUpgrade.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">{t('NSDC_RPL_aligned_sthdh', `NSDC RPL aligned`)}</div>
          </div>
        </div>
      </div>

      {/* 2. Economic & Financial Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <IndianRupee size={16} className="text-emerald-600" />
            <span>{t('Cooperative_Economic_Health____wk4f2', `Cooperative Economic Health & Fair Wage Velocity`)}</span>
          </h2>
          <button
            onClick={() => onNavigateSection('FINANCE')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <span>{t('Finance_Command_pbjac', `Finance Command`)}</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">{t('Gross_Service_Turnover_1h15z', `Gross Service Turnover`)}</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{t('_128_45_Cr_0ygl4', `₹128.45 Cr`)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t('FY_2026_27_YTD_1ifus', `FY 2026-27 YTD`)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-emerald-500 shadow-xs bg-emerald-50/20">
            <div className="text-xs font-bold text-emerald-800 flex items-center justify-between">
              <span>{t('Direct_Worker_Earnings_lsowi', `Direct Worker Earnings`)}</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-black">{t('94_5__ht91q', `94.5%`)}</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{t('_121_38_Cr_6umhg', `₹121.38 Cr`)}</div>
            <div className="text-[11px] text-emerald-800 font-medium mt-0.5">{t('Direct_UPI_to_Artisan_Accounts_hzgp1', `Direct UPI to Artisan Accounts`)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
            <div className="text-xs font-bold text-blue-800 flex items-center justify-between">
              <span>{t('Labour_Welfare_Corpus_wzz18', `Labour Welfare Corpus`)}</span>
              <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-black">{t('2_0__4n0cv', `2.0%`)}</span>
            </div>
            <div className="text-2xl font-black text-blue-700 mt-1">{t('_2_56_Cr_lqhng', `₹2.56 Cr`)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('MPSLWB_Escrow_Pool_gd0uc', `MPSLWB Escrow Pool`)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{t('Society_Ops_Share_x0hog', `Society Ops Share`)}</span>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-black">{t('3_5__2zkcc', `3.5%`)}</span>
            </div>
            <div className="text-2xl font-black text-slate-800 mt-1">{t('_4_49_Cr_no9un', `₹4.49 Cr`)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('224_Affiliated_Societies_thuvm', `224 Affiliated Societies`)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">{t('Monthly_Growth_Rate_dr89w', `Monthly Growth Rate`)}</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{t('_14_2__ac2kv', `+14.2%`)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Month_on_Month_bookings_wo8h3', `Month-on-Month bookings`)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">{t('Annual_Growth__YoY__voeq7', `Annual Growth (YoY)`)}</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{t('_38_6__ed4s7', `+38.6%`)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Cooperative_expansion_rate_274sk', `Cooperative expansion rate`)}</div>
          </div>
        </div>
      </div>

      {/* 3. Charts: Revenue Velocity & Hourly Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900">{t('National_Economic_Velocity__Cr_9nwkk', `National Economic Velocity (Cr INR)`)}</h3>
              <p className="text-xs text-slate-500">{t('Gross_Service_Turnover_vs_Dire_6ul0x', `Gross Service Turnover vs Direct Worker Share vs Welfare Pool`)}</p>
            </div>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
              {t('FY_2026_27_Semi_Annual_okvlf', `FY 2026-27 Semi-Annual`)}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotalRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWorkerPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Cr`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }}
                />
                <Area type="monotone" dataKey="totalRevenue" name="Gross Service Value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotalRev)" />
                <Area type="monotone" dataKey="workerPayout" name="Worker Payout (94.5%)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWorkerPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">{t('Today_apos_s_Dispatch_Curve_jf1r1', `Today&apos;s Dispatch Curve`)}</h3>
              <p className="text-xs text-slate-500">{t('Hourly_booking_request_distrib_p1jnj', `Hourly booking request distribution`)}</p>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              {t('Peak__06___08_PM_9p6xx', `Peak: 06 - 08 PM`)}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_DISPATCH_ACTIVITY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                <Tooltip
                  formatter={(val: any) => [val, 'Bookings']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Operations & Dispute Triage Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Today_apos_s_Bookings_fx8gf', `Today&apos;s Bookings`)}</div>
          <div className="text-lg font-black text-slate-900 mt-0.5">{t('31_240_hszh0', `31,240`)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{t('97_8__matched__lt__90s_1foax', `97.8% matched &lt; 90s`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Completed_Jobs_7bz0p', `Completed Jobs`)}</div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">{t('27_810_ru0vh', `27,810`)}</div>
          <div className="text-[10px] text-slate-500">{t('OTP_2FA_Verified_d86oz', `OTP 2FA Verified`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Cancelled_Jobs_21v2a', `Cancelled Jobs`)}</div>
          <div className="text-lg font-black text-amber-700 mt-0.5">{t('1_120_4x6xw', `1,120`)}</div>
          <div className="text-[10px] text-slate-500">{t('3_5__cancellation_rate_fne0r', `3.5% cancellation rate`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Emergency_Dispatches_q96jz', `Emergency Dispatches`)}</div>
          <div className="text-lg font-black text-rose-600 mt-0.5">{t('2_310_lp5ti', `2,310`)}</div>
          <div className="text-[10px] text-rose-600 font-semibold">{t('Avg_arrival_14_mins_taew1', `Avg arrival 14 mins`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Active_Disputes_sojv7', `Active Disputes`)}</div>
          <div className="text-lg font-black text-indigo-700 mt-0.5">{t('42_b7prc', `42`)}</div>
          <div className="text-[10px] text-indigo-600 font-semibold">{t('18_in_peer_review_5cwze', `18 in peer review`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">{t('Reassignment_Rate_si2k5', `Reassignment Rate`)}</div>
          <div className="text-lg font-black text-slate-800 mt-0.5">{t('1_2__4mytf', `1.2%`)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{t('Zero_strikeout_SLA_yf9m3', `Zero strikeout SLA`)}</div>
        </div>
      </div>

      {/* 5. Geographic Overview Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-blue-600" />
              <span>{t('State_Level_Workforce_Deployme_kn1we', `State-Level Workforce Deployment & Cooperative Penetration`)}</span>
            </h3>
            <p className="text-xs text-slate-500">{t('Real_time_supply_vs_demand_bal_gi2ez', `Real-time supply vs demand balance across pilot states`)}</p>
          </div>
          <button
            onClick={() => onNavigateSection('NATIONAL_MAP')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
          >
            {t('Launch_National_Heatmap_Drill__ictjm', `Launch National Heatmap Drill-down →`)}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">{t('State___Apex_Federation_wj4ph', `State / Apex Federation`)}</th>
                <th className="py-2.5 px-3">{t('Total_Artisans_mls73', `Total Artisans`)}</th>
                <th className="py-2.5 px-3">{t('Verified___1u3xw', `Verified %`)}</th>
                <th className="py-2.5 px-3">{t('Active_Now_54khw', `Active Now`)}</th>
                <th className="py-2.5 px-3">{t('Monthly_Value_gh2xe', `Monthly Value`)}</th>
                <th className="py-2.5 px-3">{t('Demand_Index_jt1a8', `Demand Index`)}</th>
                <th className="py-2.5 px-3">{t('Critical_Skill_Gap_1kbjp', `Critical Skill Gap`)}</th>
                <th className="py-2.5 px-3 text-right">{t('Action_9t19s', `Action`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STATE_METRICS.map((st) => (
                <tr key={st.stateCode} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{st.stateName}</div>
                    <div className="text-[10px] text-slate-400">{st.federationName}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {st.totalWorkers.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">
                      {Math.round((st.verifiedWorkers / st.totalWorkers) * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-700">
                    {st.activeWorkers.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ₹{(st.monthlyRevenueInr / 100000).toFixed(1)} {t('Lakh_1nmel', `Lakh`)}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${st.demandIndex}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-700">{st.demandIndex}{t('_100_0vsv5', `/100`)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {st.shortageSkills.slice(0, 2).map((sk) => (
                        <span key={sk} className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateSection('WORKFORCE')}
                      className="px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 font-bold hover:bg-blue-50 rounded"
                    >
                      {t('Inspect_0tvqa', `Inspect`)}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
