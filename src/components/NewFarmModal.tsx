import React, { useState } from 'react';
import { X, Sprout, MapPin, Trees, Layers, CheckCircle } from 'lucide-react';
import { Farm } from '../types';

interface NewFarmModalProps {
  onClose: () => void;
  onAddFarm: (farm: Farm) => void;
}

export const NewFarmModal: React.FC<NewFarmModalProps> = ({ onClose, onAddFarm }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    district: 'Udupi',
    state: 'Karnataka',
    totalPlants: 500,
    bearingAge: '6 - 10 Years',
    variety: 'Mangala Hybrid',
    soilType: 'Lateritic Red Loam',
    irrigationType: 'Automated Drip'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      district: formData.district,
      state: formData.state,
      totalPlants: Number(formData.totalPlants),
      bearingAge: formData.bearingAge,
      variety: formData.variety,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      lastScanDate: 'Today',
      status: 'Good',
      healthyCount: Number(formData.totalPlants),
      diseasedCount: 0,
      observationCount: 0,
      coordinates: { lat: 13.3409, lng: 74.7421 }
    };

    onAddFarm(newFarm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto">
        <div className="bg-[#0D3B24] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#176B3A] rounded-lg">
              <Trees className="w-5 h-5 text-[#EAF5EC]" />
            </span>
            <div>
              <h3 className="font-bold text-base">Register New Arecanut Plantation</h3>
              <p className="text-xs text-[#EAF5EC]/70">Track palm health and field scans per farm</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#17231B] mb-1">Farm Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sahyadri Green Palms"
              className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Village / Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Brahmavara"
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              >
                <option value="Udupi">Udupi</option>
                <option value="Dakshina Kannada">Dakshina Kannada (Mangaluru)</option>
                <option value="Shivamogga">Shivamogga</option>
                <option value="Chikkamagaluru">Chikkamagaluru</option>
                <option value="Uttara Kannada">Uttara Kannada</option>
                <option value="Kasaragod">Kasaragod (Kerala)</option>
                <option value="Davanagere">Davanagere / Channagiri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Total Plant Count</label>
              <input
                type="number"
                min="10"
                max="50000"
                value={formData.totalPlants}
                onChange={(e) => setFormData({ ...formData, totalPlants: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Arecanut Variety</label>
              <select
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              >
                <option value="Mangala Hybrid">Mangala (High Yielding)</option>
                <option value="Sreemangala">Sreemangala (Selection)</option>
                <option value="Mohitnagar">Mohitnagar</option>
                <option value="South Kanara Indigenous">South Kanara Indigenous</option>
                <option value="Thirthahalli Selection">Thirthahalli Malnad Local</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              >
                <option value="Lateritic Red Loam">Lateritic Red Loam</option>
                <option value="Coastal Sandy Alluvial">Coastal Sandy Alluvial</option>
                <option value="Malnad Rich Humus Loam">Malnad Rich Humus Loam</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#17231B] mb-1">Irrigation Setup</label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
              >
                <option value="Automated Drip">Automated Drip with Fertigation</option>
                <option value="Micro-sprinkler Basin">Micro-sprinkler Basin</option>
                <option value="Flood Basin">Flood Basin</option>
                <option value="Gravity Canals">Gravity Mountain Canals</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#176B3A] hover:bg-[#0D3B24] text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Farm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
