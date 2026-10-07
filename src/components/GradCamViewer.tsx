import React, { useState } from 'react';
import { Eye, Layers, Sparkles, Info, CheckCircle2 } from 'lucide-react';

interface GradCamViewerProps {
  originalImageUrl: string;
  gradCamImageUrl?: string | null;
  diseaseName: string;
  severity: string;
  confidence: number;
  focusAreaDescription: string;
  diseaseId: string;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  originalImageUrl,
  gradCamImageUrl,
  diseaseName,
  severity,
  confidence,
  focusAreaDescription,
  diseaseId,
}) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'split' | 'original'>('overlay');

  const hasGradCam = Boolean(gradCamImageUrl);
  const isHealthy = ['Healthy_Foot', 'Healthy_Leaf', 'Healthy_Nut', 'Healthy_Trunk'].includes(diseaseId);
  const isUncertain = diseaseId === 'Uncertain' || severity === 'Medium' && diseaseName === 'Uncertain Result';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#EAF5EC] text-[#176B3A]">
              <Layers className="w-4 h-4" />
            </span>
            <h4 className="font-semibold text-sm sm:text-base text-[#17231B]">
              AI Attention Map / Grad-CAM
            </h4>
          </div>
          <p className="text-xs text-[#66736A] mt-0.5">
            MobileNetV2 attention visualization for the {confidence}% prediction.
          </p>
        </div>

        <div className="flex items-center bg-[#FAFBF8] p-1 rounded-xl border border-gray-200 text-xs font-medium">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'overlay' ? 'bg-[#176B3A] text-white shadow-sm' : 'text-[#66736A] hover:text-[#17231B]'}`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'split' ? 'bg-[#176B3A] text-white shadow-sm' : 'text-[#66736A] hover:text-[#17231B]'}`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'original' ? 'bg-[#176B3A] text-white shadow-sm' : 'text-[#66736A] hover:text-[#17231B]'}`}
          >
            Original
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#FAFBF8]">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#66736A] border-b border-gray-200">
              Original RGB
            </div>
            <div className="aspect-square">
              <img src={originalImageUrl} alt="Original arecanut plant image" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#FAFBF8]">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#66736A] border-b border-gray-200">
              Backend Grad-CAM
            </div>
            <div className="aspect-square">
              {hasGradCam ? (
                <img src={gradCamImageUrl!} alt="MobileNetV2 Grad-CAM visualization" className="w-full h-full object-cover" />
              ) : (
                <EmptyGradCam />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-[#101614] aspect-square border border-gray-200">
          <img
            src={viewMode === 'overlay' && hasGradCam ? gradCamImageUrl! : originalImageUrl}
            alt={viewMode === 'overlay' ? 'MobileNetV2 Grad-CAM visualization' : 'Original arecanut plant image'}
            className="w-full h-full object-contain"
          />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-sm">
              {viewMode === 'overlay' && hasGradCam ? 'MobileNetV2 · Grad-CAM' : 'Original RGB'}
            </span>
            {viewMode === 'overlay' && hasGradCam && (
              <span className="bg-[#176B3A]/90 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
                Backend generated
              </span>
            )}
          </div>

          {viewMode === 'overlay' && !hasGradCam && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/30">
              <div className="max-w-xs text-center bg-white/95 rounded-xl p-4 shadow-lg">
                <Info className="w-5 h-5 text-[#A66A00] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#17231B]">Grad-CAM unavailable</p>
                <p className="text-[11px] text-[#66736A] mt-1">The original image is shown because the backend did not return a Grad-CAM image.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#FAFBF8] border border-gray-100 p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#66736A]">Model</div>
          <div className="text-xs font-bold text-[#17231B] mt-0.5">MobileNetV2</div>
        </div>
        <div className="rounded-xl bg-[#FAFBF8] border border-gray-100 p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#66736A]">Explainability</div>
          <div className="text-xs font-bold text-[#17231B] mt-0.5">Grad-CAM</div>
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[#FAFBF8] border border-gray-200">
        <div className="flex items-start gap-2.5">
          {isHealthy ? <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0 mt-0.5" /> : <Sparkles className="w-4 h-4 text-[#176B3A] shrink-0 mt-0.5" />}
          <div>
            <div className="text-xs font-bold text-[#17231B]">What the map means</div>
            <p className="text-[11px] text-[#66736A] leading-relaxed mt-1">
              {focusAreaDescription || 'The highlighted regions show image areas that contributed more strongly to the model prediction.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[10px] text-[#66736A] leading-relaxed">
        <Eye className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Grad-CAM explains where the model attended; it does not independently confirm a disease or pathogen.
        </span>
      </div>
    </div>
  );
};

const EmptyGradCam: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center p-6 bg-[#F7F9F7]">
    <div className="text-center">
      <Info className="w-5 h-5 text-[#A66A00] mx-auto mb-2" />
      <p className="text-xs font-semibold text-[#17231B]">Grad-CAM unavailable</p>
      <p className="text-[11px] text-[#66736A] mt-1">Try the scan again after confirming the FastAPI backend is running.</p>
    </div>
  </div>
);
