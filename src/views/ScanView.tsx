import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  ShieldAlert,
  Sliders,
  Sprout,
  X,
  Share2,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlantPart, ScanResult, DiseaseSeverity, ScanStatus } from '../types';
import { ARECANUT_DISEASES } from '../data/diseases';
import { SAMPLE_SCAN_PRESETS } from '../data/mockData';
import { GradCamViewer } from '../components/GradCamViewer';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ScanViewProps {
  onScanComplete: (newScan: ScanResult) => void;
  onOpenReportModal: (scan: ScanResult) => void;
  onOpenAgriAi: () => void;
  lang: Language;
}

type ScanStage = 'upload' | 'analyzing' | 'result';

export const ScanView: React.FC<ScanViewProps> = ({
  onScanComplete,
  onOpenReportModal,
  onOpenAgriAi,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const [selectedPart, setSelectedPart] = useState<PlantPart>('leaf');
  const [stage, setStage] = useState<ScanStage>('upload');
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'treatment' | 'prevention' | 'model'>('overview');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [gradCamImage, setGradCamImage] = useState<string | null>(null);
  const [topPredictions, setTopPredictions] = useState<Array<{ class: string; confidence: number }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Send image to the real FastAPI AI model
  const predictImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/api/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : detail?.message || `AI prediction failed: ${response.status}`;
      throw new Error(message);
    }

    if (data?.valid_image === false || data?.success === false) {
      throw new Error(
        data?.message ||
          data?.detail?.message ||
          'This image is not suitable for ArecaCare analysis.'
      );
    }

    if (!data?.class || !Number.isFinite(Number(data?.confidence))) {
      throw new Error('The AI model returned an invalid prediction.');
    }

    return data;
  };

  const getGradCAM = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://127.0.0.1:8000/api/gradcam', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : detail?.message || `Grad-CAM request failed: ${response.status}`;
      throw new Error(message);
    }
    if (data?.success !== true || !data?.gradcam_image) {
      throw new Error('Grad-CAM was not generated for this image.');
    }
    return data;
  };

  // Classes that represent healthy plant parts
  const HEALTHY_CLASSES = [
    'Healthy_Foot',
    'Healthy_Leaf',
    'Healthy_Nut',
    'Healthy_Trunk',
  ];

  // Independently evaluated final deployed model metric.
  // This is model test accuracy, not the confidence of one uploaded image.
  const MODEL_TEST_ACCURACY = 85.90;

  const getResultStatus = (className: string): ScanStatus => {
    return HEALTHY_CLASSES.includes(className) ? 'Healthy' : 'Diseased';
  };

  const getResultSeverity = (
    confidence: number,
    status: ScanStatus
  ): DiseaseSeverity => {
    if (status === 'Healthy') return 'Low';
    if (confidence >= 85) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  const normalizeName = (name: string) =>
    name
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const formatDiseaseName = (name: string) =>
    name
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const getDiseaseInfo = (className: string) => {
    const normalized = normalizeName(className);

    // Healthy classes must never fall back to a disease entry.
    if (HEALTHY_CLASSES.includes(className)) {
      const baseInfo = ARECANUT_DISEASES[0];

      return {
        ...baseInfo,
        id: className,
        name: className,
        kannadaName:
          className === 'Healthy_Leaf'
            ? 'ಆರೋಗ್ಯಕರ ಎಲೆ'
            : className === 'Healthy_Nut'
            ? 'ಆರೋಗ್ಯಕರ ಅಡಿಕೆ'
            : className === 'Healthy_Trunk'
            ? 'ಆರೋಗ್ಯಕರ ಕಾಂಡ'
            : 'ಆರೋಗ್ಯಕರ ಬುಡ',
        status: 'Healthy' as ScanStatus,
        severity: 'Low' as DiseaseSeverity,
        scientificName: 'No disease detected',
        vectorOrPathogen: 'None identified',
        description:
          `The AI model classified this image as ${className.replace(/_/g, ' ')}. No disease class was selected by the model. Continue regular monitoring of the plant.`,
        symptoms: [
          'No disease-specific symptoms were identified by this classification result.',
          'Continue observing the plant for visible changes.',
        ],
        treatments: [],
        prevention: [
          'Maintain regular farm monitoring.',
          'Keep the plant area clean and observe new symptoms early.',
          'Verify any future abnormal symptoms with an agriculture professional.',
        ],
        possibleCause: 'No disease detected by the AI classification result.',
      };
    }

    const aliases: Record<string, string[]> = {
      bud_borer: ['bud borer', 'bud_borer'],
      mahali_koleroga: ['mahali koleroga', 'koleroga', 'fruit rot mahali'],
      stem_bleeding: ['stem bleeding', 'stem_bleeding'],
      stem_cracking: ['stem cracking', 'stem_cracking'],
      yellow_leaf_disease: ['yellow leaf disease', 'yellow_leaf_disease', 'yellow leaf'],
    };

    const candidates = [normalized];

    Object.values(aliases).forEach((values) => {
      if (values.includes(normalized)) {
        candidates.push(...values);
      }
    });

    return (
      ARECANUT_DISEASES.find((d) => {
        const diseaseName = normalizeName(d.name);
        return candidates.some(
          (candidate) =>
            diseaseName === candidate ||
            diseaseName.includes(candidate) ||
            candidate.includes(diseaseName)
        );
      }) || ARECANUT_DISEASES[0]
    );
  };

  // Handle sample preset selection
  const handleSelectSample = (sample: typeof SAMPLE_SCAN_PRESETS[0]) => {
    setSelectedPart(sample.part);
    setGradCamImage(null);
    setTopPredictions([]);
    setCurrentResult(null);
    setUploadedImage(sample.image);
    startAnalysis(sample.image, sample.diseaseId, sample.confidence, sample.part);
  };

  // Handle file input - REAL AI prediction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10 MB.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setGradCamImage(null);
    setTopPredictions([]);
    setCurrentResult(null);
    setStage('analyzing');
    setAnalysisStep(1);

    try {
      const prediction = await predictImage(file);
      setTopPredictions(Array.isArray(prediction.top_predictions) ? prediction.top_predictions : []);

      let gradcam = null;
      try {
        gradcam = await getGradCAM(file);
        setGradCamImage(gradcam?.gradcam_image || null);
      } catch (gradcamError) {
        console.error('Grad-CAM error:', gradcamError);
        setGradCamImage(null);
      }

      setAnalysisStep(2);
      setTimeout(() => setAnalysisStep(3), 400);
      setTimeout(() => setAnalysisStep(4), 800);

      setTimeout(() => {
        const predictedClass = prediction.class;
        const confidence = Number(prediction.confidence);
        const resultStatus = getResultStatus(predictedClass);
        const resultSeverity = getResultSeverity(confidence, resultStatus);
        const diseaseInfo = getDiseaseInfo(predictedClass);

        const newScanResult: ScanResult = {
          id: `SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          date:
            '26 Sep 2026, ' +
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          farmId: 'farm-1',
          farmName: 'Green Valley Areca Farm',
          plotLocation: 'Plot #03 - Section West',
          plantPart: selectedPart,
          imageUrl,          diseaseId: predictedClass,
          diseaseName: predictedClass,
          kannadaName:
            predictedClass === 'Healthy_Leaf'
              ? 'ಆರೋಗ್ಯಕರ ಎಲೆ'
              : predictedClass === 'Healthy_Nut'
              ? 'ಆರೋಗ್ಯಕರ ಅಡಿಕೆ'
              : predictedClass === 'Healthy_Trunk'
              ? 'ಆರೋಗ್ಯಕರ ಕಾಂಡ'
              : predictedClass === 'Healthy_Foot'
              ? 'ಆರೋಗ್ಯಕರ ಬುಡ'
              : '',
          confidence,
          status: resultStatus,
          severity: resultSeverity,
          possibleCause:
            resultStatus === 'Healthy'
              ? 'The AI model classified the uploaded image as a healthy plant part.'
              : prediction.advisory ||
                'Verify the AI prediction before taking agricultural action.',
          gradCamFocusArea:
            gradcam?.success
              ? `Grad-CAM generated by the MobileNetV2 backend using layer ${gradcam.layer || 'feature layer'}.`
              : 'Grad-CAM could not be generated for this scan.',
          weatherSnapshot: {
            location: 'Udupi, Karnataka',
            temp: 28,
            humidity: 78,
            rainfall: 2.4,
            condition: 'Partly Cloudy',
          },
          recommendationSummary:
            prediction.advisory ||
            diseaseInfo.treatments?.[0]?.description ||
            'Monitor the plant regularly.',
        };

        setCurrentResult(newScanResult);
        onScanComplete(newScanResult);
        setStage('result');
      }, 1200);
    } catch (error) {
      console.error('Prediction error:', error);
      setStage('upload');
      setAnalysisStep(1);
      alert(
        error instanceof Error
          ? error.message
          : 'AI scan failed. Make sure FastAPI is running at http://127.0.0.1:8000'
      );
    }
  };

  // 4-Step Analysis Simulation
  const startAnalysis = (
    imageUrl: string,
    diseaseId: string,
    confidence: number,
    part: PlantPart
  ) => {
    setStage('analyzing');
    setAnalysisStep(1);

    const disease = ARECANUT_DISEASES.find((d) => d.id === diseaseId) || ARECANUT_DISEASES[0];

    const newScanResult: ScanResult = {
      id: `SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '26 Sep 2026, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      farmId: 'farm-1',
      farmName: 'Green Valley Areca Farm',
      plotLocation: 'Plot #03 - Section West',
      plantPart: part,
      imageUrl: imageUrl,
      diseaseId: disease.id,
      diseaseName: disease.name,
      kannadaName: disease.kannadaName,
      confidence: confidence,
      status: disease.status,
      severity: disease.severity,
      possibleCause: disease.possibleCause,
      gradCamFocusArea:
        disease.status === 'Healthy'
          ? 'Uniform photosynthetic green reflectance across entire leaflet structure'
          : `High gradient density concentrated around ${disease.name.toLowerCase()} focal loci and necrotic margins`,
      weatherSnapshot: {
        location: 'Udupi, Karnataka',
        temp: 28,
        humidity: 78,
        rainfall: 2.4,
        condition: 'Partly Cloudy'
      },
      recommendationSummary: disease.treatments[0]?.description || 'Monitor plant regularly.'
    };

    // Step 1: Uploaded (instantly)
    setTimeout(() => {
      setAnalysisStep(2); // Step 2: CLAHE Preprocessing
    }, 600);

    setTimeout(() => {
      setAnalysisStep(3); // Step 3: 9-Class MobileNetV2 Inference
    }, 1300);

    setTimeout(() => {
      setAnalysisStep(4); // Step 4: Advisory & Grad-CAM
    }, 2000);

    setTimeout(() => {
      setCurrentResult(newScanResult);
      onScanComplete(newScanResult);
      setStage('result');

      // Trigger celebratory confetti if healthy!
      if (disease.status === 'Healthy') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#176B3A', '#4FAF68', '#EAF5EC']
        });
      }
    }, 2600);
  };

  const handleReset = () => {
    setStage('upload');
    setUploadedImage(null);
    setCurrentResult(null);
    setGradCamImage(null);
    setTopPredictions([]);
    setAnalysisStep(1);
    setActiveTab('overview');
  };

  const currentDiseaseInfo = currentResult
    ? getDiseaseInfo(currentResult.diseaseName)
    : ARECANUT_DISEASES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn pb-20 sm:pb-12">
      {/* 1. UPLOAD STATE */}
      {stage === 'upload' && (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 px-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
              AI Pathology Diagnostic Scanner
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#0D3B24] tracking-tight">
              Scan Your Plant
            </h1>
            <p className="text-[11px] sm:text-xs lg:text-sm text-[#66736A]">
              Upload an image of arecanut leaf, nut, trunk or plant to detect diseases with explainable AI.
            </p>
          </div>

          {/* Plant Organ Selector */}
          <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-200 shadow-xs max-w-xl mx-auto grid grid-cols-4 gap-1 sm:gap-1.5 text-xs font-semibold">
            {[
              { id: 'leaf' as PlantPart, label: 'Leaf', emoji: '🌿' },
              { id: 'nut' as PlantPart, label: 'Nut Bunch', emoji: '🥥' },
              { id: 'trunk' as PlantPart, label: 'Trunk / Bud', emoji: '🌴' },
              { id: 'whole' as PlantPart, label: 'Whole Plant', emoji: '🌳' }
            ].map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part.id)}
                className={`py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                  selectedPart === part.id
                    ? 'bg-[#176B3A] text-white shadow-sm'
                    : 'text-[#66736A] hover:bg-gray-100 hover:text-[#17231B]'
                }`}
              >
                <span className="text-base sm:text-lg">{part.emoji}</span>
                <span className="text-[10px] sm:text-xs text-center leading-tight">{part.label}</span>
              </button>
            ))}
          </div>

          {/* Large Drag & Drop Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();

              const file = e.dataTransfer.files?.[0];
              if (!file) return;

              if (!file.type.startsWith('image/')) {
                alert('Please drop an image file.');
                return;
              }

              if (file.size > 10 * 1024 * 1024) {
                alert('Image size must be less than 10 MB.');
                return;
              }

              const imageUrl = URL.createObjectURL(file);
              setUploadedImage(imageUrl);
              setGradCamImage(null);
              setTopPredictions([]);
              setCurrentResult(null);
              setStage('analyzing');
              setAnalysisStep(1);

              try {
                const prediction = await predictImage(file);
                setTopPredictions(Array.isArray(prediction.top_predictions) ? prediction.top_predictions : []);

                let gradcam = null;
                try {
                  gradcam = await getGradCAM(file);
                  setGradCamImage(gradcam?.gradcam_image || null);
                } catch (gradcamError) {
                  console.error('Grad-CAM error:', gradcamError);
                  setGradCamImage(null);
                }

                setAnalysisStep(2);
                setTimeout(() => setAnalysisStep(3), 400);
                setTimeout(() => setAnalysisStep(4), 800);

                setTimeout(() => {
                  const predictedClass = prediction.class;
                  const confidence = Number(prediction.confidence);
                  const resultStatus = getResultStatus(predictedClass);
                  const resultSeverity = getResultSeverity(confidence, resultStatus);
                  const diseaseInfo = getDiseaseInfo(predictedClass);

                  const newScanResult: ScanResult = {
                    id: `SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    date:
                      '26 Sep 2026, ' +
                      new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    farmId: 'farm-1',
                    farmName: 'Green Valley Areca Farm',
                    plotLocation: 'Plot #03 - Section West',
                    plantPart: selectedPart,
                    imageUrl,          diseaseId: predictedClass,
          diseaseName: predictedClass,
          kannadaName:
            predictedClass === 'Healthy_Leaf'
              ? 'ಆರೋಗ್ಯಕರ ಎಲೆ'
              : predictedClass === 'Healthy_Nut'
              ? 'ಆರೋಗ್ಯಕರ ಅಡಿಕೆ'
              : predictedClass === 'Healthy_Trunk'
              ? 'ಆರೋಗ್ಯಕರ ಕಾಂಡ'
              : predictedClass === 'Healthy_Foot'
              ? 'ಆರೋಗ್ಯಕರ ಬುಡ'
              : '',
          confidence,
          status: resultStatus,
          severity: resultSeverity,
          possibleCause:
            resultStatus === 'Healthy'
              ? 'The AI model classified the uploaded image as a healthy plant part.'
              : prediction.advisory ||
                'Verify the AI prediction before taking agricultural action.',
          gradCamFocusArea:
            gradcam?.success
              ? `Grad-CAM generated by the MobileNetV2 backend using layer ${gradcam.layer || 'feature layer'}.`
              : 'Grad-CAM could not be generated for this scan.',
                    weatherSnapshot: {
                      location: 'Udupi, Karnataka',
                      temp: 28,
                      humidity: 78,
                      rainfall: 2.4,
                      condition: 'Partly Cloudy',
                    },
                    recommendationSummary:
                      prediction.advisory ||
                      diseaseInfo.treatments?.[0]?.description ||
                      'Monitor the plant regularly.',
                  };

                  setCurrentResult(newScanResult);
                  onScanComplete(newScanResult);
                  setStage('result');
                }, 1200);
              } catch (error) {
                console.error('Prediction error:', error);
                setStage('upload');
                setAnalysisStep(1);
                alert(
                  'Could not connect to the AI model. Make sure FastAPI is running at http://127.0.0.1:8000'
                );
              }
            }}
            className="border-2 border-dashed border-[#176B3A]/40 hover:border-[#176B3A] bg-[#FAFBF8] hover:bg-white rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group shadow-sm hover:shadow-md space-y-4"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-3xl bg-[#EAF5EC] text-[#176B3A] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#0D3B24]">
                Drag & drop an image here or <span className="text-[#176B3A] underline">Browse Files</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-[#66736A]">
                Supported: JPG, JPEG, PNG | Max 10 MB | Input: 224×224 RGB
              </p>
            </div>

            {/* Take Photo Button for Mobile / Camera */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-[#0D3B24] hover:bg-[#176B3A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo / Camera</span>
              </button>
            </div>
          </div>

          {/* Interactive Sample Presets Strip (Instant 1-Click Evaluation) */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#176B3A]" />
                <h4 className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#0D3B24]">
                  Or Test with Sample Images (1-Click AI Demo)
                </h4>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#66736A]">Click any card to analyze</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {SAMPLE_SCAN_PRESETS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#176B3A] transition-all cursor-pointer group p-1.5 sm:p-2 space-y-1.5 sm:space-y-2"
                >
                  <div className="aspect-square rounded-lg overflow-hidden relative bg-gray-100">
                    <img
                      src={sample.image}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] sm:text-[9px] font-mono px-1 rounded">
                      {sample.part}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-[10px] sm:text-[11px] text-[#17231B] truncate group-hover:text-[#176B3A]">
                      {sample.name}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-[#66736A] font-medium truncate">
                      {sample.badge}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ANALYZING STATE */}
      {stage === 'analyzing' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 lg:p-12 text-center max-w-xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="space-y-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EAF5EC] text-[#176B3A] flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D3B24]">
              Analyzing Your Plant
            </h2>
            <p className="text-[11px] sm:text-xs text-[#66736A]">
              Executing MobileNetV2 neural inference & agronomic advisory engine...
            </p>
          </div>

          {/* Thumbnail preview being scanned */}
          {uploadedImage && (
            <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-[#176B3A] shadow-md">
              <img src={uploadedImage} alt="Crop in analysis" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#176B3A]/20 backdrop-blur-2xs flex items-center justify-center">
                <div className="w-full h-1 bg-[#4FAF68] animate-bounce shadow-glow"></div>
              </div>
            </div>
          )}

          {/* 4 Sequential Diagnostic Steps */}
          <div className="space-y-3 text-left max-w-md mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all bg-[#FAFBF8] border border-gray-100">
              {analysisStep >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={`text-xs ${analysisStep >= 1 ? 'font-bold text-[#17231B]' : 'text-gray-400'}`}>
                {t.step1}
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all bg-[#FAFBF8] border border-gray-100">
              {analysisStep >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 animate-pulse" />
              )}
              <span className={`text-xs ${analysisStep >= 2 ? 'font-bold text-[#17231B]' : 'text-gray-400'}`}>
                {t.step2}
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all bg-[#FAFBF8] border border-gray-100">
              {analysisStep >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 animate-pulse" />
              )}
              <span className={`text-xs ${analysisStep >= 3 ? 'font-bold text-[#17231B]' : 'text-gray-400'}`}>
                {t.step3}
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all bg-[#FAFBF8] border border-gray-100">
              {analysisStep >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 animate-pulse" />
              )}
              <span className={`text-xs ${analysisStep >= 4 ? 'font-bold text-[#17231B]' : 'text-gray-400'}`}>
                {t.step4}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. DETECTION RESULT VIEW */}
      {stage === 'result' && currentResult && (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn">
          {/* Result Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0D3B24] tracking-tight">
                  {t.detectionResult}
                </h1>
                <span className="text-[10px] sm:text-xs font-mono bg-[#EAF5EC] text-[#176B3A] px-2 sm:px-2.5 py-0.5 rounded-md font-bold">
                  {currentResult.id}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#66736A] mt-0.5">
                Analyzed on {currentResult.date} • {currentResult.farmName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => onOpenReportModal(currentResult)}
                className="flex items-center gap-1.5 sm:gap-2 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs lg:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.downloadReport}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 sm:gap-2 bg-[#FAFBF8] hover:bg-gray-100 text-[#0D3B24] border border-gray-300 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs lg:text-sm font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.scanAnother}</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Result Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Column (5 Cols): Scanned Leaf & Grad-CAM Attention Map */}
            <div className="lg:col-span-5 space-y-4">
              <GradCamViewer
                originalImageUrl={currentResult.imageUrl}
                gradCamImageUrl={gradCamImage}
                diseaseName={formatDiseaseName(currentResult.diseaseName)}
                severity={currentResult.severity}
                confidence={currentResult.confidence}
                focusAreaDescription={currentResult.gradCamFocusArea}
                diseaseId={currentResult.diseaseId}
              />
            </div>

            {/* Right Column (7 Cols): Primary Diagnosis & Detail Tabs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Primary Diagnosis Header Card */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#66736A]">
                      Identified Condition
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B24] mt-0.5">
                      {formatDiseaseName(currentResult.diseaseName)}
                    </h2>
                    <p className="text-xs text-[#176B3A] font-semibold mt-0.5">
                      {currentResult.kannadaName}
                    </p>
                  </div>

                  {/* Confidence Score Pill */}
                  <div className="bg-[#FAFBF8] border border-gray-200 p-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-[11px] text-[#66736A]">{t.confidence}</div>
                    <div className="text-2xl font-black text-[#176B3A]">
                      {currentResult.confidence}%
                    </div>
                  </div>
                </div>

                {/* Status & Severity Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      currentResult.status === 'Healthy'
                        ? 'bg-[#EAF5EC] text-[#176B3A]'
                        : 'bg-red-50 text-[#D9534F]'
                    }`}
                  >
                    {currentResult.status === 'Healthy' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{t.status}: {currentResult.status}</span>
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      currentResult.severity === 'High'
                        ? 'bg-[#D9534F] text-white'
                        : currentResult.severity === 'Medium'
                        ? 'bg-[#E6A23C] text-white'
                        : 'bg-[#176B3A] text-white'
                    }`}
                  >
                    {t.severity}: {currentResult.severity}
                  </span>

                  <span className="text-xs text-[#66736A] capitalize bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {currentResult.plantPart} Organ
                  </span>
                </div>
              </div>



              {/* Model evaluation + top predictions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#EAF5EC] border border-[#176B3A]/20 rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#66736A]">Model Test Accuracy</div>
                  <div className="text-2xl font-black text-[#176B3A] mt-1">{MODEL_TEST_ACCURACY}%</div>
                  <div className="text-[10px] text-[#66736A] mt-1">Final evaluated 9-class model</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#66736A]">Image Confidence</div>
                  <div className="text-2xl font-black text-[#0D3B24] mt-1">{currentResult.confidence}%</div>
                  <div className="text-[10px] text-[#66736A] mt-1">Top class probability</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#66736A]">Classes</div>
                  <div className="text-2xl font-black text-[#0D3B24] mt-1">9</div>
                  <div className="text-[10px] text-[#66736A] mt-1">Trained output categories</div>
                </div>
              </div>

              {topPredictions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0D3B24]">Top 3 Model Predictions</div>
                    <span className="text-[10px] text-[#66736A]">9-class MobileNetV2</span>
                  </div>
                  <div className="space-y-2.5">
                    {topPredictions.map((item, index) => (
                      <div key={`${item.class}-${index}`} className="flex items-center gap-2">
                        <span className="w-5 text-[10px] font-bold text-[#66736A]">#{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-semibold text-[#17231B] truncate">{formatDiseaseName(item.class)}</span>
                            <span className="font-bold text-[#176B3A] shrink-0">{Number(item.confidence).toFixed(2)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-[#EAF5EC] overflow-hidden">
                            <div className="h-full rounded-full bg-[#176B3A] transition-all" style={{ width: `${Math.min(100, Math.max(0, Number(item.confidence)))}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Tabs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="bg-[#FAFBF8] border-b border-gray-200 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                        : 'text-[#66736A] hover:text-[#17231B]'
                    }`}
                  >
                    {t.tabOverview}
                  </button>
                  <button
                    onClick={() => setActiveTab('symptoms')}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'symptoms'
                        ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                        : 'text-[#66736A] hover:text-[#17231B]'
                    }`}
                  >
                    {t.tabSymptoms}
                  </button>
                  <button
                    onClick={() => setActiveTab('treatment')}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'treatment'
                        ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                        : 'text-[#66736A] hover:text-[#17231B]'
                    }`}
                  >
                    {t.tabTreatment}
                  </button>
                  <button
                    onClick={() => setActiveTab('prevention')}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'prevention'
                        ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                        : 'text-[#66736A] hover:text-[#17231B]'
                    }`}
                  >
                    {t.tabPrevention}
                  </button>
                  <button
                    onClick={() => setActiveTab('model')}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'model'
                        ? 'bg-[#176B3A] text-white shadow-2xs font-bold'
                        : 'text-[#66736A] hover:text-[#17231B]'
                    }`}
                  >
                    {t.tabModelMetrics}
                  </button>
                </div>

                {/* Tab Content Body */}
                <div className="p-6 text-xs text-[#17231B] space-y-4">
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFBF8] p-3.5 rounded-xl border border-gray-100">
                        <div>
                          <div className="text-[11px] text-[#66736A]">Scientific Etiology / Pathogen:</div>
                          <div className="font-semibold text-[#0D3B24] italic mt-0.5">
                            {currentDiseaseInfo.scientificName}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#66736A]">Vector / Inoculum:</div>
                          <div className="font-semibold text-[#0D3B24] mt-0.5">
                            {currentDiseaseInfo.vectorOrPathogen}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-bold text-[#0D3B24] uppercase text-[11px] tracking-wider">
                          Description
                        </div>
                        <p className="text-xs text-[#66736A] leading-relaxed">
                          {currentDiseaseInfo.description}
                        </p>
                      </div>

                      {/* Advisory Card: Recommended Next Steps */}
                      <div className="bg-[#EAF5EC] p-4 rounded-xl border border-[#176B3A]/20 space-y-2">
                        <div className="font-bold text-xs text-[#0D3B24] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#176B3A]" />
                          <span>{t.recommendedNextSteps}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#0D3B24]/90 pl-1">
                          <li>Inspect nearby palms within a 20-meter radius for similar symptoms.</li>
                          <li>Monitor plant and soil moisture conditions regularly during humid intervals.</li>
                          <li>Consult a qualified agriculture professional before applying chemical treatment.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SYMPTOMS */}
                  {activeTab === 'symptoms' && (
                    <div className="space-y-3">
                      <div className="font-bold text-[#0D3B24] uppercase text-[11px] tracking-wider">
                        Characteristic Clinical Manifestations
                      </div>
                      <div className="space-y-2">
                        {currentDiseaseInfo.symptoms.map((sym, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FAFBF8] border border-gray-200">
                            <span className="w-2 h-2 rounded-full bg-[#176B3A] mt-1 shrink-0" />
                            <span className="text-xs text-[#17231B]">{sym}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TREATMENT */}
                  {activeTab === 'treatment' && (
                    <div className="space-y-3">
                      <div className="font-bold text-[#0D3B24] uppercase text-[11px] tracking-wider">
                        Prescribed ICAR-CPCRI Treatment Protocol
                      </div>
                      <div className="space-y-3">
                        {currentDiseaseInfo.treatments.map((tr, idx) => (
                          <div key={idx} className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#0D3B24] flex items-center gap-2">
                                <span className="text-[10px] bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-mono font-bold">
                                  {tr.type}
                                </span>
                                {tr.title}
                              </span>
                              <span className="text-[10px] font-semibold text-[#E6A23C]">{tr.timing}</span>
                            </div>
                            {tr.dosage && (
                              <div className="text-[11px] font-mono text-[#176B3A] bg-[#FAFBF8] p-1.5 rounded border border-gray-100 font-semibold">
                                Dosage: {tr.dosage}
                              </div>
                            )}
                            <p className="text-xs text-[#66736A] leading-relaxed">{tr.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PREVENTION */}
                  {activeTab === 'prevention' && (
                    <div className="space-y-3">
                      <div className="font-bold text-[#0D3B24] uppercase text-[11px] tracking-wider">
                        Long-Term Preventive Measures
                      </div>
                      <div className="space-y-2">
                        {currentDiseaseInfo.prevention.map((prev, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FAFBF8] border border-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-[#176B3A] mt-0.5 shrink-0" />
                            <span className="text-xs text-[#17231B]">{prev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: MODEL METRICS */}
                  {activeTab === 'model' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 bg-[#FAFBF8] rounded-xl border border-gray-200">
                          <span className="text-[10px] text-[#66736A] block">Backbone Architecture</span>
                          <span className="font-bold text-[#0D3B24]">MobileNetV2</span>
                        </div>
                        <div className="p-2.5 bg-[#FAFBF8] rounded-xl border border-gray-200">
                          <span className="text-[10px] text-[#66736A] block">Test Accuracy</span>
                          <span className="font-bold text-[#176B3A]">{MODEL_TEST_ACCURACY}%</span>
                        </div>
                        <div className="p-2.5 bg-[#FAFBF8] rounded-xl border border-gray-200">
                          <span className="text-[10px] text-[#66736A] block">Model Input</span>
                          <span className="font-bold text-[#0D3B24]">224 x 224 x 3</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#176B3A]/20 text-[11px] text-[#66736A] space-y-1">
                        <div><span className="font-bold text-[#0D3B24]">Evaluation:</span> Test accuracy {MODEL_TEST_ACCURACY}% • Test loss 0.5225 • 9 trained classes.</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-[#66736A] space-y-1">
                        <div className="font-bold text-[#0D3B24]">Grad-CAM Feature Activation Focus:</div>
                        <div>{currentResult.gradCamFocusArea}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Advisory Disclaimer Note */}
              <div className="p-3.5 bg-[#FAFBF8] rounded-2xl border border-amber-200/80 text-xs text-[#66736A] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#E6A23C] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-[#17231B]">Important Note: </strong>
                  {t.disclaimer}
                </p>
              </div>

              {/* Ask Farm AI Assistant Shortcut */}
              <div className="flex items-center justify-between p-3.5 bg-[#0D3B24] rounded-2xl text-white text-xs">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-5 h-5 text-[#4FAF68]" />
                  <span>Have questions on Bordeaux mixture or fertilizer dosage?</span>
                </div>
                <button
                  onClick={onOpenAgriAi}
                  className="bg-[#176B3A] hover:bg-[#4FAF68] hover:text-[#0D3B24] text-white px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0"
                >
                  {t.askAgriAI}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
