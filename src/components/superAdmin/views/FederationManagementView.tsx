import React, { useState } from 'react';
import {
  Building,
  Users,
  TrendingUp,
  Award,
  ShieldCheck,
  IndianRupee,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { NATIONAL_FEDERATIONS } from '../../../data/superAdminSeedData';
import { NationalFederationItem } from '../../../types/superAdmin';

export const FederationManagementView: React.FC = () => {
  const [federations, setFederations] = useState<NationalFederationItem[]>(NATIONAL_FEDERATIONS);
  const [selectedFed, setSelectedFed] = useState<NationalFederationItem | null>(NATIONAL_FEDERATIONS[0]);

  const totalFederations = federations.length;
  const totalSocieties = federations.reduce((acc, f) => acc + f.societiesAffiliated, 0);
  const totalWorkers = federations.reduce((acc, f) => acc + f.workersRepresented, 0);
  const totalTurnover = federations.reduce((acc, f) => acc + f.totalEconomicTurnoverInr, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Apex_Federations_mmwfz', `Apex Federations`)}</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{totalFederations}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">{t('1_National___4_State_Apex_07t95', `1 National + 4 State Apex`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Affiliated_Societies_pxjm7', `Affiliated Societies`)}</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{totalSocieties}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Primary_Cooperative_Unions_s63rf', `Primary Cooperative Unions`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Artisans_Represented_gpxbn', `Artisans Represented`)}</div>
          <div className="text-3xl font-black text-emerald-700 mt-1">{totalWorkers.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('100__Democratic_Representation_b5xqw', `100% Democratic Representation`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Cumulative_Economic_Activity_fnmjq', `Cumulative Economic Activity`)}</div>
          <div className="text-3xl font-black text-slate-900 mt-1">₹{(totalTurnover / 10000000).toFixed(1)} {t('Cr_qxkdy', `Cr`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('Audited_FY_Turnover_if10t', `Audited FY Turnover`)}</div>
        </div>
      </div>

      {/* 2. Federations Master List & Detailed Leader Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Federations Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building size={16} className="text-blue-600" />
              <span>{t('National___State_Apex_Federati_7g9pj', `National & State Apex Federations`)}</span>
            </h3>
            <span className="text-xs text-slate-400">{t('Select_federation_for_governan_tm5wb', `Select federation for governance dossier`)}</span>
          </div>

          <div className="space-y-3">
            {federations.map((fed) => {
              const isSelected = selectedFed?.id === fed.id;
              return (
                <div
                  key={fed.id}
                  onClick={() => setSelectedFed(fed)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            fed.level === 'NATIONAL'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {fed.level} {t('APEX_0mi72', `APEX`)}</span>
                        <span className="text-xs text-slate-400 font-mono">{fed.code}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-1">{fed.name}</h4>
                      <p className="text-xs text-slate-500">{fed.jurisdiction}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 font-medium">{t('Performance_qvba8', `Performance`)}</div>
                      <div className="text-lg font-black text-blue-700">{fed.performanceScore} {t('__100_m4ofc', `/ 100`)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">{t('Societies_tevjd', `Societies`)}</div>
                      <div className="font-bold text-slate-800">{fed.societiesAffiliated}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">{t('Artisans_bvvh9', `Artisans`)}</div>
                      <div className="font-bold text-slate-800">{fed.workersRepresented.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">{t('Turnover_0wota', `Turnover`)}</div>
                      <div className="font-bold text-emerald-700">₹{(fed.totalEconomicTurnoverInr / 10000000).toFixed(1)} {t('Cr_5cxba', `Cr`)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Federation Leader & Governance Dossier */}
        <div className="lg:col-span-5">
          {selectedFed ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 sticky top-4">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  {t('Leadership___Regulatory_Profil_sptbc', `Leadership & Regulatory Profile`)}</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedFed.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('HQ__02mwu', `HQ:`)}{selectedFed.headquarters}
                </p>
              </div>

              {/* Leadership Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Elected_President___Director_ntkg7', `Elected President / Director`)}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {t('TERMED_upl2c', `TERMED`)}</span>
                </div>
                <div className="font-black text-slate-900 text-sm">{selectedFed.president}</div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <Phone size={13} className="text-slate-400" />
                    <span>{selectedFed.directorPhone}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Mail size={13} className="text-slate-400" />
                    <span>{selectedFed.directorEmail}</span>
                  </div>
                </div>
              </div>

              {/* Performance & Growth */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">{t('Performance_Score_od8h9', `Performance Score`)}</div>
                  <div className="text-xl font-black text-blue-700 mt-0.5">{selectedFed.performanceScore}{t('_100_jal6h', `/100`)}</div>
                  <div className="text-[10px] text-slate-500">{t('Ministry_Benchmark__85__gldf2', `Ministry Benchmark: 85+`)}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">{t('YoY_Growth_88ddk', `YoY Growth`)}</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">+{selectedFed.growthRateYoY}%</div>
                  <div className="text-[10px] text-slate-500">{t('Artisan_Onboarding_by5l8', `Artisan Onboarding`)}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Annual statutory audit dossier for ${selectedFed.name} scheduled with Central Registrar of Cooperative Societies (CRCS).`)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Schedule_CRCS_Statutory_Audit_1igjk', `Schedule CRCS Statutory Audit`)}</button>
                <button
                  onClick={() => alert(`Direct dispatch advisory broadcast issued to ${selectedFed.name} secretariats.`)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Issue_Ministry_Directive_Notic_x3y8g', `Issue Ministry Directive Notice`)}</button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              {t('Select_a_federation_to_view_le_1klr4', `Select a federation to view leadership and governance details.`)}</div>
          )}
        </div>
      </div>
    </div>
  );
};
