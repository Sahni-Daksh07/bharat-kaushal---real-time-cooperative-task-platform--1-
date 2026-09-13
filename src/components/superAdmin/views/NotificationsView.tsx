import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { STATE_METRICS } from '../../../data/superAdminSeedData';
import { SEEDED_SOCIETIES } from '../../../data/seedData';

export const NotificationsView: React.FC = () => {
  const [targetAudience, setTargetAudience] = useState<'ALL_WORKERS' | 'STATE' | 'SOCIETY' | 'SKILL'>('ALL_WORKERS');
  const [selectedState, setSelectedState] = useState('MP');
  const [selectedSociety, setSelectedSociety] = useState('SOC-IND-02');
  const [selectedSkill, setSelectedSkill] = useState('Plumbing');
  const [alertType, setAlertType] = useState<'NATIONAL_ANNOUNCEMENT' | 'TRAINING_NOTICE' | 'POLICY_UPDATE' | 'EMERGENCY_ALERT'>('NATIONAL_ANNOUNCEMENT');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please fill out both the alert title and the message content.');
      return;
    }

    setSentNotice(
      `Broadcast dispatched successfully via CDAC SMS & WhatsApp Gateways to target group: ${targetAudience}.`
    );
    setTitle('');
    setMessage('');
    setTimeout(() => setSentNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell size={16} className="text-blue-600" />
            <span>{t('National_Multilingual_Broadcas_cvf2y', `National Multilingual Broadcast & Citizen Communication Hub`)}</span>
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Radio size={12} className="animate-pulse" />
            <span>{t('CDAC_Gateway_Live_1i2a9', `CDAC Gateway Live`)}</span>
          </span>
        </div>
        <p className="text-xs text-slate-500">
          {t('Transmit_official_government_c_7idfh', `Transmit official government circulars, skill training invites, policy amendments, and severe weather emergency safety warnings directly to artisan handsets via SMS, WhatsApp, and app push notifications.`)}</p>

        {sentNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{sentNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Notification Composition Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {t('Compose_National_Broadcast_v2o4r', `Compose National Broadcast`)}</h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            {/* Target Audience Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Select_Target_Audience__aw7s1', `Select Target Audience:`)}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ALL_WORKERS', label: 'All 184k Artisans' },
                  { id: 'STATE', label: 'Specific State' },
                  { id: 'SOCIETY', label: 'Specific Society' },
                  { id: 'SKILL', label: 'Specific Trade' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTargetAudience(aud.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      targetAudience === aud.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters depending on Audience */}
            {targetAudience === 'STATE' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Target_State__j7odn', `Target State:`)}</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  {STATE_METRICS.map((st) => (
                    <option key={st.stateCode} value={st.stateCode}>
                      {st.stateName} ({st.totalWorkers.toLocaleString('en-IN')} {t('workers__gd0g4', `workers)`)}</option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === 'SOCIETY' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Target_Primary_Society__ug1x5', `Target Primary Society:`)}</label>
                <select
                  value={selectedSociety}
                  onChange={(e) => setSelectedSociety(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  {SEEDED_SOCIETIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === 'SKILL' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Target_Trade___Skill__3hu6h', `Target Trade / Skill:`)}</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Plumbing">{t('Plumbing___Sanitation_lol9a', `Plumbing & Sanitation`)}</option>
                  <option value="Electrical">{t('Electrical_Works_sdt39', `Electrical Works`)}</option>
                  <option value="HVAC">{t('Appliance___HVAC_Repair_14an6', `Appliance & HVAC Repair`)}</option>
                  <option value="Solar">{t('Solar_Rooftop_Tech_ll031', `Solar Rooftop Tech`)}</option>
                  <option value="Carpentry">{t('Carpentry___Joinery_p89j9', `Carpentry & Joinery`)}</option>
                </select>
              </div>
            )}

            {/* Alert Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t('Notification_Category__ahxjp', `Notification Category:`)}</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="NATIONAL_ANNOUNCEMENT">{t('National_Government_Announceme_oz41w', `National Government Announcement`)}</option>
                <option value="TRAINING_NOTICE">{t('NSDC___ITI_Skill_Upgrade_Batch_cazdg', `NSDC / ITI Skill Upgrade Batch Notice`)}</option>
                <option value="POLICY_UPDATE">{t('Cooperative_Policy___Revenue_S_oth9a', `Cooperative Policy & Revenue Share Update`)}</option>
                <option value="EMERGENCY_ALERT">{t('Severe_Weather___Emergency_Con_g14wq', `Severe Weather & Emergency Contingency`)}</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t('Announcement_Title__pip8d', `Announcement Title:`)}</label>
              <input
                type="text"
                placeholder={t('e_g__Mandatory_Monsoon_Safety__pm3y2', `e.g. Mandatory Monsoon Safety Protocol & Flood Relief Dispatch Bonus`)}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t('Vernacular_Message_Body__Hindi_pnz0o', `Vernacular Message Body (Hindi / English):`)}</label>
              <textarea
                placeholder={t('Enter_communication_details_fo_py2a2', `Enter communication details for SMS, WhatsApp and app in-box...`)}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={15} />
              <span>{t('Broadcast_Official_Notificatio_xn61s', `Broadcast Official Notification to Handsets`)}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Handset Preview & Delivery Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone size={15} className="text-slate-600" />
              <span>{t('Artisan_Mobile_Handset_Preview_kdcrb', `Artisan Mobile Handset Preview`)}</span>
            </h3>

            {/* Handset mockup */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border-4 border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                <span>{t('GOV_BHARATKAUSHAL_98nbh', `GOV-BHARATKAUSHAL`)}</span>
                <span>{t('Just_Now_7gsa9', `Just Now`)}</span>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-xs text-amber-400">
                  {title || 'Sample: Emergency Monsoon Dispatch Bonus'}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {message ||
                    'प्रिय कारीगर साथी, इंदौर में भारी वर्षा के चलते आपातकालीन प्लंबिंग दरों पर +25% अतिरिक्त समाज कल्याण प्रोत्साहन लागू कर दिया गया है।'}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex items-center justify-between">
                <span>{t('Sent_via_CDAC_GovNet_SMS_wiooq', `Sent via CDAC GovNet SMS`)}</span>
                <span>{t('Delivered_in_2_1s_oo105', `Delivered in 2.1s`)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
