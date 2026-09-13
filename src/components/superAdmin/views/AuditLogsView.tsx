import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  UserCheck,
  Laptop,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { AUDIT_LOGS_SEEDED } from '../../../data/superAdminSeedData';
import { AuditLogEntry } from '../../../types/superAdmin';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(AUDIT_LOGS_SEEDED);
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((l) => {
    const matchesModule = selectedModule === 'ALL' || l.module === selectedModule;
    const matchesSearch =
      searchQuery === '' ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleExportAuditCSV = () => {
    const csv =
      'data:text/csv;charset=utf-8,ID,Timestamp,User,Role,Action,Module,Description,Before,After,IP,Device,Status\n' +
      filteredLogs
        .map(
          (l) =>
            `${l.id},"${l.timestamp}","${l.userName}",${l.userRole},${l.action},${l.module},"${l.description}","${l.beforeValue || ''}","${l.afterValue || ''}",${l.ipAddress},"${l.device}",${l.status}`
        )
        .join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'BharatKaushal_National_Audit_Trail.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              <span>{t('Statutory_National_Governance__7u4kv', `Statutory National Governance Audit Trail`)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('Immutable_log_of_every_policy__dy64z', `Immutable log of every policy change, financial transfer, role assignment, verification verdict, and welfare release.`)}</p>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5"
          >
            <Download size={14} />
            <span>{t('Export_Official_Audit_Log__CSV_q2kci', `Export Official Audit Log (CSV)`)}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t('Search_audit_trail_by_keyword__yl7cz', `Search audit trail by keyword, official name, action...`)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">{t('All_Statutory_Modules_qly9j', `All Statutory Modules`)}</option>
              <option value="POLICY">{t('Policy___Economic_Models_gkwv7', `Policy & Economic Models`)}</option>
              <option value="FINANCE">{t('Financial___Escrow_Releases_j5hv3', `Financial & Escrow Releases`)}</option>
              <option value="VERIFICATION">{t('Artisan_Verification___Clearan_jnmb8', `Artisan Verification & Clearances`)}</option>
              <option value="WELFARE">{t('Welfare_Pool_Decisions_p0bjd', `Welfare Pool Decisions`)}</option>
              <option value="DISPATCH">{t('Dispatch_Radius_Overrides_ny6gd', `Dispatch Radius Overrides`)}</option>
              <option value="SECURITY">{t('Security___Fraud_Flags_njqri', `Security & Fraud Flags`)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Audit Trail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3">{t('Log_ID___Timestamp_tbwnf', `Log ID & Timestamp`)}</th>
                <th className="py-3 px-3">{t('Authorizing_User_gwsqb', `Authorizing User`)}</th>
                <th className="py-3 px-3">{t('Module___Action_cc9q7', `Module & Action`)}</th>
                <th className="py-3 px-3">{t('Audit_Details_rpctg', `Audit Details`)}</th>
                <th className="py-3 px-3">{t('Before_vs_After_ig3ex', `Before vs After`)}</th>
                <th className="py-3 px-3">{t('Station___IP_e8lzi', `Station / IP`)}</th>
                <th className="py-3 px-3">{t('Status_i9x96', `Status`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-[11px] font-bold text-slate-800">{log.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.timestamp}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {log.userRole} ({log.userId})
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-bold font-mono">
                      {log.module}
                    </span>
                    <div className="font-semibold text-slate-700 mt-1">{log.action}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-800 max-w-xs">
                    <p>{log.description}</p>
                  </td>

                  <td className="py-3 px-3 text-[11px] font-mono text-slate-600 max-w-xs">
                    {log.beforeValue && (
                      <div className="text-slate-500 line-through truncate">
                        {t('Prev__9crbk', `Prev:`)}{log.beforeValue}
                      </div>
                    )}
                    {log.afterValue && (
                      <div className="text-emerald-700 font-bold truncate">
                        {t('New__nryu2', `New:`)}{log.afterValue}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-700">{log.ipAddress}</div>
                    <div className="text-[10px] text-slate-400">{log.device}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
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
