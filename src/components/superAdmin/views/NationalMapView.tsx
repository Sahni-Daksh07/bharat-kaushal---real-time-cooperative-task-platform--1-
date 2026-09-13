import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Search,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  IndianRupee,
  PhoneCall,
  HardHat,
} from 'lucide-react';
import { STATE_METRICS, NATIONAL_IMPACT_KPIS } from '../../../data/superAdminSeedData';
import { SEEDED_SOCIETIES, SEEDED_WORKERS } from '../../../data/seedData';
import { StateWorkforceMetric } from '../../../types/superAdmin';

type MapDensityLayer =
  | 'WORKER_DENSITY'
  | 'DEMAND_DENSITY'
  | 'BOOKING_DENSITY'
  | 'SKILL_DENSITY'
  | 'INCOME_DENSITY'
  | 'EMERGENCY_REQUESTS'
  | 'ACTIVE_SERVICE_REGIONS';

export const NationalMapView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<MapDensityLayer>('WORKER_DENSITY');
  const [selectedState, setSelectedState] = useState<StateWorkforceMetric | null>(STATE_METRICS[0]); // Default MP
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Indore');
  const [selectedCity, setSelectedCity] = useState<string>('Indore');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('SOC-IND-02');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>('BH-KAUSHAL-WKR-000124');
  const [searchQuery, setSearchQuery] = useState('');

  // Societies matching current state/district
  const currentSocieties = SEEDED_SOCIETIES.filter(
    (s) => !selectedState || s.state.toLowerCase() === selectedState.stateName.toLowerCase()
  );

  // Workers matching current society
  const currentWorkers = SEEDED_WORKERS.filter(
    (w) => !selectedSocietyId || w.societyId === selectedSocietyId
  );

  const selectedWorker = SEEDED_WORKERS.find((w) => w.id === selectedWorkerId);
  const selectedSociety = SEEDED_SOCIETIES.find((s) => s.id === selectedSocietyId);

  const getLayerMetricValue = (st: StateWorkforceMetric) => {
    switch (activeLayer) {
      case 'WORKER_DENSITY':
        return `${st.totalWorkers.toLocaleString('en-IN')} Workers`;
      case 'DEMAND_DENSITY':
        return `Demand Index: ${st.demandIndex}/100`;
      case 'BOOKING_DENSITY':
        return `${st.totalBookings.toLocaleString('en-IN')} Bookings`;
      case 'SKILL_DENSITY':
        return `Top: ${st.topTrade}`;
      case 'INCOME_DENSITY':
        return `₹${(st.monthlyRevenueInr / 100000).toFixed(1)}L / mo`;
      case 'EMERGENCY_REQUESTS':
        return `${Math.round(st.totalBookings * 0.07)} SOS reqs`;
      case 'ACTIVE_SERVICE_REGIONS':
        return `${st.societiesCount} Cooperative Zones`;
    }
  };

  const getLayerColor = (st: StateWorkforceMetric) => {
    if (activeLayer === 'WORKER_DENSITY') {
      return st.totalWorkers > 30000 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900';
    }
    if (activeLayer === 'DEMAND_DENSITY') {
      return st.demandIndex > 90 ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900';
    }
    if (activeLayer === 'INCOME_DENSITY') {
      return st.monthlyRevenueInr > 30000000 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-900';
    }
    if (activeLayer === 'EMERGENCY_REQUESTS') {
      return 'bg-amber-500 text-white';
    }
    return 'bg-indigo-600 text-white';
  };

  return (
    <div className="space-y-5">
      {/* Header & Layer Selection Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <span>{t('National_Geospatial_Command____ycacb', `National Geospatial Command & Multi-Level Administrative Drill-Down`)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('Interactive_territorial_heatma_1vdpa', `Interactive territorial heatmaps across all 14 pilot states with granular hierarchic navigation down to individual worker level.`)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{t('Pan_India_Coverage__80ich', `Pan-India Coverage:`)}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {t('168_Districts_Active_0wxlk', `168 Districts Active`)}</span>
          </div>
        </div>

        {/* 7 Density Layers */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Layers size={12} />
            <span>{t('Select_Active_Telemetry_Layer__4442j', `Select Active Telemetry Layer:`)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'WORKER_DENSITY', label: 'Worker Density', icon: Users },
              { id: 'DEMAND_DENSITY', label: 'Demand Density', icon: TrendingUp },
              { id: 'BOOKING_DENSITY', label: 'Booking Density', icon: Activity },
              { id: 'SKILL_DENSITY', label: 'Skill Density', icon: Zap },
              { id: 'INCOME_DENSITY', label: 'Income Density', icon: IndianRupee },
              { id: 'EMERGENCY_REQUESTS', label: 'Emergency Requests', icon: AlertTriangle },
              { id: 'ACTIVE_SERVICE_REGIONS', label: 'Active Service Regions', icon: Building2 },
            ].map((layer) => {
              const Icon = layer.icon;
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as MapDensityLayer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Icon size={13} />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hierarchic Drill-Down Breadcrumb */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => {
              setSelectedState(null);
              setSelectedDistrict('');
              setSelectedCity('');
              setSelectedSocietyId('');
              setSelectedWorkerId(null);
            }}
            className={`font-black flex items-center gap-1 ${
              !selectedState ? 'text-blue-600 underline' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>{t('_____India__Apex__gr1ir', `🇮🇳 India (Apex)`)}</span>
          </button>

          {selectedState && (
            <>
              <ChevronRight size={13} className="text-slate-400" />
              <button
                onClick={() => {
                  setSelectedDistrict('');
                  setSelectedCity('');
                  setSelectedSocietyId('');
                  setSelectedWorkerId(null);
                }}
                className={`font-bold ${
                  !selectedDistrict ? 'text-blue-600 underline' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t('State__ivsfg', `State:`)}{selectedState.stateName}
              </button>
            </>
          )}

          {selectedDistrict && (
            <>
              <ChevronRight size={13} className="text-slate-400" />
              <button
                onClick={() => {
                  setSelectedCity('');
                  setSelectedSocietyId('');
                  setSelectedWorkerId(null);
                }}
                className={`font-bold ${
                  !selectedCity ? 'text-blue-600 underline' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t('District__jipkv', `District:`)}{selectedDistrict}
              </button>
            </>
          )}

          {selectedSociety && (
            <>
              <ChevronRight size={13} className="text-slate-400" />
              <button
                onClick={() => setSelectedWorkerId(null)}
                className={`font-bold ${
                  !selectedWorkerId ? 'text-blue-600 underline' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t('Society__inopq', `Society:`)}{selectedSociety.name.split(' ')[0]} ({selectedSociety.code})
              </button>
            </>
          )}

          {selectedWorker && (
            <>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {t('Worker__evk6x', `Worker:`)}{selectedWorker.name} ({selectedWorker.id})
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Map & Drill-Down Exploration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Regional State Map Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>{t('Active_State_Territorial_Clust_quydo', `Active State Territorial Clusters`)}</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                  {t('Layer__q30gg', `Layer:`)}{activeLayer.replace(/_/g, ' ')}
                </span>
              </h3>
              <span className="text-xs text-slate-400">{t('Click_a_state_to_drill_down_s2bld', `Click a state to drill down`)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATE_METRICS.map((st) => {
                const isSelected = selectedState?.stateCode === st.stateCode;
                return (
                  <div
                    key={st.stateCode}
                    onClick={() => {
                      setSelectedState(st);
                      setSelectedDistrict(st.capital === 'Bhopal' ? 'Indore' : st.capital);
                      setSelectedCity(st.capital === 'Bhopal' ? 'Indore' : st.capital);
                      if (st.stateCode === 'MP') {
                        setSelectedSocietyId('SOC-IND-02');
                        setSelectedWorkerId('BH-KAUSHAL-WKR-000124');
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          {st.stateCode} {t('__Capital__5xmmb', `• Capital:`)}{st.capital}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">{st.stateName}</h4>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getLayerColor(st)}`}>
                        {getLayerMetricValue(st)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">{t('Artisans_vc6lq', `Artisans`)}</div>
                        <div className="font-bold text-slate-800">{st.totalWorkers.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">{t('Societies_eqtif', `Societies`)}</div>
                        <div className="font-bold text-slate-800">{st.societiesCount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">{t('Demand_8l6mn', `Demand`)}</div>
                        <div className="font-bold text-blue-600">{st.demandIndex}%</div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{t('Top__d19o5', `Top:`)}<strong>{st.topTrade}</strong></span>
                      <span className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                        <span>{t('Drill_Down_xca1s', `Drill Down`)}</span>
                        <ChevronRight size={11} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District & City Selection Panel */}
          {selectedState && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('Districts_in_okkif', `Districts in`)}{selectedState.stateName} ({selectedState.societiesCount} {t('societies_registered__j0m9h', `societies registered)`)}</h4>
                <span className="text-xs text-blue-600 font-bold">{t('Selected__fy55i', `Selected:`)}{selectedDistrict}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Dewas', 'Sagar', 'Rewa'].map((dist) => {
                  const isDistSelected = selectedDistrict === dist;
                  return (
                    <button
                      key={dist}
                      onClick={() => {
                        setSelectedDistrict(dist);
                        setSelectedCity(dist);
                        const matchedSoc = SEEDED_SOCIETIES.find((s) => s.city.toLowerCase() === dist.toLowerCase());
                        if (matchedSoc) {
                          setSelectedSocietyId(matchedSoc.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isDistSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t('___h8ame', `📍`)}{dist}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Society -> Worker Granular Drill-Down View */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Society Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  {t('Primary_Labour_Cooperative_Soc_8c3zp', `Primary Labour Cooperative Society`)}</span>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">
                  {selectedSociety ? selectedSociety.name : 'Select a Society'}
                </h3>
                {selectedSociety && (
                  <div className="text-xs text-slate-500">
                    {t('Registration_Code__hrena', `Registration Code:`)}<span className="font-mono font-bold text-slate-700">{selectedSociety.code}</span>
                  </div>
                )}
              </div>
              {selectedSociety && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                  ★ {selectedSociety.rating}
                </span>
              )}
            </div>

            {selectedSociety && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-slate-400 text-[10px]">{t('Total_Artisans_3244m', `Total Artisans`)}</div>
                  <div className="font-black text-slate-900 text-base">{selectedSociety.totalWorkers}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-slate-400 text-[10px]">{t('Active_Today_wfrsv', `Active Today`)}</div>
                  <div className="font-black text-emerald-700 text-base">{selectedSociety.activeWorkers}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-slate-400 text-[10px]">{t('Welfare_Pool_q1fbi', `Welfare Pool`)}</div>
                  <div className="font-black text-blue-700 text-base">₹{(selectedSociety.welfarePool / 1000).toFixed(0)}k</div>
                </div>
              </div>
            )}

            {/* Workers List in Society */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{t('Artisans_in_this_Cooperative_U_dkg8m', `Artisans in this Cooperative Unit (`)}{currentWorkers.length}{t('___w0wdg', `):`)}</span>
                <span className="text-slate-400 text-[11px]">{t('Click_to_inspect_worker_record_1stgg', `Click to inspect worker record`)}</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {currentWorkers.map((w) => {
                  const isWSelected = selectedWorkerId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWorkerId(w.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isWSelected
                          ? 'bg-blue-50 border-blue-500 shadow-2xs'
                          : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{w.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded font-mono">
                              {w.primaryTrade}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {t('ID__49s8s', `ID:`)}{w.id} {t('__Rating____dvfyq', `• Rating: ★`)}{w.rating}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-700">{t('Trust__7lawj', `Trust:`)}{w.trustScore}</div>
                        <div className="text-[10px] text-slate-400">{w.completedJobs} {t('jobs_3z7k6', `jobs`)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Worker Profile Snapshot */}
          {selectedWorker && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                    {selectedWorker.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                      <span>{selectedWorker.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                        {t('VERIFIED_ARTISAN_ez4g3', `VERIFIED ARTISAN`)}</span>
                    </h4>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {selectedWorker.id} {t('__Aadhaar_waiml', `• Aadhaar`)}{selectedWorker.maskedAadhaar}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">{t('Cooperative_Share_eqihn', `Cooperative Share`)}</div>
                  <div className="text-base font-black text-emerald-400">{t('94_5__ulcrj', `94.5%`)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">{t('Primary_Skill_mj5f3', `Primary Skill`)}</div>
                  <div className="font-bold text-white mt-0.5">{selectedWorker.primaryTrade}</div>
                  <div className="text-[10px] text-slate-400">{t('Assessment__6d1zo', `Assessment:`)}{selectedWorker.skillAssessmentScore}{t('_100_ul9it', `/100`)}</div>
                </div>

                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">{t('Lifetime_Earnings_gy67t', `Lifetime Earnings`)}</div>
                  <div className="font-bold text-emerald-400 mt-0.5">₹{selectedWorker.earnings.total.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">{t('Welfare____qndnr', `Welfare: ₹`)}{selectedWorker.welfareBalance}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {t('___h0vy0', `📍`)}{selectedWorker.address}, {selectedWorker.city}
                </span>
                <a
                  href={`tel:${selectedWorker.phone}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <PhoneCall size={12} />
                  <span>{t('Call_Officer_Desk_frnd5', `Call Officer Desk`)}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
