import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Settings,
  Bell,
  Globe,
  Database,
  Cpu,
  Save,
  CheckCircle2,
  Trees,
  Award
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ProfileViewProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenViva: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  lang,
  setLang,
  onOpenViva
}) => {
  const t = TRANSLATIONS[lang];

  const [userName, setUserName] = useState('Shankar Bhat');
  const [userRole, setUserRole] = useState<'farmer' | 'officer' | 'researcher'>('farmer');
  const [phone, setPhone] = useState('+91 94812 34567');
  const [district, setDistrict] = useState('Udupi, Karnataka');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [claheEnabled, setClaheEnabled] = useState(true);
  const [autoRiskAlerts, setAutoRiskAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
            User Profile & AI Configuration
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight mt-1">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A]">
            Manage your agricultural officer credentials, language preferences, and vision model hyperparameters.
          </p>
        </div>

        <button
          onClick={onOpenViva}
          className="flex items-center gap-2 bg-[#FAFBF8] hover:bg-white text-[#0D3B24] border border-gray-300 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer w-fit"
        >
          <Award className="w-4 h-4 text-[#E6A23C]" />
          <span>CSE Final Year Project Dossier</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0D3B24] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              🌴
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#17231B]">{userName}</h3>
              <p className="text-xs text-[#66736A]">Arecanut Planter & Agronomic Practitioner</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold uppercase">
                  Verified Farmer ID: ARECA-KA-884
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">User Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              >
                <option value="farmer">Arecanut Farmer / Plantation Owner</option>
                <option value="officer">Agricultural Extension Officer</option>
                <option value="researcher">Plant Pathology Researcher (ICAR/University)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Primary District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>
          </div>
        </div>

        {/* Language & Interface Settings */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#0D3B24] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#176B3A]" />
            <span>Language & Localization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                lang === 'en'
                  ? 'border-[#176B3A] bg-[#EAF5EC]/50 shadow-2xs font-bold text-[#0D3B24]'
                  : 'border-gray-200 bg-[#FAFBF8] text-[#66736A]'
              }`}
            >
              <div className="font-bold text-sm">English (Default)</div>
              <p className="text-[11px] text-[#66736A] mt-1">Full technical terminology, botanical names & research metrics</p>
            </button>

            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                lang === 'kn'
                  ? 'border-[#176B3A] bg-[#EAF5EC]/50 shadow-2xs font-bold text-[#0D3B24]'
                  : 'border-gray-200 bg-[#FAFBF8] text-[#66736A]'
              }`}
            >
              <div className="font-bold text-sm">ಕನ್ನಡ (Kannada)</div>
              <p className="text-[11px] text-[#66736A] mt-1">ಸ್ಥಳೀಯ ರೈತ ಸ್ನೇಹಿ ಭಾಷೆ, ರೋಗ ಲಕ್ಷಣಗಳು ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳು</p>
            </button>
          </div>
        </div>

        {/* Model Pipeline Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#0D3B24] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#176B3A]" />
            <span>Vision Model & CLAHE Enhancement Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-2xl border border-gray-100 cursor-pointer">
              <div>
                <div className="font-semibold text-[#17231B]">CLAHE Sunlight Glare Normalization</div>
                <div className="text-[11px] text-[#66736A]">Adapts contrast on over-exposed leaves in sunny plantation conditions</div>
              </div>
              <input
                type="checkbox"
                checked={claheEnabled}
                onChange={(e) => setClaheEnabled(e.target.checked)}
                className="w-4 h-4 text-[#176B3A] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-2xl border border-gray-100 cursor-pointer">
              <div>
                <div className="font-semibold text-[#17231B]">Automated Monsoon Outbreak Alerts</div>
                <div className="text-[11px] text-[#66736A]">Notify when relative humidity & rainfall exceed Mahali threshold</div>
              </div>
              <input
                type="checkbox"
                checked={autoRiskAlerts}
                onChange={(e) => setAutoRiskAlerts(e.target.checked)}
                className="w-4 h-4 text-[#176B3A] rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-[#176B3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : (
            <span className="text-xs text-[#66736A]">All data stored in secure local state.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
