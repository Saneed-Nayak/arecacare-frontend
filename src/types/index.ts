export type PlantPart = 'leaf' | 'nut' | 'trunk' | 'whole';

export type DiseaseSeverity = 'High' | 'Medium' | 'Low' | 'Healthy';

export type ScanStatus = 'Diseased' | 'Healthy' | 'Observation';

export interface TreatmentStep {
  type: 'Chemical' | 'Organic / Bio-control' | 'Cultural / Agronomic';
  title: string;
  dosage?: string;
  description: string;
  timing: string;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  kannadaName: string;
  category: PlantPart;
  severity: DiseaseSeverity;
  status: ScanStatus;
  confidenceDefault: number;
  image: string;
  gradCamOverlay?: string;
  possibleCause: string;
  vectorOrPathogen: string;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatments: TreatmentStep[];
  favorableWeather: {
    tempRange: string;
    humidityRange: string;
    rainfallCondition: string;
    highRiskMonths: string;
  };
  cpcriReference: string;
}

export interface ScanResult {
  id: string;
  date: string;
  farmId: string;
  farmName: string;
  plotLocation: string;
  plantPart: PlantPart;
  imageUrl: string;
  diseaseId: string;
  diseaseName: string;
  kannadaName: string;
  confidence: number;
  status: ScanStatus;
  severity: DiseaseSeverity;
  possibleCause: string;
  notes?: string;
  gradCamFocusArea: string;
  gradCamHeatmapCoordinates?: { x: number; y: number; radius: number; intensity: number }[];
  weatherSnapshot: {
    location: string;
    temp: number;
    humidity: number;
    rainfall: number;
    condition: string;
  };
  recommendationSummary: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  totalPlants: number;
  bearingAge: string;
  variety: string;
  soilType: string;
  irrigationType: string;
  lastScanDate: string;
  status: 'Good' | 'Attention Needed' | 'High Risk';
  healthyCount: number;
  diseasedCount: number;
  observationCount: number;
  coordinates: { lat: number; lng: number };
}

export interface WeatherDayForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfallMm: number;
  condition: string;
  icon: string;
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  riskFactorNotes: string;
}

export interface ModelMetric {
  architecture: string;
  datasetSize: number;
  inputResolution: string;
  trainingEpochs: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  inferenceLatencyMs: number;
  classes: {
    name: string;
    precision: number;
    recall: number;
    f1: number;
    sampleCount: number;
  }[];
}

export type ActiveView = 
  | 'landing'
  | 'dashboard'
  | 'scan'
  | 'library'
  | 'weather'
  | 'farms'
  | 'history'
  | 'reports'
  | 'profile'
  | 'research';
