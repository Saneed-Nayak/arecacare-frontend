import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  Gauge,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface WeatherRiskViewProps {
  lang: Language;
}

type LiveLocation = {
  latitude: number;
  longitude: number;
  city: string;
  locality: string;
  region: string;
  country: string;
};

type LiveWeather = {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    precipitation: number;
    wind: number;
    weatherCode: number;
    time: string;
  };
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    precipitationProbability: number;
    weatherCode: number;
    humidityMax: number;
  }>;
};

const weatherDescription = (code: number) => {
  if (code === 0) return 'Clear Sky';
  if ([1, 2].includes(code)) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55].includes(code)) return 'Drizzle';
  if ([61, 63, 65].includes(code)) return 'Rain';
  if ([66, 67].includes(code)) return 'Freezing Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain Showers';
  if ([85, 86].includes(code)) return 'Snow Showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Variable Conditions';
};

const weatherIcon = (code: number) => {
  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return CloudRain;
  }
  if ([0].includes(code)) return Sun;
  return CloudSun;
};

/*
 * Environmental susceptibility index.
 * This is NOT a disease diagnosis. It combines live humidity, rain,
 * precipitation probability, temperature and recent wetness proxy.
 */
const calculateRisk = (
  temperature: number,
  humidity: number,
  rainfall: number,
  precipitationProbability = 0
) => {
  const humidityScore = Math.min(35, Math.max(0, (humidity - 55) * 0.9));
  const rainScore = Math.min(25, rainfall * 2.5);
  const probabilityScore = Math.min(15, precipitationProbability * 0.15);
  const temperatureScore =
    temperature >= 24 && temperature <= 30 ? 15 : 7;

  return Math.round(
    Math.min(100, humidityScore + rainScore + probabilityScore + temperatureScore)
  );
};

const riskLabel = (score: number) => {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
};

const formatTime = (iso: string, timezone: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: timezone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const formatDay = (date: string) => {
  const d = new Date(`${date}T12:00:00`);
  return {
    day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    date: d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    }),
  };
};

const reverseGeocode = async (latitude: number, longitude: number): Promise<LiveLocation> => {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}` +
    `&longitude=${longitude}&localityLanguage=en`;

  const response = await fetch(url);
  if (!response.ok) {
    return {
      latitude,
      longitude,
      city: '',
      locality: '',
      region: '',
      country: 'India',
    };
  }

  const data = await response.json();

  return {
    latitude,
    longitude,
    city: data.city || data.localityInfo?.administrative?.[2]?.name || '',
    locality: data.locality || data.localityInfo?.administrative?.[3]?.name || '',
    region: data.principalSubdivision || '',
    country: data.countryName || 'India',
  };
};

const fetchWeatherAtLocation = async (latitude: number, longitude: number): Promise<LiveWeather> => {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,relative_humidity_2m_max` +
    `&forecast_days=7&timezone=auto`;

  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error('Live weather service is unavailable right now.');
  }

  const data = await response.json();

  return {
    latitude: Number(data.latitude ?? latitude),
    longitude: Number(data.longitude ?? longitude),
    timezone: data.timezone || 'auto',
    elevation: Number(data.elevation ?? 0),
    current: {
      temperature: Number(data.current.temperature_2m),
      humidity: Number(data.current.relative_humidity_2m),
      rainfall: Number(data.current.rain ?? 0),
      precipitation: Number(data.current.precipitation ?? 0),
      wind: Number(data.current.wind_speed_10m),
      weatherCode: Number(data.current.weather_code),
      time: data.current.time,
    },
    daily: (data.daily?.time ?? []).map((date: string, i: number) => ({
      date,
      tempMax: Number(data.daily.temperature_2m_max?.[i] ?? 0),
      tempMin: Number(data.daily.temperature_2m_min?.[i] ?? 0),
      precipitation: Number(data.daily.precipitation_sum?.[i] ?? 0),
      precipitationProbability: Number(data.daily.precipitation_probability_max?.[i] ?? 0),
      weatherCode: Number(data.daily.weather_code?.[i] ?? 0),
      humidityMax: Number(data.daily.relative_humidity_2m_max?.[i] ?? 0),
    })),
  };
};

const getBrowserLocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Live location is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Location permission was denied. Please allow location access in your browser.'));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Your live location is currently unavailable. Check GPS/Wi-Fi and try again.'));
        } else {
          reject(new Error('Could not get your live location. Please try again.'));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });

export const WeatherRiskView: React.FC<WeatherRiskViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const position = await getBrowserLocation();
      const { latitude, longitude } = position.coords;

      const [place, result] = await Promise.all([
        reverseGeocode(latitude, longitude),
        fetchWeatherAtLocation(latitude, longitude),
      ]);

      setLocation(place);
      setWeather(result);
    } catch (err) {
      console.error('Live location/weather error:', err);
      setError(err instanceof Error ? err.message : 'Could not load your live location and weather.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
    const timer = window.setInterval(() => loadWeather(true), 15 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [loadWeather]);

  const current = weather?.current;

  const currentRiskScore = current
    ? calculateRisk(
        current.temperature,
        current.humidity,
        current.rainfall,
        weather?.daily?.[0]?.precipitationProbability ?? 0
      )
    : 0;

  const currentRisk = riskLabel(currentRiskScore);

  const riskColor =
    currentRisk === 'High'
      ? '#D9534F'
      : currentRisk === 'Moderate'
      ? '#E6A23C'
      : '#176B3A';

  const riskFactors = current
    ? [
        {
          label: 'Atmospheric humidity',
          value: `${current.humidity}%`,
          note:
            current.humidity >= 75
              ? 'High environmental moisture'
              : 'Within lower-risk range',
          active: current.humidity >= 75,
        },
        {
          label: 'Current rainfall',
          value: `${current.rainfall.toFixed(1)} mm`,
          note:
            current.rainfall >= 3
              ? 'Recent surface moisture'
              : 'Limited current rainfall',
          active: current.rainfall >= 3,
        },
        {
          label: 'Rain probability',
          value: `${weather?.daily?.[0]?.precipitationProbability ?? 0}%`,
          note:
            (weather?.daily?.[0]?.precipitationProbability ?? 0) >= 60
              ? 'Rain likely today'
              : 'Lower rain probability',
          active:
            (weather?.daily?.[0]?.precipitationProbability ?? 0) >= 60,
        },
        {
          label: 'Temperature',
          value: `${current.temperature.toFixed(1)}°C`,
          note:
            current.temperature >= 24 && current.temperature <= 30
              ? 'Favourable environmental window'
              : 'Outside the selected window',
          active: current.temperature >= 24 && current.temperature <= 30,
        },
      ]
    : [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B3A] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#176B3A]/20">
            Micro-Climatic Pathology Predictive Model
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D3B24] tracking-tight mt-2">
            Weather & Disease Risk
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A] mt-1 max-w-2xl">
            Real-time agro-meteorological station telemetry and 7-day fungal
            outbreak susceptibility index.
          </p>
        </div>

        {/* Live browser location */}
        <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl border border-gray-200 shadow-sm max-w-full">
          <MapPin className="w-4 h-4 text-[#176B3A] shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#176B3A]">Live Location</div>
            <div className="text-xs font-semibold text-[#17231B] truncate">
              {location
                ? [location.locality, location.city, location.region].filter(Boolean).join(', ') || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : 'Requesting location…'}
            </div>
          </div>
        </div>
      </div>

      {/* Live location status strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#66736A] bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <span className="inline-flex items-center gap-2 font-semibold text-[#0D3B24]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#176B3A] animate-pulse" />
          Live location online
        </span>
        <span>Current device coordinates</span>
        <span className="hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Last telemetry: {weather ? formatTime(current?.time ?? '', weather.timezone) : 'Loading live data…'}
        </span>
        <span className="hidden md:inline">•</span>
        <span>Live API refresh: 15 min</span>
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error} Showing the last available state until the connection is restored.</span>
          </div>
          <button
            type="button"
            onClick={() => loadWeather(true)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-red-200 font-semibold hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => loadWeather(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-[#176B3A] shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          {refreshing ? 'Updating live weather…' : 'Refresh weather'}
        </button>
      </div>

      {/* Current location + risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B3A] animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#0D3B24]">
                Current Field Station Telemetry
              </span>
            </div>
            <span className="text-[11px] text-[#66736A]">
              {weather ? formatTime(current?.time ?? '', weather.timezone) : 'Loading live data…'}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between gap-5">
            <div>
              <div className="text-5xl font-extrabold text-[#0D3B24] tracking-tight">
                {current ? `${current.temperature.toFixed(1)}°C` : '—'}
              </div>
              <div className="text-sm font-semibold text-[#66736A] mt-1">
                {current ? weatherDescription(current.weatherCode) : 'Loading…'}
              </div>
              <div className="text-xs text-[#176B3A] font-medium mt-1">
                {location ? `${[location.locality, location.city, location.region].filter(Boolean).join(', ') || 'Current location'} • ${weather ? `${weather.latitude.toFixed(4)}, ${weather.longitude.toFixed(4)}` : 'Loading weather…'}` : 'Locating…'}
              </div>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-[#EAF5EC] flex items-center justify-center text-[#176B3A] shadow-inner">
              {(current?.rainfall ?? 0) >= 4 ? (
                <CloudRain className="w-12 h-12" />
              ) : current?.weatherCode === 1 || current?.weatherCode === 2 ? (
                <CloudSun className="w-12 h-12" />
              ) : (
                <Sun className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Sensor cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFBF8] p-4 rounded-2xl border border-gray-100 text-center">
            <div className="space-y-1">
              <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-[#176B3A]" />
                Humidity
              </div>
              <div className="text-lg font-bold text-[#17231B]">
                {current ? `${current.humidity}%` : '—'}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold">
                {current && current.humidity >= 75 ? 'Elevated' : 'Normal'}
              </div>
            </div>

            <div className="space-y-1 sm:border-l sm:border-gray-200">
              <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                <CloudRain className="w-3.5 h-3.5 text-[#176B3A]" />
                Rainfall
              </div>
              <div className="text-lg font-bold text-[#17231B]">
                {current ? `${current.rainfall.toFixed(1)} mm` : '—'}
              </div>
              <div className="text-[10px] text-[#66736A]">
                {(current?.rainfall ?? 0) >= 4 ? 'Active rain' : 'Light showers'}
              </div>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
              <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                <Wind className="w-3.5 h-3.5 text-[#176B3A]" />
                Wind Speed
              </div>
              <div className="text-lg font-bold text-[#17231B]">
                {current ? `${current.wind.toFixed(1)} km/h` : '—'}
              </div>
              <div className="text-[10px] text-[#66736A]">Gentle breeze</div>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
              <div className="text-[#66736A] flex items-center justify-center gap-1 text-[11px]">
                <Thermometer className="w-3.5 h-3.5 text-[#176B3A]" />
                Rain Probability
              </div>
              <div className="text-lg font-bold text-[#17231B]">
                {weather ? `${weather.daily[0]?.precipitationProbability ?? 0}%` : '—'}
              </div>
              <div className="text-[10px] text-[#66736A] font-semibold">
                Today
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-[11px] text-[#66736A] italic">
            <span>Live weather data refreshes automatically every 15 minutes.</span>
            <span className="not-italic font-semibold text-[#176B3A]">
              {location ? [location.city, location.region].filter(Boolean).join(', ') || 'Current location' : 'Current location'}
            </span>
          </div>
        </div>

        {/* Disease Risk */}
        <div className="lg:col-span-6 bg-[#0D3B24] text-white p-6 rounded-3xl shadow-lg space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase bg-[#176B3A] text-[#EAF5EC] px-3 py-1 rounded-full font-bold">
              Epidemiological Alert
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{ color: currentRisk === 'High' ? '#FCD34D' : '#A7F3D0' }}
            >
              {currentRisk === 'High' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {currentRisk === 'High' ? 'Action Required' : 'Monitor'}
            </span>
          </div>

          <div>
            <div className="text-xs text-[#EAF5EC]/70 uppercase tracking-wider font-semibold">
              Current Outbreak Vulnerability
            </div>
            <div className="flex items-end justify-between gap-4 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAFBF8]">
                {currentRisk} Disease Risk
              </h2>
              <div className="text-right">
                <div className="text-3xl font-extrabold">{currentRiskScore}%</div>
                <div className="text-[10px] text-[#EAF5EC]/60 uppercase">
                  Susceptibility
                </div>
              </div>
            </div>
          </div>

          {/* Risk gauge */}
          <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-[#4FAF68]">Low 0–39%</span>
              <span className="text-[#E6A23C]">Moderate 40–69%</span>
              <span className="text-red-400">High 70–100%</span>
            </div>
            <div className="relative w-full h-3 bg-white/15 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 opacity-80" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2"
                style={{
                  left: `calc(${Math.min(currentRiskScore, 98)}% - 8px)`,
                  borderColor: riskColor,
                }}
              />
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#4FAF68]">
              Key Meteorological Factors
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {riskFactors.map((factor) => (
                <div
                  key={factor.label}
                  className="flex items-start gap-2 rounded-xl bg-black/15 border border-white/10 p-2.5"
                >
                  {factor.active ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAF68] shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-[#A7F3D0] shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-white">
                      {factor.label}: {factor.value}
                    </div>
                    <div className="text-[10px] text-[#EAF5EC]/65 mt-0.5">
                      {factor.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-[11px] text-[#EAF5EC]/80 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              The susceptibility score describes environmental disease pressure.
              It does <strong>not</strong> confirm infection in an individual
              palm without visual or AI-assisted scanning.
            </p>
          </div>
        </div>
      </div>

      {/* Risk summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Gauge className="w-5 h-5 text-[#176B3A]" />
            <span className="text-[10px] font-bold uppercase text-[#66736A]">
              Risk Index
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0D3B24] mt-2">
            {currentRiskScore}%
          </div>
          <div className="text-[10px] text-[#66736A] mt-1">
            Current environmental pressure
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Droplets className="w-5 h-5 text-[#176B3A]" />
            <span className="text-[10px] font-bold uppercase text-[#66736A]">
              Humidity
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0D3B24] mt-2">
            {current ? `${current.humidity}%` : '—'}
          </div>
          <div className="text-[10px] text-[#66736A] mt-1">
            Relative humidity
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <CloudRain className="w-5 h-5 text-[#176B3A]" />
            <span className="text-[10px] font-bold uppercase text-[#66736A]">
              Rainfall
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0D3B24] mt-2">
            {current ? `${current.rainfall.toFixed(1)} mm` : '—'}
          </div>
          <div className="text-[10px] text-[#66736A] mt-1">
            Recent precipitation
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-[#176B3A]" />
            <span className="text-[10px] font-bold uppercase text-[#66736A]">
              7-Day View
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0D3B24] mt-2">
            {weather ? weather.daily.filter((d) => riskLabel(calculateRisk((d.tempMax + d.tempMin) / 2, d.humidityMax, d.precipitation, d.precipitationProbability)) === 'High').length : '—'}
          </div>
          <div className="text-[10px] text-[#66736A] mt-1">
            High-risk forecast days
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#176B3A]" />
              <h3 className="text-lg font-bold text-[#0D3B24]">
                7-Day Weather & Disease Outbreak Forecast
              </h3>
            </div>
            <p className="text-xs text-[#66736A] mt-1">
              Environmental susceptibility projection for field planning,
              drainage and disease monitoring.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold bg-[#FAFBF8] text-[#176B3A] px-3 py-1.5 rounded-xl border border-gray-200">
            Live 7-day forecast
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {loading && !weather ? (
            <div className="lg:col-span-7 flex items-center justify-center py-10 text-sm text-[#66736A]">
              <RefreshCw className="w-4 h-4 animate-spin mr-2 text-[#176B3A]" />
              Loading live 7-day forecast…
            </div>
          ) : weather?.daily?.map((day, idx) => {
            const score = calculateRisk(
              (day.tempMax + day.tempMin) / 2,
              day.humidityMax,
              day.precipitation,
              day.precipitationProbability
            );
            const risk = riskLabel(score);
            const isHigh = risk === 'High';
            const isModerate = risk === 'Moderate';
            const parts = formatDay(day.date);
            const Icon = weatherIcon(day.weatherCode);

            return (
              <div
                key={day.date}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  idx === 0
                    ? 'bg-[#EAF5EC]/60 border-[#176B3A]/40 shadow-sm'
                    : 'bg-[#FAFBF8] border-gray-200 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="font-bold text-xs text-[#0D3B24]">
                    {idx === 0 ? 'Today' : parts.day}
                  </div>
                  <div className="text-[10px] text-[#66736A]">{parts.date}</div>
                </div>

                <div className="text-center py-2">
                  <div className="w-11 h-11 rounded-xl bg-white shadow-sm mx-auto flex items-center justify-center text-[#176B3A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-sm text-[#17231B] mt-2">
                    {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                  </div>
                  <div className="text-[10px] text-[#66736A] mt-0.5">
                    {Math.round(day.humidityMax)}% RH • {day.precipitation.toFixed(1)} mm
                  </div>
                  <div className="text-[9px] text-[#66736A] mt-1">
                    Rain {Math.round(day.precipitationProbability)}%
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isHigh
                        ? 'bg-[#D9534F] text-white'
                        : isModerate
                        ? 'bg-[#E6A23C] text-white'
                        : 'bg-[#176B3A] text-white'
                    }`}
                  >
                    {risk} Risk • {score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Forecast legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] text-[#66736A]">
          <span className="font-semibold text-[#17231B]">Risk legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#176B3A]" />
            Low
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6A23C]" />
            Moderate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" />
            High
          </span>
        </div>
      </div>
    </div>
  );
};
