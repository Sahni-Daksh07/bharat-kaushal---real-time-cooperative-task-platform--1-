import React, { useState, useRef } from 'react';
import { WorkerProfile, WorkerAddressInfo } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import {
  HardHat,
  User,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Wallet,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Copy,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerProfile;
  lang: SupportedLanguage;
  onUpdateProfile: (updatedData: Partial<WorkerProfile>) => Promise<WorkerProfile>;
  onOpenEmailModal: () => void;
  onOpenAssessmentModal?: () => void;
}

const WORKER_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
];

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  isOpen,
  onClose,
  worker,
  lang,
  onUpdateProfile,
  onOpenEmailModal,
  onOpenAssessmentModal,
}) => {
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const aadhaarDocInputRef = useRef<HTMLInputElement | null>(null);

  // Tab: 'GENERAL' | 'ADDRESSES' | 'AADHAAR_KYC'
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'ADDRESSES' | 'AADHAAR_KYC'>('GENERAL');

  // Form State
  const [name, setName] = useState(worker.name);
  const [phone, setPhone] = useState(worker.phone);
  const [alternatePhone, setAlternatePhone] = useState(worker.alternatePhone || '');
  const [email, setEmail] = useState(worker.email || '');
  const [photoUrl, setPhotoUrl] = useState(worker.photoUrl || '');
  const [dob, setDob] = useState(worker.dob || '1988-06-15');
  const [gender, setGender] = useState(worker.gender || 'Male');

  // Permanent Address
  const [permAddress, setPermAddress] = useState<WorkerAddressInfo>({
    address: worker.permanentAddress?.address || worker.address || 'Gram Post Badnawar, Tehsil Badnawar',
    line1: worker.permanentAddress?.line1 || 'House No. 14, Ward 3, Badnawar Road',
    locality: worker.permanentAddress?.locality || 'Gram Badnawar',
    landmark: worker.permanentAddress?.landmark || 'Near Gram Panchayat Bhawan',
    city: worker.permanentAddress?.city || 'Dhar',
    district: worker.permanentAddress?.district || 'Dhar',
    state: worker.permanentAddress?.state || 'Madhya Pradesh',
    pinCode: worker.permanentAddress?.pinCode || '454660',
  });

  // Temporary / Current Address
  const [tempAddress, setTempAddress] = useState<WorkerAddressInfo>({
    address: worker.temporaryAddress?.address || worker.address || '32, Gandhi Nagar, Near Rajwada',
    line1: worker.temporaryAddress?.line1 || '32, Gandhi Nagar, 2nd Floor',
    locality: worker.temporaryAddress?.locality || 'Rajwada Market Area',
    landmark: worker.temporaryAddress?.landmark || 'Opposite Ahilya Fort Gate',
    city: worker.temporaryAddress?.city || worker.city || 'Indore',
    district: worker.temporaryAddress?.district || worker.district || 'Indore',
    state: worker.temporaryAddress?.state || worker.state || 'Madhya Pradesh',
    pinCode: worker.temporaryAddress?.pinCode || worker.pinCode || '452004',
  });

  // Aadhaar Details
  const [aadhaarNumber, setAadhaarNumber] = useState(worker.aadhaarNumber || '4589 1234 4521');
  const [aadhaarDocUrl, setAadhaarDocUrl] = useState(worker.documents?.aadhaarDocUrl || '');

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Profile image size should be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Aadhaar Card Photo Upload
  const handleAadhaarDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErrorMessage('Aadhaar document size should be under 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAadhaarDocUrl(reader.result);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy Permanent Address to Temporary Address
  const handleCopyPermanentToTemp = () => {
    setTempAddress({ ...permAddress });
  };

  // Save Worker Profile
  const handleSaveAll = async () => {
    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Valid 10-digit primary mobile number is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    const maskedAadhaar =
      cleanAadhaar.length >= 4 ? `XXXX XXXX ${cleanAadhaar.slice(-4)}` : worker.maskedAadhaar;

    try {
      await onUpdateProfile({
        name: name.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        email: email.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        dob,
        gender,
        address: tempAddress.address || `${tempAddress.line1}, ${tempAddress.city}`,
        city: tempAddress.city || 'Indore',
        district: tempAddress.district || 'Indore',
        state: tempAddress.state || 'Madhya Pradesh',
        pinCode: tempAddress.pinCode || '452004',
        permanentAddress: permAddress,
        temporaryAddress: tempAddress,
        aadhaarNumber: aadhaarNumber.trim(),
        maskedAadhaar,
        documents: {
          ...worker.documents,
          aadhaarUploaded: true,
          aadhaarDocUrl: aadhaarDocUrl || undefined,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to update worker dossier. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[70] overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-200 shadow-inner">
              <HardHat size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">{t('Craftsman_Profile___Dossier_s3zij', `Craftsman Profile & Dossier`)}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {worker.verificationStatus === 'VERIFIED' ? 'Society Certified' : 'Verification Under Review'}
                </span>
              </div>
              <p className="text-xs text-amber-200">
                {t('Member_of_z14zd', `Member of`)}{worker.societyName} {t('__Artisan_ID__wkx42', `• Artisan ID:`)}{worker.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('GENERAL')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'GENERAL'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={16} />
            <span>{t('Personal___Contact_a5n7q', `Personal & Contact`)}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ADDRESSES')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ADDRESSES'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin size={16} />
            <span>{t('Permanent___Temporary_Addresse_ict0y', `Permanent & Temporary Addresses`)}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('AADHAAR_KYC')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'AADHAAR_KYC'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={16} />
            <span>{t('Aadhaar_Card___Identity_Proof_qc2gw', `Aadhaar Card & Identity Proof`)}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: GENERAL & CONTACT DETAILS */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-amber-100 border-2 border-amber-400 overflow-hidden shadow-md flex items-center justify-center text-amber-800 font-black text-2xl">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{name ? name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'W'}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl shadow-lg transition-transform active:scale-95 border-2 border-white"
                    title={t('Upload_artisan_photo_w40uf', `Upload artisan photo`)}
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900">{t('Craftsman_Photo_ID_bl7mq', `Craftsman Photo ID`)}</h3>
                    <span className="text-[11px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                      {t('Displayed_on_Customer_OTP_Card_4gljx', `Displayed on Customer OTP Card`)}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('Upload_official_artisan_photo__v9xwc', `Upload official artisan photo or select from standard profiles.`)}</p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap pt-1">
                    {WORKER_AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(preset)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all hover:scale-110 ${
                          photoUrl === preset
                            ? 'border-amber-600 ring-2 ring-amber-300'
                            : 'border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded bg-slate-200 hover:bg-rose-50 transition-colors"
                      >
                        {t('Remove_ca0hz', `Remove`)}</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User size={13} className="text-amber-700" />
                    <span>{t('Artisan_Full_Name___hfe47', `Artisan Full Name *`)}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('e_g___Ramesh_Kumar_ut2d2', `e.g., Ramesh Kumar`)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Primary Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-700" />
                    <span>{t('Registered_Mobile_Number___a7aiy', `Registered Mobile Number *`)}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">{t('_91_dhxvl', `+91`)}</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('9826198765_qywtw', `9826198765`)}
                      className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Alternative Contact Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-700" />
                    <span>{t('Alternative___Emergency_Mobile_oltbr', `Alternative / Emergency Mobile`)}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">{t('_91_la4r5', `+91`)}</span>
                    <input
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder={t('9826198766_wy2w8', `9826198766`)}
                      className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Date_of_Birth_lic7s', `Date of Birth`)}</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Gender_p578p', `Gender`)}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Male">{t('Male_xnhrt', `Male`)}</option>
                    <option value="Female">{t('Female_yf1ph', `Female`)}</option>
                    <option value="Other">{t('Other_bji6m', `Other`)}</option>
                  </select>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail size={13} className="text-amber-700" />
                      <span>{t('Email_Address__Optional__kwxi7', `Email Address (Optional)`)}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEmailModal();
                      }}
                      className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                    >
                      <span>{worker.emailVerified ? '✓ Email Verified' : 'Verify Email OTP'}</span>
                      <ExternalLink size={11} />
                    </button>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('ramesh_kumar_shramik_bharatkau_6lg0r', `ramesh.kumar@shramik.bharatkaushal.in`)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Trade & Trust Metrics Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500">{t('Primary_Trade_gwh3z', `Primary Trade`)}</span>
                  <div className="text-xs font-black text-stone-900">{worker.primaryTrade}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500">{t('Skill_Level_0vodv', `Skill Level`)}</span>
                  <div className="text-xs font-black text-emerald-700">{worker.skillLevel} ({worker.skillAssessmentScore}{t('___29w46', `%)`)}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500">{t('Trust_Score_9h7yf', `Trust Score`)}</span>
                  <div className="text-xs font-black text-blue-700">{worker.trustScore}{t('_100_eftw3', `/100`)}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500">{t('Welfare_Pool_j86iw', `Welfare Pool`)}</span>
                  <div className="text-xs font-black text-amber-800">₹{worker.welfareBalance}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERMANENT & TEMPORARY ADDRESSES */}
          {activeTab === 'ADDRESSES' && (
            <div className="space-y-6">
              {/* Permanent Address Box */}
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building2 size={16} className="text-amber-700" />
                    <span>{t('1__Permanent_Address__Native_H_vbp6t', `1. Permanent Address (Native Home / Village)`)}</span>
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    {t('Aadhaar_Linked_fi67j', `Aadhaar Linked`)}</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{t('House___Plot_No____Street___Wa_1vzpq', `House / Plot No. & Street / Ward`)}</label>
                    <input
                      type="text"
                      value={permAddress.line1}
                      onChange={(e) => setPermAddress({ ...permAddress, line1: e.target.value })}
                      placeholder={t('e_g___House_No__14__Ward_3__Ba_vbv9n', `e.g., House No. 14, Ward 3, Badnawar Road`)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('Gram___Locality___Tehsil_0nsi2', `Gram / Locality / Tehsil`)}</label>
                      <input
                        type="text"
                        value={permAddress.locality}
                        onChange={(e) => setPermAddress({ ...permAddress, locality: e.target.value })}
                        placeholder={t('e_g___Gram_Badnawar_7etwz', `e.g., Gram Badnawar`)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('Landmark_ya6r8', `Landmark`)}</label>
                      <input
                        type="text"
                        value={permAddress.landmark}
                        onChange={(e) => setPermAddress({ ...permAddress, landmark: e.target.value })}
                        placeholder={t('e_g___Near_Gram_Panchayat_Bhaw_bjjac', `e.g., Near Gram Panchayat Bhawan`)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('City___District_roiwa', `City / District`)}</label>
                      <input
                        type="text"
                        value={permAddress.city}
                        onChange={(e) => setPermAddress({ ...permAddress, city: e.target.value, district: e.target.value })}
                        placeholder={t('Dhar_3chpe', `Dhar`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('State_owzfg', `State`)}</label>
                      <input
                        type="text"
                        value={permAddress.state}
                        onChange={(e) => setPermAddress({ ...permAddress, state: e.target.value })}
                        placeholder={t('Madhya_Pradesh_j202i', `Madhya Pradesh`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('PIN_Code_dk3va', `PIN Code`)}</label>
                      <input
                        type="text"
                        value={permAddress.pinCode}
                        onChange={(e) => setPermAddress({ ...permAddress, pinCode: e.target.value })}
                        placeholder={t('454660_3bz3v', `454660`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Temporary / Current Working Address Box */}
              <div className="bg-amber-50/50 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <MapPin size={16} className="text-amber-700" />
                    <span>{t('2__Temporary___Current_Address_s5mb9', `2. Temporary / Current Address (Active Work Base in Indore)`)}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyPermanentToTemp}
                    className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Copy size={12} />
                    <span>{t('Same_as_Permanent_wvzb3', `Same as Permanent`)}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{t('Current_Room___House___Street_awyjo', `Current Room / House & Street`)}</label>
                    <input
                      type="text"
                      value={tempAddress.line1}
                      onChange={(e) => setTempAddress({ ...tempAddress, line1: e.target.value })}
                      placeholder={t('e_g___32__Gandhi_Nagar__2nd_Fl_5k9vh', `e.g., 32, Gandhi Nagar, 2nd Floor`)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('Current_Locality___Market_v3btn', `Current Locality / Market`)}</label>
                      <input
                        type="text"
                        value={tempAddress.locality}
                        onChange={(e) => setTempAddress({ ...tempAddress, locality: e.target.value })}
                        placeholder={t('e_g___Rajwada_Market_Area_0b6m6', `e.g., Rajwada Market Area`)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('Current_Landmark_8a6bd', `Current Landmark`)}</label>
                      <input
                        type="text"
                        value={tempAddress.landmark}
                        onChange={(e) => setTempAddress({ ...tempAddress, landmark: e.target.value })}
                        placeholder={t('e_g___Opposite_Ahilya_Fort_Gat_b5fe2', `e.g., Opposite Ahilya Fort Gate`)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('Work_City_fqenn', `Work City`)}</label>
                      <input
                        type="text"
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value, district: e.target.value })}
                        placeholder={t('Indore_xev6z', `Indore`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('State_xndm1', `State`)}</label>
                      <input
                        type="text"
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                        placeholder={t('Madhya_Pradesh_arsvy', `Madhya Pradesh`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">{t('PIN_Code_4uic7', `PIN Code`)}</label>
                      <input
                        type="text"
                        value={tempAddress.pinCode}
                        onChange={(e) => setTempAddress({ ...tempAddress, pinCode: e.target.value })}
                        placeholder={t('452004_qmpim', `452004`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AADHAAR CARD & KYC PROOF */}
          {activeTab === 'AADHAAR_KYC' && (
            <div className="space-y-6">
              {/* Aadhaar Number Input & Status */}
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{t('Aadhaar_Card_Verification_x6x72', `Aadhaar Card Verification`)}</h3>
                      <p className="text-xs text-slate-500">{t('Government_UIDAI_e_KYC_complia_r4fgv', `Government UIDAI e-KYC compliant identity record`)}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>{t('UIDAI_Verified_89a6y', `UIDAI Verified`)}</span>
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700">{t('12_Digit_Aadhaar_Card_Number___snv5j', `12-Digit Aadhaar Card Number *`)}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder={t('4589_1234_4521_um2pk', `4589 1234 4521`)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-wider"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <Lock size={12} className="text-emerald-600" />
                      <span>{t('Masked_Display__e50bc', `Masked Display:`)}{worker.maskedAadhaar}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aadhaar Card Document Upload Preview */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3 bg-stone-50/50">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileCheck size={24} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{t('Aadhaar_Card_Document_Attachme_8ljns', `Aadhaar Card Document Attachment`)}</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {t('Attach_front_back_copy_or_phot_cfpuf', `Attach front/back copy or photograph of your physical Aadhaar card for cooperative verification records.`)}</p>
                </div>

                {aadhaarDocUrl ? (
                  <div className="space-y-2 pt-2">
                    <div className="max-w-xs mx-auto h-36 rounded-xl overflow-hidden border border-slate-300 shadow-sm relative group bg-white">
                      <img
                        src={aadhaarDocUrl}
                        alt="Aadhaar Document"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => aadhaarDocInputRef.current?.click()}
                        className="text-xs text-amber-700 hover:text-amber-900 font-bold px-3 py-1 bg-amber-100 rounded-lg"
                      >
                        {t('Replace_Image_tyrs0', `Replace Image`)}</button>
                      <button
                        type="button"
                        onClick={() => setAadhaarDocUrl('')}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1 bg-rose-50 rounded-lg"
                      >
                        {t('Remove_n4goo', `Remove`)}</button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => aadhaarDocInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-slate-300 hover:border-amber-400 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
                    >
                      <Upload size={14} />
                      <span>{t('Upload_Aadhaar_Photo___Scan_48r5k', `Upload Aadhaar Photo / Scan`)}</span>
                    </button>
                  </div>
                )}

                <input
                  ref={aadhaarDocInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleAadhaarDocUpload}
                  className="hidden"
                />
              </div>

              {/* Aadhaar Security Note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  <span>{t('UIDAI_Aadhaar_Security___Statu_8yn8i', `UIDAI Aadhaar Security & Statutory Protection`)}</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {t('Aadhaar_numbers_are_stored_sec_hllwm', `Aadhaar numbers are stored securely with 256-bit encryption. Public and customer views only display masked format (XXXX XXXX 4521) in full compliance with the Aadhaar Act and National Data Protection Norms.`)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>{t('Craftsman_dossier_updated_succ_81c5m', `Craftsman dossier updated successfully!`)}</span>
              </span>
            ) : (
              <span>{t('Synced_with_Indore_Labour_Coop_f5tla', `Synced with Indore Labour Cooperative Society`)}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              {t('Cancel_p4dtc', `Cancel`)}</button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving Dossier...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
