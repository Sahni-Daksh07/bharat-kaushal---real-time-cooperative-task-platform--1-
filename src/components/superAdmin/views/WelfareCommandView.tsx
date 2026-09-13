import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Users,
  IndianRupee,
  Clock,
  Download,
  Building,
} from 'lucide-react';
import { NATIONAL_IMPACT_KPIS } from '../../../data/superAdminSeedData';

interface WelfareTransaction {
  id: string;
  workerName: string;
  type: 'CONTRIBUTION' | 'INSURANCE_PREMIUM' | 'BENEFIT_PAYOUT';
  amount: number;
  description: string;
  date: string;
}

const SEEDED_WELFARE_TRANSACTIONS: WelfareTransaction[] = [
  {
    id: 'WLF-TXN-00912',
    workerName: 'Ramesh Sharma',
    type: 'CONTRIBUTION',
    amount: 14.8,
    description: '2% statutory welfare deduction from job #BK-IND-8842',
    date: '2026-09-12 11:42',
  },
  {
    id: 'WLF-TXN-00911',
    workerName: 'Sunil Verma',
    type: 'INSURANCE_PREMIUM',
    amount: 20.0,
    description: 'Annual PMSBY accidental insurance renewal policy #PMSBY-MP-291',
    date: '2026-09-12 10:15',
  },
  {
    id: 'WLF-TXN-00910',
    workerName: 'Dinesh Solanki',
    type: 'BENEFIT_PAYOUT',
    amount: 5000.0,
    description: 'Emergency medical hospitalization cash relief grant approved by Board',
    date: '2026-09-11 16:30',
  },
  {
    id: 'WLF-TXN-00909',
    workerName: 'Mohan Lal Jatav',
    type: 'CONTRIBUTION',
    amount: 9.98,
    description: '2% statutory welfare deduction from job #BK-IND-8830',
    date: '2026-09-11 14:10',
  },
  {
    id: 'WLF-TXN-00908',
    workerName: 'Anand Chouhan',
    type: 'BENEFIT_PAYOUT',
    amount: 2500.0,
    description: 'Tool kit upgrade subsidy (Brushless drill set) under Karigar Vikas Scheme',
    date: '2026-09-10 11:20',
  },
];

export const WelfareCommandView: React.FC = () => {
  const [filterType, setFilterType] = useState('ALL');
  const records = SEEDED_WELFARE_TRANSACTIONS;

  const filteredRecords = records.filter(
    (r) => filterType === 'ALL' || r.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Welfare_Contributions_Pool_i4bci', `Welfare Contributions Pool`)}</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{t('_2_56_Cr_xq3ln', `₹2.56 Cr`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('2_0__Statutory_Escrow_rfean', `2.0% Statutory Escrow`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Worker_Social_Coverage_toln7', `Worker Social Coverage`)}</div>
          <div className="text-3xl font-black text-emerald-700 mt-1">{t('184_520_gj6to', `184,520`)}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('100__Registered_Artisans_qvr8t', `100% Registered Artisans`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Insurance_Enrolled_m3fdk', `Insurance Enrolled`)}</div>
          <div className="text-3xl font-black text-indigo-700 mt-1">{t('154_200_1ey03', `154,200`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('PMSBY__2_Lakh_Underwritten_idzcu', `PMSBY ₹2 Lakh Underwritten`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Benefit_Claims_Settled_ck80s', `Benefit Claims Settled`)}</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{t('8_420_3oru8', `8,420`)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t('_42_8_Lakh_Disbursed_yrzyf', `₹42.8 Lakh Disbursed`)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">{t('Active_Welfare_Passbooks_wxv37', `Active Welfare Passbooks`)}</div>
          <div className="text-3xl font-black text-teal-700 mt-1">{t('100__kekdb', `100%`)}</div>
          <div className="text-[11px] text-teal-600 font-bold mt-0.5">{t('Digital_passbook_visible_tzdz0', `Digital passbook visible`)}</div>
        </div>
      </div>

      {/* 2. Welfare Fund Utilization & Governance Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900">{t('Fund_Utilization_Matrix_hcnbw', `Fund Utilization Matrix`)}</h3>
            <span className="text-xs text-emerald-600 font-bold">{t('Audit_Grade_A_o7x3i', `Audit Grade A`)}</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600">{t('Accidental_Insurance__PMSBY_ES_s1oyi', `Accidental Insurance (PMSBY/ESIC):`)}</span>
              <span className="font-bold text-slate-900">{t('55__allocation_rnu4k', `55% allocation`)}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600">{t('Tool___Equipment_Modernization_hqirn', `Tool & Equipment Modernization Subsidy:`)}</span>
              <span className="font-bold text-slate-900">{t('25__allocation_de3l2', `25% allocation`)}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600">{t('Emergency_Health___Hospital_Ca_75jfv', `Emergency Health & Hospital Cash Grant:`)}</span>
              <span className="font-bold text-slate-900">{t('15__allocation_sfkti', `15% allocation`)}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600">{t('Administrative_Escrow_Liquidit_guwg8', `Administrative Escrow Liquidity Reserve:`)}</span>
              <span className="font-bold text-slate-900">{t('5__reserve_zoijn', `5% reserve`)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake size={16} className="text-blue-600" />
                <span>{t('Welfare_Contribution___Claim_L_lao9o', `Welfare Contribution & Claim Ledger`)}</span>
              </h3>
              <p className="text-xs text-slate-500">{t('Statutory_record_of_2__welfare_7ujgg', `Statutory record of 2% welfare pool transactions`)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              >
                <option value="ALL">{t('All_Transaction_Types_t8vg3', `All Transaction Types`)}</option>
                <option value="CONTRIBUTION">{t('Job_2__Deductions_bpqge', `Job 2% Deductions`)}</option>
                <option value="INSURANCE_PREMIUM">{t('Insurance_Underwriting_wwqh1', `Insurance Underwriting`)}</option>
                <option value="BENEFIT_PAYOUT">{t('Welfare_Claim_Grants_vkizr', `Welfare Claim Grants`)}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">{t('Transaction_ID_pd9l3', `Transaction ID`)}</th>
                  <th className="py-2.5 px-3">{t('Artisan_wa3vm', `Artisan`)}</th>
                  <th className="py-2.5 px-3">{t('Type_qmvt0', `Type`)}</th>
                  <th className="py-2.5 px-3">{t('Amount_j3cqh', `Amount`)}</th>
                  <th className="py-2.5 px-3">{t('Description_8k03t', `Description`)}</th>
                  <th className="py-2.5 px-3">{t('Timestamp_5ivy8', `Timestamp`)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{r.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.workerName}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.type === 'CONTRIBUTION'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.type === 'INSURANCE_PREMIUM'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-black text-slate-900">
                      ₹{r.amount}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{r.description}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
