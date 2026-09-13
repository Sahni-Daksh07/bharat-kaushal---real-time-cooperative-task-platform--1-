import React from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  ShieldAlert,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';

export const AiIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Top Predictive Workforce Forecast */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Brain size={18} className="text-indigo-600" />
              <span>{t('National_Cooperative_Workforce_m2xse', `National Cooperative Workforce Forecast (Next 30-Day Synthesis)`)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('Correlating_macro_economic_hou_zrzew', `Correlating macro-economic housing indices, monsoon forecasts, and historical dispatch velocity.`)}</p>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">
            {t('Autonomous_Optimization_Active_85bct', `Autonomous Optimization Active`)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-medium text-slate-500">{t('Expected_National_Demand_j0v7j', `Expected National Demand`)}</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{t('1_240_000_Bookings_rdrst', `1,240,000 Bookings`)}</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">{t('___14_8__Month_over_Month_vy747', `↑ +14.8% Month-over-Month`)}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-medium text-slate-500">{t('Expected_Available_Supply_wnri7', `Expected Available Supply`)}</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{t('1_095_000_Worker_Days_rgvb0', `1,095,000 Worker-Days`)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Existing_active_cooperative_ro_slsxv', `Existing active cooperative roster`)}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-rose-200 bg-rose-50/30">
            <div className="text-xs font-bold text-rose-900">{t('Net_Worker_Requirement_Gap_m3bw9', `Net Worker Requirement Gap`)}</div>
            <div className="text-2xl font-black text-rose-700 mt-1">{t('_14_500_Artisans_iyta1', `+14,500 Artisans`)}</div>
            <div className="text-[11px] text-rose-800 font-bold mt-0.5">{t('Requires_fast_track_onboarding_7es9l', `Requires fast-track onboarding`)}</div>
          </div>
        </div>
      </div>

      {/* 2. Actionable AI Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={16} className="text-amber-600" />
          <span>{t('Actionable_Governance_Recommen_a6pjm', `Actionable Governance Recommendations`)}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                <Users size={14} className="text-blue-700" />
                <span>{t('1__Deploy_More_Workers__Indore_y0gwr', `1. Deploy More Workers (Indore & Bhopal Clusters)`)}</span>
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-950 px-2 py-0.5 rounded font-bold">{t('HIGH_PRIORITY_t0pbr', `HIGH PRIORITY`)}</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {t('Unmet_plumbing___electrical_de_n4f2o', `Unmet plumbing & electrical demand in Malwa region is averaging 840 calls daily. Mobilize 650 certified artisans from Ujjain and Dewas societies using the inter-district reciprocal dispatch framework.`)}</p>
            <button
              onClick={() => alert('Inter-district deployment mobilization order issued to MP Federation.')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Approve_Mobilization_Directive_h5xi2', `Approve Mobilization Directive`)}</button>
          </div>

          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                <Brain size={14} className="text-indigo-700" />
                <span>{t('2__Conduct_Emergency_RPL_Train_gaw27', `2. Conduct Emergency RPL Training (HVAC & Solar)`)}</span>
              </span>
              <span className="text-[10px] bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded font-bold">{t('URGENT_zcqfz', `URGENT`)}</span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              {t('Solar_rooftop_installation_dem_w500p', `Solar rooftop installation demand has surged by 46%. Authorize 3 special batch certifications via NSDC Skill India Digital for 1,200 semi-skilled electricians across UP and MP.`)}</p>
            <button
              onClick={() => alert('Special RPL Batch authorization dispatched to NSDC SIDH portal.')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Authorize_Special_RPL_Batches_fu8bt', `Authorize Special RPL Batches`)}</button>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>{t('3__Increase_Verification_Veloc_ef2fd', `3. Increase Verification Velocity`)}</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-bold">{t('KYC_4b5hu', `KYC`)}</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {t('12_210_worker_applications_are_t5063', `12,210 worker applications are awaiting local cooperative society police e-clearance. Allocate automated DigiLocker API batch processing to clear backlog within 48 hours.`)}</p>
            <button
              onClick={() => alert('Automated batch DigiLocker KYC triggered.')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Trigger_Batch_Verification_b33ea', `Trigger Batch Verification`)}</button>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                <Building2 size={14} className="text-amber-700" />
                <span>{t('4__Expand_Coverage_to_12_New_D_nhu67', `4. Expand Coverage to 12 New Districts`)}</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">{t('EXPANSION_86evb', `EXPANSION`)}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {t('Bundelkhand_and_Eastern_UP_dis_dl9xz', `Bundelkhand and Eastern UP districts demonstrate organic search queries &gt; 10,000/week with zero registered cooperative coverage. Onboard local Labour Societies.`)}</p>
            <button
              onClick={() => alert('District expansion protocol initiated with State Registrar.')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Initiate_District_Onboarding_l89zi', `Initiate District Onboarding`)}</button>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Risk Alerts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert size={16} className="text-rose-600" />
          <span>{t('Active_Predictive_Risk_Alerts_un5aq', `Active Predictive Risk Alerts`)}</span>
        </h3>

        <div className="space-y-2.5">
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                <span>{t('Rising_Cancellation_Velocity_i_zu2d9', `Rising Cancellation Velocity in North Lucknow (UP)`)}</span>
              </div>
              <p className="text-rose-800">
                {t('Cancellation_rate_climbed_from_vp2mh', `Cancellation rate climbed from 2.8% to 6.2% due to heavy traffic chokeholds. Automated dispatch engine is temporarily lowering initial radius from 5km to 3km in congested postal codes.`)}</p>
            </div>
            <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded shrink-0">
              {t('MITIGATED_jyu99', `MITIGATED`)}</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                <span>{t('Potential_Booking_Abuse_in_Com_cakxs', `Potential Booking Abuse in Commercial Office Hub`)}</span>
              </div>
              <p className="text-amber-800">
                {t('1_customer_profile_has_booked__neavb', `1 customer profile has booked and cancelled 4 commercial HVAC services within 2 hours. Escrow deposit lock has been automatically triggered on that profile.`)}</p>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded shrink-0">
              {t('ESCROW_LOCKED_wwk6q', `ESCROW LOCKED`)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
