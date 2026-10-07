import React, { useMemo, useState } from 'react';
import {
  Trees,
  Plus,
  MapPin,
  Sprout,
  Activity,
  Search,
  ChevronRight
} from 'lucide-react';
import { Farm, ScanResult, ActiveView } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface MyFarmsViewProps {
  farms: Farm[];
  scans?: ScanResult[];
  onOpenNewFarm: () => void;
  setActiveView: (view: ActiveView) => void;
  lang: Language;
}

export const MyFarmsView: React.FC<MyFarmsViewProps> = ({
  farms,
  scans = [],
  onOpenNewFarm,
  setActiveView,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * Real farm health data
   * ---------------------
   * ScanResult records are matched to farms using farmName.
   * The farm object remains the fallback when there are no scan
   * records for that farm yet.
   */
  const getFarmStats = (farm: Farm) => {
    const farmScans = scans.filter(
      (scan) =>
        scan.farmName?.trim().toLowerCase() ===
        farm.name?.trim().toLowerCase()
    );

    const healthyCount = farmScans.filter(
      (scan) => scan.status === 'Healthy'
    ).length;

    const diseasedCount = farmScans.filter(
      (scan) => scan.status === 'Diseased'
    ).length;

    const uncertainCount = farmScans.filter(
      (scan) => String(scan.status) === 'Uncertain'
    ).length;

    const totalScans = farmScans.length;

    const healthyPercent =
      totalScans > 0
        ? Math.round((healthyCount / totalScans) * 100)
        : 0;

    const latestScan =
      [...farmScans].sort((a, b) => {
        const aTime = Date.parse(a.date || '');
        const bTime = Date.parse(b.date || '');

        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
          return bTime - aTime;
        }

        return 0;
      })[0] || farmScans[0] || null;

    let healthStatus: 'Good' | 'Attention Needed' | 'Critical';

    if (totalScans === 0) {
      healthStatus =
        String(farm.status) === 'Critical'
          ? 'Critical'
          : String(farm.status) === 'Attention Needed'
          ? 'Attention Needed'
          : 'Good';
    } else if (diseasedCount === 0 && uncertainCount === 0) {
      healthStatus = 'Good';
    } else if (
      diseasedCount >= 3 ||
      (diseasedCount > 0 && healthyPercent < 60)
    ) {
      healthStatus = 'Critical';
    } else {
      healthStatus = 'Attention Needed';
    }

    return {
      farmScans,
      healthyCount,
      diseasedCount,
      uncertainCount,
      totalScans,
      healthyPercent,
      latestScan,
      healthStatus
    };
  };

  const filteredFarms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return farms;

    return farms.filter((farm) =>
      [
        farm.name,
        farm.location,
        farm.district,
        farm.state,
        farm.soilType,
        farm.variety
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [farms, searchQuery]);

  const selectedFarmStats = selectedFarm
    ? getFarmStats(selectedFarm)
    : null;

  const getAdvisory = (
    stats: ReturnType<typeof getFarmStats>,
    farm: Farm
  ) => {
    if (String(stats.latestScan?.status) === 'Uncertain') {
      return `The latest AI scan for ${farm.name} is uncertain. Review the scan image and upload a clearer specimen before taking disease-specific action.`;
    }

    if (stats.diseasedCount > 0) {
      const diseaseName = stats.latestScan?.diseaseName || 'a plant health condition';

      return `${diseaseName} was detected in this farm. Inspect nearby palms for similar symptoms, maintain good field sanitation and drainage, and review the AI scan report before applying any treatment.`;
    }

    if (stats.totalScans > 0 && stats.healthyCount === stats.totalScans) {
      return `Recent AI scans for ${farm.name} are currently healthy. Continue routine monitoring and rescan plants when symptoms or unusual changes appear.`;
    }

    return `No AI scan history is available for ${farm.name} yet. Scan a representative plant to establish the farm's current health baseline.`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
            Plantation Registry & Plot Management
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight mt-1">
            My Farms
          </h1>

          <p className="text-xs sm:text-sm text-[#66736A]">
            Manage multiple arecanut estates, track bearing palm counts, and view plot health distributions.
          </p>
        </div>

        <button
          onClick={onOpenNewFarm}
          className="flex items-center gap-2 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farm, location, district, soil or variety..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF8] border border-gray-300 rounded-xl text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
          />
        </div>
      </div>

      {/* Farm Cards Grid */}
      {filteredFarms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
          <Trees className="w-10 h-10 mx-auto text-[#176B3A] mb-3" />
          <h3 className="font-bold text-[#0D3B24]">
            No farms found
          </h3>
          <p className="text-xs text-[#66736A] mt-1">
            Register a farm or change your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => {
            const stats = getFarmStats(farm);

            return (
              <div
                key={farm.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  {/* Header of Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5EC] text-[#176B3A] flex items-center justify-center font-bold text-xl">
                      🌴
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        stats.healthStatus === 'Good'
                          ? 'bg-[#EAF5EC] text-[#176B3A]'
                          : stats.healthStatus === 'Attention Needed'
                          ? 'bg-amber-50 text-[#E6A23C]'
                          : 'bg-red-50 text-[#D9534F]'
                      }`}
                    >
                      Status: {stats.healthStatus}
                    </span>
                  </div>

                  {/* Farm Name & Location */}
                  <div>
                    <h3 className="font-bold text-lg text-[#17231B] group-hover:text-[#176B3A] transition-colors">
                      {farm.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#66736A] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#176B3A]" />
                      <span>
                        {farm.location}, {farm.district}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Matrix */}
                  <div className="grid grid-cols-2 gap-2 bg-[#FAFBF8] p-3 rounded-2xl border border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-[#66736A] block">
                        Total Palms
                      </span>

                      <span className="font-bold text-[#0D3B24] text-sm">
                        {farm.totalPlants} Plants
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#66736A] block">
                        AI Scans
                      </span>

                      <span className="font-semibold text-[#17231B]">
                        {stats.totalScans}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-gray-200">
                      <span className="text-[10px] text-[#66736A] block">
                        Last Scan
                      </span>

                      <span className="font-semibold text-[#17231B]">
                        {stats.latestScan?.date || farm.lastScanDate || 'Not scanned'}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-gray-200">
                      <span className="text-[10px] text-[#66736A] block">
                        Soil Type
                      </span>

                      <span className="font-medium text-[#17231B] text-[11px] truncate block">
                        {farm.soilType}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-gray-200">
                      <span className="text-[10px] text-[#66736A] block">
                        Variety
                      </span>

                      <span className="font-medium text-[#17231B] text-[11px] truncate block">
                        {farm.variety}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-gray-200">
                      <span className="text-[10px] text-[#66736A] block">
                        Diseased
                      </span>

                      <span className="font-bold text-[#D9534F]">
                        {stats.diseasedCount}
                      </span>
                    </div>
                  </div>

                  {/* Health Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#66736A]">
                        Health Index
                      </span>

                      <span className="font-mono font-bold text-[#176B3A]">
                        {stats.totalScans > 0
                          ? `${stats.healthyPercent}% Healthy`
                          : 'No scan baseline'}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          stats.healthStatus === 'Critical'
                            ? 'bg-[#D9534F]'
                            : stats.healthStatus === 'Attention Needed'
                            ? 'bg-[#E6A23C]'
                            : 'bg-[#176B3A]'
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, stats.healthyPercent)
                          )}%`
                        }}
                      />
                    </div>

                    {stats.uncertainCount > 0 && (
                      <div className="text-[10px] text-[#E6A23C]">
                        {stats.uncertainCount} uncertain AI scan
                        {stats.uncertainCount === 1 ? '' : 's'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedFarm(farm)}
                    className="w-full bg-[#FAFBF8] hover:bg-[#EAF5EC] text-[#176B3A] hover:text-[#0D3B24] border border-[#176B3A]/20 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View Farm Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Farm Detail Drawer / Modal */}
      {selectedFarm && selectedFarmStats && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-xl text-[#0D3B24]">
                  {selectedFarm.name}
                </h3>

                <p className="text-xs text-[#66736A]">
                  {selectedFarm.location}, {selectedFarm.district},{' '}
                  {selectedFarm.state}
                </p>
              </div>

              <button
                onClick={() => setSelectedFarm(null)}
                className="p-2 text-gray-500 hover:text-black rounded-lg cursor-pointer"
                aria-label="Close farm details"
              >
                ✕
              </button>
            </div>

            {/* Farm Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Total Palms
                </div>
                <div className="font-bold text-sm text-[#0D3B24] mt-0.5">
                  {selectedFarm.totalPlants} Plants
                </div>
              </div>

              <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Bearing Age
                </div>
                <div className="font-bold text-sm text-[#17231B] mt-0.5">
                  {selectedFarm.bearingAge}
                </div>
              </div>

              <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Irrigation System
                </div>
                <div className="font-bold text-sm text-[#176B3A] mt-0.5">
                  {selectedFarm.irrigationType}
                </div>
              </div>
            </div>

            {/* Real AI Health Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#176B3A]" />
                <h4 className="font-bold text-sm text-[#0D3B24]">
                  AI Farm Health Summary
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#176B3A]/15">
                  <div className="text-[10px] text-[#66736A]">
                    Healthy
                  </div>
                  <div className="font-bold text-lg text-[#176B3A]">
                    {selectedFarmStats.healthyCount}
                  </div>
                </div>

                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="text-[10px] text-[#66736A]">
                    Diseased
                  </div>
                  <div className="font-bold text-lg text-[#D9534F]">
                    {selectedFarmStats.diseasedCount}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-[10px] text-[#66736A]">
                    Uncertain
                  </div>
                  <div className="font-bold text-lg text-[#E6A23C]">
                    {selectedFarmStats.uncertainCount}
                  </div>
                </div>

                <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                  <div className="text-[10px] text-[#66736A]">
                    Total Scans
                  </div>
                  <div className="font-bold text-lg text-[#0D3B24]">
                    {selectedFarmStats.totalScans}
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Detection */}
            <div className="p-4 bg-[#FAFBF8] rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#66736A]">
                    Latest AI Detection
                  </div>

                  <div className="font-bold text-sm text-[#17231B] mt-1">
                    {selectedFarmStats.latestScan?.diseaseName ||
                      'No scan recorded'}
                  </div>

                  {selectedFarmStats.latestScan && (
                    <div className="text-[11px] text-[#66736A] mt-1">
                      Confidence:{' '}
                      <span className="font-bold text-[#176B3A]">
                        {selectedFarmStats.latestScan.confidence}%
                      </span>
                      {' • '}
                      {selectedFarmStats.latestScan.date}
                    </div>
                  )}
                </div>

                {selectedFarmStats.latestScan && (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      selectedFarmStats.latestScan.status === 'Healthy'
                        ? 'bg-[#EAF5EC] text-[#176B3A]'
                        : String(selectedFarmStats.latestScan.status) === 'Uncertain'
                        ? 'bg-amber-50 text-[#E6A23C]'
                        : 'bg-red-50 text-[#D9534F]'
                    }`}
                  >
                    {selectedFarmStats.latestScan.status}
                  </span>
                )}
              </div>
            </div>

            {/* Agronomic Recommendation */}
            <div className="p-4 bg-[#EAF5EC] rounded-2xl border border-[#176B3A]/20 space-y-2 text-xs text-[#0D3B24]">
              <div className="flex items-center gap-2 font-bold">
                <Sprout className="w-4 h-4 text-[#176B3A]" />
                Smart Farm Advisory
              </div>

              <p className="leading-relaxed">
                {getAdvisory(selectedFarmStats, selectedFarm)}
              </p>
            </div>

            {/* Farm Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Soil Type
                </div>
                <div className="font-semibold text-[#17231B] mt-1">
                  {selectedFarm.soilType}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Variety
                </div>
                <div className="font-semibold text-[#17231B] mt-1">
                  {selectedFarm.variety}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Last Scan
                </div>
                <div className="font-semibold text-[#17231B] mt-1">
                  {selectedFarmStats.latestScan?.date ||
                    selectedFarm.lastScanDate ||
                    'Not scanned'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-[#66736A]">
                  Health Index
                </div>
                <div className="font-semibold text-[#176B3A] mt-1">
                  {selectedFarmStats.totalScans > 0
                    ? `${selectedFarmStats.healthyPercent}%`
                    : 'No baseline'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              {selectedFarmStats.latestScan && (
                <button
                  onClick={() => {
                    setSelectedFarm(null);
                    setActiveView('history');
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-[#EAF5EC] text-[#176B3A] border border-[#176B3A]/20 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  View Scan History
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedFarm(null);
                  setActiveView('scan');
                }}
                className="w-full sm:w-auto bg-[#176B3A] hover:bg-[#0D3B24] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Scan Plant for This Farm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
