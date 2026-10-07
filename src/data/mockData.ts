import { Farm, ScanResult, WeatherDayForecast, ModelMetric } from '../types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Green Valley Areca Farm',
    location: 'Brahmavara, Udupi District',
    district: 'Udupi',
    state: 'Karnataka',
    totalPlants: 850,
    bearingAge: '8 - 12 Years (Prime Bearing)',
    variety: 'Mangala & Mohitnagar Hybrid',
    soilType: 'Lateritic Red Loam (pH 5.8)',
    irrigationType: 'Automated Drip with Fertigation',
    lastScanDate: '25 Sep 2026',
    status: 'Good',
    healthyCount: 18,
    diseasedCount: 8,
    observationCount: 1,
    coordinates: { lat: 13.4355, lng: 74.7421 }
  },
  {
    id: 'farm-2',
    name: 'Coastal Palms Agro Plantation',
    location: 'Kundapura Taluk',
    district: 'Udupi',
    state: 'Karnataka',
    totalPlants: 1200,
    bearingAge: '14 Years',
    variety: 'South Kanara Indigenous',
    soilType: 'Coastal Sandy Loam (pH 6.2)',
    irrigationType: 'Micro-sprinkler Basin',
    lastScanDate: '24 Sep 2026',
    status: 'Attention Needed',
    healthyCount: 12,
    diseasedCount: 5,
    observationCount: 2,
    coordinates: { lat: 13.6268, lng: 74.6917 }
  },
  {
    id: 'farm-3',
    name: 'Sahyadri Foothills Estate',
    location: 'Thirthahalli, Malnad',
    district: 'Shivamogga',
    state: 'Karnataka',
    totalPlants: 640,
    bearingAge: '6 Years (Early Bearing)',
    variety: 'Thirthahalli Selection & Sreemangala',
    soilType: 'High Organic Malnad Humus (pH 5.5)',
    irrigationType: 'Gravity Flow Valley Canals',
    lastScanDate: '21 Sep 2026',
    status: 'Good',
    healthyCount: 9,
    diseasedCount: 2,
    observationCount: 0,
    coordinates: { lat: 13.6932, lng: 75.2412 }
  }
];

export const INITIAL_SCANS: ScanResult[] = [
  {
    id: 'SC-2026-9041',
    date: '25 Sep 2026, 11:24 AM',
    farmId: 'farm-1',
    farmName: 'Green Valley Areca Farm',
    plotLocation: 'Block B - North Plot #14',
    plantPart: 'leaf',
    imageUrl: '/images/yellow-leaf-disease.jpg',
    diseaseId: 'yellow-leaf-disease',
    diseaseName: 'Yellow Leaf Disease (YLD)',
    kannadaName: 'ಹಳದಿ ಎಲೆ ರೋಗ',
    confidence: 94.6,
    status: 'Diseased',
    severity: 'High',
    possibleCause: 'Phytoplasma-associated disease vector transmission with potassium imbalance',
    gradCamFocusArea: 'Middle and tip chlorotic regions of mid-whorl fronds (Convolutional Layer 4 Activations)',
    gradCamHeatmapCoordinates: [
      { x: 42, y: 38, radius: 28, intensity: 0.95 },
      { x: 65, y: 52, radius: 22, intensity: 0.88 },
      { x: 28, y: 60, radius: 18, intensity: 0.74 }
    ],
    weatherSnapshot: {
      location: 'Udupi, Karnataka',
      temp: 28,
      humidity: 78,
      rainfall: 2.4,
      condition: 'Partly Cloudy'
    },
    recommendationSummary: 'Apply balanced NPK + Magnesium Sulphate (50g). Spray Dimethoate 30 EC (1.5ml/L) on leaf undersides to manage vector hoppers.'
  },
  {
    id: 'SC-2026-9038',
    date: '24 Sep 2026, 03:45 PM',
    farmId: 'farm-1',
    farmName: 'Green Valley Areca Farm',
    plotLocation: 'Block A - East Plot #06',
    plantPart: 'leaf',
    imageUrl: '/images/healthy-leaf.jpg',
    diseaseId: 'healthy-palm',
    diseaseName: 'Healthy Leaf',
    kannadaName: 'ಆರೋಗ್ಯಕರ ಎಲೆ',
    confidence: 98.2,
    status: 'Healthy',
    severity: 'Healthy',
    possibleCause: 'Optimal chlorophyll synthesis and vigorous cellular turgor',
    gradCamFocusArea: 'Uniform photosynthetic distribution across leaf lamina with zero necrotic activation',
    gradCamHeatmapCoordinates: [
      { x: 50, y: 50, radius: 35, intensity: 0.35 }
    ],
    weatherSnapshot: {
      location: 'Udupi, Karnataka',
      temp: 29,
      humidity: 76,
      rainfall: 0.0,
      condition: 'Sunny with Light Clouds'
    },
    recommendationSummary: 'Plant is in optimal vigor. Maintain standard post-monsoon organic mulching and scheduled NPK top dressing.'
  },
  {
    id: 'SC-2026-9029',
    date: '23 Sep 2026, 09:12 AM',
    farmId: 'farm-2',
    farmName: 'Coastal Palms Agro Plantation',
    plotLocation: 'Sector 3 - Palm #88',
    plantPart: 'leaf',
    imageUrl: '/images/leaf-spot.jpg',
    diseaseId: 'leaf-spot',
    diseaseName: 'Leaf Spot / Blight',
    kannadaName: 'ಎಲೆ ಚುಕ್ಕೆ ರೋಗ',
    confidence: 91.3,
    status: 'Diseased',
    severity: 'Medium',
    possibleCause: 'Colletotrichum foliar fungal sporulation during humid intervals',
    gradCamFocusArea: 'Necrotic dark focal lesions on lamina surrounded by chlorotic ring halos',
    gradCamHeatmapCoordinates: [
      { x: 35, y: 32, radius: 18, intensity: 0.92 },
      { x: 58, y: 45, radius: 24, intensity: 0.89 },
      { x: 70, y: 68, radius: 15, intensity: 0.78 }
    ],
    weatherSnapshot: {
      location: 'Kundapura, Udupi',
      temp: 27,
      humidity: 82,
      rainfall: 5.1,
      condition: 'Light Showers'
    },
    recommendationSummary: 'Spray 1% Bordeaux mixture or Mancozeb 75 WP @ 2.5 g/L. Prune heavily blighted lower fronds.'
  },
  {
    id: 'SC-2026-8994',
    date: '21 Sep 2026, 02:20 PM',
    farmId: 'farm-1',
    farmName: 'Green Valley Areca Farm',
    plotLocation: 'Block C - South Slope #02',
    plantPart: 'nut',
    imageUrl: '/images/fruit-rot-mahali.jpg',
    diseaseId: 'fruit-rot-mahali',
    diseaseName: 'Mahali / Koleroga (Fruit Rot)',
    kannadaName: 'ಮಹಾಳಿ / ಕೊಳೆ ರೋಗ',
    confidence: 96.8,
    status: 'Diseased',
    severity: 'High',
    possibleCause: 'Phytophthora meadii oospore activation following monsoon rain spells',
    gradCamFocusArea: 'Nut calyx junction and brown water-soaked rotting lesions on nut surfaces',
    gradCamHeatmapCoordinates: [
      { x: 48, y: 40, radius: 30, intensity: 0.98 },
      { x: 62, y: 58, radius: 25, intensity: 0.91 }
    ],
    weatherSnapshot: {
      location: 'Udupi, Karnataka',
      temp: 26,
      humidity: 88,
      rainfall: 14.2,
      condition: 'Overcast & Rain'
    },
    recommendationSummary: 'Urgent bunch spray with 1% Bordeaux mixture + rosin sticker or Metalaxyl MZ 0.2%. Collect and incinerate fallen shed nuts.'
  },
  {
    id: 'SC-2026-8971',
    date: '19 Sep 2026, 10:05 AM',
    farmId: 'farm-3',
    farmName: 'Sahyadri Foothills Estate',
    plotLocation: 'Zone A - Palm #112',
    plantPart: 'trunk',
    imageUrl: '/images/bud-rot.jpg',
    diseaseId: 'bud-rot',
    diseaseName: 'Bud Rot (Spindle Rot)',
    kannadaName: 'ಸುಳಿ ಕೊಳೆ ರೋಗ',
    confidence: 93.4,
    status: 'Diseased',
    severity: 'High',
    possibleCause: 'Phytophthora arecae mycelial invasion into apical spindle shoot',
    gradCamFocusArea: 'Apical central spindle sheath rot and crown transition base',
    gradCamHeatmapCoordinates: [
      { x: 50, y: 42, radius: 26, intensity: 0.94 }
    ],
    weatherSnapshot: {
      location: 'Thirthahalli, Shivamogga',
      temp: 24,
      humidity: 92,
      rainfall: 18.0,
      condition: 'Heavy Mist & Rain'
    },
    recommendationSummary: 'Climb palm immediately, surgically excise all rotten tissue from spindle, dress with 10% Bordeaux paste.'
  },
  {
    id: 'SC-2026-8940',
    date: '16 Sep 2026, 04:10 PM',
    farmId: 'farm-2',
    farmName: 'Coastal Palms Agro Plantation',
    plotLocation: 'Sector 1 - Palm #34',
    plantPart: 'trunk',
    imageUrl: '/images/stem-cracking.jpg',
    diseaseId: 'stem-cracking',
    diseaseName: 'Stem Cracking & Bleeding',
    kannadaName: 'ಕಾಂಡ ಸೀಳುವಿಕೆ ರೋಗ',
    confidence: 89.7,
    status: 'Diseased',
    severity: 'Medium',
    possibleCause: 'Longitudinal bark stress fissures with Thielaviopsis sap exuding',
    gradCamFocusArea: 'Vertical bark fissures and dark reddish viscous exudate region',
    gradCamHeatmapCoordinates: [
      { x: 52, y: 55, radius: 22, intensity: 0.89 }
    ],
    weatherSnapshot: {
      location: 'Kundapura, Udupi',
      temp: 31,
      humidity: 68,
      rainfall: 0.0,
      condition: 'Sunny'
    },
    recommendationSummary: 'Scrape oozing tissue, swab with Calixin 0.1%, seal fissure with Coal Tar. Whitewash lower trunk with 1% Lime.'
  }
];

export const MONTHLY_SCAN_STATS = [
  { month: 'Jan', healthy: 12, diseased: 3, total: 15 },
  { month: 'Feb', healthy: 14, diseased: 2, total: 16 },
  { month: 'Mar', healthy: 15, diseased: 4, total: 19 },
  { month: 'Apr', healthy: 13, diseased: 5, total: 18 },
  { month: 'May', healthy: 16, diseased: 6, total: 22 },
  { month: 'Jun', healthy: 11, diseased: 12, total: 23 },
  { month: 'Jul', healthy: 9, diseased: 15, total: 24 },
  { month: 'Aug', healthy: 14, diseased: 11, total: 25 },
  { month: 'Sep', healthy: 18, diseased: 9, total: 27 }
];

export const SEVEN_DAY_FORECAST: WeatherDayForecast[] = [
  {
    day: 'Today (Sat)',
    date: '26 Sep 2026',
    tempMax: 29,
    tempMin: 24,
    humidity: 78,
    rainfallMm: 2.4,
    condition: 'Partly Cloudy with Humid Intervals',
    icon: 'CloudSun',
    diseaseRisk: 'High',
    riskFactorNotes: 'Elevated relative humidity (78%) and residual leaf wetness elevate Yellow Leaf & Foliar Blight susceptibility.'
  },
  {
    day: 'Sun',
    date: '27 Sep 2026',
    tempMax: 28,
    tempMin: 23,
    humidity: 84,
    rainfallMm: 8.6,
    condition: 'Moderate Rain Showers',
    icon: 'CloudRain',
    diseaseRisk: 'High',
    riskFactorNotes: 'Rainfall combined with 84% humidity triggers Koleroga (Mahali) spore germination on nut bunches.'
  },
  {
    day: 'Mon',
    date: '28 Sep 2026',
    tempMax: 28,
    tempMin: 24,
    humidity: 82,
    rainfallMm: 6.0,
    condition: 'Scattered Afternoon Showers',
    icon: 'CloudRain',
    diseaseRisk: 'High',
    riskFactorNotes: 'Overcast sky reduces canopy sunlight; inspect crowns for Bud Rot onset.'
  },
  {
    day: 'Tue',
    date: '29 Sep 2026',
    tempMax: 30,
    tempMin: 24,
    humidity: 74,
    rainfallMm: 1.2,
    condition: 'Partly Sunny & Warm',
    icon: 'CloudSun',
    diseaseRisk: 'Moderate',
    riskFactorNotes: 'Optimal window for prophylactic Bordeaux mixture foliar spray during morning hours.'
  },
  {
    day: 'Wed',
    date: '30 Sep 2026',
    tempMax: 31,
    tempMin: 25,
    humidity: 70,
    rainfallMm: 0.0,
    condition: 'Clear Tropical Sun',
    icon: 'Sun',
    diseaseRisk: 'Moderate',
    riskFactorNotes: 'Dry condition lowers fungal spread rate; monitor soil moisture and vector hopper count.'
  },
  {
    day: 'Thu',
    date: '01 Oct 2026',
    tempMax: 31,
    tempMin: 24,
    humidity: 68,
    rainfallMm: 0.0,
    condition: 'Sunny with Mild Breeze',
    icon: 'Sun',
    diseaseRisk: 'Low',
    riskFactorNotes: 'Low disease transmission risk. Recommended time for root basin fertilizer application.'
  },
  {
    day: 'Fri',
    date: '02 Oct 2026',
    tempMax: 30,
    tempMin: 24,
    humidity: 71,
    rainfallMm: 0.8,
    condition: 'Light Evening Cloudiness',
    icon: 'CloudSun',
    diseaseRisk: 'Low',
    riskFactorNotes: 'Stable atmospheric index. Safe for routine weeding and organic manuring.'
  }
];

export const ACADEMIC_MODEL_METRIC: ModelMetric = {
  architecture: 'Custom ResNet-50 + Grad-CAM Explainable Vision Pipeline (PyTorch)',
  datasetSize: 12450,
  inputResolution: '224 x 224 x 3 (CLAHE Preprocessed RGB)',
  trainingEpochs: 60,
  accuracy: 96.2,
  precision: 95.8,
  recall: 96.0,
  f1Score: 95.9,
  inferenceLatencyMs: 142,
  classes: [
    { name: 'Yellow Leaf Disease (YLD)', precision: 95.4, recall: 96.1, f1: 95.7, sampleCount: 2850 },
    { name: 'Leaf Spot / Blight', precision: 94.2, recall: 93.8, f1: 94.0, sampleCount: 2400 },
    { name: 'Mahali / Koleroga (Fruit Rot)', precision: 97.6, recall: 98.2, f1: 97.9, sampleCount: 2600 },
    { name: 'Bud Rot (Spindle Rot)', precision: 96.1, recall: 95.3, f1: 95.7, sampleCount: 1900 },
    { name: 'Stem Cracking & Bleeding', precision: 93.8, recall: 94.5, f1: 94.1, sampleCount: 1200 },
    { name: 'Healthy Arecanut Specimen', precision: 98.2, recall: 98.6, f1: 98.4, sampleCount: 1500 }
  ]
};

export const SAMPLE_SCAN_PRESETS = [
  {
    id: 'sample-yld',
    name: 'Yellow Leaf Disease (Leaf)',
    part: 'leaf' as const,
    image: '/images/yellow-leaf-disease.jpg',
    diseaseId: 'yellow-leaf-disease',
    confidence: 94.6,
    badge: 'High Severity'
  },
  {
    id: 'sample-healthy',
    name: 'Healthy Arecanut Frond',
    part: 'leaf' as const,
    image: '/images/healthy-leaf.jpg',
    diseaseId: 'healthy-palm',
    confidence: 98.2,
    badge: 'Healthy Plant'
  },
  {
    id: 'sample-leaf-spot',
    name: 'Leaf Spot / Blight (Leaf)',
    part: 'leaf' as const,
    image: '/images/leaf-spot.jpg',
    diseaseId: 'leaf-spot',
    confidence: 91.3,
    badge: 'Medium Severity'
  },
  {
    id: 'sample-mahali',
    name: 'Mahali / Koleroga (Nut Bunch)',
    part: 'nut' as const,
    image: '/images/fruit-rot-mahali.jpg',
    diseaseId: 'fruit-rot-mahali',
    confidence: 96.8,
    badge: 'High Severity'
  },
  {
    id: 'sample-bud-rot',
    name: 'Bud Rot (Spindle / Crown)',
    part: 'trunk' as const,
    image: '/images/bud-rot.jpg',
    diseaseId: 'bud-rot',
    confidence: 93.4,
    badge: 'High Severity'
  },
  {
    id: 'sample-stem-cracking',
    name: 'Stem Cracking & Bleeding (Trunk)',
    part: 'trunk' as const,
    image: '/images/stem-cracking.jpg',
    diseaseId: 'stem-cracking',
    confidence: 89.7,
    badge: 'Medium Severity'
  }
];
