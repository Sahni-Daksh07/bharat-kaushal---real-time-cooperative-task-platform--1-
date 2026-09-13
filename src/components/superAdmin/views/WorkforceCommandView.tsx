import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  IndianRupee,
  MapPin,
  Clock,
  Briefcase,
  X,
  Phone,
  Mail,
  FileCheck,
  Zap,
  TrendingUp,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { SEEDED_WORKERS, SEEDED_SOCIETIES } from '../../../data/seedData';
import { WorkerProfile } from '../../../types';
import { NATIONAL_IMPACT_KPIS } from '../../../data/superAdminSeedData';

export const WorkforceCommandView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSociety, setSelectedSociety] = useState('ALL');
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  const workers = SEEDED_WORKERS;

  // Filter workers based on search criteria
  const filteredWorkers = workers.filter((w) => {
    const matchesQuery =
      searchQuery === '' ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.primaryTrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrade = selectedTrade === 'ALL' || w.primaryTrade.toLowerCase() === selectedTrade.toLowerCase();
    const matchesState = selectedState === 'ALL' || w.state.toLowerCase() === selectedState.toLowerCase();
    const matchesSociety = selectedSociety === 'ALL' || w.societyId === selectedSociety;
    const matchesTrust = w.trustScore >= minTrustScore;

    return matchesQuery && matchesTrade && matchesState && matchesSociety && matchesTrust;
  });

  return (
    <div className="space-y-6">
      {/* 1. Top Workforce Command KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Total_Workforce_27rae', `Total Workforce`)}</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {NATIONAL_IMPACT_KPIS.workersDigitized.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{t('100__e_Shram_linked_p4htu', `100% e-Shram linked`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Available_Workforce_aeyt3', `Available Workforce`)}</div>
          <div className="text-2xl font-black text-teal-700 mt-1">{t('94_200_lx29v', `94,200`)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{t('Active___ready_for_dispatch_ey1of', `Active & ready for dispatch`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Skilled__NSQF_L3_4__u8mlp', `Skilled (NSQF L3/4)`)}</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{t('118_500_nnrjn', `118,500`)}</div>
          <div className="text-[10px] text-blue-600 font-bold mt-0.5">{t('64_2__certified_masters_qmzw5', `64.2% certified masters`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Semi_Skilled___Apprentice_5ptxi', `Semi-Skilled / Apprentice`)}</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{t('66_020_6vozz', `66,020`)}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">{t('Under_cooperative_mentorship_rvf6a', `Under cooperative mentorship`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('High_Demand_Skills_mdrk3', `High Demand Skills`)}</div>
          <div className="text-base font-black text-slate-900 mt-1">{t('HVAC___Solar_g2mzu', `HVAC & Solar`)}</div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">{t('38__regional_deficit_4pp4t', `38% regional deficit`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Low_Availability_Skills_bxwz8', `Low Availability Skills`)}</div>
          <div className="text-base font-black text-slate-900 mt-1">{t('3_Phase_Industrial_vgnzl', `3-Phase Industrial`)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{t('RPL_batches_active_sas91', `RPL batches active`)}</div>
        </div>
      </div>

      {/* 2. Search & Filter Console */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span>{t('National_Artisan_Registry_Sear_syo5h', `National Artisan Registry Search & Multi-Parametric Filter`)}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {t('Showing_eno2s', `Showing`)}<strong>{filteredWorkers.length}</strong> {t('artisans_matching_criteria_uxp7t', `artisans matching criteria`)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t('Search_by_Artisan_Name__ID__Tr_m219c', `Search by Artisan Name, ID, Trade, District, City...`)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trade Filter */}
          <div>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">{t('All_Trades___Skills_r7ja3', `All Trades / Skills`)}</option>
              <option value="Plumbing">{t('Plumbing___Sanitation_bt57p', `Plumbing & Sanitation`)}</option>
              <option value="Electrical">{t('Electrical_Works_jwvao', `Electrical Works`)}</option>
              <option value="Carpentry">{t('Carpentry___Woodwork_r3qxa', `Carpentry & Woodwork`)}</option>
              <option value="Appliance Repair">{t('Appliance___HVAC_7masg', `Appliance & HVAC`)}</option>
              <option value="Painting">{t('Painting___Civil_0iflj', `Painting & Civil`)}</option>
            </select>
          </div>

          {/* Society Filter */}
          <div>
            <select
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">{t('All_Cooperative_Societies_vxwnm', `All Cooperative Societies`)}</option>
              {SEEDED_SOCIETIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Min Trust Score */}
          <div>
            <select
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>{t('Any_Trust_Score_6yeek', `Any Trust Score`)}</option>
              <option value={80}>{t('Trust_Score__ge__80_lbubt', `Trust Score &ge; 80`)}</option>
              <option value={90}>{t('Trust_Score__ge__90__High_Trus_hfagi', `Trust Score &ge; 90 (High Trust)`)}</option>
              <option value={95}>{t('Trust_Score__ge__95__Apex_Arti_sem1e', `Trust Score &ge; 95 (Apex Artisan)`)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Artisan Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">{t('Artisan_Identity_6ctse', `Artisan Identity`)}</th>
                <th className="py-3 px-4">{t('Trade___Experience_1ids2', `Trade & Experience`)}</th>
                <th className="py-3 px-4">{t('Cooperative_Society_n3h1w', `Cooperative Society`)}</th>
                <th className="py-3 px-4">{t('Trust___Reliability_hxpee', `Trust & Reliability`)}</th>
                <th className="py-3 px-4">{t('Total_Earnings__94_5___uypvf', `Total Earnings (94.5%)`)}</th>
                <th className="py-3 px-4">{t('Welfare_Pool_14y36', `Welfare Pool`)}</th>
                <th className="py-3 px-4">{t('Status_xsh8s', `Status`)}</th>
                <th className="py-3 px-4 text-right">{t('Administrative_Action_dte8d', `Administrative Action`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs shrink-0">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{w.name}</span>
                          {w.verificationStatus === 'VERIFIED' && (
                            <span title={t('Aadhaar_Verified_ni3r5', `Aadhaar Verified`)}>
                              <ShieldCheck size={13} className="text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {w.id} • {w.city}, {w.state}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{w.primaryTrade}</div>
                    <div className="text-[10px] text-slate-500">
                      {w.skills[0]?.yearsExperience || 5} {t('yrs_exp___Assessment__s4xa3', `yrs exp • Assessment:`)}{w.skillAssessmentScore}{t('_100_340ym', `/100`)}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{w.societyName.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{w.societyId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-12 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${w.trustScore}%` }}
                        />
                      </div>
                      <span className="font-black text-slate-800 text-[11px]">{w.trustScore}{t('_100_rdr4o', `/100`)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ★ {w.rating} ({w.completedJobs} {t('jobs__bt9d4', `jobs)`)}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-black text-emerald-700">₹{w.earnings.total.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">{t('Lifetime_Gross_atm7o', `Lifetime Gross`)}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-blue-700">₹{w.welfareBalance.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">{t('2__Social_Security_7hxr7', `2% Social Security`)}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.availability
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {w.availability ? 'ON DUTY' : 'OFFLINE'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedWorker(w)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs transition-colors"
                    >
                      {t('Admin_Profile_Dossier_an9h9', `Admin Profile Dossier`)}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. WORKER PROFILE ADMIN VIEW MODAL */}
      {selectedWorker && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-t-3xl flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                      {t('Level_4_Accredited_Artisan_rbkyh', `Level-4 Accredited Artisan`)}</span>
                    <span className="text-xs text-slate-300 font-mono">{t('UAN__925mi', `UAN:`)}{selectedWorker.uanNumber}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedWorker.name}</h3>
                  <p className="text-xs text-slate-300">
                    {selectedWorker.primaryTrade} {t('Specialist___v8p4v', `Specialist •`)}{selectedWorker.societyName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Quick Info Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Worker_ID_usjvu', `Worker ID`)}</div>
                  <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">{selectedWorker.id}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Trust_Score_ltwpb', `Trust Score`)}</div>
                  <div className="font-bold text-emerald-700 text-base mt-0.5">{selectedWorker.trustScore} {t('__100_mabiy', `/ 100`)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Reliability_Index_2xlac', `Reliability Index`)}</div>
                  <div className="font-bold text-blue-700 text-base mt-0.5">{selectedWorker.reliabilityScore}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Completed_Jobs_70jz4', `Completed Jobs`)}</div>
                  <div className="font-bold text-slate-900 text-base mt-0.5">
                    {selectedWorker.completedJobs} {t('___25e7y', `(★`)}{selectedWorker.rating})
                  </div>
                </div>
              </div>

              {/* Skills, Experience, Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-blue-600" />
                    <span>{t('Skills___Competency_Assessment_s51vs', `Skills & Competency Assessment`)}</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedWorker.skills.map((sk) => (
                      <div key={sk.name} className="bg-slate-50 p-2.5 rounded-xl text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{sk.name}</div>
                          <div className="text-[10px] text-slate-500">{sk.yearsExperience} {t('Years_Professional_Experience_dh9rn', `Years Professional Experience`)}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                          {sk.isPrimary ? 'Primary Trade' : 'Secondary'}
                        </span>
                      </div>
                    ))}
                    <div className="text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span>{t('NSDC_Skill_Assessment_Score__atex6', `NSDC Skill Assessment Score:`)}</span>
                      <strong className="font-black text-sm">{selectedWorker.skillAssessmentScore} {t('__100_5u6lv', `/ 100`)}</strong>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-emerald-600" />
                    <span>{t('Financials___Welfare_Contribut_bmhqk', `Financials & Welfare Contributions`)}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">{t('Total_Lifetime_Payout__94_5____e22lr', `Total Lifetime Payout (94.5%):`)}</span>
                      <span className="font-black text-emerald-700">₹{selectedWorker.earnings.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">{t('Social_Security_Welfare_Pool___c8ibs', `Social Security Welfare Pool (2%):`)}</span>
                      <span className="font-bold text-blue-700">₹{selectedWorker.welfareBalance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">{t('Bank_IFSC_Linked__0x411', `Bank IFSC Linked:`)}</span>
                      <span className="font-mono text-slate-800">{selectedWorker.bankDetails.ifsc}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">{t('Insurance_Scheme__sb3qd', `Insurance Scheme:`)}</span>
                      <span className="font-bold text-slate-900">{t('PMSBY__2_Lakh_Accidental_71375', `PMSBY ₹2 Lakh Accidental`)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8-Stage Lifecycle Timeline */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Clock size={15} className="text-amber-600" />
                  <span>{t('Artisan_Governance_Lifecycle_A_2koh9', `Artisan Governance Lifecycle Audit Timeline`)}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { stage: '1. Registration', status: 'Completed', date: '14 May 2024', desc: 'e-Shram UAN Linked' },
                    { stage: '2. Verification', status: 'Passed', date: '18 May 2024', desc: 'DigiLocker & Police Clearance' },
                    { stage: '3. Assessment', status: 'Certified', date: '25 May 2024', desc: 'Score: 92/100 RPL L4' },
                    { stage: '4. Bookings', status: 'Active', date: 'Current', desc: `${selectedWorker.completedJobs} Jobs Fulfilled` },
                    { stage: '5. Earnings', status: 'Settled', date: 'T+0 Automated', desc: '94.5% Direct UPI' },
                    { stage: '6. Welfare', status: 'Active Pool', date: 'Monthly', desc: 'PMSBY Premium Auto-Paid' },
                    { stage: '7. Training', status: 'Upgraded', date: '10 Aug 2026', desc: 'Appliance Diagnostics Master' },
                    { stage: '8. Disputes', status: 'Zero Flags', date: 'Clean Record', desc: '0 Active Complaints' },
                  ].map((item) => (
                    <div key={item.stage} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                      <div className="text-[10px] font-bold text-slate-400">{item.stage}</div>
                      <div className="font-bold text-emerald-700 text-xs mt-0.5">{item.status}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{item.desc}</div>
                      <div className="text-[9px] text-slate-400 mt-1 font-mono">{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 rounded-b-3xl border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {t('Cooperative_Member_ID__gce2c', `Cooperative Member ID:`)}<strong className="text-slate-800">{selectedWorker.id}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Artisan record ${selectedWorker.id} exported to official dossier format.`)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Export_Profile_Dossier_5dui0', `Export Profile Dossier`)}</button>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {t('Close_Dossier_u7e1d', `Close Dossier`)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
