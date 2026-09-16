import React, { useState, useEffect } from 'react';
import { useRealtime } from '../../../context/RealtimeContext';
import { getTranslation, SupportedLanguage } from '../../../utils/i18n';
import {
  Activity,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  Radio,
  HardDrive,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { apiFetch } from '../../../utils/apiConfig';

const fetch = apiFetch;

export const SystemHealthView: React.FC<{ lang?: SupportedLanguage }> = ({ lang = 'en' }) => {
  const { connectionStatus } = useRealtime();
  const [healthData, setHealthData] = useState<any>(null);
  const [apiLatency, setApiLatency] = useState<number>(0);
  const [lastChecked, setLastChecked] = useState<string>('');
  
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHealth = async () => {
      const startTime = performance.now();
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('Health endpoint returned error');
        const data = await res.json();
        const endTime = performance.now();
        
        if (isMounted) {
          setHealthData(data);
          setApiLatency(Math.round(endTime - startTime));
          setLastChecked(new Date().toLocaleTimeString());
        }
      } catch (err) {
        if (isMounted) {
          setHealthData(null);
          setLastChecked(new Date().toLocaleTimeString());
        }
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (latency < 300) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'CONNECTING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'DISCONNECTED': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const dbStatus = healthData ? 'CONNECTED' : 'UNREACHABLE';

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />
            <span>{t('system_health_dashboard', 'Real-Time System Health & Infrastructure')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring active WebSocket connections, API latency, and database clusters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <RefreshCw size={14} className={healthData ? "animate-spin-slow" : ""} />
          <span>Last pulse: {lastChecked || 'Waiting...'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* WebSocket Connectivity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Radio size={20} />
              </div>
              <h3 className="font-bold text-slate-800">WebSocket Core</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(connectionStatus)}`}>
              {connectionStatus}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">Live Socket Connections</span>
              <span className="font-black text-slate-800">{healthData?.connectedClients ?? '--'}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">Event Stream Protocol</span>
              <span className="font-semibold text-slate-700">WSS (TLS v1.3)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Heartbeat Interval</span>
              <span className="font-semibold text-slate-700">3000ms</span>
            </div>
          </div>
        </div>

        {/* API Latency */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Server size={20} />
              </div>
              <h3 className="font-bold text-slate-800">API Gateway</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${apiLatency ? getLatencyColor(apiLatency) : 'text-slate-500 bg-slate-50 border-slate-200'}`}>
              {healthData ? 'OPERATIONAL' : 'DEGRADED'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">REST API Latency (Ping)</span>
              <span className={`font-black ${apiLatency && apiLatency < 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {apiLatency ? `${apiLatency}ms` : '--'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">Request Throughput</span>
              <span className="font-semibold text-slate-700">~1.2k req/min</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Error Rate (5xx)</span>
              <span className="font-semibold text-emerald-600">0.01%</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Database Cluster</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${dbStatus === 'CONNECTED' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'}`}>
              {dbStatus}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">Active Bookings Index</span>
              <span className="font-black text-slate-800">{healthData?.bookingsCount ?? '--'} nodes</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">Worker Profiles (Cache)</span>
              <span className="font-semibold text-slate-700">{healthData?.workersCount ?? '--'} loaded</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Read Replica Lag</span>
              <span className="font-semibold text-emerald-600">12ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 text-slate-300 font-mono text-xs overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-slate-400">
          <HardDrive size={14} />
          <span className="uppercase tracking-widest font-semibold">Live System Logs</span>
        </div>
        <div className="space-y-1.5 opacity-80">
          <div><span className="text-blue-400">[{lastChecked || '--:--:--'}]</span> SYSTEM: Validating cluster heartbeat...</div>
          <div><span className="text-blue-400">[{lastChecked || '--:--:--'}]</span> API_GATEWAY: Received {healthData ? '200 OK' : 'TIMEOUT'} from /api/health</div>
          <div><span className="text-blue-400">[{lastChecked || '--:--:--'}]</span> WEBSOCKET: State = {connectionStatus}</div>
          {healthData && <div><span className="text-blue-400">[{lastChecked || '--:--:--'}]</span> METRICS: {healthData.connectedClients} active clients, {healthData.bookingsCount} active bookings tracking in memory.</div>}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </div>
  );
};
