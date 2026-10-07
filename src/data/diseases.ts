import { DiseaseInfo } from '../types';

export const ARECANUT_DISEASES: DiseaseInfo[] = [
  {
    id: 'yellow-leaf-disease',
    name: 'Yellow Leaf Disease (YLD)',
    scientificName: 'Phytoplasma-associated (16SrXI group)',
    kannadaName: 'ಹಳದಿ ಎಲೆ ರೋಗ (ಕೇಂಡು ರೋಗ)',
    category: 'leaf',
    severity: 'High',
    status: 'Diseased',
    confidenceDefault: 94.6,
    image: '/images/yellow-leaf-disease.jpg',
    possibleCause: 'Phytoplasma-associated disease transmitted by plant hoppers (Proutista moesta)',
    vectorOrPathogen: 'Phytoplasma & Vector Insect (Proutista moesta Westw.)',
    description: 'Yellow Leaf Disease (YLD) is one of the most debilitating diseases of arecanut palms in southern India, particularly Karnataka and Kerala. It causes characteristic chlorosis starting from the inner leaflets, leading to palm stunting, tapering of the stem, and severe yield collapse.',
    symptoms: [
      'Progressive golden-yellow chlorosis on leaflets starting from middle whorl leaves',
      'Margins and tips of leaflets turn brown, brittle and dry prematurely',
      'Gradual reduction in crown size and narrowing/tapering of the trunk',
      'Severe root rot in lower root zone with blackening of feeder roots',
      'Poor nut setting with blackish, unmarketable spongy nut kernels (Chali)'
    ],
    causes: [
      'Phytoplasma pathogen transmitted by sap-sucking plant hoppers (Proutista moesta)',
      'Imbalanced potassium/magnesium nutrition in lateritic acidic soils',
      'Poor drainage and root-zone waterlogging during heavy monsoon',
      'Use of infected planting material from endemic zones'
    ],
    prevention: [
      'Source certified disease-free seedlings from ICAR-CPCRI or recognized university nurseries',
      'Maintain strict vector hopper control using bio-pesticides or recommended sprays',
      'Ensure deep field drainage channels (at least 60-90 cm deep) between every two palm rows',
      'Adopt intercropping with cocoa, banana, or pepper to improve microclimate & soil health'
    ],
    treatments: [
      {
        type: 'Cultural / Agronomic',
        title: 'Nutrient Fortification & Soil Care',
        dosage: '100g N : 40g P2O5 : 140g K2O + 1kg Neem Cake per palm',
        description: 'Apply balanced chemical fertilizers in two split doses (Sept/Oct and Feb/March). Supplement with Magnesium Sulphate (50g) and Zinc Sulphate (25g) to alleviate chlorotic stress.',
        timing: 'Twice a year (Post-monsoon and Pre-summer)'
      },
      {
        type: 'Organic / Bio-control',
        title: 'Organic Manuring & Bio-inoculants',
        dosage: '12 kg Farmyard Manure + 200g Trichoderma harzianum',
        description: 'Incorporate well-decomposed organic manure mixed with Trichoderma and Phosphobacteria into root basin to revitalize soil microbial activity and feeder root growth.',
        timing: 'Apply during August - September'
      },
      {
        type: 'Chemical',
        title: 'Vector Population Management',
        dosage: 'Dimethoate 30 EC @ 1.5 ml/L or Imidacloprid 17.8 SL @ 0.3 ml/L',
        description: 'Foliar spray directed towards the under-surface of arecanut leaves and intercrops to suppress vector plant hoppers (Proutista moesta).',
        timing: 'During vector peak seasons (October - December)'
      }
    ],
    favorableWeather: {
      tempRange: '24°C - 31°C',
      humidityRange: '70% - 85%',
      rainfallCondition: 'Post-monsoon humid conditions',
      highRiskMonths: 'September to January'
    },
    cpcriReference: 'CPCRI Technical Bulletin No. 84 - Integrated Management of Yellow Leaf Disease of Arecanut'
  },
  {
    id: 'leaf-spot',
    name: 'Leaf Spot / Leaf Blight',
    scientificName: 'Colletotrichum gloeosporioides / Phyllosticta arecae',
    kannadaName: 'ಎಲೆ ಚುಕ್ಕೆ ರೋಗ',
    category: 'leaf',
    severity: 'Medium',
    status: 'Diseased',
    confidenceDefault: 91.3,
    image: '/images/leaf-spot.jpg',
    possibleCause: 'Fungal foliar pathogen thriving in high humidity and dense canopies',
    vectorOrPathogen: 'Colletotrichum gloeosporioides Penz. & Sacc.',
    description: 'Leaf spot is a very common fungal disease affecting arecanut seedlings and mature palms. It creates dark necrotic circular patches with chlorotic halos, impairing photosynthetic efficiency and causing premature leaflet blight.',
    symptoms: [
      'Small dark brown or black circular spots on leaf blade (1-3 mm)',
      'Spots enlarge and coalesce into irregular blighted necrotic patches',
      'Distinct yellowish-green halo surrounding each spot lesion',
      'Premature drying, shredding and blighting of affected leaflets'
    ],
    causes: [
      'High relative humidity (>80%) combined with leaf wetness exceeding 6 hours',
      'Overhead irrigation splashing fungal spores across fronds',
      'Excessive canopy shade and dense planting distance (< 2.7m)',
      'Nitrogen over-fertilization making foliage tender and susceptible'
    ],
    prevention: [
      'Prune and safely burn heavily blighted lower senescent leaves',
      'Maintain adequate spacing (2.7 m x 2.7 m) for sufficient airflow and light penetration',
      'Avoid sprinkler or overhead wetting of canopy during humid periods',
      'Apply prophylactic pre-monsoon foliar protection'
    ],
    treatments: [
      {
        type: 'Chemical',
        title: 'Foliar Fungicide Spray',
        dosage: '1% Bordeaux Mixture or Mancozeb 75 WP @ 2.5 g/L',
        description: 'Thoroughly spray upper and lower surfaces of leaves when initial spots appear. Ensure uniform coverage with fine mist.',
        timing: 'At first appearance of spots; repeat after 25-30 days'
      },
      {
        type: 'Organic / Bio-control',
        title: 'Pseudomonas fluorescens Bio-formulation',
        dosage: 'Pseudomonas fluorescens @ 10 g/L (or 0.5% liquid suspension)',
        description: 'Foliar spray of antagonistic bacterial culture to competitively exclude Colletotrichum spores on the leaf surface.',
        timing: 'Pre-monsoon and mid-season preventative'
      }
    ],
    favorableWeather: {
      tempRange: '25°C - 30°C',
      humidityRange: '80% - 95%',
      rainfallCondition: 'Intermittent rains with warm cloudy days',
      highRiskMonths: 'June to October'
    },
    cpcriReference: 'UAS Dharwad & CPCRI Plant Pathology Circular - Management of Arecanut Foliar Blights'
  },
  {
    id: 'fruit-rot-mahali',
    name: 'Mahali / Koleroga (Fruit Rot)',
    scientificName: 'Phytophthora meadii McRae',
    kannadaName: 'ಮಹಾಳಿ ರೋಗ / ಕೊಳೆ ರೋಗ',
    category: 'nut',
    severity: 'High',
    status: 'Diseased',
    confidenceDefault: 96.8,
    image: '/images/fruit-rot-mahali.jpg',
    possibleCause: 'Destructive oomycete pathogen attacking developing nut clusters during heavy monsoon',
    vectorOrPathogen: 'Phytophthora meadii McRae',
    description: 'Mahali (Koleroga) is historically the most destructive arecanut disease in high-rainfall coastal and Malnad regions of Karnataka, Kerala, and Maharashtra. A severe outbreak can destroy 70-90% of the entire nut harvest within weeks if unmanaged.',
    symptoms: [
      'Dark green water-soaked oily lesions appearing at the calyx end of young nuts',
      'Rapid spreading of rot turning nuts dull dark brown with foul odor',
      'Massive premature dropping/shedding of green nuts forming a carpet beneath the palm',
      'White cottony mycelial growth developing over fallen rotting nuts in humid weather',
      'Rotting spreading to the nut bunch stalk (rachilla) causing cluster collapse'
    ],
    causes: [
      'Continuous heavy monsoon rainfall with saturated atmospheric humidity (>90%)',
      'Temperatures ranging between 20°C and 24°C during monsoon months',
      'Spore splashing through rain wind currents from infected tree tops and weeds',
      'Failure to apply timely pre-monsoon prophylactic bunch spraying'
    ],
    prevention: [
      'Mandatory pre-monsoon prophylactic spray of 1% Bordeaux mixture before monsoon onset (late May / early June)',
      'Covering arecanut bunches with UV-stabilized polythene bags/covers (100-200 gauge) in heavy rainfall zones',
      'Collect and incinerate all fallen infected nuts and diseased stalks to eliminate inoculum',
      'Maintain proper palm drainage to prevent prolonged swampy soil'
    ],
    treatments: [
      {
        type: 'Chemical',
        title: 'Prophylactic Bordeaux Mixture Spray',
        dosage: '1% Bordeaux Mixture (1kg CuSO4 + 1kg Quicklime in 100L water) + Rosin sticker',
        description: 'First spray before onset of South-West monsoon. Second spray 40-45 days later during monsoon break. Ensure complete wetting of nut bunches.',
        timing: 'Late May (1st spray) & July/August (2nd spray)'
      },
      {
        type: 'Chemical',
        title: 'Systemic Fungicide for Active Outbreak',
        dosage: 'Metalaxyl-Mancozeb (Ridomil MZ) @ 2.5 g/L or Fosetyl-Al @ 2.0 g/L',
        description: 'Apply systemic fungicide directly to the bunches if fruit dropping has already commenced. Provides internal curative action.',
        timing: 'Immediate intervention upon first fallen nut symptom'
      },
      {
        type: 'Cultural / Agronomic',
        title: 'Polythene Bunch Covering',
        dosage: 'Transparent 100-gauge polythene sheets tied at bunch peduncle',
        description: 'Physically shields developing arecanut bunches from rain splash and Phytophthora zoospores. 98%+ efficacy without chemical residue.',
        timing: 'Tied in early June before heavy rains begin'
      }
    ],
    favorableWeather: {
      tempRange: '20°C - 26°C',
      humidityRange: '88% - 100%',
      rainfallCondition: 'Continuous heavy rainfall and dense overcast skies',
      highRiskMonths: 'June to August'
    },
    cpcriReference: 'ICAR-CPCRI Extension Folder 42 - Koleroga of Arecanut and its Eco-friendly Management'
  },
  {
    id: 'bud-rot',
    name: 'Bud Rot (Spindle Rot)',
    scientificName: 'Phytophthora arecae (Coleman) Pethybridge',
    kannadaName: 'ಸುಳಿ ಕೊಳೆ ರೋಗ',
    category: 'trunk',
    severity: 'High',
    status: 'Diseased',
    confidenceDefault: 93.4,
    image: '/images/bud-rot.jpg',
    possibleCause: 'Phytophthora infection penetrating the growing spindle and apical meristem',
    vectorOrPathogen: 'Phytophthora arecae / Phytophthora palmivora',
    description: 'Bud rot is a lethal disease affecting the apical growing point (spindle) of the arecanut palm. If the apical bud tissues rot completely, the crown collapses and the palm cannot recover, leading to permanent tree loss.',
    symptoms: [
      'Discoloration and yellow-brown wilting of the central spindle leaf',
      'Central spindle leaf droops and can easily be pulled out from the crown',
      'Rotten spindle base emits a strong putrid, foul odor due to secondary bacterial decay',
      'Outer whorl leaves remain green initially, then collapse progressively as bud rots'
    ],
    causes: [
      'Prolonged leaf wetness in the crown during continuous rainy spells',
      'Accumulation of water in leaf axils harboring Phytophthora spores',
      'Mechanical injury to crown during palm harvesting or climbing',
      'Secondary entry of bacterial pathogens in rotted tissues'
    ],
    prevention: [
      'Prophylactic crown treatment with Mancozeb (2g) + sand sachets placed in leaf axils',
      'Clean crown cleaning and sanitization prior to onset of monsoon rains',
      'Immediate removal and burning of dead collapsed crowns to safeguard neighboring palms'
    ],
    treatments: [
      {
        type: 'Cultural / Agronomic',
        title: 'Surgical Debridement & Paste Dressing',
        dosage: '10% Bordeaux Paste or Copper Oxychloride paste',
        description: 'In early stages, climb palm, cut out all infected rotting tissue from spindle base until healthy white tissue is visible. Thoroughly smear with 10% Bordeaux paste.',
        timing: 'Immediate upon first sign of spindle yellowing'
      },
      {
        type: 'Chemical',
        title: 'Crown Drenching & Protection',
        dosage: 'Copper Oxychloride 50 WP @ 3 g/L or Metalaxyl @ 2 g/L',
        description: 'Drench crown and surrounding leaf axils of affected palm and all surrounding palms within a 20-meter radius to halt disease transmission.',
        timing: 'Post surgical debridement + prophylactic neighbor drench'
      }
    ],
    favorableWeather: {
      tempRange: '21°C - 27°C',
      humidityRange: '85% - 98%',
      rainfallCondition: 'Continuous monsoon rainfall and crown water pooling',
      highRiskMonths: 'June to September'
    },
    cpcriReference: 'CPCRI Advisory Note No. 59 - Diagnosis and Cure of Bud Rot in Arecanut'
  },
  {
    id: 'stem-cracking',
    name: 'Stem Cracking & Bleeding',
    scientificName: 'Thielaviopsis paradoxa (de Seynes) / Growth Stress',
    kannadaName: 'ಕಾಂಡ ಸೀಳುವಿಕೆ ಮತ್ತು ರಸ ಸೋರುವ ರೋಗ',
    category: 'trunk',
    severity: 'Medium',
    status: 'Diseased',
    confidenceDefault: 89.7,
    image: '/images/stem-cracking.jpg',
    possibleCause: 'Longitudinal bark split due to physiological water flux combined with fungal infection',
    vectorOrPathogen: 'Thielaviopsis paradoxa & Sunscald / Water Fluctuations',
    description: 'Stem cracking manifests as vertical splits along the arecanut trunk, frequently accompanied by reddish-brown sap exudation (bleeding). It weakens the trunk structural integrity and exposes inner vascular bundles to secondary wood decay.',
    symptoms: [
      'Longitudinal vertical cracks and fissures on lower and middle segments of the stem',
      'Exudation of dark reddish-brown sticky viscous fluid from cracks',
      'Discoloration and rotting of internal fibrous tissues underneath cracks',
      'Stunting of crown fronds and tapering trunk diameter in severe chronic cases'
    ],
    causes: [
      'Sudden heavy irrigation or rain following prolonged dry drought spells (sap pressure surge)',
      'Sunscald on southwestern exposed trunks lacking adequate shade/protection',
      'Infection by Thielaviopsis paradoxa through microscopic bark fissures',
      'Boron deficiency causing brittle stem vascular tissues'
    ],
    prevention: [
      'White-wash trunk up to 2.5 meters height with 1% Lime wash or Copper Oxychloride wash',
      'Maintain steady, uniform drip irrigation during dry months to prevent water stress spikes',
      'Plant shade trees or intercrops (banana, gliricidia) along southwestern plantation borders',
      'Apply Borax @ 15g per palm annually in deficient soils'
    ],
    treatments: [
      {
        type: 'Cultural / Agronomic',
        title: 'Wound Dressing & Tar Seal',
        dosage: 'Coal Tar or 10% Bordeaux Paste',
        description: 'Scrape away oozing bark and decaying tissue with a sharp chisel. Disinfect with 0.1% Calixin (Tridemorph) and seal with hot Coal Tar or thick Bordeaux paste.',
        timing: 'During dry sunny periods (November - March)'
      },
      {
        type: 'Organic / Bio-control',
        title: 'Neem Cake & Trichoderma Soil Treatment',
        dosage: '5 kg Neem Cake + 100g Trichoderma harzianum per palm',
        description: 'Apply around root basin to suppress soil-borne inoculum and enhance systemic palm vigor.',
        timing: 'Once annually post-monsoon'
      }
    ],
    favorableWeather: {
      tempRange: '28°C - 36°C',
      humidityRange: '50% - 75%',
      rainfallCondition: 'Sudden rain after dry hot spell or strong direct sunlight',
      highRiskMonths: 'February to May'
    },
    cpcriReference: 'CPCRI Technical Guide - Stem Bleeding and Cracking in Arecanut & Coconut'
  },
  {
    id: 'healthy-palm',
    name: 'Healthy Arecanut Frond & Palm',
    scientificName: 'Areca catechu L. (Healthy)',
    kannadaName: 'ಆರೋಗ್ಯಕರ ಅಡಿಕೆ ಮರ ಮತ್ತು ಗರಿ',
    category: 'leaf',
    severity: 'Healthy',
    status: 'Healthy',
    confidenceDefault: 98.2,
    image: '/images/healthy-leaf.jpg',
    possibleCause: 'Optimal agronomic nutrition, balanced water management, and vigorous vegetative state',
    vectorOrPathogen: 'None (Healthy Crop Specimen)',
    description: 'The specimen displays optimal chlorophyll density, robust leaflet turgidity, clean rachis architecture, and absence of pathogenic foliar lesions or physiological chlorosis.',
    symptoms: [
      'Uniform deep emerald green coloration across all leaflets',
      'Crisp, clean leaf margins without necrosis, chlorosis, or brown spotting',
      'Strong, elastic rachis capable of supporting full photosynthetic activity',
      'Normal leaf emergence rate (6-8 new fronds per year in bearing palms)'
    ],
    causes: [
      'Balanced NPK nutrition (100g N : 40g P2O5 : 140g K2O per bearing palm)',
      'Adequate organic mulching and soil moisture retention',
      'Proper drainage preventing root suffocation and root rot',
      'Regular prophylactic phytosanitary inspection'
    ],
    prevention: [
      'Continue regular soil nutrient replenishment schedule',
      'Perform periodic weeding and organic mulching in the 1-meter basin',
      'Maintain summer drip irrigation at 16-20 Liters per palm per day'
    ],
    treatments: [
      {
        type: 'Cultural / Agronomic',
        title: 'Routine Maintenance Nutrition Schedule',
        dosage: 'NPK 100:40:140g + 12kg Farmyard Manure per tree',
        description: 'Apply 1st split in Sept/Oct with organic manure and 2nd split in Feb/March under irrigation.',
        timing: 'Semi-annual routine schedule'
      },
      {
        type: 'Organic / Bio-control',
        title: 'Green Manuring & Organic Mulch',
        dosage: 'Sunnhemp / Cowpea / Mucuna green manure crop in interspaces',
        description: 'Grow leguminous green manure crops in alleys and incorporate biomass into palm basins to boost soil organic carbon above 1.5%.',
        timing: 'Sown in May-June, incorporated in August-Sept'
      }
    ],
    favorableWeather: {
      tempRange: '22°C - 33°C',
      humidityRange: '60% - 85%',
      rainfallCondition: 'Moderate distributed rainfall with adequate drainage',
      highRiskMonths: 'Stable all year'
    },
    cpcriReference: 'Package of Practices for Arecanut - Directorate of Arecanut & Spices Development (DASD), Calicut'
  }
];
