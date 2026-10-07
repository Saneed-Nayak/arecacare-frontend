import React, { useEffect, useMemo, useState } from 'react';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Trees,
  TrendingUp,
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Eye,
  FileText,
  Plus,
  ArrowUpRight,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { ScanResult, Farm, ActiveView } from '../types';
import { MONTHLY_SCAN_STATS } from '../data/mockData';
import { Language, TRANSLATIONS } from '../lib/translations';

interface DashboardViewProps {
  scans: ScanResult[];
  farms: Farm[];
  setActiveView: (view: ActiveView) => void;
  onSelectScanForReport: (scan: ScanResult) => void;
  onOpenNewFarm: () => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scans,
  farms,
  setActiveView,
  onSelectScanForReport,
  onOpenNewFarm,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  // Live browser location + Open-Meteo weather
  const [liveWeather, setLiveWeather] = useState<{
    latitude: number;
    longitude: number;
    locationName: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    rainProbability: number;
    wind: number;
    condition: string;
    riskScore: number;
    riskLabel: 'Low' | 'Moderate' | 'High';
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
    if ([71, 73, 75, 77].includes(code)) return 'Snow';
    if ([80, 81, 82].includes(code)) return 'Rain Showers';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Variable Weather';
  };

  const loadLiveWeather = () => {
    if (!navigator.geolocation) {
      setWeatherError('Location is not supported by this browser.');
      setWeatherLoading(false);
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code` +
            `&hourly=precipitation_probability` +
            `&forecast_days=1&timezone=auto`;

          const response = await fetch(weatherUrl);
          if (!response.ok) throw new Error('Weather service unavailable.');

          const data = await response.json();
          const current = data.current;
          const probability = Number(data.hourly?.precipitation_probability?.[0] ?? 0);

          const humidity = Number(current.relative_humidity_2m ?? 0);
          const rainfall = Number(current.precipitation ?? 0);
          const temperature = Number(current.temperature_2m ?? 0);

          const humidityScore = Math.min(35, Math.max(0, (humidity - 55) * 0.9));
          const rainScore = Math.min(25, Math.max(0, rainfall * 2.5));
          const probabilityScore = Math.min(15, probability * 0.15);
          const temperatureScore =
            temperature >= 24 && temperature <= 30 ? 15 :
            temperature >= 20 && temperature <= 33 ? 7 : 0;

          const riskScore = Math.round(
            Math.min(100, humidityScore + rainScore + probabilityScore + temperatureScore)
          );

          const riskLabel =
            riskScore >= 70 ? 'High' :
            riskScore >= 40 ? 'Moderate' : 'Low';

          let locationName = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;

          try {
            const geoResponse = await fetch(
              `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
            );
            if (geoResponse.ok) {
              const geo = await geoResponse.json();
              const result = geo.results?.[0];
              if (result) {
                locationName =
                  result.name ||
                  result.city ||
                  result.town ||
                  result.village ||
                  locationName;
                if (result.admin1) locationName += `, ${result.admin1}`;
              }
            }
          } catch {
            // Keep coordinates if reverse geocoding is unavailable.
          }

          setLiveWeather({
            latitude,
            longitude,
            locationName,
            temperature,
            humidity,
            rainfall,
            rainProbability: probability,
            wind: Number(current.wind_speed_10m ?? 0),
            condition: getWeatherCondition(Number(current.weather_code ?? 0)),
            riskScore,
            riskLabel
          });
        } catch (error) {
          setWeatherError(
            error instanceof Error ? error.message : 'Unable to load live weather.'
          );
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        setWeatherLoading(false);
        setWeatherError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access to show live weather.'
            : 'Unable to access your current location.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    loadLiveWeather();
    const timer = window.setInterval(loadLiveWeather, 15 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const riskMessage = useMemo(() => {
    if (!liveWeather) return 'Waiting for live weather telemetry.';
    if (liveWeather.riskLabel === 'High') {
      return `Humidity (${Math.round(liveWeather.humidity)}%) and current rainfall conditions are favorable for disease development. Increase field monitoring.`;
    }
    if (liveWeather.riskLabel === 'Moderate') {
      return `Current humidity (${Math.round(liveWeather.humidity)}%) and rain probability (${Math.round(liveWeather.rainProbability)}%) indicate moderate disease pressure.`;
    }
    return `Current weather conditions indicate relatively low environmental disease pressure. Continue routine monitoring.`;
  }, [liveWeather]);


  // Derive counts from actual scans state
  const totalScans = scans.length;
  const healthyScans = scans.filter((s) => s.status === 'Healthy').length;
  const diseasedScans = scans.filter((s) => s.status === 'Diseased').length;
  const activeFarmsCount = farms.length;

  // Selected chart hover point
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0D3B24] tracking-tight">
              Farm Health Dashboard
            </h1>
            <span className="text-[10px] font-mono bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold uppercase border border-[#176B3A]/20">
              Live Monitoring
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#66736A] mt-1">
            Real-time pathological surveillance & agronomic risk analytics for coastal Karnataka
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenNewFarm}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#0D3B24] border border-gray-300 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#176B3A]" />
            <span className="hidden sm:inline">Add Farm</span>
          </button>
          <button
            onClick={() => setActiveView('scan')}
            className="flex items-center gap-2 bg-[#176B3A] hover:bg-[#0D3B24] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <ScanLine className="w-4 h-4" />
            <span>{t.btnScanPlant}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Total Scans */}
        <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-[#66736A] uppercase tracking-wider">
              {t.totalScans}
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#FAFBF8] text-[#176B3A] border border-gray-100">
              <ScanLine className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B24]">
              {totalScans}
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#176B3A] hidden sm:flex items-center">
              +4 this week
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#66736A]">
            Multi-organ diagnosis
          </div>
        </div>

        {/* Healthy Plants */}
        <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-[#66736A] uppercase tracking-wider">
              {t.healthyPlants}
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#EAF5EC] text-[#176B3A]">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#176B3A]">
              {healthyScans}
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#176B3A] bg-[#EAF5EC] px-1.5 sm:px-2 py-0.5 rounded">
              {totalScans > 0 ? Math.round((healthyScans / totalScans) * 100) : 67}%
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#66736A]">
            Optimal vigor
          </div>
        </div>

        {/* Diseased Plants */}
        <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-[#66736A] uppercase tracking-wider">
              {t.diseasedPlants}
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-[#D9534F]">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#D9534F]">
              {diseasedScans}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#E6A23C] bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded">
              Advisory
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#66736A]">
            Treatment active
          </div>
        </div>

        {/* Active Farms */}
        <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 sm:space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-[#66736A] uppercase tracking-wider">
              {t.activeFarms}
            </span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#EAF5EC] text-[#0D3B24]">
              <Trees className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B24]">
              {activeFarmsCount}
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#66736A]">
              2,690 Palms
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#66736A]">
            Udupi district
          </div>
        </div>
      </div>

      {/* Middle Row: Scan Overview Chart & Weather Risk Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Scan Overview Chart (Jan - Sep 2026) */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0D3B24]">
                Scan Overview — Healthy vs Diseased (Jan–Sep 2026)
              </h3>
              <p className="text-[11px] sm:text-xs text-[#66736A]">
                Seasonal disease trends showing monsoon peak
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#176B3A]"></span>
                <span className="text-[#17231B]">Healthy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D9534F]"></span>
                <span className="text-[#17231B]">Diseased</span>
              </div>
            </div>
          </div>

          {/* SVG Interactive Chart */}
          <div className="relative pt-4 pb-2">
            <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
              {MONTHLY_SCAN_STATS.map((item, idx) => {
                const maxVal = 28;
                const healthyHeight = (item.healthy / maxVal) * 100;
                const diseasedHeight = (item.diseased / maxVal) * 100;
                const isHovered = hoveredMonth === idx;

                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-[#0D3B24] text-white text-[11px] p-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn">
                        <div className="font-bold">{item.month} 2026</div>
                        <div className="text-emerald-300">Healthy: {item.healthy}</div>
                        <div className="text-red-300">Diseased: {item.diseased}</div>
                      </div>
                    )}

                    {/* Dual Bars */}
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-[85%]">
                      {/* Healthy Bar */}
                      <div
                        style={{ height: `${healthyHeight}%` }}
                        className="w-1/2 bg-[#176B3A] rounded-t-sm transition-all duration-300 group-hover:bg-[#0D3B24]"
                      ></div>
                      {/* Diseased Bar */}
                      <div
                        style={{ height: `${diseasedHeight}%` }}
                        className="w-1/2 bg-[#D9534F] rounded-t-sm transition-all duration-300 group-hover:bg-[#b83834]"
                      ></div>
                    </div>

                    {/* Month Label */}
                    <div className="mt-2 text-[11px] font-medium text-[#66736A] group-hover:text-[#0D3B24]">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid baseline */}
            <div className="w-full border-b border-gray-200 mt-1"></div>
            <div className="flex justify-between text-[10px] text-[#66736A] pt-2 px-2">
              <span>Low Disease Phase (Winter/Summer)</span>
              <span className="font-semibold text-amber-700">Monsoon Koleroga Outbreak Window</span>
              <span>Post-Monsoon Recovery</span>
            </div>
          </div>
        </div>

        {/* Live Weather & Disease Risk Card */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 sm:space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#176B3A] shrink-0" />
                <span className="font-bold text-sm text-[#0D3B24] truncate">
                  {weatherLoading ? 'Detecting location…' : liveWeather?.locationName || 'Live Location'}
                </span>
              </div>
              <button
                onClick={loadLiveWeather}
                disabled={weatherLoading}
                title="Refresh live weather"
                className="p-1.5 rounded-lg hover:bg-[#EAF5EC] text-[#176B3A] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {weatherError ? (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {weatherError}
                <button
                  onClick={loadLiveWeather}
                  className="block mt-2 font-bold underline"
                >
                  Try again
                </button>
              </div>
            ) : liveWeather ? (
              <>
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-extrabold text-[#0D3B24] tracking-tight">
                      {Math.round(liveWeather.temperature)}°C
                    </div>
                    <div className="text-xs font-semibold text-[#66736A] mt-0.5">
                      {liveWeather.condition}
                    </div>
                    <div className="text-[10px] text-[#66736A] mt-1">
                      {liveWeather.latitude.toFixed(3)}, {liveWeather.longitude.toFixed(3)}
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF5EC] flex items-center justify-center text-[#176B3A]">
                    <CloudSun className="w-8 h-8" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#FAFBF8] p-3 rounded-xl border border-gray-100 text-center text-xs">
                  <div className="space-y-0.5">
                    <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                      <Droplets className="w-3 h-3 text-[#176B3A]" />
                      <span>Humidity</span>
                    </div>
                    <div className="font-bold text-[#17231B]">{Math.round(liveWeather.humidity)}%</div>
                  </div>
                  <div className="space-y-0.5 border-x border-gray-200">
                    <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                      <CloudRain className="w-3 h-3 text-[#176B3A]" />
                      <span>Rain</span>
                    </div>
                    <div className="font-bold text-[#17231B]">
                      {liveWeather.rainfall.toFixed(1)} mm
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                      <Wind className="w-3 h-3 text-[#176B3A]" />
                      <span>Wind</span>
                    </div>
                    <div className="font-bold text-[#17231B]">
                      {Math.round(liveWeather.wind)} km/h
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-3.5 rounded-xl border space-y-1.5 ${
                  liveWeather.riskLabel === 'High'
                    ? 'bg-red-50 border-red-200'
                    : liveWeather.riskLabel === 'Moderate'
                      ? 'bg-amber-50 border-amber-200/80'
                      : 'bg-[#EAF5EC] border-[#176B3A]/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17231B] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        liveWeather.riskLabel === 'High'
                          ? 'bg-[#D9534F]'
                          : liveWeather.riskLabel === 'Moderate'
                            ? 'bg-[#E6A23C]'
                            : 'bg-[#176B3A]'
                      }`} />
                      Disease Risk: {liveWeather.riskLabel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-white/70 px-2 py-0.5 rounded">
                      {liveWeather.riskScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66736A] leading-relaxed">
                    {riskMessage}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-xs text-[#66736A]">
                Waiting for live location and weather…
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveView('weather')}
            className="w-full bg-[#FAFBF8] hover:bg-[#EAF5EC] text-[#176B3A] border border-[#176B3A]/20 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View 7-Day Outbreak Forecast</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Scans Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#0D3B24]">
              {t.recentScans}
            </h3>
            <p className="text-xs text-[#66736A]">
              Latest multi-organ diagnostic records from registered arecanut plots
            </p>
          </div>

          <button
            onClick={() => setActiveView('history')}
            className="text-xs font-bold text-[#176B3A] hover:text-[#0D3B24] flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Scan History ({totalScans})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAFBF8] border-b border-gray-200 text-[#66736A] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Disease / Condition</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scans.slice(0, 5).map((scan) => (
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

                  {/* Disease Name & Organ */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#17231B] text-xs sm:text-sm">
                      {scan.diseaseName}
                    </div>
                    <div className="text-[11px] text-[#66736A] capitalize">
                      {scan.plantPart} Specimen • {scan.farmName}
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
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

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectScanForReport(scan)}
                      className="inline-flex items-center gap-1 bg-[#FAFBF8] hover:bg-[#EAF5EC] text-[#0D3B24] border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#176B3A]" />
                      <span>Report</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
