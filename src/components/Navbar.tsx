import React, { useState } from 'react';
import { Leaf, Award, Globe, Bot, Shield, Bell, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { ActiveView } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenViva: () => void;
  onOpenAgriAi: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  lang,
  setLang,
  onOpenViva,
  onOpenAgriAi,
  isLoggedIn,
  setIsLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const t = TRANSLATIONS[lang];

  return (
    <nav className="sticky top-0 z-40 bg-[#FAFBF8]/98 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-2xl bg-[#0D3B24] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 64 64" fill="none">
                <path d="M32 8C32 8 20 22 20 38C20 45.732 25.3726 52 32 52C38.6274 52 44 45.732 44 38C44 22 32 8 32 8Z" fill="#176B3A"/>
                <path d="M32 14V48" stroke="#4FAF68" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="14" r="3.5" fill="#EAF5EC" stroke="#176B3A" strokeWidth="2"/>
                <circle cx="23" cy="30" r="3" fill="#4FAF68"/>
                <circle cx="41" cy="30" r="3" fill="#4FAF68"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl text-[#0D3B24] tracking-tight">
                  ArecaCare AI
                </span>
                <span className="hidden sm:inline text-[10px] font-mono uppercase bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold border border-[#176B3A]/20">
                  CSE Capstone
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#66736A] hidden md:block">
                Smart Arecanut Pathology & Advisory
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'landing'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'dashboard'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navDashboard}
            </button>
            <button
              onClick={() => setActiveView('scan')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'scan'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navScanPlant}
            </button>
            <button
              onClick={() => setActiveView('library')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'library'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navDiseaseLibrary}
            </button>
            <button
              onClick={() => setActiveView('weather')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'weather'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navWeatherRisk}
            </button>
            <button
              onClick={() => setActiveView('farms')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'farms'
                  ? 'bg-[#EAF5EC] text-[#176B3A]'
                  : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
              }`}
            >
              {t.navMyFarms}
            </button>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-[#FAFBF8] text-xs font-semibold text-[#17231B] transition-all cursor-pointer shadow-2xs"
              title="Toggle English / ಕನ್ನಡ Language"
            >
              <Globe className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#176B3A]" />
              <span className="hidden sm:inline">{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* AI Assistant Chat Trigger */}
            <button
              onClick={onOpenAgriAi}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF5EC] hover:bg-[#d8edd9] text-[#176B3A] text-xs font-semibold transition-all border border-[#176B3A]/20 cursor-pointer shadow-2xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Agro-AI Advisor</span>
            </button>

            {/* Viva & Research Dossier Trigger */}
            <button
              onClick={onOpenViva}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FAFBF8] hover:bg-white text-[#0D3B24] border border-gray-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-[#E6A23C]" />
              <span className="hidden md:inline">Project Dossier</span>
              <span className="md:hidden">Viva</span>
            </button>

            {/* Notification Bell */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-[#66736A] hover:text-[#17231B] hover:bg-black/5 relative transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9534F]"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 text-xs space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-[#0D3B24]">Alerts & Advisories</span>
                    <span className="text-[10px] bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold">2 New</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Mahali Spore Alert: Udupi District
                      </div>
                      <p className="text-[11px] text-amber-800 mt-1">
                        Recent rainfalls + 78% humidity create high risk of Fruit Rot. Schedule bunch spraying.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-green-50/70 border border-green-200">
                      <div className="font-semibold text-green-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Scan Verification Complete
                      </div>
                      <p className="text-[11px] text-green-800 mt-1">
                        Report #SC-2026-9041 verified by model with 94.6% confidence.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Launch App / Main CTA Button */}
            {activeView === 'landing' ? (
              <button
                onClick={() => setActiveView('scan')}
                className="flex items-center gap-1.5 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-3 sm:px-3.5 lg:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <span>{t.btnScanPlant}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('scan')}
                className="flex items-center gap-1.5 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-3 sm:px-3.5 lg:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <Leaf className="w-4 h-4" />
                <span className="hidden md:inline">New Scan</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#66736A] hover:text-[#17231B] hover:bg-black/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <button
            onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'landing' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'dashboard' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => { setActiveView('scan'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'scan' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navScanPlant}
          </button>
          <button
            onClick={() => { setActiveView('library'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'library' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navDiseaseLibrary}
          </button>
          <button
            onClick={() => { setActiveView('weather'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'weather' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navWeatherRisk}
          </button>
          <button
            onClick={() => { setActiveView('farms'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'farms' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navMyFarms}
          </button>
          <button
            onClick={() => { setActiveView('history'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'history' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navScanHistory}
          </button>
          <button
            onClick={() => { setActiveView('reports'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === 'reports' ? 'bg-[#EAF5EC] text-[#176B3A]' : 'text-[#17231B]'
            }`}
          >
            {t.navReports}
          </button>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => { onOpenAgriAi(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-xs text-[#176B3A] font-semibold bg-[#EAF5EC] px-3 py-2 rounded-xl"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Agro-AI Assistant</span>
            </button>
            <button
              onClick={() => { onOpenViva(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-xs text-[#0D3B24] font-semibold bg-gray-100 px-3 py-2 rounded-xl"
            >
              <Award className="w-4 h-4 text-[#E6A23C]" />
              <span>Viva Info</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
