import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Scale,
  ShieldCheck,
  Save,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useRealtime } from '../../../context/RealtimeContext';
import { CooperativePolicy } from '../../../types';

export const PoliciesView: React.FC = () => {
  const { policy, updatePolicy } = useRealtime();

  // Local form state for policy adjustment
  const [workerShare, setWorkerShare] = useState(policy.modelA.workerSharePercent);
  const [societyShare, setSocietyShare] = useState(policy.modelA.societySharePercent);
  const [welfareShare, setWelfareShare] = useState(policy.modelA.welfareFundPercent);

  const [graceWindow, setGraceWindow] = useState(policy.cancellationPolicy.graceWindowMinutes);
  const [penaltyInr, setPenaltyInr] = useState(policy.cancellationPolicy.unexcusedPenaltyInr);

  const [initialRadius, setInitialRadius] = useState(policy.dispatchPolicy.standardInitialRadiusKm);
  const [maxRadius, setMaxRadius] = useState(policy.dispatchPolicy.maxRadiusKm);
  const [skillWeight, setSkillWeight] = useState(policy.dispatchPolicy.weights.skillMatch);
  const [distanceWeight, setDistanceWeight] = useState(policy.dispatchPolicy.weights.distanceEta);
  const [fairnessWeight, setFairnessWeight] = useState(policy.dispatchPolicy.weights.fairness);

  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const totalShare = Number((workerShare + societyShare + welfareShare).toFixed(1));

  const handleSavePolicy = () => {
    if (totalShare !== 100.0) {
      alert(`Economic split must total exactly 100.0%. Current total is ${totalShare}%.`);
      return;
    }

    const updated: CooperativePolicy = {
      ...policy,
      modelA: {
        workerSharePercent: workerShare,
        societySharePercent: societyShare,
        welfareFundPercent: welfareShare,
      },
      cancellationPolicy: {
        ...policy.cancellationPolicy,
        graceWindowMinutes: graceWindow,
        unexcusedPenaltyInr: penaltyInr,
      },
      dispatchPolicy: {
        ...policy.dispatchPolicy,
        standardInitialRadiusKm: initialRadius,
        maxRadiusKm: maxRadius,
        weights: {
          ...policy.dispatchPolicy.weights,
          skillMatch: skillWeight,
          distanceEta: distanceWeight,
          fairness: fairnessWeight,
        },
      },
    };

    updatePolicy(updated);
    setSaveSuccessNotice(
      'Policy update successfully applied across all 224 primary societies. Statutory audit record AUD-2026-POL-091 created.'
    );
    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" />
            <span>{t('National_Cooperative_Policy____1rtrh', `National Cooperative Policy & Statutory Algorithmic Parameters`)}</span>
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {t('Model_A_Active__94_5__Worker_S_sbmwb', `Model A Active (94.5% Worker Sovereign)`)}</span>
        </div>
        <p className="text-xs text-slate-500">
          {t('Governs_real_time_payout_split_vi1up', `Governs real-time payout splits, fairness weights, cancellation penalties, and radial dispatch expansion. Every mutation is cryptographically logged in the National Audit Vault.`)}</p>

        {saveSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}
      </div>

      {/* 3 Pillars of Policy Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Economic Policy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <IndianRupee size={16} className="text-emerald-600" />
              <span>{t('1__Economic_Revenue_Split__Mod_xtosi', `1. Economic Revenue Split (Model A)`)}</span>
            </h3>
            <p className="text-xs text-slate-500">{t('Mandatory_statutory_breakdown__n7lcc', `Mandatory statutory breakdown totaling 100%`)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Artisan_Direct_Share__ivx98', `Artisan Direct Share:`)}</span>
                <span className="font-black text-emerald-700">{workerShare}%</span>
              </div>
              <input
                type="range"
                min={90.0}
                max={96.0}
                step={0.5}
                value={workerShare}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWorkerShare(val);
                  setSocietyShare(Number((100.0 - val - welfareShare).toFixed(1)));
                }}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Society_Operations_Share__j2gec', `Society Operations Share:`)}</span>
                <span className="font-bold text-slate-800">{societyShare}%</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={8.0}
                step={0.5}
                value={societyShare}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSocietyShare(val);
                  setWorkerShare(Number((100.0 - val - welfareShare).toFixed(1)));
                }}
                className="w-full accent-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Social_Security_Welfare_Fund__lxmx5', `Social Security Welfare Fund:`)}</span>
                <span className="font-bold text-blue-700">{welfareShare}%</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={4.0}
                step={0.5}
                value={welfareShare}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWelfareShare(val);
                  setSocietyShare(Number((100.0 - workerShare - val).toFixed(1)));
                }}
                className="w-full accent-blue-600"
              />
            </div>

            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                totalShare === 100.0 ? 'bg-slate-50 text-slate-800' : 'bg-rose-50 text-rose-800'
              }`}
            >
              <span>{t('Total_Distribution_Balance__qxlht', `Total Distribution Balance:`)}</span>
              <span className="font-mono">{totalShare}%</span>
            </div>
          </div>
        </div>

        {/* 2. Cancellation & Appeal Policy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale size={16} className="text-amber-600" />
              <span>{t('2__Cancellation___Penalty_Rule_kobab', `2. Cancellation & Penalty Rules`)}</span>
            </h3>
            <p className="text-xs text-slate-500">{t('Consumer_grace_window___doorst_bd41i', `Consumer grace window & doorstep protection`)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Free_Cancellation_Window__tuhk8', `Free Cancellation Window:`)}</span>
                <span className="font-bold text-slate-900">{graceWindow} {t('minutes_enljz', `minutes`)}</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={graceWindow}
                onChange={(e) => setGraceWindow(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">{t('Customer_can_cancel_freely_bef_5v2e8', `Customer can cancel freely before worker departs.`)}</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Unexcused_Doorstep_Cancellatio_yihhx', `Unexcused Doorstep Cancellation Penalty:`)}</span>
                <span className="font-bold text-slate-900">₹{penaltyInr}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={10}
                value={penaltyInr}
                onChange={(e) => setPenaltyInr(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">{t('Directly_credited_to_worker_fo_qsj2r', `Directly credited to worker for travel diesel compensation.`)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-800">{t('Cooperative_Appeal_Guarantees__de3aa', `Cooperative Appeal Guarantees:`)}</div>
              <p className="text-slate-500 text-[11px]">
                {t('Workers_can_submit_digital_app_nrx9l', `Workers can submit digital appeals with GPS photos against arbitrary customer cancellations. 100% peer-reviewed by Society Board.`)}</p>
            </div>
          </div>
        </div>

        {/* 3. Dispatch Policy & Weights */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-blue-600" />
              <span>{t('3__Dispatch_Radial___Fairness__3e97h', `3. Dispatch Radial & Fairness Weights`)}</span>
            </h3>
            <p className="text-xs text-slate-500">{t('Autonomous_match_ranking_equat_gyjxf', `Autonomous match ranking equation`)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Initial_Search_Radius__3fbtd', `Initial Search Radius:`)}</span>
                <span className="font-bold text-slate-900">{initialRadius} {t('km_dq3of', `km`)}</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                step={1}
                value={initialRadius}
                onChange={(e) => setInitialRadius(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Skill_Match_Weight__uzu56', `Skill Match Weight:`)}</span>
                <span className="font-bold text-slate-900">{skillWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={skillWeight}
                onChange={(e) => setSkillWeight(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{t('Fairness___Underutilization_We_b91i8', `Fairness & Underutilization Weight:`)}</span>
                <span className="font-bold text-emerald-700">{fairnessWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={fairnessWeight}
                onChange={(e) => setFairnessWeight(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <span className="text-xs text-slate-500">
          {t('Statutory_Sign_off__Dr__Amitab_o8ahv', `Statutory Sign-off: Dr. Amitabh Verma, IAS (Level 5 National Apex Clearance)`)}</span>
        <button
          onClick={handleSavePolicy}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2"
        >
          <Save size={15} />
          <span>{t('Apply_Policy_Amendments___Audi_soc41', `Apply Policy Amendments & Audit Log`)}</span>
        </button>
      </div>
    </div>
  );
};
