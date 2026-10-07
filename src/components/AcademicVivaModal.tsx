import React, { useState } from 'react';
import { X, Award, Cpu, Database, BarChart3, Binary, Layers, CheckCircle, FileCode, Sparkles } from 'lucide-react';
import { ACADEMIC_MODEL_METRIC } from '../data/mockData';

interface AcademicVivaModalProps {
  onClose: () => void;
}

export const AcademicVivaModal: React.FC<AcademicVivaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'metrics' | 'dataset' | 'gradcam'>('architecture');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-[#0D3B24] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#176B3A] rounded-lg">
              <Award className="w-5 h-5 text-[#EAF5EC]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">ArecaCare AI — CSE Data Science Final Year Project</h3>
                <span className="text-[10px] bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold">
                  Viva & Technical Dossier
                </span>
              </div>
              <p className="text-xs text-[#EAF5EC]/70">
                Deep Learning Model Explainability & Smart Agricultural Pathology Architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-[#FAFBF8] border-b border-gray-200 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#176B3A] text-white shadow-xs'
                : 'text-[#66736A] hover:text-[#17231B]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-[#176B3A] text-white shadow-xs'
                : 'text-[#66736A] hover:text-[#17231B]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Model Evaluation & Confusion Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-[#176B3A] text-white shadow-xs'
                : 'text-[#66736A] hover:text-[#17231B]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Dataset & Augmentation</span>
          </button>
          <button
            onClick={() => setActiveTab('gradcam')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gradcam'
                ? 'bg-[#176B3A] text-white shadow-xs'
                : 'text-[#66736A] hover:text-[#17231B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Grad-CAM Explainability Math</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                  <div className="text-[11px] text-[#66736A]">Backbone CNN</div>
                  <div className="text-sm font-bold text-[#0D3B24] mt-0.5">ResNet-50 + SE</div>
                </div>
                <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                  <div className="text-[11px] text-[#66736A]">Overall Accuracy</div>
                  <div className="text-sm font-bold text-[#176B3A] mt-0.5">96.2%</div>
                </div>
                <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                  <div className="text-[11px] text-[#66736A]">Inference Latency</div>
                  <div className="text-sm font-bold text-[#0D3B24] mt-0.5">142 ms (Edge Ready)</div>
                </div>
                <div className="p-3 bg-[#FAFBF8] rounded-xl border border-gray-200">
                  <div className="text-[11px] text-[#66736A]">Classes Covered</div>
                  <div className="text-sm font-bold text-[#0D3B24] mt-0.5">6 Primary Classes</div>
                </div>
              </div>

              {/* End to end flowchart */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                  End-to-End Deep Learning Architecture
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                    <div className="font-bold text-[#176B3A]">1. Input & CLAHE</div>
                    <p className="text-[11px] text-[#66736A]">
                      High-resolution RGB image resized to 224x224. Contrast Limited Adaptive Histogram Equalization suppresses harsh Western Ghats sunlight glares.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                    <div className="font-bold text-[#176B3A]">2. Feature Extraction</div>
                    <p className="text-[11px] text-[#66736A]">
                      50 convolutional layers with residual skip connections extract hierarchical botanical representations (margins, veins, necrotic lesions, calyx rot).
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                    <div className="font-bold text-[#176B3A]">3. Grad-CAM Engine</div>
                    <p className="text-[11px] text-[#66736A]">
                      Computes gradient of predicted class score with respect to feature activation maps in Conv_5_3 layer, generating visual heatmaps.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                    <div className="font-bold text-[#176B3A]">4. Agronomic Rule Base</div>
                    <p className="text-[11px] text-[#66736A]">
                      Fuses CNN classification with localized weather indices (humidity, rainfall) to prescribe ICAR-CPCRI validated treatment plans.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benchmark Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                  Model Comparison Benchmark (CSE Final Year Study)
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAFBF8] border-b text-[#66736A] uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Architecture Model</th>
                        <th className="p-2.5">Params</th>
                        <th className="p-2.5">Accuracy</th>
                        <th className="p-2.5">F1-Score</th>
                        <th className="p-2.5">Inference Time</th>
                        <th className="p-2.5">Edge Suitability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-[#EAF5EC]/40 font-semibold text-[#176B3A]">
                        <td className="p-2.5 flex items-center gap-1.5">
                          <span>★ Proposed ResNet-50 + Grad-CAM</span>
                        </td>
                        <td className="p-2.5">25.6M</td>
                        <td className="p-2.5">96.2%</td>
                        <td className="p-2.5">95.9%</td>
                        <td className="p-2.5">142 ms</td>
                        <td className="p-2.5 text-green-700">Excellent (Recommended)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">EfficientNet-B0</td>
                        <td className="p-2.5">5.3M</td>
                        <td className="p-2.5">94.1%</td>
                        <td className="p-2.5">93.8%</td>
                        <td className="p-2.5">98 ms</td>
                        <td className="p-2.5">High</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">Custom 6-Layer CNN Baseline</td>
                        <td className="p-2.5">3.8M</td>
                        <td className="p-2.5">86.4%</td>
                        <td className="p-2.5">85.7%</td>
                        <td className="p-2.5">62 ms</td>
                        <td className="p-2.5">Moderate (Underfitting)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">VGG-16</td>
                        <td className="p-2.5">138.4M</td>
                        <td className="p-2.5">93.0%</td>
                        <td className="p-2.5">92.6%</td>
                        <td className="p-2.5">310 ms</td>
                        <td className="p-2.5">Poor (Heavy memory)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                Class-wise Precision, Recall & F1-Score Breakdown
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAFBF8] border-b text-[#66736A] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Disease Class</th>
                      <th className="p-3">Test Samples</th>
                      <th className="p-3">Precision (%)</th>
                      <th className="p-3">Recall (%)</th>
                      <th className="p-3">F1-Score (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ACADEMIC_MODEL_METRIC.classes.map((cls, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-[#17231B]">{cls.name}</td>
                        <td className="p-3 font-mono text-[#66736A]">{cls.sampleCount}</td>
                        <td className="p-3 font-mono font-semibold text-[#176B3A]">{cls.precision}%</td>
                        <td className="p-3 font-mono font-semibold text-[#0D3B24]">{cls.recall}%</td>
                        <td className="p-3 font-mono font-bold text-[#176B3A]">{cls.f1}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Confusion Matrix Summary */}
              <div className="p-4 bg-[#FAFBF8] border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0D3B24]">6x6 Normalized Confusion Matrix Diagonal</span>
                  <span className="text-[11px] font-mono text-[#176B3A] font-bold">Overall Accuracy: 96.2%</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Mahali (Fruit Rot) and Healthy Specimen achieved the highest classification fidelity (97.9% and 98.4% F1) owing to distinct visual textural cues. Yellow Leaf Disease achieved 95.7% F1 with minimal minor misclassifications against early-stage nitrogen deficiency chlorosis.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FAFBF8] border border-gray-200 rounded-xl">
                  <div className="text-xs text-[#66736A]">Total Images Collected</div>
                  <div className="text-lg font-bold text-[#0D3B24] mt-1">12,450 Annotated</div>
                  <div className="text-[11px] text-[#66736A]">Field photographed + Expert verified</div>
                </div>
                <div className="p-3 bg-[#FAFBF8] border border-gray-200 rounded-xl">
                  <div className="text-xs text-[#66736A]">Train / Val / Test Split</div>
                  <div className="text-lg font-bold text-[#176B3A] mt-1">70% / 15% / 15%</div>
                  <div className="text-[11px] text-[#66736A]">Stratified K-Fold (5 Folds)</div>
                </div>
                <div className="p-3 bg-[#FAFBF8] border border-gray-200 rounded-xl">
                  <div className="text-xs text-[#66736A]">Agro-climatic Zones</div>
                  <div className="text-lg font-bold text-[#0D3B24] mt-1">Coastal & Malnad</div>
                  <div className="text-[11px] text-[#66736A]">Udupi, DK, Shivamogga, Kasaragod</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2 text-xs">
                <h4 className="font-bold text-[#0D3B24]">Data Augmentation & Synthetic Balancing:</h4>
                <ul className="list-disc list-inside space-y-1 text-[#66736A]">
                  <li>Random horizontal & vertical flips (p=0.5) to capture varying palm frond orientations</li>
                  <li>Affine transformation with rotation range (-25° to +25°) and shear (0.15)</li>
                  <li>Color jitter: Brightness (±20%), Contrast (±20%), Saturation (±15%) to account for cloudy monsoon vs sunny light</li>
                  <li>MixUp and CutMix regularization to prevent over-reliance on background plantation foliage</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'gradcam' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAFBF8] border border-gray-200 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-[#0D3B24] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#176B3A]" />
                  <span>Mathematical Formulation of Grad-CAM in ArecaCare AI</span>
                </h4>
                <p className="text-[#66736A] leading-relaxed">
                  To ensure transparency in agricultural decisions, we calculate the neuron importance weights <code className="font-mono bg-white px-1 py-0.5 rounded border">α_k^c</code> via global average pooling of the gradients:
                </p>
                <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-center text-xs sm:text-sm text-[#0D3B24]">
                  {'α_k^c = (1 / Z) * Σ_i Σ_j (∂ y^c / ∂ A_{i,j}^k)'}
                </div>
                <p className="text-[#66736A] leading-relaxed">
                  The heat map localization <code className="font-mono bg-white px-1 py-0.5 rounded border">L_Grad-CAM^c</code> is then computed by applying a Rectified Linear Unit (ReLU) to the weighted combination of forward activation maps:
                </p>
                <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-center text-xs sm:text-sm text-[#176B3A]">
                  {'L_Grad-CAM^c = ReLU( Σ_k α_k^c * A^k )'}
                </div>
                <p className="text-[11px] text-[#66736A]">
                  The ReLU operator ensures that only features positively contributing to the target arecanut disease class are highlighted, filtering out healthy background leaves.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-[#66736A] shrink-0">
          <div>Department of Computer Science & Engineering • Data Science Specialization</div>
          <button
            onClick={onClose}
            className="bg-[#0D3B24] hover:bg-[#176B3A] text-white px-4 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
