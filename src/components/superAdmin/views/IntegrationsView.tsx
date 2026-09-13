import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Lock,
  Zap,
} from 'lucide-react';
import { INTEGRATION_CONNECTORS } from '../../../data/superAdminSeedData';
import { IntegrationConnector } from '../../../types/superAdmin';

export const IntegrationsView: React.FC = () => {
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(INTEGRATION_CONNECTORS);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const handleTestPing = (id: string) => {
    setIsTesting(id);
    setTimeout(() => {
      setIsTesting(null);
      alert(`Integration health check successful for ${id}. Endpoint handshake latency: 38ms.`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            <span>{t('National_Digital_Public_Infras_xexrb', `National Digital Public Infrastructure (DPI) & Statutory Gateways`)}</span>
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {t('6_Connected___1_Sandbox_j26cd', `6 Connected • 1 Sandbox`)}</span>
        </div>
        <p className="text-xs text-slate-500">
          {t('Direct_cryptographic_mTLS_link_1zrvz', `Direct cryptographic mTLS links to Ministry of Labour (e-Shram), MeitY (DigiLocker), MSDE (NSDC), NPCI (UPI), and PMSBY Insurance underwriting engines.`)}</p>
      </div>

      {/* 2. Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'CONNECTED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : c.status === 'SANDBOX'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ● {c.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{c.id}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-1">{c.name}</h3>
                <p className="text-xs text-slate-500">{c.agency}</p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                {c.uptime}{t('__Uptime_5caf0', `% Uptime`)}</span>
            </div>

            <p className="text-xs text-slate-600 leading-snug">{c.description}</p>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100">
              <div>
                <div className="text-[10px] text-slate-400">{t('Security_Protocol_e0nbi', `Security Protocol`)}</div>
                <div className="font-mono text-[11px] text-slate-700 font-medium truncate">{c.protocol}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">{t('Synced_Today_xck50', `Synced Today`)}</div>
                <div className="font-bold text-slate-800">{c.recordsSyncedToday.toLocaleString('en-IN')} {t('Records_8i8ss', `Records`)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-slate-400">
                {t('Last_Handshake__oe533', `Last Handshake:`)}<strong>{c.lastSyncTimestamp}</strong>
              </span>

              <button
                onClick={() => handleTestPing(c.id)}
                disabled={isTesting === c.id}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} className={isTesting === c.id ? 'animate-spin' : ''} />
                <span>{isTesting === c.id ? 'Testing...' : 'Test Ping'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
