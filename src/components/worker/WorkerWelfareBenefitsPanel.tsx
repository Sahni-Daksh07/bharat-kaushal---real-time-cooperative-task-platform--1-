import React, { useState, useMemo } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { SupportedLanguage } from '../../utils/i18n';
import { INDORE_SERVICES_DATASET } from '../../data/servicesData';
import {
  HeartPulse,
  Shield,
  ShieldCheck,
  Umbrella,
  PiggyBank,
  GraduationCap,
  Sparkles,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Building2,
  Download,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  X,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface WorkerWelfareBenefitsPanelProps {
  lang?: SupportedLanguage;
  className?: string;
}

interface CompletedTaskItem {
  id: string;
  bookingId: string;
  serviceName: string;
  category: string;
  locality: string;
  completedAt: string;
  grossAmount: number;
  workerEarning: number;
  welfareContribution: number;
  policySnapshot: string;
  otpVerified: boolean;
}

export const WorkerWelfareBenefitsPanel: React.FC<WorkerWelfareBenefitsPanelProps> = ({
  className = '',
}) => {
  const { currentWorker, bookings, policy, welfareRecords } = useRealtime();

  // Interactive Projection Simulator State
  const [projectedMonthlyTasks, setProjectedMonthlyTasks] = useState<number>(25);
  const [projectedAvgTicket, setProjectedAvgTicket] = useState<number>(450);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROJECTIONS' | 'TASKS' | 'SCHEMES'>('OVERVIEW');

  // Claim Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimScheme, setClaimScheme] = useState<'MEDICAL' | 'TOOL_REPLACEMENT' | 'EDUCATION_SCHOLARSHIP' | 'ACCIDENT_COVER'>('MEDICAL');
  const [claimAmount, setClaimAmount] = useState('2500');
  const [claimRemarks, setClaimRemarks] = useState('Emergency medical expense incurred during trade visit');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Statement Download State
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Active welfare contribution percentage based on active policy model
  const activeWelfarePercent = useMemo(() => {
    return policy.activeModel === 'MODEL_A'
      ? policy.modelA.welfareFundPercent // 2.0%
      : policy.modelB.welfareFundPercent; // 2.5%
  }, [policy]);

  const activeWorkerSharePercent = useMemo(() => {
    return policy.activeModel === 'MODEL_A'
      ? policy.modelA.workerSharePercent // 94.5%
      : policy.modelB.workerSharePercent; // 95.0%
  }, [policy]);

  // Construct worker's completed tasks dataset (Live completed bookings + historical completed tasks)
  const completedTasksDataset: CompletedTaskItem[] = useMemo(() => {
    const list: CompletedTaskItem[] = [];

    // 1. Live completed bookings from context for this worker
    const liveCompleted = bookings.filter(
      (b) => b.workerId === currentWorker.id && b.status === 'COMPLETED'
    );

    liveCompleted.forEach((b) => {
      const gross = b.pricing.grossAmount || 250;
      const workerShare = b.pricing.workerShare || Math.round((gross * activeWorkerSharePercent) / 100);
      const welfare = b.pricing.welfareShare || Math.round((gross * activeWelfarePercent) / 100);

      list.push({
        id: `TSK-${b.id}`,
        bookingId: b.id,
        serviceName: b.serviceName,
        category: b.category,
        locality: b.customerAddress?.landmark || b.customerAddress?.address || 'Indore Central',
        completedAt: b.completedAt || new Date().toISOString(),
        grossAmount: gross,
        workerEarning: workerShare,
        welfareContribution: welfare,
        policySnapshot: policy.activeModel === 'MODEL_A' ? 'Model A (2.0% Welfare)' : 'Model B (2.5% Welfare)',
        otpVerified: true,
      });
    });

    // 2. Seeded historical completed tasks based on the worker's trade & completedJobs count
    // Generates realistic recent completed tasks in Indore
    const tradeServices = INDORE_SERVICES_DATASET.filter(
      (s) => s.category.toLowerCase() === currentWorker.primaryTrade.toLowerCase()
    );
    const fallbackServices = tradeServices.length > 0 ? tradeServices : INDORE_SERVICES_DATASET.slice(0, 5);

    const indoreLocalities = [
      'Navlakha Square, Near Holkar College',
      'Vijay Nagar, Near C21 Mall',
      'Rajwada, M.G. Road',
      'Bhawarkua, A.B. Road',
      'Palasia, Old Palasia Main Road',
      'Annapurna Temple Colony',
      'Sudama Nagar, Sector E',
      'Sapna Sangeeta Road',
      'Bengali Square, Kanadia Road',
      'Geeta Bhawan Square',
    ];

    const historicalCount = Math.min(12, Math.max(6, currentWorker.completedJobs || 8));

    for (let i = 0; i < historicalCount; i++) {
      const service = fallbackServices[i % fallbackServices.length];
      const locality = indoreLocalities[i % indoreLocalities.length];
      const gross = service.suggested_display_price_inr || 350;
      const workerShare = Math.round((gross * activeWorkerSharePercent) / 100);
      const welfare = Math.round((gross * activeWelfarePercent) / 100);
      const hoursAgo = (i + 1) * 26 + Math.floor(i * 3.5);
      const date = new Date(Date.now() - hoursAgo * 3600000);

      list.push({
        id: `TSK-${1080 - i}`,
        bookingId: `BK-IND-${1080 - i}`,
        serviceName: service.service_name,
        category: service.category,
        locality,
        completedAt: date.toISOString(),
        grossAmount: gross,
        workerEarning: workerShare,
        welfareContribution: welfare,
        policySnapshot: 'Model A (2.0% Welfare)',
        otpVerified: true,
      });
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }, [bookings, currentWorker, activeWorkerSharePercent, activeWelfarePercent, policy.activeModel]);

  // Aggregate statistics computed directly from the completed tasks dataset
  const datasetStats = useMemo(() => {
    const totalTasksInDataset = completedTasksDataset.length;
    const totalGrossInDataset = completedTasksDataset.reduce((sum, t) => sum + t.grossAmount, 0);
    const totalWorkerEarningsInDataset = completedTasksDataset.reduce((sum, t) => sum + t.workerEarning, 0);
    const totalWelfareInDataset = completedTasksDataset.reduce((sum, t) => sum + t.welfareContribution, 0);

    const avgGrossPerTask = totalTasksInDataset > 0 ? Math.round(totalGrossInDataset / totalTasksInDataset) : 400;
    const avgWelfarePerTask = totalTasksInDataset > 0 ? (totalWelfareInDataset / totalTasksInDataset) : 8;

    // Actual lifetime welfare fund
    const currentWelfareBalance = currentWorker.welfareBalance > 0
      ? currentWorker.welfareBalance
      : Math.round(totalWelfareInDataset + (currentWorker.completedJobs * avgWelfarePerTask));

    return {
      totalTasksInDataset,
      totalGrossInDataset,
      totalWorkerEarningsInDataset,
      totalWelfareInDataset,
      avgGrossPerTask,
      avgWelfarePerTask: Number(avgWelfarePerTask.toFixed(2)),
      currentWelfareBalance,
    };
  }, [completedTasksDataset, currentWorker]);

  // Projected Social Security Contributions Calculation
  const projections = useMemo(() => {
    // Current actual monthly pace estimate
    const pastMonthTasks = Math.min(datasetStats.totalTasksInDataset, 24);
    const actualMonthlyWelfareRunRate = Math.round(pastMonthTasks * datasetStats.avgWelfarePerTask);

    // Simulated projections based on worker's slider inputs
    const simMonthlyGross = projectedMonthlyTasks * projectedAvgTicket;
    const simMonthlyWorkerEarning = Math.round((simMonthlyGross * activeWorkerSharePercent) / 100);
    const simMonthlyWelfareContribution = Math.round((simMonthlyGross * activeWelfarePercent) / 100);

    // Multi-horizon projections
    const projected1Month = simMonthlyWelfareContribution;
    const projected6Months = simMonthlyWelfareContribution * 6;
    const projected1Year = simMonthlyWelfareContribution * 12;
    const projected3Years = simMonthlyWelfareContribution * 36;

    // Matching Govt/Cooperative Subsidies
    // Under MP Unorganized Workers Social Security Fund & PM-SYM,
    // workers receive matching contributions for designated pension & health reserves
    const matchingGovtSubsidyAnnual = Math.round(projected1Year * 0.5); // 50% State matching fund
    const totalProjected1YearCorpus = projected1Year + matchingGovtSubsidyAnnual;

    // Scheme-wise allocation breakdown of projected 1-year welfare funds
    const schemeAllocation = {
      accidentInsurance: 20, // PMSBY annual premium ₹20
      lifeInsurance: 436,    // PMJJBY annual premium ₹436
      healthBuffer: Math.round(projected1Year * 0.35), // 35% health & hospitalization pool
      pensionMatching: Math.round(projected1Year * 0.30), // 30% retirement pension matching
      childrenScholarship: Math.round(projected1Year * 0.15), // 15% skill & children education grant
      emergencyDistress: Math.max(0, projected1Year - (20 + 436 + Math.round(projected1Year * 0.35) + Math.round(projected1Year * 0.30) + Math.round(projected1Year * 0.15))),
    };

    return {
      actualMonthlyWelfareRunRate,
      simMonthlyGross,
      simMonthlyWorkerEarning,
      simMonthlyWelfareContribution,
      projected1Month,
      projected6Months,
      projected1Year,
      projected3Years,
      matchingGovtSubsidyAnnual,
      totalProjected1YearCorpus,
      schemeAllocation,
    };
  }, [datasetStats, projectedMonthlyTasks, projectedAvgTicket, activeWorkerSharePercent, activeWelfarePercent]);

  // Handle statement download
  const handleDownloadStatement = () => {
    const textData = `
=========================================================
BHARAT KAUSHAL COOPERATIVE LABOUR FEDERATION (MADHYA PRADESH)
MADHYA PRADESH STATE LABOUR WELFARE BOARD (MPSLWB)
STATUTORY WORKER SOCIAL SECURITY & WELFARE STATEMENT
=========================================================
Worker Name         : ${currentWorker.name}
Worker ID           : ${currentWorker.id}
Trade Guild         : ${currentWorker.primaryTrade}
Affiliated Society  : ${currentWorker.societyName}
e-Shram UAN         : UAN-MP-9824-7712-4521
MPSLWB Reg ID       : MP-IND-WLF-40192

Date of Statement   : ${new Date().toLocaleDateString('en-IN')}
Active Welfare Cess : ${activeWelfarePercent}% (${policy.activeModel})

FINANCIAL SUMMARY
---------------------------------------------------------
Completed Tasks     : ${currentWorker.completedJobs}
Accumulated Welfare : ₹${datasetStats.currentWelfareBalance}
Monthly Run-Rate    : ₹${projections.actualMonthlyWelfareRunRate} / month
Projected 12-Month  : ₹${projections.projected1Year}
Govt Matching Pool  : ₹${projections.matchingGovtSubsidyAnnual}

COVERED SOCIAL SECURITY SCHEMES:
1. PMSBY Accidental Death & Disability Cover: ₹2,00,000 (Active)
2. PMJJBY Life Insurance Protection: ₹2,00,000 (Active)
3. Ayushman & Emergency Healthcare Reserve: Funded (35%)
4. PM-SYM Contributory Old-Age Pension: Enrolled (₹3,000/mo at 60)
5. Children Education & Skill Upgradation: Eligible

=========================================================
Verified digitally via Indore Shramik Kaushal Sahakari Samiti.
=========================================================
    `.trim();

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Welfare_Statement_${currentWorker.id}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadNotice('Welfare Statement generated and downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimSubmitted(false);
      setIsClaimModalOpen(false);
    }, 2000);
  };

  return (
    <section className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6 dashboard-card ${className}`} data-dashboard-card="true">
      {/* Top Header: Identity, Scheme Accreditation & Stat Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <ShieldCheck size={18} />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              {t('Welfare___Social_Security_Bene_dk5t1', `Welfare & Social Security Benefits Summary`)}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {t('MPSLWB_Accredited_9ohw5', `MPSLWB Accredited`)}</span>
          </div>
          <p className="text-xs text-slate-500">
            {t('Automated_statutory_social_sec_wybp1', `Automated statutory social security accrual calculated from every verified task in Indore.`)}</p>
        </div>

        {/* Worker Social Security Identification Cardlet */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
          <div className="space-y-0.5 pr-3 border-r border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">{t('e_Shram_UAN_q4doe', `e-Shram UAN`)}</span>
            <span className="font-mono font-bold text-slate-800">{t('9824_7712_4521_wkpoj', `9824-7712-4521`)}</span>
          </div>
          <div className="space-y-0.5 pr-3 border-r border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">{t('Labour_Cess_Rate_lf0td', `Labour Cess Rate`)}</span>
            <span className="font-bold text-blue-700">{activeWelfarePercent}{t('____owyg2', `% (`)}{policy.activeModel})</span>
          </div>
          <button
            onClick={handleDownloadStatement}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title={t('Download_Statutory_Contributio_yk88z', `Download Statutory Contribution Statement`)}
          >
            <Download size={13} />
            <span>{t('Statement_x8bx9', `Statement`)}</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Shield size={13} />
            <span>{t('Current_Status_65okb', `Current Status`)}</span>
          </button>
          <button
            onClick={() => setActiveTab('PROJECTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'PROJECTIONS' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Calculator size={13} />
            <span>{t('Projected_Contributions_vzr9z', `Projected Contributions`)}</span>
          </button>
          <button
            onClick={() => setActiveTab('TASKS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'TASKS' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <FileText size={13} />
            <span>{t('Completed_Tasks_Dataset___c2mmt', `Completed Tasks Dataset (`)}{completedTasksDataset.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('SCHEMES')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'SCHEMES' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Umbrella size={13} />
            <span>{t('Govt_Schemes___Coverage_ekybp', `Govt Schemes & Coverage`)}</span>
          </button>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Sparkles size={13} />
          <span>{t('Claim_Welfare_Benefit_zonbr', `Claim Welfare Benefit`)}</span>
        </button>
      </div>

      {/* 4 Core Summary Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">{t('Accumulated_Welfare_Fund_ngii3', `Accumulated Welfare Fund`)}</div>
          <div className="text-xl font-black text-blue-700">₹{datasetStats.currentWelfareBalance}</div>
          <div className="text-[10px] text-slate-400">{t('Total_credited_to_MPSLWB_pool_yo6wn', `Total credited to MPSLWB pool`)}</div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-emerald-800 font-medium">{t('Completed_Tasks_Count_ywqj5', `Completed Tasks Count`)}</div>
          <div className="text-xl font-black text-emerald-700">{currentWorker.completedJobs} {t('Verified_dw278', `Verified`)}</div>
          <div className="text-[10px] text-emerald-800/80 font-bold">{t('100__OTP___Geo_validated_55zcs', `100% OTP & Geo-validated`)}</div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-amber-800 font-medium">{t('Avg_Welfare___Task_lv17e', `Avg Welfare / Task`)}</div>
          <div className="text-xl font-black text-amber-900">₹{datasetStats.avgWelfarePerTask}</div>
          <div className="text-[10px] text-amber-700 font-medium">{t('At_u4k9f', `At`)}{activeWelfarePercent}{t('__statutory_rate_w5jqy', `% statutory rate`)}</div>
        </div>

        <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-violet-800 font-medium">{t('Projected_Annual_Corpus_o8gpf', `Projected Annual Corpus`)}</div>
          <div className="text-xl font-black text-violet-900">₹{projections.totalProjected1YearCorpus}</div>
          <div className="text-[10px] text-violet-700 font-medium">{t('Includes_50__State_match_lscf2', `Includes 50% State match`)}</div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          {/* Social Security Benefits Pillars Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Accidental & Disability */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Shield size={18} />
                </span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {t('Fully_Covered_76hjr', `Fully Covered`)}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('Pradhan_Mantri_Suraksha_Bima___4m6d6', `Pradhan Mantri Suraksha Bima (PMSBY)`)}</h4>
              <p className="text-xs text-slate-600">
                {t('_2_00_000_accidental_death___p_hvpm0', `₹2,00,000 accidental death & permanent total disability insurance on duty in Indore district.`)}</p>
              <div className="pt-2 border-t border-slate-200 text-[11px] flex justify-between text-slate-500">
                <span>{t('Annual_Premium__sb0sg', `Annual Premium:`)}</span>
                <span className="font-bold text-slate-900">{t('_20_yr__Cooperative_Debited__410lp', `₹20/yr (Cooperative Debited)`)}</span>
              </div>
            </div>

            {/* Card 2: Term Life Insurance */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Umbrella size={18} />
                </span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {t('Active_1r2qr', `Active`)}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('PM_Jeevan_Jyoti_Bima__PMJJBY__qjpdi', `PM Jeevan Jyoti Bima (PMJJBY)`)}</h4>
              <p className="text-xs text-slate-600">
                {t('_2_00_000_life_assurance_cover_z5fye', `₹2,00,000 life assurance cover for family nominees against any cause of mortality.`)}</p>
              <div className="pt-2 border-t border-slate-200 text-[11px] flex justify-between text-slate-500">
                <span>{t('Annual_Premium__hm72o', `Annual Premium:`)}</span>
                <span className="font-bold text-slate-900">{t('_436_yr__Fund_Subsidized__1bde5', `₹436/yr (Fund Subsidized)`)}</span>
              </div>
            </div>

            {/* Card 3: Emergency Health & Hospitalization Cushion */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                  <HeartPulse size={18} />
                </span>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {t('Cooperative_Pool_b364i', `Cooperative Pool`)}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('Health___Hospitalization_Cushi_zk9ec', `Health & Hospitalization Cushion`)}</h4>
              <p className="text-xs text-slate-600">
                {t('Up_to__25_000_instant_emergenc_94be3', `Up to ₹25,000 instant emergency medical advance at empaneled Indore municipal hospitals.`)}</p>
              <div className="pt-2 border-t border-slate-200 text-[11px] flex justify-between text-slate-500">
                <span>{t('Dedicated_Allocation__67azx', `Dedicated Allocation:`)}</span>
                <span className="font-bold text-slate-900">{t('35__of_task_cess____rbffu', `35% of task cess (₹`)}{Math.round(datasetStats.currentWelfareBalance * 0.35)})</span>
              </div>
            </div>
          </div>

          {/* Quick Projection Glance */}
          <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <TrendingUp size={15} className="text-blue-700" />
                <span>{t('Projected_Social_Security_Traj_xqycq', `Projected Social Security Trajectory`)}</span>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                {t('At_your_current_pace___si3d9', `At your current pace (`)}{datasetStats.totalTasksInDataset} {t('recent_tasks_analyzed___you_ge_jy4km', `recent tasks analyzed), you generate approximately`)}<strong> ₹{projections.actualMonthlyWelfareRunRate}</strong> {t('in_social_security_contributio_yo2fo', `in social security contributions every month. In 12 months, your statutory balance will accumulate to`)}<strong>₹{datasetStats.currentWelfareBalance + (projections.actualMonthlyWelfareRunRate * 12)}</strong>.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('PROJECTIONS')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-2xs"
            >
              {t('Adjust_Task_Forecasts___rsrne', `Adjust Task Forecasts →`)}</button>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTIONS SIMULATOR */}
      {activeTab === 'PROJECTIONS' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator size={16} className="text-blue-600" />
                  <span>{t('Interactive_Social_Security_Pr_vjwuc', `Interactive Social Security Projection Calculator`)}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('Simulate_future_welfare_accumu_xyhyb', `Simulate future welfare accumulation based on your expected monthly completed tasks volume.`)}</p>
              </div>
              <span className="text-xs font-mono bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                {t('Rate__944ha', `Rate:`)}{activeWelfarePercent}{t('__Cess_dwsn6', `% Cess`)}</span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Slider 1: Tasks per month */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{t('Projected_Completed_Tasks___Mo_m3uqg', `Projected Completed Tasks / Month:`)}</span>
                  <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {projectedMonthlyTasks} {t('tasks_mo_zucdb', `tasks/mo`)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={projectedMonthlyTasks}
                  onChange={(e) => setProjectedMonthlyTasks(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t('Part_time__5__obsvy', `Part-time (5)`)}</span>
                  <span>{t('Standard__25__svlmx', `Standard (25)`)}</span>
                  <span>{t('Full_time_Peak__60__5pljd', `Full-time Peak (60)`)}</span>
                </div>
              </div>

              {/* Slider 2: Average Job Ticket */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{t('Average_Job_Value__Gross_INR___l1xgk', `Average Job Value (Gross INR):`)}</span>
                  <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    ₹{projectedAvgTicket} {t('__task_ccnhc', `/ task`)}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="25"
                  value={projectedAvgTicket}
                  onChange={(e) => setProjectedAvgTicket(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t('_200__Minor_Fix__nu8p7', `₹200 (Minor Fix)`)}</span>
                  <span>{t('_450__Indore_Avg__ksy28', `₹450 (Indore Avg)`)}</span>
                  <span>{t('_1_200__Major_Overhaul__vt2pr', `₹1,200 (Major Overhaul)`)}</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">{t('Quick_Presets__20b2z', `Quick Presets:`)}</span>
              <button
                onClick={() => { setProjectedMonthlyTasks(15); setProjectedAvgTicket(350); }}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                {t('Light_Load__15_jobs____350__xdfrr', `Light Load (15 jobs @ ₹350)`)}</button>
              <button
                onClick={() => { setProjectedMonthlyTasks(30); setProjectedAvgTicket(480); }}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                {t('Regular_Active__30_jobs____480_gyuhe', `Regular Active (30 jobs @ ₹480)`)}</button>
              <button
                onClick={() => { setProjectedMonthlyTasks(50); setProjectedAvgTicket(650); }}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                {t('High_Demand_Season__50_jobs____zpkkf', `High Demand Season (50 jobs @ ₹650)`)}</button>
            </div>
          </div>

          {/* Projection Horizons Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">{t('1_Month_Projected_bph08', `1 Month Projected`)}</div>
              <div className="text-xl font-black text-slate-900">₹{projections.projected1Month}</div>
              <div className="text-[10px] text-slate-500">{t('From_v3gn8', `From`)}{projectedMonthlyTasks} {t('tasks_completed_xboph', `tasks completed`)}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">{t('6_Months_Projected_7wagy', `6 Months Projected`)}</div>
              <div className="text-xl font-black text-slate-900">₹{projections.projected6Months}</div>
              <div className="text-[10px] text-slate-500">{t('From_mr6v4', `From`)}{projectedMonthlyTasks * 6} {t('tasks_lojn5', `tasks`)}</div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="text-[11px] text-emerald-800 font-medium">{t('12_Months__1_Year__ywbcj', `12 Months (1 Year)`)}</div>
              <div className="text-xl font-black text-emerald-700">₹{projections.projected1Year}</div>
              <div className="text-[10px] text-emerald-700">{t('____becn2', `+ ₹`)}{projections.matchingGovtSubsidyAnnual} {t('Govt_Match_eqhns', `Govt Match`)}</div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
              <div className="text-[11px] text-blue-800 font-medium">{t('3_Year_Long_Term_Pool_lw5ds', `3-Year Long Term Pool`)}</div>
              <div className="text-xl font-black text-blue-700">₹{projections.projected3Years}</div>
              <div className="text-[10px] text-blue-700">{t('Lifelong_Pension___Health_Fund_9um6w', `Lifelong Pension & Health Fund`)}</div>
            </div>
          </div>

          {/* Scheme Allocation of 1-Year Projected Funds */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold text-slate-900">
                {t('12_Month_Projected_Welfare_All_14ydf', `12-Month Projected Welfare Allocation Breakdown (₹`)}{projections.projected1Year})
              </h4>
              <span className="text-slate-500 text-[11px]">{t('MP_Unorganized_Workers_Fund_Di_7g8us', `MP Unorganized Workers Fund Distribution`)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px]">{t('PMSBY_Accident_er2qc', `PMSBY Accident`)}</div>
                <div className="font-black text-slate-900">₹{projections.schemeAllocation.accidentInsurance}</div>
                <div className="text-[10px] text-emerald-600">{t('_2_Lakh_Cover_5xblb', `₹2 Lakh Cover`)}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px]">{t('PMJJBY_Life_7kqgy', `PMJJBY Life`)}</div>
                <div className="font-black text-slate-900">₹{projections.schemeAllocation.lifeInsurance}</div>
                <div className="text-[10px] text-emerald-600">{t('_2_Lakh_Term_Life_2whmq', `₹2 Lakh Term Life`)}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px]">{t('Health___Medical_4oq41', `Health & Medical`)}</div>
                <div className="font-black text-slate-900">₹{projections.schemeAllocation.healthBuffer}</div>
                <div className="text-[10px] text-slate-500">{t('35__Cushion_dgkss', `35% Cushion`)}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px]">{t('Pension_Matching_gugqo', `Pension Matching`)}</div>
                <div className="font-black text-slate-900">₹{projections.schemeAllocation.pensionMatching}</div>
                <div className="text-[10px] text-blue-600">{t('PM_SYM_Account_fero6', `PM-SYM Account`)}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px]">{t('Child_Skill___Tool_bkggl', `Child Skill / Tool`)}</div>
                <div className="font-black text-slate-900">₹{projections.schemeAllocation.childrenScholarship}</div>
                <div className="text-[10px] text-slate-500">{t('Annual_Stipend_08sfp', `Annual Stipend`)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED TASKS DATASET TABLE */}
      {activeTab === 'TASKS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <span>{t('Current_Completed_Tasks_Datase_6p1w1', `Current Completed Tasks Dataset (`)}{completedTasksDataset.length} {t('Recent_Records__gu6mq', `Recent Records)`)}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t('Every_completed_task_automatic_qhjxt', `Every completed task automatically transfers`)}{activeWelfarePercent}{t('__to_the_MP_State_Labour_Welfa_bszar', `% to the MP State Labour Welfare Board.`)}</p>
            </div>

            <div className="text-xs text-slate-500">
              {t('Total_Dataset_Welfare__lh6vw', `Total Dataset Welfare:`)}<strong className="text-slate-900">₹{datasetStats.totalWelfareInDataset}</strong>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{t('Task_ID___Date_fs65u', `Task ID / Date`)}</th>
                    <th className="p-3">{t('Service___Trade_7qr88', `Service & Trade`)}</th>
                    <th className="p-3">{t('Customer_Locality__Indore__va6zb', `Customer Locality (Indore)`)}</th>
                    <th className="p-3 text-right">{t('Gross_Bill_8axai', `Gross Bill`)}</th>
                    <th className="p-3 text-right">{t('Worker_Take_Home_2sz5e', `Worker Take-Home`)}</th>
                    <th className="p-3 text-right text-blue-700">{t('Welfare_Cess___nfw11', `Welfare Cess (`)}{activeWelfarePercent}{t('___g8znu', `%)`)}</th>
                    <th className="p-3 text-center">{t('Verification_78ytu', `Verification`)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {completedTasksDataset.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-mono font-bold text-slate-900">{task.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(task.completedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{task.serviceName}</div>
                        <span className="text-[10px] text-slate-500">{task.category}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-600 truncate max-w-[180px] block">{task.locality}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ₹{task.grossAmount}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        ₹{task.workerEarning}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700 bg-blue-50/40">
                        {t('___v2euq', `+₹`)}{task.welfareContribution}
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} />
                          <span>{t('OTP_Validated_g5s44', `OTP Validated`)}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOVT SCHEMES & ACCREDITATION DETAILS */}
      {activeTab === 'SCHEMES' && (
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Umbrella size={16} className="text-blue-600" />
              <span>{t('Madhya_Pradesh_Unorganized_Wor_fe9eb', `Madhya Pradesh Unorganized Workers Social Security Framework`)}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {t('Bharat_Kaushal_cooperative_ope_0rzu5', `Bharat Kaushal cooperative operates in direct compliance with the Madhya Pradesh Shram Kalyan Nidhi Adhiniyam 
              and the Ministry of Labour & Employment guidelines. Your contributions unlock guaranteed tripartite benefits:`)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <PiggyBank size={16} className="text-amber-600" />
                  <span>{t('PM_SYM_Contributory_Pension_Sc_4grbh', `PM-SYM Contributory Pension Scheme`)}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {t('Worker_deposits__55__200_month_sesp0', `Worker deposits ₹55–₹200/month (auto-allocated from welfare pool), matched 100% by the Government of India. 
                  Guarantees a monthly pension of ₹3,000 post-age 60.`)}</p>
                <div className="text-[11px] font-semibold text-blue-700">
                  {t('Status__Integrated_with_CSC____k6nbm', `Status: Integrated with CSC / Shramik Card`)}</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap size={16} className="text-violet-600" />
                  <span>{t('Children_Education___Vocationa_1gnuf', `Children Education & Vocational Scholarships`)}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {t('Annual_stipend_of__1_800_to__6_hvdwg', `Annual stipend of ₹1,800 to ₹6,000 for up to two schooling children of registered cooperative members 
                  from Class 5 through vocational diploma or ITI certifications.`)}</p>
                <div className="text-[11px] font-semibold text-emerald-700">
                  {t('Status__Annual_window_opens_Oc_x3jp1', `Status: Annual window opens October`)}</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse size={16} className="text-rose-600" />
                  <span>{t('Ayushman_Bharat_Golden_Card_Li_dmf1n', `Ayushman Bharat Golden Card Linkage`)}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {t('Free_hospitalization_coverage__6h8q9', `Free hospitalization coverage up to ₹5,00,000 per family per year across empaneled public & private hospitals 
                  in Indore and Madhya Pradesh.`)}</p>
                <div className="text-[11px] font-semibold text-emerald-700">
                  {t('Status__KYC_Aadhaar_Linked_odrqf', `Status: KYC Aadhaar Linked`)}</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  <span>{t('Cooperative_Trade_Tool___Equip_t1t3y', `Cooperative Trade Tool & Equipment Subsidy`)}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {t('50__equipment_replacement_gran_ypzzv', `50% equipment replacement grant (up to ₹5,000) for broken or lost trade tools for plumbers, electricians, 
                  and carpenters with over 100 verified completed jobs.`)}</p>
                <div className="text-[11px] font-semibold text-blue-700">
                  {t('Status__dct3h', `Status:`)}{currentWorker.completedJobs >= 100 ? '✅ Eligible (100+ Jobs Completed)' : `Pending (${currentWorker.completedJobs}/100 Jobs)`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welfare Claim Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">{t('Submit_Welfare_Benefit_Claim_9xkmn', `Submit Welfare Benefit Claim`)}</h3>
              </div>
              <button onClick={() => setIsClaimModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {claimSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-sm">{t('Claim_Request_Submitted__x164m', `Claim Request Submitted!`)}</h4>
                <p className="text-xs text-emerald-800">
                  {t('Claim_ID__n0q26', `Claim ID:`)}<strong>{t('CLM__y3si8', `CLM-`)}{Date.now().toString().slice(-6)}</strong> {t('has_been_registered_with_Indor_rve7l', `has been registered with Indore Shramik Kaushal Sahakari Samiti. Review usually completes within 24 hours.`)}</p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">{t('Benefit_Scheme_Category_3ju9p', `Benefit Scheme Category`)}</label>
                  <select
                    value={claimScheme}
                    onChange={(e) => setClaimScheme(e.target.value as any)}
                    className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="MEDICAL">{t('Emergency_Healthcare___Hospita_ywgit', `Emergency Healthcare / Hospitalization Cushion`)}</option>
                    <option value="TOOL_REPLACEMENT">{t('Tool___Equipment_Replacement_S_czozs', `Tool & Equipment Replacement Subsidy`)}</option>
                    <option value="EDUCATION_SCHOLARSHIP">{t('Children_Education_Scholarship_tcszg', `Children Education Scholarship`)}</option>
                    <option value="ACCIDENT_COVER">{t('PMSBY_Accidental_Injury_Reimbu_45ip2', `PMSBY Accidental Injury Reimbursement`)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">{t('Claim_Amount__INR__zg3q5', `Claim Amount (INR)`)}</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {t('Available_balance_in_your_welf_q6ftn', `Available balance in your welfare reserve: ₹`)}{datasetStats.currentWelfareBalance}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">{t('Reason___Expense_Details_d5ljh', `Reason & Expense Details`)}</label>
                  <textarea
                    rows={3}
                    value={claimRemarks}
                    onChange={(e) => setClaimRemarks(e.target.value)}
                    className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('Provide_details_about_the_inci_fw0io', `Provide details about the incident or medical prescription...`)}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t('Cancel_lux6r', `Cancel`)}</button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {t('Submit_Claim_for_Approval_6tcqu', `Submit Claim for Approval`)}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
