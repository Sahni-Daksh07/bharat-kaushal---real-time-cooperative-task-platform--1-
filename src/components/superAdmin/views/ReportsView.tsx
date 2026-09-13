import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Printer,
  Sparkles,
  Award,
  Filter,
  Eye,
  X,
  Shield,
  Building,
  Check,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { NATIONAL_IMPACT_KPIS, STATE_METRICS, SKILL_GAPS_DATA } from '../../../data/superAdminSeedData';
import { useAuth } from '../../../context/AuthContext';

interface ReportTemplate {
  id: string;
  title: string;
  category: 'Workforce' | 'Employment' | 'Skill Development' | 'Welfare' | 'Finance' | 'Societies' | 'Federations' | 'Forecasting' | 'Compliance';
  description: string;
  generatedDate: string;
  fileSize: string;
  statutoryAct: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'REP-WKR-01',
    title: 'National Workforce & Artisan Onboarding Audit',
    category: 'Workforce',
    description: 'Breakdown of 184,520 digitized artisans, Aadhaar e-KYC compliance, police clearance, and trade distributions.',
    generatedDate: 'September 2026',
    fileSize: '4.2 MB',
    statutoryAct: 'Section 14, Unorganised Workers Social Security Act 2008',
  },
  {
    id: 'REP-EMP-02',
    title: 'Employment & Direct Livelihood Generation Dossier',
    category: 'Employment',
    description: '4.28 million direct work-hours, informal-to-formal wage delta (+41.2%), and household poverty lifting index.',
    generatedDate: 'September 2026',
    fileSize: '3.8 MB',
    statutoryAct: 'Directorate General of Employment Monitoring Directive',
  },
  {
    id: 'REP-SKL-03',
    title: 'National Skill Competency & RPL Certification Audit',
    category: 'Skill Development',
    description: 'NSQF Level 3 & 4 certifications issued in collaboration with NSDC, Skill India Digital Hub (SIDH), and state ITIs.',
    generatedDate: 'Q2 FY 2026-27',
    fileSize: '2.9 MB',
    statutoryAct: 'National Council for Vocational Education and Training (NCVET)',
  },
  {
    id: 'REP-WLF-04',
    title: 'Social Security Welfare Pool & Insurance Underwriting Report',
    category: 'Welfare',
    description: '2% statutory welfare collections (₹2.56 Cr) and PMSBY ₹2,00,000 accidental insurance coverage per worker.',
    generatedDate: 'August 2026',
    fileSize: '1.8 MB',
    statutoryAct: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY) Interlock',
  },
  {
    id: 'REP-FIN-05',
    title: 'Cooperative Financial Settlement & Direct Payout Audit',
    category: 'Finance',
    description: 'Audited statement of 94.5% direct worker payout (₹121.38 Cr) and 3.5% society operations share with zero intermediary leakages.',
    generatedDate: 'August 2026',
    fileSize: '5.1 MB',
    statutoryAct: 'Multi-State Cooperative Societies Financial Audit Rule 2002',
  },
  {
    id: 'REP-SOC-06',
    title: 'Primary Cooperative Societies Statutory Compliance Dossier',
    category: 'Societies',
    description: 'Performance scores, democratic resolution audits, and financial solvency ratings across 224 primary labor cooperatives.',
    generatedDate: 'September 2026',
    fileSize: '6.4 MB',
    statutoryAct: 'Central Registrar of Cooperative Societies Inspection Standard',
  },
  {
    id: 'REP-FED-07',
    title: 'National & State Apex Federations Statutory Review',
    category: 'Federations',
    description: 'Inter-state reciprocal dispatch protocols, democratic governance, and economic turnover across 14 state unions.',
    generatedDate: 'Annual FY 2025-26',
    fileSize: '8.2 MB',
    statutoryAct: 'National Cooperative Union of India (NCUI) Charter',
  },
  {
    id: 'REP-FCT-08',
    title: 'Predictive Demand & Seasonal Worker Requirement Forecast',
    category: 'Forecasting',
    description: 'Machine learning demand projections across 14 states with monsoon and festive season surge planning.',
    generatedDate: 'September 2026',
    fileSize: '3.1 MB',
    statutoryAct: 'National Workforce Planning & Human Resource Directive',
  },
  {
    id: 'REP-CMP-09',
    title: 'Statutory Regulatory Compliance & Anti-Fraud Audit',
    category: 'Compliance',
    description: 'Biometric deduplication, fake GPS audits, zero arbitrary terminations, and human review dispute disposition logs.',
    generatedDate: 'September 2026',
    fileSize: '2.5 MB',
    statutoryAct: 'Code on Social Security 2020 & Grievance Redressal Mandate',
  },
];

export const ReportsView: React.FC = () => {
  const { superAdminUser } = useAuth();

  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Custom Report Builder State
  const [customRange, setCustomRange] = useState('CURRENT_MONTH');
  const [customState, setCustomState] = useState('ALL');
  const [customCategory, setCustomCategory] = useState('ALL');

  // Filtered Templates
  const filteredTemplates = REPORT_TEMPLATES.filter((r) => {
    if (filterCategory === 'ALL') return true;
    return r.category === filterCategory;
  });

  // Export handlers
  const handleDownloadCSV = (report: ReportTemplate) => {
    setExportNotice(`Preparing CSV data stream for: ${report.title}...`);

    let csvContent = '\uFEFF'; // BOM for proper Excel UTF-8 display
    csvContent += `GOVERNMENT OF INDIA - BHARAT KAUSHAL STATUTORY DOSSIER\n`;
    csvContent += `Report Title,"${report.title}"\n`;
    csvContent += `Report ID,"${report.id}"\n`;
    csvContent += `Statutory Authority,"Ministry of Labour & Employment / Central Registrar of Cooperative Societies"\n`;
    csvContent += `Authorizing Officer,"${superAdminUser?.name || 'Dr. Amitabh Verma, IAS'}"\n`;
    csvContent += `Official Designation,"${superAdminUser?.officialDesignation || 'Joint Secretary & Mission Director'}"\n`;
    csvContent += `Classification,"OFFICIAL STATUTORY AUDIT - FOR GOVERNMENT USE ONLY"\n`;
    csvContent += `Timestamp,"${new Date().toISOString()}"\n`;
    csvContent += `\n`;
    csvContent += `NATIONAL AGGREGATE SUMMARY\n`;
    csvContent += `Metric,Value,Unit\n`;
    csvContent += `Total Artisans Digitized,${NATIONAL_IMPACT_KPIS.workersDigitized},Artisans\n`;
    csvContent += `Aadhaar e-KYC Verified,${NATIONAL_IMPACT_KPIS.workersVerified},Artisans (${NATIONAL_IMPACT_KPIS.verificationRate}%)\n`;
    csvContent += `Total Jobs Executed,${NATIONAL_IMPACT_KPIS.totalJobsCompleted},Jobs\n`;
    csvContent += `Gross Service Turnover,${NATIONAL_IMPACT_KPIS.grossServiceValueInr},INR\n`;
    csvContent += `Direct Worker Earnings (94.5%),${NATIONAL_IMPACT_KPIS.workerDirectIncomeInr},INR\n`;
    csvContent += `Welfare Fund Corpus (2.0%),${NATIONAL_IMPACT_KPIS.welfareCorpusInr},INR\n`;
    csvContent += `Primary Societies Revenue (3.5%),${NATIONAL_IMPACT_KPIS.societyRevenueInr},INR\n`;
    csvContent += `Active States Covered,${NATIONAL_IMPACT_KPIS.statesActive},States\n`;
    csvContent += `Districts Covered,${NATIONAL_IMPACT_KPIS.districtsCovered},Districts\n`;
    csvContent += `\n`;
    csvContent += `STATE-WISE STATUTORY BREAKDOWN\n`;
    csvContent += `State Code,State Name,Total Workers,Verified Workers,Active Dispatch,Gross Revenue (INR),Worker Share (94.5%),Welfare Corpus (2.0%),Societies Count,Demand Index,Supply Index\n`;

    STATE_METRICS.forEach((sm) => {
      const workerShare = Math.round(sm.monthlyRevenueInr * 0.945);
      const welfareShare = Math.round(sm.monthlyRevenueInr * 0.02);
      csvContent += `"${sm.stateCode}","${sm.stateName}",${sm.totalWorkers},${sm.verifiedWorkers},${sm.activeWorkers},${sm.monthlyRevenueInr},${workerShare},${welfareShare},${sm.societiesCount},${sm.demandIndex},${sm.supplyIndex}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setExportNotice(`CSV successfully generated and downloaded for "${report.title}".`);
    }, 400);
  };

  const handleDownloadJSON = (report: ReportTemplate) => {
    setExportNotice(`Compiling JSON payload for: ${report.title}...`);

    const payload = {
      dossierMetadata: {
        id: report.id,
        title: report.title,
        category: report.category,
        statutoryAct: report.statutoryAct,
        authorizingOfficer: superAdminUser?.name || 'Dr. Amitabh Verma, IAS',
        designation: superAdminUser?.officialDesignation || 'Joint Secretary & National Mission Director',
        clearanceLevel: superAdminUser?.clearanceLevel || 'APEX_LEVEL_5_NATIONAL',
        generatedAt: new Date().toISOString(),
        classification: 'GOVERNMENT_OF_INDIA_OFFICIAL_STATUTORY_RECORD',
        digitalSealHash: `NIC-SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      },
      nationalImpactKPIs: NATIONAL_IMPACT_KPIS,
      stateLevelMetrics: STATE_METRICS,
      skillGapBreakdown: SKILL_GAPS_DATA,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.id}_Statutory_Audit.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setExportNotice(`JSON machine-readable payload downloaded for "${report.title}".`);
    }, 400);
  };

  const handlePrintOrPDF = (report: ReportTemplate) => {
    setSelectedReport(report);
    // Give state a moment to render then prompt print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleOpenDossierModal = (report: ReportTemplate) => {
    setSelectedReport(report);
  };

  const handleGenerateCustomDossier = (e: React.FormEvent) => {
    e.preventDefault();
    const customTemplate: ReportTemplate = {
      id: `REP-CUST-${Date.now().toString().slice(-4)}`,
      title: `Custom Statutory Dossier (${customState === 'ALL' ? 'Pan-India' : customState} • ${customRange.replace(/_/g, ' ')})`,
      category: customCategory === 'ALL' ? 'Workforce' : (customCategory as any),
      description: `Custom query compiled for ${customState === 'ALL' ? 'all 14 active states' : customState} covering ${customRange.replace(/_/g, ' ')}. Authorized by ${superAdminUser?.name || 'Director General'}.`,
      generatedDate: 'Instant Compilation',
      fileSize: '3.4 MB',
      statutoryAct: 'Ad-hoc Parliamentary & Ministerial Query Compilation Protocol',
    };
    setSelectedReport(customTemplate);
    setExportNotice(`Custom Dossier compiled successfully for ${customTemplate.title}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {t('National_Governance___Statutor_oszag', `National Governance & Statutory Reporting Center`)}</h2>
                <p className="text-xs text-slate-500">
                  {t('Parliamentary_Dossiers__Minist_y3fxw', `Parliamentary Dossiers, Ministry Submissions, Direct Benefit Transfer Audits, and Welfare Certifications.`)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-600" />
              <span>{t('Digital_Signature_Active__NIC__gh73j', `Digital Signature Active (NIC-CRCS)`)}</span>
            </span>
          </div>
        </div>

        {/* Global Feedback Notice */}
        {exportNotice && (
          <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              <span>{exportNotice}</span>
            </div>
            <button
              onClick={() => setExportNotice(null)}
              className="text-blue-500 hover:text-blue-800 text-xs px-2 py-0.5"
            >
              {t('Dismiss_st5gw', `Dismiss`)}</button>
          </div>
        )}
      </div>

      {/* 2. Custom Report Builder Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              {t('Custom_Statutory_Dossier_Build_lfob0', `Custom Statutory Dossier Builder`)}</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {t('Direct_Query_Against_Multi_Sta_i6zvl', `Direct Query Against Multi-State Core Ledger`)}</span>
        </div>

        <form onSubmit={handleGenerateCustomDossier} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">{t('Audited_Time_Period_1163c', `Audited Time Period`)}</label>
            <select
              value={customRange}
              onChange={(e) => setCustomRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="CURRENT_MONTH">{t('Current_Month__September_2026__dxc06', `Current Month (September 2026)`)}</option>
              <option value="Q2_FY_2026_27">{t('Q2_FY_2026_27__Jul___Sep__0z5vd', `Q2 FY 2026-27 (Jul - Sep)`)}</option>
              <option value="Q1_FY_2026_27">{t('Q1_FY_2026_27__Apr___Jun__v1m20', `Q1 FY 2026-27 (Apr - Jun)`)}</option>
              <option value="FULL_FY_2025_26">{t('Full_FY_2025_26_Annual_fa04h', `Full FY 2025-26 Annual`)}</option>
              <option value="ALL_TIME_CUMULATIVE">{t('All_Time_Cumulative_Since_Laun_aefxj', `All-Time Cumulative Since Launch`)}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">{t('Geographic_Jurisdiction_ezsvw', `Geographic Jurisdiction`)}</label>
            <select
              value={customState}
              onChange={(e) => setCustomState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">{t('All_14_Active_States__National_vy9ux', `All 14 Active States (National Aggregate)`)}</option>
              <option value="Madhya Pradesh">{t('Madhya_Pradesh__MP__wsdzv', `Madhya Pradesh (MP)`)}</option>
              <option value="Uttar Pradesh">{t('Uttar_Pradesh__UP__175u3', `Uttar Pradesh (UP)`)}</option>
              <option value="Maharashtra">{t('Maharashtra__MH__lgwa2', `Maharashtra (MH)`)}</option>
              <option value="Rajasthan">{t('Rajasthan__RJ__egkmb', `Rajasthan (RJ)`)}</option>
              <option value="Gujarat">{t('Gujarat__GJ__fltv5', `Gujarat (GJ)`)}</option>
              <option value="Karnataka">{t('Karnataka__KA__s0j3y', `Karnataka (KA)`)}</option>
              <option value="Bihar">{t('Bihar__BR__4kn9z', `Bihar (BR)`)}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">{t('Thematic_Focus_pe7fs', `Thematic Focus`)}</label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">{t('All_Indicators__Unified_Compre_186vp', `All Indicators (Unified Comprehensive Dossier)`)}</option>
              <option value="Workforce">{t('Workforce___Artisan_Digitizati_y393r', `Workforce & Artisan Digitization`)}</option>
              <option value="Finance">{t('Cooperative_Financial_Split____s70gw', `Cooperative Financial Split & Payouts (94.5%)`)}</option>
              <option value="Welfare">{t('Welfare_Pool__2_0_____Social_S_ffe2p', `Welfare Pool (2.0%) & Social Security`)}</option>
              <option value="Skill Development">{t('NSDC___RPL_Skill_Certification_m4oxl', `NSDC & RPL Skill Certifications`)}</option>
              <option value="Societies">{t('Primary_Cooperative_Societies__lnngi', `Primary Cooperative Societies Solvency`)}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md h-[38px]"
            >
              <FileSpreadsheet size={15} />
              <span>{t('Compile___Preview_Dossier_q5jvf', `Compile & Preview Dossier`)}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
          <Filter size={13} />
          <span>{t('Category__vo4qp', `Category:`)}</span>
        </span>
        {[
          { key: 'ALL', label: 'All Statutory Reports' },
          { key: 'Workforce', label: 'Workforce' },
          { key: 'Employment', label: 'Employment' },
          { key: 'Finance', label: 'Finance' },
          { key: 'Welfare', label: 'Welfare' },
          { key: 'Skill Development', label: 'Skills' },
          { key: 'Societies', label: 'Societies' },
          { key: 'Compliance', label: 'Compliance' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterCategory === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Pre-Configured Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((rep) => (
          <div
            key={rep.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-100">
                  {rep.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">{rep.fileSize}</span>
              </div>

              <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700">{t('Statutory_Act__ft5md', `Statutory Act:`)}</span> {rep.statutoryAct}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>{t('Period__k4ds2', `Period:`)}<strong className="text-slate-700">{rep.generatedDate}</strong></span>
                <span className="font-mono font-bold text-slate-600">{rep.id}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  onClick={() => handleOpenDossierModal(rep)}
                  title={t('Preview_Full_Dossier_w3oel', `Preview Full Dossier`)}
                  className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Eye size={12} />
                  <span>{t('View_xliee', `View`)}</span>
                </button>
                <button
                  onClick={() => handlePrintOrPDF(rep)}
                  title={t('Print_or_Save_as_PDF_1t5w9', `Print or Save as PDF`)}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Printer size={12} />
                  <span>{t('PDF_0wfno', `PDF`)}</span>
                </button>
                <button
                  onClick={() => handleDownloadCSV(rep)}
                  title={t('Download_Raw_CSV_Data_gzncl', `Download Raw CSV Data`)}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet size={12} />
                  <span>{t('CSV_di1q6', `CSV`)}</span>
                </button>
                <button
                  onClick={() => handleDownloadJSON(rep)}
                  title={t('Export_Machine_Readable_JSON_hb4l1', `Export Machine-Readable JSON`)}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <FileCode size={12} />
                  <span>{t('JSON_h0090', `JSON`)}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. INTERACTIVE REPORT DOSSIER MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Top Control Bar */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-400 font-mono tracking-wider">
                      {t('Government_of_India___Ministry_va93f', `Government of India • Ministry of Labour & Employment`)}</span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-mono font-bold">
                      {t('STATUTORY_DOSSIER_7d4vv', `STATUTORY DOSSIER`)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {selectedReport.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title={t('Print_Official_Dossier_v4qps', `Print Official Dossier`)}
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => handleDownloadCSV(selectedReport)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title={t('Download_CSV_Data_1prat', `Download CSV Data`)}
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Dossier Body Printable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 print:p-0 print:m-0">
              {/* Official Header Insignia */}
              <div className="text-center space-y-1.5 border-b border-slate-200 pb-5">
                <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  {t('Sovereign_National_Cooperative_ub0gm', `Sovereign National Cooperative Registry`)}</div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {t('Bharat_Kaushal_National_Workfo_mv2xr', `Bharat Kaushal National Workforce Governance System`)}</h1>
                <div className="text-xs text-slate-600 font-medium">
                  {t('Statutory_Submission_under_rdj0p', `Statutory Submission under`)}{selectedReport.statutoryAct}
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  {t('Dossier_Ref__qhqya', `Dossier Ref:`)}{selectedReport.id} {t('__Issued__imyl5', `• Issued:`)}{selectedReport.generatedDate} {t('__Security_Classification__OFF_djpbr', `• Security Classification: OFFICIAL AUDIT`)}</div>
              </div>

              {/* National Aggregate Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Total_Digitized_Artisans_4h96i', `Total Digitized Artisans`)}</div>
                  <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                    {NATIONAL_IMPACT_KPIS.workersDigitized.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    {NATIONAL_IMPACT_KPIS.verificationRate}{t('__Aadhaar_Verified_vobod', `% Aadhaar Verified`)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Gross_Service_Turnover_a6wfu', `Gross Service Turnover`)}</div>
                  <div className="text-base font-black text-blue-900 font-mono mt-0.5">
                    ₹{(NATIONAL_IMPACT_KPIS.grossServiceValueInr / 10000000).toFixed(2)} {t('Cr_w0c29', `Cr`)}</div>
                  <div className="text-[10px] text-slate-500">{t('1_42M_Jobs_Executed_8etbc', `1.42M Jobs Executed`)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">{t('Direct_Worker_Payout__94_5___spfd7', `Direct Worker Payout (94.5%)`)}</div>
                  <div className="text-base font-black text-emerald-950 font-mono mt-0.5">
                    ₹{(NATIONAL_IMPACT_KPIS.workerDirectIncomeInr / 10000000).toFixed(2)} {t('Cr_8tlas', `Cr`)}</div>
                  <div className="text-[10px] text-emerald-700 font-bold">{t('_41_2__Above_Informal_re013', `+41.2% Above Informal`)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-900 uppercase">{t('Welfare_Fund_Pool__2_0___ttqcx', `Welfare Fund Pool (2.0%)`)}</div>
                  <div className="text-base font-black text-amber-950 font-mono mt-0.5">
                    ₹{(NATIONAL_IMPACT_KPIS.welfareCorpusInr / 10000000).toFixed(2)} {t('Cr_1lhsn', `Cr`)}</div>
                  <div className="text-[10px] text-amber-800 font-bold">{t('PMSBY_Underwritten_oz2bv', `PMSBY Underwritten`)}</div>
                </div>
              </div>

              {/* State Breakdown Audited Table */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Building size={14} className="text-blue-600" />
                    <span>{t('State_Cooperative_Union_Breakd_u60dx', `State Cooperative Union Breakdown (`)}{STATE_METRICS.length} {t('Active_Jurisdictions__8w3wd', `Active Jurisdictions)`)}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{t('Realtime_Synchronization_r66b2', `Realtime Synchronization`)}</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">{t('State___Jurisdiction_p0gx3', `State / Jurisdiction`)}</th>
                        <th className="p-3 text-right">{t('Artisans_tooqu', `Artisans`)}</th>
                        <th className="p-3 text-right">{t('Verified_yed29', `Verified`)}</th>
                        <th className="p-3 text-right">{t('Active_Dispatch_snphv', `Active Dispatch`)}</th>
                        <th className="p-3 text-right">{t('Gross_Revenue__INR__uskum', `Gross Revenue (INR)`)}</th>
                        <th className="p-3 text-right">{t('Worker_Payout__94_5___twcjh', `Worker Payout (94.5%)`)}</th>
                        <th className="p-3 text-right">{t('Welfare__2___hd8e0', `Welfare (2%)`)}</th>
                        <th className="p-3 text-center">{t('Societies_4bp4b', `Societies`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {STATE_METRICS.map((sm) => {
                        const workerPayout = Math.round(sm.monthlyRevenueInr * 0.945);
                        const welfareCorpus = Math.round(sm.monthlyRevenueInr * 0.02);
                        return (
                          <tr key={sm.stateCode} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 rounded">
                                {sm.stateCode}
                              </span>
                              <span>{sm.stateName}</span>
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700">
                              {sm.totalWorkers.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-700 font-semibold">
                              {sm.verifiedWorkers.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-right font-mono text-blue-700">
                              {sm.activeWorkers.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                              ₹{(sm.monthlyRevenueInr / 100000).toFixed(2)} L
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-800">
                              ₹{(workerPayout / 100000).toFixed(2)} L
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-amber-800">
                              ₹{(welfareCorpus / 100000).toFixed(2)} L
                            </td>
                            <td className="p-3 text-center font-mono text-slate-600 font-bold">
                              {sm.societiesCount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Attestation & Digital Stamp */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>{t('Digitally_Authenticated_by_Cen_zwu33', `Digitally Authenticated by Central Registrar of Cooperative Societies (CRCS)`)}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {t('Signatory__9fylu', `Signatory:`)}{superAdminUser?.name || 'Dr. Amitabh Verma, IAS'} ({superAdminUser?.officialDesignation || 'Joint Secretary & National Mission Director'})
                  </div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    {t('Public_Key__SHA256_4a8b89e87b7_rcvr4', `Public Key: SHA256:4a8b89e87b78912e78fa09 • Timestamp:`)}{new Date().toUTCString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadCSV(selectedReport)}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    <span>{t('Download_CSV_wdga9', `Download CSV`)}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer size={14} />
                    <span>{t('Print_Dossier_i8wwc', `Print Dossier`)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
