import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ShieldCheck,
  Ban,
  RefreshCw,
  TrendingUp,
  Download,
  IndianRupee,
  Users,
  Eye,
  X,
} from 'lucide-react';
import { SEEDED_SOCIETIES } from '../../../data/seedData';
import { NATIONAL_FEDERATIONS } from '../../../data/superAdminSeedData';

interface SocietyExtended {
  id: string;
  name: string;
  code: string;
  city: string;
  district: string;
  state: string;
  totalWorkers: number;
  activeWorkers: number;
  revenue: number;
  welfarePool: number;
  rating: number;
  contactPerson: string;
  phone: string;
  federationId: string;
  utilizationRate: number; // percentage
  cancellationRate: number; // percentage
  growthRateYoY: number; // percentage
  complianceScore: number; // 0-100
  status: 'ACTIVE' | 'AUDIT_PENDING' | 'SUSPENDED';
}

const EXTENDED_SOCIETIES: SocietyExtended[] = SEEDED_SOCIETIES.map((s, idx) => ({
  ...s,
  federationId: 'FED-MP-002',
  utilizationRate: 82 + (idx % 8),
  cancellationRate: 2.8 + (idx % 3) * 0.4,
  growthRateYoY: 28 + (idx % 12),
  complianceScore: 92 + (idx % 7),
  status: idx === 3 ? 'AUDIT_PENDING' : 'ACTIVE',
}));

export const SocietyManagementView: React.FC = () => {
  const [societies, setSocieties] = useState<SocietyExtended[]>(EXTENDED_SOCIETIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSocietyForModal, setSelectedSocietyForModal] = useState<SocietyExtended | null>(null);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    setSocieties((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setAuditNotice(`Administrative action logged: Society ${id} status altered to ${newStatus}.`);
    setTimeout(() => setAuditNotice(null), 4000);
  };

  const handleExportSocieties = () => {
    const csv =
      'data:text/csv;charset=utf-8,ID,Name,Code,City,State,TotalWorkers,ActiveWorkers,RevenueINR,WelfarePoolINR,Rating,UtilizationPercent,CancellationPercent,ComplianceScore,Status\n' +
      societies
        .map(
          (s) =>
            `${s.id},"${s.name}",${s.code},${s.city},${s.state},${s.totalWorkers},${s.activeWorkers},${s.revenue},${s.welfarePool},${s.rating},${s.utilizationRate}%,${s.cancellationRate}%,${s.complianceScore},${s.status}`
        )
        .join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'BharatKaushal_Societies_National_Registry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-blue-600" />
              <span>{t('National_Primary_Labour_Cooper_zxycd', `National Primary Labour Cooperative Societies Governance`)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('Direct_oversight__compliance_a_viwpx', `Direct oversight, compliance auditing, operational metrics, and accreditation of 224 affiliated primary societies.`)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportSocieties}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5"
            >
              <Download size={14} />
              <span>{t('Export_Societies__CSV__jxkee', `Export Societies (CSV)`)}</span>
            </button>
          </div>
        </div>

        {auditNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600 shrink-0" />
            <span>{auditNotice}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={t('Search_society_by_name__regist_tkicb', `Search society by name, registration code, or city...`)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Societies Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3">{t('Society_Identity_bx72m', `Society Identity`)}</th>
                <th className="py-3 px-3">{t('Workers_mbyj0', `Workers`)}</th>
                <th className="py-3 px-3">{t('Gross_Bookings_Value_yhsn0', `Gross Bookings Value`)}</th>
                <th className="py-3 px-3">{t('Welfare_Pool_ouiux', `Welfare Pool`)}</th>
                <th className="py-3 px-3">{t('Rating___Utilization_a7r0d', `Rating / Utilization`)}</th>
                <th className="py-3 px-3">{t('Cancellation_i3j29', `Cancellation`)}</th>
                <th className="py-3 px-3">{t('Growth_YoY_8e5sv', `Growth YoY`)}</th>
                <th className="py-3 px-3">{t('Compliance_hphpe', `Compliance`)}</th>
                <th className="py-3 px-3">{t('Status_iww0t', `Status`)}</th>
                <th className="py-3 px-3 text-right">{t('Administrative_Actions_5z4q0', `Administrative Actions`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {s.code} • {s.city}, {s.state}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-black text-slate-900">{s.totalWorkers}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{s.activeWorkers} {t('on_duty_fuxjx', `on-duty`)}</div>
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-800">
                    ₹{(s.revenue / 100000).toFixed(1)} {t('Lakh_27ci9', `Lakh`)}</td>

                  <td className="py-3 px-3 font-bold text-blue-700">
                    ₹{(s.welfarePool / 1000).toFixed(0)}k
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">★ {s.rating}</div>
                    <div className="text-[10px] text-slate-500">{s.utilizationRate}{t('__utilization_c700b', `% utilization`)}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-700">{s.cancellationRate}%</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">+{s.growthRateYoY}%</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="w-10 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${s.complianceScore}%` }}
                        />
                      </div>
                      <span className="font-black text-slate-800 text-[11px]">{s.complianceScore}{t('_100_z29d7', `/100`)}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'AUDIT_PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSocietyForModal(s)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title={t('View_Full_Details_nc4g1', `View Full Details`)}
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() =>
                          alert(`Initiated statutory compliance audit for ${s.name} (${s.code}). Inspection notice sent to ${s.phone}.`)
                        }
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                      >
                        {t('Audit_8nmx1', `Audit`)}</button>

                      {s.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleToggleStatus(s.id, 'SUSPENDED')}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px]"
                        >
                          {t('Suspend_ji38i', `Suspend`)}</button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(s.id, 'ACTIVE')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-semibold text-[11px]"
                        >
                          {t('Reactivate_51lxd', `Reactivate`)}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Society Details Modal */}
      {selectedSocietyForModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  {t('Society_Registration_Dossier_7q6zk', `Society Registration Dossier`)}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedSocietyForModal.name}</h3>
                <div className="text-xs text-slate-500 font-mono">
                  {selectedSocietyForModal.code} • {selectedSocietyForModal.city}, {selectedSocietyForModal.state}
                </div>
              </div>
              <button
                onClick={() => setSelectedSocietyForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px]">{t('Managing_Secretary_egzxn', `Managing Secretary`)}</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedSocietyForModal.contactPerson}</div>
                <div className="text-slate-500 font-mono mt-0.5">{selectedSocietyForModal.phone}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px]">{t('Affiliated_Apex_Federation_krsb0', `Affiliated Apex Federation`)}</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{t('MP_State_Federation_x346w', `MP State Federation`)}</div>
                <div className="text-slate-500 font-mono mt-0.5">{t('FED_MP_002_iy8qg', `FED-MP-002`)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px]">{t('Annual_Revenue_nnmre', `Annual Revenue`)}</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">
                  ₹{(selectedSocietyForModal.revenue / 100000).toFixed(2)} {t('Lakh_zur1o', `Lakh`)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px]">{t('Compliance_Rating_rpy1u', `Compliance Rating`)}</div>
                <div className="font-black text-blue-700 text-sm mt-0.5">
                  {selectedSocietyForModal.complianceScore} {t('__100__Grade_A__7boz2', `/ 100 (Grade A)`)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSocietyForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                {t('Close_eiml9', `Close`)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
