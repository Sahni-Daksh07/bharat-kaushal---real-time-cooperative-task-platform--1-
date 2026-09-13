import React from 'react';
import {
  TrendingUp,
  Brain,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle,
} from 'lucide-react';
import { PREDICTIVE_DEMAND_FORECAST } from '../../../data/superAdminSeedData';

export const DemandForecastingView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900/50 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
              <Brain size={12} />
              <span>{t('Predictive_AI_Forecasting_Engi_u2o6h', `Predictive AI Forecasting Engine v4.2`)}</span>
            </span>
            <span className="text-xs text-indigo-200">{t('Ensemble_seasonal_machine_lear_vaggi', `Ensemble seasonal machine learning`)}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('National_Service_Demand___Seas_a1z2k', `National Service Demand & Seasonal Worker Requirements`)}</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('Forecasting_7_day_and_30_day_r_dslzs', `Forecasting 7-day and 30-day regional demand curves, weather correlations, festival shifts, and artisan mobilization requirements.`)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-indigo-900/50 border border-indigo-700/50 px-3 py-1.5 rounded-xl font-mono text-indigo-200">
            {t('Next_30_Day_Accuracy__94_2__yy03e', `Next 30-Day Accuracy: 94.2%`)}</span>
        </div>
      </div>

      {/* 2. Predictive Trade Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREDICTIVE_DEMAND_FORECAST.map((item) => (
          <div
            key={item.service}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                  {item.category}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">{item.service}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                  item.trend === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : item.trend === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {item.trend === 'HIGH' && <Flame size={12} />}
                <span>{item.trend} {t('DEMAND_pusis', `DEMAND`)}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400">{t('Current_Vol_i9hqm', `Current Vol`)}</div>
                <div className="font-bold text-slate-800 text-xs mt-0.5">{item.currentDemand.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">{t('7_Day_Projected_x7q06', `7-Day Projected`)}</div>
                <div className="font-bold text-blue-700 text-xs mt-0.5">{item.projectedDemand7d.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">{t('30_Day_Peak_s52wd', `30-Day Peak`)}</div>
                <div className="font-black text-rose-700 text-xs mt-0.5">{item.projectedDemand30d.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-1.5">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>{t('Peak_Season__yi2lx', `Peak Season:`)}<strong>{item.peakSeason}</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Clock size={13} className="text-slate-400 shrink-0" />
                <span>{t('Peak_Hours__a2uha', `Peak Hours:`)}<strong>{item.peakHours}</strong></span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-snug">
              <strong>{t('AI_Recommendation__j8ug7', `AI Recommendation:`)}</strong> {item.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
