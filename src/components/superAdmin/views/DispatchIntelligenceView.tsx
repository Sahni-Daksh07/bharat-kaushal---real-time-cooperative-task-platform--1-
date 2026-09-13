import React from 'react';
import {
  Zap,
  Clock,
  Scale,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  MapPin,
  Users,
} from 'lucide-react';
import { STATE_METRICS, SKILL_GAPS_DATA } from '../../../data/superAdminSeedData';

export const DispatchIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Core Dispatch KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Average_Match_Time_1h8kd', `Average Match Time`)}</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{t('42_sec_rzx5k', `42 sec`)}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('Automated_geo_radius_nrn2e', `Automated geo-radius`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Worker_Utilization_Rate_muhf0', `Worker Utilization Rate`)}</div>
          <div className="text-3xl font-black text-emerald-700 mt-1">{t('78_4__kn8gx', `78.4%`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Balanced_job_distribution_5k3da', `Balanced job distribution`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Fairness_Index_wttmd', `Fairness Index`)}</div>
          <div className="text-3xl font-black text-indigo-700 mt-1">{t('94_8___100_ulf5s', `94.8 / 100`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Gini_coefficient__0_12_ycs1z', `Gini coefficient: 0.12`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Demand_Coverage_2pfyh', `Demand Coverage`)}</div>
          <div className="text-3xl font-black text-teal-700 mt-1">{t('96_2__sqpbh', `96.2%`)}</div>
          <div className="text-[11px] text-teal-600 font-bold mt-0.5">{t('_lt__3_8__unmet_calls_5iypf', `&lt; 3.8% unmet calls`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Service_Area_Coverage_ryb7z', `Service Area Coverage`)}</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{t('168_Dist_kvc25', `168 Dist`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Full_postal_coverage_y2mcp', `Full postal coverage`)}</div>
        </div>
      </div>

      {/* 2. Real-Time Detection Modules: Overload, Underutilization, Region & Skill Shortages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Worker Overload & Underutilization Anomaly Detection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale size={16} className="text-blue-600" />
              <span>{t('Worker_Overload_vs_Underutiliz_33jgq', `Worker Overload vs Underutilization Monitor`)}</span>
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {t('Automated_Fair_Throttling_Acti_vu7e1', `Automated Fair Throttling Active`)}</span>
          </div>

          <div className="space-y-3">
            {/* Overload Alert */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-700" />
                  <span>{t('Worker_Overload_Alert__Indore__tb93i', `Worker Overload Alert (Indore Vijay Nagar Cluster)`)}</span>
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">
                  {t('18_Artisans__gt__6_jobs_day_8c4zx', `18 Artisans &gt; 6 jobs/day`)}</span>
              </div>
              <p className="text-xs text-amber-800">
                {t('18_plumbers_have_logged__gt__1_o17uk', `18 plumbers have logged &gt; 11 hours duty in last 24h. Dispatch algorithm is automatically deprioritizing them and shifting incoming requests to 34 available nearby artisans to prevent fatigue.`)}</p>
            </div>

            {/* Underutilization Alert */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <TrendingDown size={14} className="text-blue-700" />
                  <span>{t('Underutilization_Warning__Gwal_zx39f', `Underutilization Warning (Gwalior Morar Zone)`)}</span>
                </span>
                <span className="text-[10px] bg-blue-200 text-blue-950 px-2 py-0.5 rounded font-bold">
                  {t('42_Artisans__lt__1_job_in_48h_iif03', `42 Artisans &lt; 1 job in 48h`)}</span>
              </div>
              <p className="text-xs text-blue-800">
                {t('Fairness_engine_has_applied_a__ddcv8', `Fairness engine has applied a +25 point dispatch priority boost to Gwalior Karigar Cooperative artisans to ensure equitable income distribution.`)}</p>
            </div>
          </div>
        </div>

        {/* Module 2: Regional & Skill Shortages Detection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              <span>{t('Real_Time_Regional___Skill_Def_2l7ll', `Real-Time Regional & Skill Deficit Radar`)}</span>
            </h3>
            <span className="text-xs text-slate-400">{t('RPL_Escalation_Triggers_l06yp', `RPL Escalation Triggers`)}</span>
          </div>

          <div className="space-y-3">
            {SKILL_GAPS_DATA.slice(0, 3).map((gap) => (
              <div key={gap.trade} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-slate-900">{gap.trade}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      gap.urgencyLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {gap.gapPercentage}{t('__Deficit___l92c4', `% Deficit (`)}{gap.urgencyLevel})
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {t('Priority_Regions__x2l7i', `Priority Regions:`)}<strong>{gap.priorityRegions.join(', ')}</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{t('Available_Certified__q8ou8', `Available Certified:`)}{gap.activeWorkers.toLocaleString('en-IN')}</span>
                  <span>{t('Daily_Unmet_Demand____00a9a', `Daily Unmet Demand: ~`)}{gap.dailyDemandCount - gap.activeWorkers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
