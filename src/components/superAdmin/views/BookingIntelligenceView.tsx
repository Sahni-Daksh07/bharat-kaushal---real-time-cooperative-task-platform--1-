import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useRealtime } from '../../../context/RealtimeContext';
import { STATE_METRICS } from '../../../data/superAdminSeedData';

const DAILY_TREND_DATA = [
  { day: 'Mon', completed: 4120, emergency: 310, cancelled: 140 },
  { day: 'Tue', completed: 4350, emergency: 290, cancelled: 130 },
  { day: 'Wed', completed: 4210, emergency: 340, cancelled: 150 },
  { day: 'Thu', completed: 4680, emergency: 380, cancelled: 160 },
  { day: 'Fri', completed: 5120, emergency: 420, cancelled: 190 },
  { day: 'Sat', completed: 6890, emergency: 580, cancelled: 240 },
  { day: 'Sun', completed: 7420, emergency: 610, cancelled: 270 },
];

const HOURLY_HEAT_DATA = [
  { hour: '07:00 AM', requests: 840 },
  { hour: '09:00 AM', requests: 2890 },
  { hour: '11:00 AM', requests: 4650 },
  { hour: '01:00 PM', requests: 3120 },
  { hour: '03:00 PM', requests: 2980 },
  { hour: '05:00 PM', requests: 4890 },
  { hour: '07:00 PM', requests: 6410 },
  { hour: '09:00 PM', requests: 3950 },
  { hour: '11:00 PM', requests: 1240 },
];

export const BookingIntelligenceView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('WEEKLY');
  const { bookings } = useRealtime();

  return (
    <div className="space-y-6">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Bookings_Per_Day_swfsy', `Bookings Per Day`)}</div>
          <div className="text-xl font-black text-slate-900 mt-1">{t('36_790_u7kgb', `36,790`)}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{t('___8_4__this_week_uvzhr', `↑ +8.4% this week`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Top_State_Demand_oaqok', `Top State Demand`)}</div>
          <div className="text-xl font-black text-blue-700 mt-1">{t('Uttar_Pradesh_klvnl', `Uttar Pradesh`)}</div>
          <div className="text-[10px] text-slate-500">{t('12_400_daily_jobs_ofiiq', `12,400 daily jobs`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Peak_Demand_Window_bfile', `Peak Demand Window`)}</div>
          <div className="text-xl font-black text-amber-700 mt-1">{t('06___08_PM_16agl', `06 - 08 PM`)}</div>
          <div className="text-[10px] text-amber-700 font-medium">{t('Post_work_residential_0blbm', `Post-work residential`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Top_Requested_Service_bxgmm', `Top Requested Service`)}</div>
          <div className="text-xl font-black text-slate-900 mt-1">{t('Plumbing_Leak_x32r6', `Plumbing Leak`)}</div>
          <div className="text-[10px] text-slate-500">{t('32__of_total_vol_ndk2j', `32% of total vol`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Emergency_Dispatches_j1511', `Emergency Dispatches`)}</div>
          <div className="text-xl font-black text-rose-600 mt-1">{t('2_930_mjesd', `2,930`)}</div>
          <div className="text-[10px] text-rose-600 font-bold">{t('14_min_avg_ETA_5kwmv', `14 min avg ETA`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Completion_Rate_ea5m4', `Completion Rate`)}</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{t('96_8__69l68', `96.8%`)}</div>
          <div className="text-[10px] text-slate-500">{t('OTP_2FA_closed_17otw', `OTP 2FA closed`)}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">{t('Cancellation_Rate_4v2xx', `Cancellation Rate`)}</div>
          <div className="text-xl font-black text-slate-800 mt-1">{t('3_2__kbl7x', `3.2%`)}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{t('Well_below_5__SLA_6ap9i', `Well below 5% SLA`)}</div>
        </div>
      </div>

      {/* 2. Charts: Daily / Weekly / Monthly / Yearly Trends */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">{t('National_Booking_Trajectory_7pr1p', `National Booking Trajectory`)}</h3>
            <p className="text-xs text-slate-500">{t('Completed_jobs_vs_Emergency_di_d6tki', `Completed jobs vs Emergency dispatches vs Cancellations`)}</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimeframe(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframe === mode
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DAILY_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="completed" name="Completed Services" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emergency" name="Emergency SOS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Peak Demand Curve & State Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-slate-900">{t('Diurnal_Peak_Demand_Hourly_Cur_abhc8', `Diurnal Peak Demand Hourly Curve`)}</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_HEAT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-slate-900">{t('State_Demand_Density_zm9ha', `State Demand Density`)}</h3>
          <div className="space-y-2">
            {STATE_METRICS.slice(0, 5).map((st) => (
              <div key={st.stateCode} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                <span className="font-bold text-slate-900">{st.stateName}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-slate-500">{st.totalBookings.toLocaleString('en-IN')} {t('total_jobs_pm19d', `total jobs`)}</span>
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${st.demandIndex}%` }} />
                  </div>
                  <span className="font-mono font-bold text-slate-700 w-8 text-right">{st.demandIndex}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
