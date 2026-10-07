import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Info,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { DiseaseInfo, PlantPart } from '../types';
import { ARECANUT_DISEASES } from '../data/diseases';
import { Language, TRANSLATIONS } from '../lib/translations';

interface DiseaseLibraryViewProps {
  onScanPlantWithPreset?: (disease: DiseaseInfo) => void;
  lang: Language;
}

export const DiseaseLibraryView: React.FC<DiseaseLibraryViewProps> = ({
  onScanPlantWithPreset,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'leaf' | 'nut' | 'trunk' | 'healthy'>('all');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  // Filter diseases
  const filteredDiseases = ARECANUT_DISEASES.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.kannadaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'healthy') return matchesSearch && d.status === 'Healthy';
    return matchesSearch && d.category === selectedFilter && d.status !== 'Healthy';
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
          ICAR-CPCRI Referenced Pathology Repository
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight">
          Arecanut Disease Library
        </h1>
        <p className="text-xs sm:text-sm text-[#66736A]">
          Learn about common diseases, symptoms, causes, and prevention protocols for sustainable areca farming.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disease name, symptom, or cause..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAFBF8] border border-gray-300 rounded-xl text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'leaf', label: 'Leaf' },
            { id: 'nut', label: 'Nut' },
            { id: 'trunk', label: 'Trunk' },
            { id: 'healthy', label: 'Healthy' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                  : 'bg-[#FAFBF8] text-[#66736A] hover:bg-gray-100 hover:text-[#17231B] border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="aspect-16/10 relative overflow-hidden bg-gray-100">
                <img
                  src={disease.image}
                  alt={disease.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Severity Badge */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                    disease.severity === 'High'
                      ? 'bg-[#D9534F] text-white'
                      : disease.severity === 'Medium'
                      ? 'bg-[#E6A23C] text-white'
                      : 'bg-[#176B3A] text-white'
                  }`}
                >
                  {disease.severity} Severity
                </span>
                <span className="absolute bottom-3 left-3 bg-[#0D3B24]/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                  {disease.category} Organ
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-[#17231B] group-hover:text-[#176B3A] transition-colors">
                    {disease.name}
                  </h3>
                  <div className="text-[11px] font-medium text-[#176B3A] mt-0.5">
                    {disease.kannadaName}
                  </div>
                  <div className="text-[11px] italic font-mono text-[#66736A] mt-0.5">
                    {disease.scientificName}
                  </div>
                </div>

                <p className="text-xs text-[#66736A] line-clamp-3 leading-relaxed">
                  {disease.description}
                </p>

                {/* Primary Symptom Bullets */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-[#0D3B24] uppercase">Key Symptoms:</div>
                  <ul className="text-xs text-[#17231B] space-y-1">
                    {disease.symptoms.slice(0, 2).map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#66736A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#176B3A] mt-1 shrink-0" />
                        <span className="line-clamp-1">{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Footer Button */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedDisease(disease)}
                className="w-full bg-[#FAFBF8] hover:bg-[#EAF5EC] text-[#176B3A] hover:text-[#0D3B24] border border-[#176B3A]/20 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>View Details & Treatment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Details Modal (Section #7) */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0D3B24] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <h3 className="font-bold text-base sm:text-lg">{selectedDisease.name}</h3>
                <p className="text-xs text-[#EAF5EC]/70">{selectedDisease.kannadaName}</p>
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Top Banner Image & Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="rounded-2xl overflow-hidden aspect-4/3 border border-gray-200 bg-gray-100">
                  <img
                    src={selectedDisease.image}
                    alt={selectedDisease.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-[#66736A] block">Pathological Classification:</span>
                    <span className="font-bold text-[#17231B] text-sm">{selectedDisease.name}</span>
                  </div>
                  <div>
                    <span className="text-[#66736A] block">Scientific Taxonomy:</span>
                    <span className="font-mono italic text-[#0D3B24]">{selectedDisease.scientificName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#66736A]">Severity Level:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        selectedDisease.severity === 'High'
                          ? 'bg-[#D9534F] text-white'
                          : selectedDisease.severity === 'Medium'
                          ? 'bg-[#E6A23C] text-white'
                          : 'bg-[#176B3A] text-white'
                      }`}
                    >
                      {selectedDisease.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66736A] block">Affected Plant Organ:</span>
                    <span className="font-semibold text-[#17231B] capitalize">{selectedDisease.category}</span>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                  Clinical Symptoms
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#FAFBF8] p-2.5 rounded-xl border border-gray-100">
                      <span className="w-2 h-2 rounded-full bg-[#176B3A] mt-1 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Causes */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                  Possible Causes & Environmental Triggers
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedDisease.causes.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#FAFBF8] p-2.5 rounded-xl border border-gray-100">
                      <span className="w-2 h-2 rounded-full bg-[#E6A23C] mt-1 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention & Treatments */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                  Agricultural Treatment Protocols
                </h4>
                <div className="space-y-2.5 text-xs">
                  {selectedDisease.treatments.map((tr, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#0D3B24]">
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-mono">
                            {tr.type}
                          </span>
                          {tr.title}
                        </span>
                        <span className="text-[10px] text-[#E6A23C]">{tr.timing}</span>
                      </div>
                      {tr.dosage && (
                        <div className="text-[11px] font-mono text-[#176B3A] bg-[#FAFBF8] p-1.5 rounded">
                          {tr.dosage}
                        </div>
                      )}
                      <p className="text-[#66736A]">{tr.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Warning Note */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Professional Warning: </strong>
                  AI-based results are preliminary. Verify with an agriculture professional before treatment decisions.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-end shrink-0">
              <button
                onClick={() => setSelectedDisease(null)}
                className="bg-[#176B3A] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0D3B24] transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
