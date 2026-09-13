import React, { useState } from 'react';
import {
  Award,
  Users,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Building,
  HeartHandshake,
  Download,
  Share2,
  FileText,
  MapPin,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { NATIONAL_IMPACT_KPIS, STATE_METRICS } from '../../../data/superAdminSeedData';

const SECTOR_DISTRIBUTION = [
  { name: 'Sanitation & Plumbing', value: 34, color: '#3b82f6' },
  { name: 'Electrical & Electronics', value: 28, color: '#10b981' },
  { name: 'Appliance & HVAC', value: 16, color: '#f59e0b' },
  { name: 'Carpentry & Joinery', value: 12, color: '#8b5cf6' },
  { name: 'Civil, Painting & Masonry', value: 10, color: '#ec4899' },
];

const WAGE_COMPARISON_DATA = [
  { trade: 'Plumber', informalDaily: 450, bharatKaushalDaily: 820, uplift: '+82%' },
  { trade: 'Electrician', informalDaily: 500, bharatKaushalDaily: 890, uplift: '+78%' },
  { trade: 'AC Tech', informalDaily: 600, bharatKaushalDaily: 1150, uplift: '+91%' },
  { trade: 'Carpenter', informalDaily: 550, bharatKaushalDaily: 870, uplift: '+58%' },
  { trade: 'Painter', informalDaily: 480, bharatKaushalDaily: 760, uplift: '+58%' },
];

export const GovernmentImpactView: React.FC = () => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2026-27');
  const [isExporting, setIsExporting] = useState(false);

  const kpis = NATIONAL_IMPACT_KPIS;

  const handleDownloadImpactReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Metric,National Value,Unit\n' +
        `Workers Digitized,${kpis.workersDigitized},Artisans\n` +
        `Workers Verified,${kpis.workersVerified},Artisans\n` +
        `Jobs Completed,${kpis.totalJobsCompleted},Dispatches\n` +
        `Gross Service Turnover,${kpis.grossServiceValueInr},INR\n` +
        `Direct Worker Income (94.5%),${kpis.workerDirectIncomeInr},INR\n` +
        `MPSLWB Welfare Corpus (2.0%),${kpis.welfareCorpusInr},INR\n` +
        `Women Artisan Participation,${kpis.womenParticipationPercent},%\n` +
        `Rural Reach,${kpis.ruralArtisanPercent},%\n` +
        `Districts Covered,${kpis.districtsCovered},Districts\n` +
        `States Active,${kpis.statesActive},States\n` +
        `Skill Certifications Issued,${kpis.skillCertificationsIssued},Certificates\n` +
        `Direct Employment Hours,${kpis.directEmploymentHours},Hours\n` +
        `Average Monthly Income,${kpis.averageWorkerMonthlyIncomeInr},INR/Month\n`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Bharat_Kaushal_National_Impact_Report_${selectedFiscalYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: The Central Impact Thesis */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Award size={14} />
              <span>{t('National_Impact_Dossier_2o1rm', `National Impact Dossier`)}</span>
            </span>
            <span className="text-xs text-amber-200/90 font-medium">{t('Official_Government_Monitoring_6ltt1', `Official Government Monitoring Record`)}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            {t('What_Impact_is_Bharat_Kaushal__omddy', `What Impact is Bharat Kaushal Creating for Workers and the Economy?`)}</h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t('By_shifting_from_predatory_gig_9dxmi', `By shifting from predatory gig intermediaries (which confiscate 25-35% commission) to a worker-owned cooperative federation model retaining`)}<strong>{t('94_5__direct_income_wzrl7', `94.5% direct income`)}</strong>{t('__Bharat_Kaushal_has_generated_j58hp', `, Bharat Kaushal has generated formal economic sovereignty, social security insurance, and certified livelihoods for unorganized informal labour.`)}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadImpactReport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2"
            >
              <Download size={15} />
              <span>{isExporting ? 'Generating Official Dossier...' : 'Export National Impact Report (CSV / PDF)'}</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 px-3 py-2 rounded-xl border border-white/10 backdrop-blur">
              <Calendar size={13} />
              <span>{t('Reporting_Fiscal__ewy4h', `Reporting Fiscal:`)}</span>
              <select
                value={selectedFiscalYear}
                onChange={(e) => setSelectedFiscalYear(e.target.value)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none"
              >
                <option value="2026-27" className="text-slate-900">{t('FY_2026_27__Current__94096', `FY 2026-27 (Current)`)}</option>
                <option value="2025-26" className="text-slate-900">{t('FY_2025_26__Audit_Complete__jvvhc', `FY 2025-26 (Audit Complete)`)}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Primary 11 Core Impact Indicators required by Government Agencies */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Sparkles size={14} className="text-amber-600" />
          <span>{t('The_11_Core_National_Transform_aqdh2', `The 11 Core National Transformational Indicators`)}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 1. Workers Digitized */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('1__Workers_Digitized_jso3z', `1. Workers Digitized`)}</div>
            <div className="text-3xl font-black text-slate-900">{kpis.workersDigitized.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Unorganized_informal_gig_artis_mwtuc', `Unorganized informal gig artisans onboarded with digital biometric profiles & UAN linking.`)}</p>
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded w-fit">
              {t('100__Paperless_KYC_jtnr3', `100% Paperless KYC`)}</div>
          </div>

          {/* 2. Workers Verified */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('2__Workers_Verified_kmn7w', `2. Workers Verified`)}</div>
            <div className="text-3xl font-black text-emerald-700">{kpis.workersVerified.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Identity_verified_via_DigiLock_4fz8u', `Identity verified via DigiLocker, police e-verification, & local cooperative society scrutiny.`)}</p>
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded w-fit">
              {kpis.verificationRate}{t('__National_Verification_Rate_s66i3', `% National Verification Rate`)}</div>
          </div>

          {/* 3. Jobs Completed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('3__Jobs_Completed_51qrn', `3. Jobs Completed`)}</div>
            <div className="text-3xl font-black text-blue-700">{kpis.totalJobsCompleted.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Verified_doorstep_services_del_0jx8p', `Verified doorstep services delivered with 2FA arrival and completion OTP authorization.`)}</p>
            <div className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded w-fit">
              {t('4_84___5_0_Citizen_Satisfactio_z5wnk', `4.84 / 5.0 Citizen Satisfaction`)}</div>
          </div>

          {/* 4. Income Generated (94.5%) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-xs space-y-2 bg-emerald-50/10">
            <div className="text-xs font-bold text-emerald-900">{t('4__Direct_Worker_Income_ovl5k', `4. Direct Worker Income`)}</div>
            <div className="text-3xl font-black text-emerald-700">{t('_121_38_Cr_q7aom', `₹121.38 Cr`)}</div>
            <p className="text-[11px] text-emerald-900/80 leading-snug">
              {t('94_5__of_gross_billings_direct_t0eck', `94.5% of gross billings directly credited to worker bank accounts via NPCI UPI without middleman cuts.`)}</p>
            <div className="text-[11px] text-emerald-900 font-black bg-emerald-100 px-2 py-0.5 rounded w-fit">
              {t('_41_2__Real_Wage_Uplift_39plc', `+41.2% Real Wage Uplift`)}</div>
          </div>

          {/* 5. Welfare Contributions (2%) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('5__Welfare_Contributions__2___hu0d6', `5. Welfare Contributions (2%)`)}</div>
            <div className="text-3xl font-black text-indigo-700">{t('_2_56_Cr_pwvn6', `₹2.56 Cr`)}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Dedicated_social_security_cont_jne1v', `Dedicated social security contributions transferred to State Labour Welfare Boards (MPSLWB).`)}</p>
            <div className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded w-fit">
              {t('154_200_Artisans_Insured_u098m', `154,200 Artisans Insured`)}</div>
          </div>

          {/* 6. Women Participation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('6__Women_Artisan_Participation_f0ter', `6. Women Artisan Participation`)}</div>
            <div className="text-3xl font-black text-rose-600">{kpis.womenParticipationPercent}%</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('67_165_women_artisans_in_home__dm9l0', `67,165 women artisans in home repair, deep cleaning, electrical assembly, and painting cooperatives.`)}</p>
            <div className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded w-fit">
              {t('Zero_Gender_Pay_Disparity_ki7d6', `Zero Gender Pay Disparity`)}</div>
          </div>

          {/* 7. Rural Reach */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('7__Rural___Peri_Urban_Reach_fc1eg', `7. Rural & Peri-Urban Reach`)}</div>
            <div className="text-3xl font-black text-amber-700">{kpis.ruralArtisanPercent}%</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Artisans_originating_from_Tier_qjoaz', `Artisans originating from Tier-3/4 tehsils and villages serving both rural hubs and urban clusters.`)}</p>
            <div className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded w-fit">
              {t('82_660_Rural_Households_Impact_dx17b', `82,660 Rural Households Impacted`)}</div>
          </div>

          {/* 8. District Coverage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('8__District_Coverage_osbx1', `8. District Coverage`)}</div>
            <div className="text-3xl font-black text-slate-900">{kpis.districtsCovered}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Administrative_districts_with__6kc89', `Administrative districts with fully registered Primary Labour Cooperative Societies.`)}</p>
            <div className="text-[11px] text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded w-fit">
              {t('224_Cooperative_Societies_5g7zy', `224 Cooperative Societies`)}</div>
          </div>

          {/* 9. State Coverage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('9__State_Coverage_1hj1g', `9. State Coverage`)}</div>
            <div className="text-3xl font-black text-slate-900">{kpis.statesActive}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Active_State_Apex_Federations__60isw', `Active State Apex Federations collaborating with State Labour & Cooperative Departments.`)}</p>
            <div className="text-[11px] text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded w-fit">
              {t('Phase_1___2_Deployment_Complet_phxzi', `Phase 1 & 2 Deployment Complete`)}</div>
          </div>

          {/* 10. Skill Certifications */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">{t('10__Skill_Certifications_Issue_ylj64', `10. Skill Certifications Issued`)}</div>
            <div className="text-3xl font-black text-teal-700">{kpis.skillCertificationsIssued.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Government_recognized_NSQF_Lev_bj39d', `Government-recognized NSQF Level 3 & 4 Recognition of Prior Learning (RPL) credentials awarded.`)}</p>
            <div className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded w-fit">
              {t('MSDE___NSDC_Approved_z2ots', `MSDE / NSDC Approved`)}</div>
          </div>

          {/* 11. Direct Employment Generated */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 lg:col-span-2">
            <div className="text-xs font-medium text-slate-500">{t('11__Direct_Employment_Generate_qgbeu', `11. Direct Employment Generated`)}</div>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-black text-slate-900">{t('4_28_Million_4zklk', `4.28 Million`)}</div>
              <span className="text-xs text-slate-500 font-medium">{t('productive_work_hours_logged_nb7dc', `productive work-hours logged`)}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t('Artisans_earn_an_average_month_ft4cw', `Artisans earn an average monthly income of`)}<strong>₹{kpis.averageWorkerMonthlyIncomeInr.toLocaleString('en-IN')}</strong>{t('__lifting_families_above_the_f_j13h3', `, lifting families above the formal poverty index with financial dignity.`)}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                {t('_41_2__Informal_Wage_Increase_kbtgl', `+41.2% Informal Wage Increase`)}</span>
              <span className="text-[11px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded">
                {t('_2_00_000_Accidental_Insurance_fdc4i', `₹2,00,000 Accidental Insurance per Artisan`)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Economic Analysis: Informal vs Cooperative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {t('Informal_Daily_Wage_vs__Bharat_gwn6k', `Informal Daily Wage vs. Bharat Kaushal Cooperative Wage (₹)`)}</h3>
              <p className="text-xs text-slate-500">{t('Direct_artisan_economic_uplift_6u6w3', `Direct artisan economic uplift across major trades`)}</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg">
              {t('Avg__69_4__Increase_iv56h', `Avg +69.4% Increase`)}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WAGE_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="trade" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  formatter={(val: any) => [`₹${val} / day`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="informalDaily" name="Informal Unorganized Daily Earning" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bharatKaushalDaily" name="Bharat Kaushal Guaranteed Earning" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs pt-1 border-t border-slate-100">
            {WAGE_COMPARISON_DATA.map((w) => (
              <div key={w.trade} className="bg-slate-50 p-2 rounded-xl">
                <div className="text-slate-500 text-[10px]">{w.trade}</div>
                <div className="text-emerald-700 font-black text-xs mt-0.5">{w.uplift}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">{t('Trade_Participation_Distributi_n9ds8', `Trade Participation Distribution`)}</h3>
            <p className="text-xs text-slate-500">{t('Sectoral_breakdown_across_regi_j1i6j', `Sectoral breakdown across registered cooperative trades`)}</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SECTOR_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SECTOR_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
