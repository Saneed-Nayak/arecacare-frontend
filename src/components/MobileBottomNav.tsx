import React from 'react';
import { LayoutDashboard, ScanLine, History, CloudSunRain, BookOpen, Bot } from 'lucide-react';
import { ActiveView } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface MobileBottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  onOpenAgriAi: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  lang,
  onOpenAgriAi
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFBF8]/98 backdrop-blur-lg border-t border-gray-200 px-2 py-2 safe-area-inset-bottom shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-[60px] ${
            activeView === 'dashboard' ? 'text-[#176B3A] font-bold' : 'text-[#66736A]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navDashboard}</span>
        </button>

        <button
          onClick={() => setActiveView('library')}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-[60px] ${
            activeView === 'library' ? 'text-[#176B3A] font-bold' : 'text-[#66736A]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] leading-tight">Diseases</span>
        </button>

        {/* Prominent Center Scan Button */}
        <button
          onClick={() => setActiveView('scan')}
          className="flex flex-col items-center -mt-6 bg-[#176B3A] hover:bg-[#0D3B24] text-white p-4 rounded-full shadow-lg border-4 border-[#FAFBF8] transition-transform active:scale-95"
        >
          <ScanLine className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveView('weather')}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-[60px] ${
            activeView === 'weather' ? 'text-[#176B3A] font-bold' : 'text-[#66736A]'
          }`}
        >
          <CloudSunRain className="w-5 h-5" />
          <span className="text-[10px] leading-tight">Risk</span>
        </button>

        <button
          onClick={() => setActiveView('history')}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-[60px] ${
            activeView === 'history' ? 'text-[#176B3A] font-bold' : 'text-[#66736A]'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] leading-tight">History</span>
        </button>
      </div>
    </div>
  );
};
