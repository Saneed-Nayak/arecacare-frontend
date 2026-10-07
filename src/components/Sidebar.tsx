import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  BookOpen,
  CloudSunRain,
  Trees,
  History,
  FileBarChart,
  User,
  Award,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { ActiveView } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  onOpenViva: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  lang,
  onOpenViva
}) => {
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'dashboard' as ActiveView, label: t.navDashboard, icon: LayoutDashboard },
    { id: 'scan' as ActiveView, label: t.navScanPlant, icon: ScanLine, highlight: true },
    { id: 'library' as ActiveView, label: t.navDiseaseLibrary, icon: BookOpen },
    { id: 'weather' as ActiveView, label: t.navWeatherRisk, icon: CloudSunRain },
    { id: 'farms' as ActiveView, label: t.navMyFarms, icon: Trees },
    { id: 'history' as ActiveView, label: t.navScanHistory, icon: History },
    { id: 'reports' as ActiveView, label: t.navReports, icon: FileBarChart },
    { id: 'profile' as ActiveView, label: t.navProfile, icon: User }
  ];

  return (
    <aside className="w-64 bg-[#FAFBF8] border-r border-[#E2E8F0] hidden lg:flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-5rem)] sticky top-20">
      {/* Navigation List */}
      <div className="space-y-6">
        {/* Quick Scan Plant Action */}
        <button
          onClick={() => setActiveView('scan')}
          className="w-full bg-[#176B3A] hover:bg-[#0D3B24] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-white/20 text-white">
              <ScanLine className="w-4 h-4" />
            </span>
            <div className="text-left">
              <div className="font-bold text-xs">{t.btnScanPlant}</div>
              <div className="text-[10px] text-white/80">AI Disease Analysis</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Main Menu Links */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#66736A] mb-2">
            Agricultural Suite
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF5EC] text-[#176B3A] shadow-2xs font-bold'
                    : 'text-[#17231B] hover:text-[#176B3A] hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#176B3A]' : 'text-[#66736A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.id === 'weather' && (
                  <span className="w-2 h-2 rounded-full bg-[#E6A23C]" title="High Risk Alert" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Academic & System Card */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {/* Viva Button */}
        <button
          onClick={onOpenViva}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-2xl text-left transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <Award className="w-4 h-4 text-[#E6A23C]" />
            <span className="font-bold text-xs text-[#0D3B24]">Final Year Project Dossier</span>
          </div>
          <p className="text-[10px] text-[#66736A] leading-tight">
            CSE Data Science • ResNet-50 & Grad-CAM Metrics (96.2% Acc)
          </p>
        </button>

        {/* Active Farm Status Badge */}
        <div className="p-3 rounded-xl bg-[#EAF5EC] text-[#0D3B24] flex items-center justify-between text-[11px]">
          <div>
            <div className="text-[10px] text-[#176B3A] font-semibold">Active Farm</div>
            <div className="font-bold truncate max-w-[130px]">Green Valley Farm</div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#176B3A] text-white text-[10px] font-mono font-bold">
            850 Palms
          </span>
        </div>
      </div>
    </aside>
  );
};
