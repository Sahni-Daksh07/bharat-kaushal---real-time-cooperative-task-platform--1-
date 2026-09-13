import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
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
  Legend,
} from 'recharts';
import { NATIONAL_IMPACT_KPIS } from '../../../data/superAdminSeedData';

const MONTHLY_FINANCIAL_BREAKDOWN = [
  { month: 'Apr', gross: 84.2, workerShare: 79.56, societyShare: 2.94, welfareShare: 1.68, settlements: 78.4 },
  { month: 'May', gross: 96.5, workerShare: 91.19, societyShare: 3.37, welfareShare: 1.93, settlements: 90.1 },
  { month: 'Jun', gross: 108.4, workerShare: 102.43, societyShare: 3.79, welfareShare: 2.16, settlements: 101.5 },
  { month: 'Jul', gross: 118.2, workerShare: 111.69, societyShare: 4.13, welfareShare: 2.36, settlements: 110.8 },
  { month: 'Aug', gross: 122.9, workerShare: 116.14, societyShare: 4.30, welfareShare: 2.45, settlements: 115.2 },
  { month: 'Sep', gross: 128.45, workerShare: 121.38, societyShare: 4.49, welfareShare: 2.56, settlements: 120.9 },
];

export const FinanceCommandView: React.FC = () => {
  const [chartView, setChartView] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const kpis = NATIONAL_IMPACT_KPIS;

  return (
    <div className="space-y-6">
      {/* 1. Finance Command Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Gross_Transaction_Vol_1i6sz', `Gross Transaction Vol`)}</div>
          <div className="text-xl font-black text-slate-900 mt-1">{t('_128_45_Cr_cy9w1', `₹128.45 Cr`)}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{t('__28_4__YoY_i28hf', `↑ 28.4% YoY`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-emerald-500 shadow-xs bg-emerald-50/10">
          <div className="text-[11px] font-bold text-emerald-900">{t('Worker_Earnings__94_5___352cf', `Worker Earnings (94.5%)`)}</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{t('_121_38_Cr_8ec09', `₹121.38 Cr`)}</div>
          <div className="text-[10px] text-emerald-800 font-medium">{t('Direct_NPCI_UPI_bvlxc', `Direct NPCI UPI`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Society_Revenue__3_5___w7x5s', `Society Revenue (3.5%)`)}</div>
          <div className="text-xl font-black text-slate-800 mt-1">{t('_4_49_Cr_uavou', `₹4.49 Cr`)}</div>
          <div className="text-[10px] text-slate-500">{t('224_Cooperative_Units_lv7ge', `224 Cooperative Units`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs bg-blue-50/20">
          <div className="text-[11px] font-bold text-blue-900">{t('Welfare_Fund__2_0___9oshu', `Welfare Fund (2.0%)`)}</div>
          <div className="text-xl font-black text-blue-700 mt-1">{t('_2_56_Cr_xyvgq', `₹2.56 Cr`)}</div>
          <div className="text-[10px] text-blue-800 font-medium">{t('MPSLWB_Escrow_5x08a', `MPSLWB Escrow`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Settlement_Volume_d0rtq', `Settlement Volume`)}</div>
          <div className="text-xl font-black text-teal-700 mt-1">{t('_120_9_Cr_hvtdo', `₹120.9 Cr`)}</div>
          <div className="text-[10px] text-teal-600 font-bold">{t('99_6__T_0_Instant_unam4', `99.6% T+0 Instant`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Refund_Volume_16wkn', `Refund Volume`)}</div>
          <div className="text-xl font-black text-amber-700 mt-1">{t('_14_8_Lakh_575s6', `₹14.8 Lakh`)}</div>
          <div className="text-[10px] text-slate-500">{t('0_11__of_turnover_oyzql', `0.11% of turnover`)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">{t('Disputed_Payments_314p0', `Disputed Payments`)}</div>
          <div className="text-xl font-black text-rose-600 mt-1">{t('_1_82_Lakh_hetvt', `₹1.82 Lakh`)}</div>
          <div className="text-[10px] text-rose-600 font-bold">{t('42_pending_reviews_l5jbc', `42 pending reviews`)}</div>
        </div>
      </div>

      {/* 2. Comprehensive Financial Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">{t('National_Financial_Settlement__3e3jg', `National Financial Settlement Velocity (Cr INR)`)}</h3>
            <p className="text-xs text-slate-500">
              {t('Cooperative_Model_A__94_5__Wor_0exgq', `Cooperative Model A: 94.5% Worker, 3.5% Society Ops, 2.0% Statutory Social Security Fund`)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Official financial audit trail exported to CSV/Excel format.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>{t('Download_Ledger_o9gvb', `Download Ledger`)}</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_FINANCIAL_BREAKDOWN} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWorker" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="gross" name="Gross National Turnover" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGross)" />
              <Area type="monotone" dataKey="workerShare" name="Direct Worker Share (94.5%)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWorker)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
