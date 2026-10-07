import React, { useState } from 'react';
import { ActiveView, ScanResult, Farm } from './types';
import { INITIAL_SCANS, INITIAL_FARMS } from './data/mockData';
import { ARECANUT_DISEASES } from './data/diseases';
import { Language } from './lib/translations';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PlantHealthReportModal } from './components/PlantHealthReportModal';
import { AcademicVivaModal } from './components/AcademicVivaModal';
import { AgriChatAssistant } from './components/AgriChatAssistant';
import { NewFarmModal } from './components/NewFarmModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { ScanView } from './views/ScanView';
import { DiseaseLibraryView } from './views/DiseaseLibraryView';
import { WeatherRiskView } from './views/WeatherRiskView';
import { MyFarmsView } from './views/MyFarmsView';
import { ScanHistoryView } from './views/ScanHistoryView';
import { ReportsView } from './views/ReportsView';
import { ProfileView } from './views/ProfileView';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Core App State
  const [scans, setScans] = useState<ScanResult[]>(INITIAL_SCANS);
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);

  // Modal States
  const [selectedScanForReport, setSelectedScanForReport] = useState<ScanResult | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [isAgriAiOpen, setIsAgriAiOpen] = useState(false);
  const [isNewFarmModalOpen, setIsNewFarmModalOpen] = useState(false);

  // Handle new scan addition
  const handleScanComplete = (newScan: ScanResult) => {
    setScans((prev) => [newScan, ...prev]);
  };

  // Handle new farm addition
  const handleAddFarm = (newFarm: Farm) => {
    setFarms((prev) => [newFarm, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#17231B] flex flex-col font-sans selection:bg-[#EAF5EC] selection:text-[#0D3B24]">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        onOpenViva={() => setIsVivaModalOpen(true)}
        onOpenAgriAi={() => setIsAgriAiOpen(true)}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Main Container */}
      {activeView === 'landing' ? (
        <main className="flex-1">
          <LandingView
            setActiveView={setActiveView}
            lang={lang}
            onOpenViva={() => setIsVivaModalOpen(true)}
            onOpenAgriAi={() => setIsAgriAiOpen(true)}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Desktop Sidebar */}
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            lang={lang}
            onOpenViva={() => setIsVivaModalOpen(true)}
          />

          {/* Dynamic View Canvas */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto max-w-5xl mx-auto w-full pb-24 lg:pb-8">
            {activeView === 'dashboard' && (
              <DashboardView
                scans={scans}
                farms={farms}
                setActiveView={setActiveView}
                onSelectScanForReport={(scan) => setSelectedScanForReport(scan)}
                onOpenNewFarm={() => setIsNewFarmModalOpen(true)}
                lang={lang}
              />
            )}

            {activeView === 'scan' && (
              <ScanView
                onScanComplete={handleScanComplete}
                onOpenReportModal={(scan) => setSelectedScanForReport(scan)}
                onOpenAgriAi={() => setIsAgriAiOpen(true)}
                lang={lang}
              />
            )}

            {activeView === 'library' && (
              <DiseaseLibraryView
                onScanPlantWithPreset={(disease) => {
                  setActiveView('scan');
                }}
                lang={lang}
              />
            )}

            {activeView === 'weather' && (
              <WeatherRiskView lang={lang} />
            )}

            {activeView === 'farms' && (
              <MyFarmsView
                farms={farms}
                onOpenNewFarm={() => setIsNewFarmModalOpen(true)}
                setActiveView={setActiveView}
                lang={lang}
              />
            )}

            {activeView === 'history' && (
              <ScanHistoryView
                scans={scans}
                onSelectScanForReport={(scan) => setSelectedScanForReport(scan)}
                lang={lang}
              />
            )}

            {activeView === 'reports' && (
              <ReportsView
                scans={scans}
                farms={farms}
                onSelectScanForReport={(scan) => setSelectedScanForReport(scan)}
                lang={lang}
              />
            )}

            {activeView === 'profile' && (
              <ProfileView
                lang={lang}
                setLang={setLang}
                onOpenViva={() => setIsVivaModalOpen(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Mobile Bottom Bar for App Views */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        onOpenAgriAi={() => setIsAgriAiOpen(true)}
      />

      {/* Floating Chat Trigger Button in Bottom Corner */}
      <button
        onClick={() => setIsAgriAiOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 bg-[#176B3A] hover:bg-[#0D3B24] text-white p-3 sm:p-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 group cursor-pointer border border-white/20"
        title="Open Smart Farm AI Advisor"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#4FAF68] animate-ping absolute top-2 right-2"></div>
        <span className="text-lg sm:text-xl">🌴</span>
        <span className="hidden sm:inline font-bold text-xs pr-1">Ask Agro-AI</span>
      </button>

      {/* Modals */}
      {selectedScanForReport && (
        <PlantHealthReportModal
          scan={selectedScanForReport}
          onClose={() => setSelectedScanForReport(null)}
        />
      )}

      {isVivaModalOpen && (
        <AcademicVivaModal onClose={() => setIsVivaModalOpen(false)} />
      )}

      <AgriChatAssistant
        isOpen={isAgriAiOpen}
        onClose={() => setIsAgriAiOpen(false)}
      />

      {isNewFarmModalOpen && (
        <NewFarmModal
          onClose={() => setIsNewFarmModalOpen(false)}
          onAddFarm={handleAddFarm}
        />
      )}
    </div>
  );
}

export default App;
