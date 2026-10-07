import React, { useState } from 'react';
import {
  FileBarChart,
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Trees,
  ArrowUpRight
} from 'lucide-react';
import { ScanResult, Farm } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ReportsViewProps {
  scans: ScanResult[];
  farms: Farm[];
  onSelectScanForReport: (scan: ScanResult) => void;
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  scans,
  farms,
  onSelectScanForReport,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedFarmFilter, setSelectedFarmFilter] = useState('all');

  const filteredScans = selectedFarmFilter === 'all'
    ? scans
    : scans.filter((s) => s.farmId === selectedFarmFilter);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
            Agronomic Extension & Phytosanitary Reports
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight mt-1">
            Plant Health Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A]">
            Generate official printable PDF health dossiers for agricultural officers, crop insurance, and plantation archives.
          </p>
        </div>

        {/* Farm Filter */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-2xs">
          <Trees className="w-4 h-4 text-[#176B3A]" />
          <select
            value={selectedFarmFilter}
            onChange={(e) => setSelectedFarmFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#17231B] focus:outline-none cursor-pointer"
          >
            <option value="all">All Registered Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid with Instant Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScans.map((scan) => (
          <div
            key={scan.id}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase bg-[#EAF5EC] text-[#176B3A] px-2.5 py-1 rounded-md font-bold">
                  {scan.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    scan.status === 'Healthy'
                      ? 'bg-green-100 text-[#176B3A]'
                      : 'bg-red-100 text-[#D9534F]'
                  }`}
                >
                  {scan.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <img src={scan.imageUrl} alt={scan.diseaseName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17231B] group-hover:text-[#176B3A] transition-colors">
                    {scan.diseaseName}
                  </h3>
                  <div className="text-[11px] text-[#66736A]">{scan.farmName}</div>
                  <div className="text-[10px] font-mono text-[#176B3A] font-semibold mt-0.5">
                    Confidence: {scan.confidence}%
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                <div className="text-[#66736A] text-[10px] uppercase font-bold">Agronomic Summary:</div>
                <p className="text-[11px] text-[#17231B] line-clamp-2 leading-relaxed">
                  {scan.recommendationSummary}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectScanForReport(scan)}
              className="w-full bg-[#176B3A] hover:bg-[#0D3B24] text-white py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Preview & Print PDF Report</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
