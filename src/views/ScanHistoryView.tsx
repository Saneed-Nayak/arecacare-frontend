import React, { useEffect, useState } from 'react';
import {
  History,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
  Trash2
} from 'lucide-react';
import { ScanResult, PlantPart } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ScanHistoryViewProps {
  scans: ScanResult[];
  onSelectScanForReport: (scan: ScanResult) => void;
  lang: Language;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  onSelectScanForReport,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'healthy' | 'diseased' | 'leaf' | 'nut' | 'trunk'>('all');

  // Keep real scan history available after page refreshes.
  // The parent `scans` prop remains the source of truth when populated.
  const [persistedScans, setPersistedScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arecacare_scan_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPersistedScans(parsed);
      }
    } catch {
      setPersistedScans([]);
    }
  }, []);

  useEffect(() => {
    if (scans.length > 0) {
      try {
        localStorage.setItem('arecacare_scan_history', JSON.stringify(scans));
        setPersistedScans(scans);
      } catch {
        // Ignore storage quota/private-mode errors; the live prop still works.
      }
    }
  }, [scans]);

  const historyScans = scans.length > 0 ? scans : persistedScans;

  const filteredScans = historyScans.filter((scan) => {
    const matchesSearch =
      scan.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.plotLocation.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTag === 'all') return matchesSearch;
    if (filterTag === 'healthy') return matchesSearch && scan.status === 'Healthy';
    if (filterTag === 'diseased') return matchesSearch && scan.status === 'Diseased';
    return matchesSearch && scan.plantPart === filterTag;
  });

  const exportCsv = () => {
    const headers = 'ID,Date,Farm,PlantPart,Disease,Confidence,Status,Severity\n';
    const rows = filteredScans
      .map(
        (s) =>
          `"${s.id}","${s.date}","${s.farmName}","${s.plantPart}","${s.diseaseName}",${s.confidence}%,"${s.status}","${s.severity}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArecaCare_Scan_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
            Audit Trail & Diagnostic Archives
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight mt-1">
            Scan History
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A]">
            Complete pathological log across all arecanut plots with Grad-CAM overlays and clinical advisories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#66736A] bg-[#FAFBF8] border border-gray-200 px-3 py-2 rounded-xl">
            {historyScans.length} recorded scan{historyScans.length === 1 ? '' : 's'}
          </span>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0D3B24] border border-gray-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer w-fit"
          >
            <Download className="w-4 h-4 text-[#176B3A]" />
            <span>Export CSV Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, disease, or plot location..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAFBF8] border border-gray-300 rounded-xl text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
          />
        </div>

        {/* Filter Pills: All | Healthy | Diseased | Leaf | Nut | Trunk */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: 'all', label: 'All Scans' },
            { id: 'healthy', label: 'Healthy' },
            { id: 'diseased', label: 'Diseased' },
            { id: 'leaf', label: 'Leaf' },
            { id: 'nut', label: 'Nut' },
            { id: 'trunk', label: 'Trunk' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setFilterTag(flt.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterTag === flt.id
                  ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                  : 'bg-[#FAFBF8] text-[#66736A] hover:bg-gray-100 hover:text-[#17231B] border border-gray-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAFBF8] border-b border-gray-200 text-[#66736A] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-4 px-4">Image</th>
                <th className="py-4 px-4">Disease / Condition</th>
                <th className="py-4 px-4">Confidence</th>
                <th className="py-4 px-4">Plant Part</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#66736A]">
                    No diagnostic records matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Thumbnail Image */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={scan.imageUrl}
                          alt={scan.diseaseName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Disease Name & Farm */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#17231B] text-xs sm:text-sm">
                        {scan.diseaseName}
                      </div>
                      <div className="text-[11px] text-[#66736A]">
                        {scan.farmName} • <span className="font-mono text-gray-500">{scan.id}</span>
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#176B3A] h-2 rounded-full"
                            style={{ width: `${scan.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-bold text-[#176B3A]">
                          {scan.confidence}%
                        </span>
                      </div>
                    </td>

                    {/* Plant Part */}
                    <td className="py-3 px-4 capitalize font-medium text-[#17231B]">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                        {scan.plantPart}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#66736A] whitespace-nowrap">
                      {scan.date}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          scan.status === 'Healthy'
                            ? 'bg-[#EAF5EC] text-[#176B3A]'
                            : 'bg-red-50 text-[#D9534F]'
                        }`}
                      >
                        {scan.status === 'Healthy' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {scan.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectScanForReport(scan)}
                        className="inline-flex items-center gap-1 bg-[#FAFBF8] hover:bg-[#EAF5EC] text-[#0D3B24] border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#176B3A]" />
                        <span>View Report</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
