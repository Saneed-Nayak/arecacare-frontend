import React from 'react';
import {
  ScanLine,
  BookOpen,
  CloudSunRain,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Trees,
  Cpu,
  BarChart3,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ActiveView } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { ARECANUT_DISEASES } from '../data/diseases';

interface LandingViewProps {
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  onOpenViva: () => void;
  onOpenAgriAi: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  setActiveView,
  lang,
  onOpenViva,
  onOpenAgriAi
}) => {
  const t = TRANSLATIONS[lang];

  const features = [
    {
      icon: ScanLine,
      title: 'AI Disease Detection',
      description: 'Instant multi-organ diagnosis (Leaf, Nut, Trunk) powered by deep ResNet-50 vision model with 96.2% diagnostic accuracy.'
    },
    {
      icon: BookOpen,
      title: 'Disease Library',
      description: 'Comprehensive botanical knowledge base for Yellow Leaf Disease, Mahali, Bud Rot, Leaf Spot, and Stem Bleeding.'
    },
    {
      icon: CloudSunRain,
      title: 'Weather & Risk Forecasting',
      description: 'Micro-climatic correlation engine predicting fungal spore outbreaks based on relative humidity, rainfall, and canopy wetness.'
    },
    {
      icon: Bot,
      title: 'Smart Farm Advisory',
      description: 'Actionable agronomic guidance detailing Bordeaux mixture preparation, bio-control inoculants, and split fertilizer schedules.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Image',
      desc: 'Capture or upload clear photos of arecanut leaves, nut bunches, or trunk fissures.'
    },
    {
      step: '02',
      title: 'AI Analysis',
      desc: 'Deep convolutional neural network applies CLAHE filtering & feature extraction.'
    },
    {
      step: '03',
      title: 'Disease Detect',
      desc: 'Instant pathogen classification with confidence score and Grad-CAM visual attention map.'
    },
    {
      step: '04',
      title: 'Get Guidance',
      desc: 'Receive ICAR-CPCRI standard chemical, biological, and cultural treatment recommendations.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 pb-12 sm:pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 sm:pt-6 lg:pt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#EAF5EC] border border-[#176B3A]/20 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#176B3A] animate-pulse"></span>
                <span className="text-[10px] sm:text-xs font-bold text-[#176B3A] uppercase tracking-wider">
                  AI-Powered Agriculture
                </span>
                <span className="hidden sm:inline text-[11px] text-[#66736A] font-medium border-l border-[#176B3A]/20 pl-2">
                  CSE Data Science Project
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#0D3B24] tracking-tight leading-[1.15]">
                Protect Your <span className="text-[#176B3A] underline decoration-[#4FAF68]/50 underline-offset-4 sm:underline-offset-8">Arecanut</span> Plants with AI
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-[#66736A] leading-relaxed max-w-2xl">
                Detect diseases early, understand symptoms, and get smart farming guidance using image-based AI analysis. Designed for farmers, agricultural officers, and plant researchers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => setActiveView('scan')}
                  className="flex items-center gap-2 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ScanLine className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Scan Plant →</span>
                </button>

                <button
                  onClick={() => setActiveView('library')}
                  className="flex items-center gap-2 bg-[#FAFBF8] hover:bg-white text-[#0D3B24] border border-gray-300 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-semibold transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#176B3A]" />
                  <span>Explore Diseases</span>
                </button>
              </div>

              {/* Trust & Academic Validation Points */}
              <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[10px] sm:text-xs text-[#66736A] border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#176B3A]" />
                  <span>96.2% CNN Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#176B3A]" />
                  <span>Grad-CAM Explainability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#176B3A]" />
                  <span>CPCRI Protocol Standards</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Arecanut Plantation & Live Scan Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 aspect-4/3 sm:aspect-5/4 group">
                <img
                  src="/images/areca-hero.jpg"
                  alt="Arecanut plantation in Karnataka"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Floating Scan Result Card overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#176B3A] animate-ping"></span>
                      <span className="text-xs font-bold text-[#0D3B24]">Real-time AI Diagnosis</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded">
                      94.6% Confidence
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#17231B]">Yellow Leaf Disease (YLD)</div>
                      <div className="text-[11px] text-[#66736A]">Phytoplasma-associated • High Severity</div>
                    </div>
                    <button
                      onClick={() => setActiveView('scan')}
                      className="bg-[#176B3A] text-white px-3 py-1.5 rounded-xl font-semibold text-[11px] hover:bg-[#0D3B24] transition-all cursor-pointer"
                    >
                      Try Scan
                    </button>
                  </div>
                </div>

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-[#0D3B24]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/15 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4FAF68]" />
                  <span>Udupi & Western Ghats Zone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#0D3B24] tracking-tight">12,450+</div>
            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#17231B]">Training Images</div>
            <div className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#66736A]">Annotated dataset</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#176B3A] tracking-tight">96.2%</div>
            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#17231B]">Classification Accuracy</div>
            <div className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#66736A]">ResNet-50 Model</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#0D3B24] tracking-tight">6 Key</div>
            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#17231B]">Arecanut Conditions</div>
            <div className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#66736A]">Pathologies</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#176B3A] tracking-tight">142 ms</div>
            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-[#17231B]">Inference Latency</div>
            <div className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#66736A]">Edge optimized</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#176B3A]">System Capabilities</div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#0D3B24] tracking-tight">
            Comprehensive Plant Health & Smart Farm Suite
          </h2>
          <p className="text-xs sm:text-sm text-[#66736A]">
            Built with computer vision algorithms, micro-climate weather analysis, and ICAR-CPCRI agronomic guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EC] text-[#176B3A] flex items-center justify-center group-hover:bg-[#176B3A] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#17231B]">{f.title}</h3>
                <p className="text-xs text-[#66736A] leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#176B3A]">Simple 4-Step Process</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight">
            How ArecaCare AI Works
          </h2>
          <p className="text-sm text-[#66736A]">
            From field photograph to precision treatment advisory in less than 3 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-[#FAFBF8] p-6 rounded-2xl border border-gray-200 space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-black text-[#176B3A]/25">{st.step}</div>
              <h3 className="font-bold text-base text-[#0D3B24]">{st.title}</h3>
              <p className="text-xs text-[#66736A] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disease Library Preview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#176B3A]">Pathology Catalog</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B24]">
              Common Arecanut Palm Diseases
            </h2>
            <p className="text-xs text-[#66736A]">
              Photographic identification and treatment protocols validated for coastal Karnataka & Kerala.
            </p>
          </div>

          <button
            onClick={() => setActiveView('library')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#176B3A] hover:text-[#0D3B24] transition-colors cursor-pointer"
          >
            <span>View All Disease Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARECANUT_DISEASES.slice(0, 3).map((dis) => (
            <div
              key={dis.id}
              onClick={() => setActiveView('library')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-16/10 relative overflow-hidden bg-gray-100">
                <img
                  src={dis.image}
                  alt={dis.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                  dis.severity === 'High' ? 'bg-[#D9534F] text-white' :
                  dis.severity === 'Medium' ? 'bg-[#E6A23C] text-white' : 'bg-[#176B3A] text-white'
                }`}>
                  {dis.severity} Severity
                </span>
                <span className="absolute bottom-3 left-3 bg-[#0D3B24]/85 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                  {dis.category} Specimen
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="font-bold text-base text-[#17231B] group-hover:text-[#176B3A] transition-colors">
                  {dis.name}
                </h3>
                <p className="text-xs text-[#66736A] line-clamp-2 leading-relaxed">
                  {dis.description}
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#176B3A] font-semibold">
                  <span>View Clinical Advisory →</span>
                  <span className="text-[11px] font-mono text-[#66736A]">90%+ Accuracy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D3B24] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase bg-[#176B3A] text-[#EAF5EC] px-3 py-1 rounded-full font-bold">
              Autonomous Crop Health Protection
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Scan Your Arecanut Plantation?
            </h2>
            <p className="text-sm text-[#EAF5EC]/80 leading-relaxed">
              Upload an image of a leaf, nut, trunk or bud now to see real-time disease detection with Grad-CAM heatmap explainability.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveView('scan')}
                className="bg-[#4FAF68] hover:bg-[#3e9354] text-[#0D3B24] font-bold px-7 py-3.5 rounded-2xl text-sm sm:text-base transition-all shadow-lg cursor-pointer transform hover:scale-105"
              >
                Launch Plant Scanner →
              </button>
              <button
                onClick={onOpenViva}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all border border-white/20 cursor-pointer"
              >
                View Final Year Project Dossier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-gray-200 text-xs text-[#66736A]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="space-y-2">
            <div className="font-extrabold text-base text-[#0D3B24]">ArecaCare AI</div>
            <p className="text-[11px] leading-relaxed">
              AI-Based Arecanut Plant Disease Detection & Smart Farm Advisory System. Final Year CSE Data Science Project.
            </p>
          </div>
          <div>
            <div className="font-bold text-[#17231B] mb-2 uppercase text-[10px] tracking-wider">Features</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveView('scan')} className="hover:text-[#176B3A]">AI Plant Scan</button></li>
              <li><button onClick={() => setActiveView('library')} className="hover:text-[#176B3A]">Disease Library</button></li>
              <li><button onClick={() => setActiveView('weather')} className="hover:text-[#176B3A]">Weather & Risk</button></li>
              <li><button onClick={() => setActiveView('farms')} className="hover:text-[#176B3A]">My Farms</button></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#17231B] mb-2 uppercase text-[10px] tracking-wider">Research References</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>ICAR - CPCRI Kasaragod & Vittal</li>
              <li>University of Agricultural Sciences, Shivamogga</li>
              <li>PyTorch & Grad-CAM Explainability</li>
              <li>Western Ghats Agro-Climatic Data</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#17231B] mb-2 uppercase text-[10px] tracking-wider">Academic Details</div>
            <p className="text-[11px] leading-relaxed">
              B.E. Computer Science & Engineering (Data Science). Prepared for final-year project viva, academic evaluation, and smart agriculture integration.
            </p>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
          <div>© 2026 ArecaCare AI • Precision Agriculture Data Science System</div>
          <div>Built with React 19, TypeScript & Tailwind CSS</div>
        </div>
      </footer>
    </div>
  );
};
