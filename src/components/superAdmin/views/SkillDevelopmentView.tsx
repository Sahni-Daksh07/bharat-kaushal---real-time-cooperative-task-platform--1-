import React from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import { SKILL_GAPS_DATA, NATIONAL_IMPACT_KPIS } from '../../../data/superAdminSeedData';

export const SkillDevelopmentView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Artisans_Formally_Assessed_govov', `Artisans Formally Assessed`)}</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{t('118_500_yz3uh', `118,500`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('NSDC___SIDH_Standard_ehgt8', `NSDC / SIDH Standard`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Assessment_Success_Rate_xabbp', `Assessment Success Rate`)}</div>
          <div className="text-3xl font-black text-emerald-700 mt-1">{t('87_4__m5vga', `87.4%`)}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('Pass_on_first_evaluation_v8twc', `Pass on first evaluation`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('RPL_Certifications_Issued_wg6qa', `RPL Certifications Issued`)}</div>
          <div className="text-3xl font-black text-indigo-700 mt-1">
            {NATIONAL_IMPACT_KPIS.skillCertificationsIssued.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('NSQF_Level_3___4_z5sz7', `NSQF Level 3 & 4`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Training_Modules_Active_duxr7', `Training Modules Active`)}</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{t('42_Trades_7v77p', `42 Trades`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Vernacular_audio_visual_d4ctg', `Vernacular audio-visual`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Critical_Skill_Gaps_vzcr9', `Critical Skill Gaps`)}</div>
          <div className="text-3xl font-black text-rose-600 mt-1">{t('6_Trades_t471g', `6 Trades`)}</div>
          <div className="text-[11px] text-rose-600 font-bold mt-0.5">{t('Priority_mobilization_q6pf3', `Priority mobilization`)}</div>
        </div>
      </div>

      {/* 2. Detailed Skill Deficit & Training Priority Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-600" />
              <span>{t('National_Skill_Gap_Matrix___Tr_rlpho', `National Skill Gap Matrix & Training Priority Roadmap`)}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('Identifies_regions_lacking_cer_2fkkh', `Identifies regions lacking certified artisans, apprentices requiring upskilling, and emerging trades.`)}</p>
          </div>

          <button
            onClick={() => alert('Cooperative apprenticeship cohort mobilization order generated for DGT & ITI networks.')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>{t('Commission_New_RPL_Batch_x06bn', `Commission New RPL Batch`)}</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3">{t('Trade___Sector_nmcd9', `Trade & Sector`)}</th>
                <th className="py-3 px-3">{t('Certified_Active_g9ikp', `Certified Active`)}</th>
                <th className="py-3 px-3">{t('Daily_Demand_kwcvl', `Daily Demand`)}</th>
                <th className="py-3 px-3">{t('Supply_Gap___1wowe', `Supply Gap %`)}</th>
                <th className="py-3 px-3">{t('Urgency_mhbj7', `Urgency`)}</th>
                <th className="py-3 px-3">{t('Priority_Regions_Deficit_de308', `Priority Regions Deficit`)}</th>
                <th className="py-3 px-3">{t('Certifications__Last_Qtr__3ypsz', `Certifications (Last Qtr)`)}</th>
                <th className="py-3 px-3 text-right">{t('Action_7mwkb', `Action`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SKILL_GAPS_DATA.map((item) => (
                <tr key={item.trade} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.trade}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {item.activeWorkers.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 font-bold text-blue-700">
                    {item.dailyDemandCount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.gapPercentage > 30 ? 'bg-rose-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.gapPercentage}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800">{item.gapPercentage}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.urgencyLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : item.urgencyLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.urgencyLevel}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {item.priorityRegions.join('; ')}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                    +{item.certifiedLastQuarter.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Launched regional ITI/NSDC upskilling boot camp for ${item.trade}.`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs"
                    >
                      {t('Deploy_Boot_Camp_3ia18', `Deploy Boot Camp`)}</button>
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
