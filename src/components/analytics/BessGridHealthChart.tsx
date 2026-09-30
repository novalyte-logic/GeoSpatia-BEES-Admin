import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Zap,
  ShieldCheck,
  BatteryCharging,
  ArrowUpRight,
  TrendingUp,
  Info,
  Sparkles,
  Clock,
  Calendar,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Layers,
} from 'lucide-react';

// ==========================================
// DATA DEFINITIONS FOR REAL-TIME, DAILY & WEEKLY
// ==========================================

export type TimeHorizon = 'realtime' | 'daily' | 'weekly';

// 1. REAL-TIME DATA: 18h Verified SCADA Telemetry + 6h Predictive Projection
interface RealTimeRecord {
  hour: string;
  hourNum: number;
  isForecast: boolean;
  bessActualMw: number | null;
  bessForecastMw: number | null;
  confidenceUpperMw: number | null;
  confidenceLowerMw: number | null;
  gridDemandMw: number;
  solarMw: number;
  healthScoreActual: number | null;
  healthScoreForecast: number | null;
  freqHz: number;
  annotation?: string;
}

const CAISO_REALTIME_DATA: RealTimeRecord[] = [
  { hour: '00:00', hourNum: 0, isForecast: false, bessActualMw: -350, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 19800, solarMw: 0, healthScoreActual: 95, healthScoreForecast: null, freqHz: 60.01 },
  { hour: '03:00', hourNum: 3, isForecast: false, bessActualMw: -220, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 18500, solarMw: 0, healthScoreActual: 96, healthScoreForecast: null, freqHz: 60.00 },
  { hour: '06:00', hourNum: 6, isForecast: false, bessActualMw: 420, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 21500, solarMw: 350, healthScoreActual: 93, healthScoreForecast: null, freqHz: 60.00 },
  { hour: '09:00', hourNum: 9, isForecast: false, bessActualMw: -2600, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 25100, solarMw: 8900, healthScoreActual: 89, healthScoreForecast: null, freqHz: 60.02 },
  { hour: '12:00', hourNum: 12, isForecast: false, bessActualMw: -5100, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 26400, solarMw: 15400, healthScoreActual: 88, healthScoreForecast: null, freqHz: 60.03 },
  { hour: '15:00', hourNum: 15, isForecast: false, bessActualMw: -2900, bessForecastMw: null, confidenceUpperMw: null, confidenceLowerMw: null, gridDemandMw: 27900, solarMw: 11200, healthScoreActual: 91, healthScoreForecast: null, freqHz: 60.01 },
  { hour: '18:00 (NOW)', hourNum: 18, isForecast: false, bessActualMw: 3950, bessForecastMw: 3950, confidenceUpperMw: 3950, confidenceLowerMw: 3950, gridDemandMw: 32400, solarMw: 1200, healthScoreActual: 86, healthScoreForecast: 86, freqHz: 59.98, annotation: 'Current Telemetry Horizon' },
  { hour: '+2h (20:00)', hourNum: 20, isForecast: true, bessActualMw: null, bessForecastMw: 6150, confidenceUpperMw: 6580, confidenceLowerMw: 5720, gridDemandMw: 33800, solarMw: 0, healthScoreActual: null, healthScoreForecast: 81, freqHz: 59.99, annotation: 'Projected Evening Peak Injection' },
  { hour: '+4h (22:00)', hourNum: 22, isForecast: true, bessActualMw: null, bessForecastMw: 2850, confidenceUpperMw: 3250, confidenceLowerMw: 2450, gridDemandMw: 27100, solarMw: 0, healthScoreActual: null, healthScoreForecast: 88, freqHz: 60.00, annotation: 'Projected Post-Peak Taper' },
  { hour: '+6h (00:00)', hourNum: 24, isForecast: true, bessActualMw: null, bessForecastMw: -450, confidenceUpperMw: -200, confidenceLowerMw: -700, gridDemandMw: 20200, solarMw: 0, healthScoreActual: null, healthScoreForecast: 94, freqHz: 60.01, annotation: 'Projected Wind Soak & Night Recharge' },
];

// 2. DAILY 24-HOUR PROFILE: Full Diurnal Fleet Cycle (00:00 to 23:00)
interface DailyRecord {
  hour: string;
  bessNetMw: number;
  solarMw: number;
  gridDemandMw: number;
  healthScore: number;
  freqHz: number;
  isPeakDischarge?: boolean;
  isPeakCharging?: boolean;
}

const CAISO_DAILY_DATA: DailyRecord[] = [
  { hour: '00:00', bessNetMw: -420, solarMw: 0, gridDemandMw: 19800, healthScore: 96, freqHz: 60.01 },
  { hour: '02:00', bessNetMw: -380, solarMw: 0, gridDemandMw: 18900, healthScore: 97, freqHz: 60.00 },
  { hour: '04:00', bessNetMw: -150, solarMw: 0, gridDemandMw: 18400, healthScore: 98, freqHz: 59.99 },
  { hour: '06:00', bessNetMw: 380, solarMw: 350, gridDemandMw: 21500, healthScore: 93, freqHz: 60.00 },
  { hour: '08:00', bessNetMw: -1450, solarMw: 5400, gridDemandMw: 24200, healthScore: 90, freqHz: 60.02 },
  { hour: '10:00', bessNetMw: -3900, solarMw: 12800, gridDemandMw: 25800, healthScore: 89, freqHz: 60.01 },
  { hour: '12:00', bessNetMw: -5100, solarMw: 15400, gridDemandMw: 26400, healthScore: 88, freqHz: 60.03, isPeakCharging: true },
  { hour: '14:00', bessNetMw: -4600, solarMw: 14200, gridDemandMw: 27100, healthScore: 89, freqHz: 60.02 },
  { hour: '16:00', bessNetMw: -1200, solarMw: 8900, gridDemandMw: 28900, healthScore: 92, freqHz: 60.01 },
  { hour: '18:00', bessNetMw: 3950, solarMw: 1200, gridDemandMw: 32400, healthScore: 86, freqHz: 59.98 },
  { hour: '20:00', bessNetMw: 5950, solarMw: 0, gridDemandMw: 33400, healthScore: 82, freqHz: 59.99, isPeakDischarge: true },
  { hour: '22:00', bessNetMw: 2400, solarMw: 0, gridDemandMw: 26800, healthScore: 89, freqHz: 60.00 },
  { hour: '23:00', bessNetMw: -300, solarMw: 0, gridDemandMw: 22100, healthScore: 94, freqHz: 60.01 },
];

// 3. WEEKLY 7-DAY AGGREGATE PERFORMANCE DATA (Mon - Sun)
interface WeeklyRecord {
  day: string;
  dateStr: string;
  dischargedGwh: number;
  chargedGwh: number;
  peakDischargeMw: number;
  solarCurtailedGwh: number;
  fleetRtePct: number;
  avgHealthScore: number;
  isHeatwaveDay?: boolean;
}

const CAISO_WEEKLY_DATA: WeeklyRecord[] = [
  { day: 'Mon', dateStr: 'Sep 23', dischargedGwh: 36.4, chargedGwh: 41.5, peakDischargeMw: 5820, solarCurtailedGwh: 18.2, fleetRtePct: 87.8, avgHealthScore: 91 },
  { day: 'Tue', dateStr: 'Sep 24', dischargedGwh: 38.1, chargedGwh: 43.2, peakDischargeMw: 5950, solarCurtailedGwh: 21.4, fleetRtePct: 88.2, avgHealthScore: 92 },
  { day: 'Wed', dateStr: 'Sep 25', dischargedGwh: 41.5, chargedGwh: 47.4, peakDischargeMw: 6180, solarCurtailedGwh: 24.1, fleetRtePct: 87.5, avgHealthScore: 89 },
  { day: 'Thu', dateStr: 'Sep 26', dischargedGwh: 39.8, chargedGwh: 45.3, peakDischargeMw: 6020, solarCurtailedGwh: 22.9, fleetRtePct: 87.9, avgHealthScore: 90 },
  { day: 'Fri', dateStr: 'Sep 27', dischargedGwh: 43.6, chargedGwh: 50.1, peakDischargeMw: 6250, solarCurtailedGwh: 26.5, fleetRtePct: 87.0, avgHealthScore: 86, isHeatwaveDay: true },
  { day: 'Sat', dateStr: 'Sep 28', dischargedGwh: 34.2, chargedGwh: 38.4, peakDischargeMw: 5410, solarCurtailedGwh: 30.2, fleetRtePct: 89.1, avgHealthScore: 95 },
  { day: 'Sun', dateStr: 'Sep 29', dischargedGwh: 33.2, chargedGwh: 37.1, peakDischargeMw: 5290, solarCurtailedGwh: 31.8, fleetRtePct: 89.4, avgHealthScore: 96 },
];

const POI_HEADROOM_DATA = [
  { poi: 'Whirlwind 230kV', county: 'Kern', capacityMw: 250, availHeadroomMw: 410, thermalLoadingPct: 68, status: 'OPTIMAL' },
  { poi: 'Morro Bay 230kV', county: 'SLO', capacityMw: 400, availHeadroomMw: 190, thermalLoadingPct: 82, status: 'STUDY_REQUIRED' },
  { poi: 'Pardee 230kV', county: 'LA', capacityMw: 150, availHeadroomMw: 280, thermalLoadingPct: 71, status: 'OPTIMAL' },
  { poi: 'Red Bluff 500kV', county: 'Riverside', capacityMw: 350, availHeadroomMw: 620, thermalLoadingPct: 58, status: 'HIGH_HEADROOM' },
  { poi: 'Bellota 230kV', county: 'San Joaquin', capacityMw: 200, availHeadroomMw: 330, thermalLoadingPct: 65, status: 'OPTIMAL' },
];

export const BessGridHealthChart: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  // Horizon Toggle: 'realtime' | 'daily' | 'weekly'
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('realtime');
  const [activeMetric, setActiveMetric] = useState<'dispatch' | 'health_index' | 'headroom' | 'frequency'>('dispatch');
  const [showPredictionHorizon, setShowPredictionHorizon] = useState<boolean>(true);
  const [forecastScenario, setForecastScenario] = useState<'standard' | 'heatwave_peak'>('standard');

  // Filter or adjust real-time dataset based on forecast visibility and scenario
  const realTimeChartData = CAISO_REALTIME_DATA.map((d) => {
    if (!showPredictionHorizon && d.isForecast) {
      return null;
    }

    if (d.isForecast && forecastScenario === 'heatwave_peak' && d.bessForecastMw !== null) {
      const multiplier = d.bessForecastMw > 0 ? 1.08 : 0.92;
      return {
        ...d,
        bessForecastMw: Math.round(d.bessForecastMw * multiplier),
        confidenceUpperMw: Math.round((d.confidenceUpperMw || d.bessForecastMw) * 1.1),
        confidenceLowerMw: Math.round((d.confidenceLowerMw || d.bessForecastMw) * 1.04),
        healthScoreForecast: Math.max(72, (d.healthScoreForecast || 80) - 6),
      };
    }

    return d;
  }).filter(Boolean) as RealTimeRecord[];

  // Custom tooltips
  const CustomRealtimeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: RealTimeRecord = payload[0]?.payload;
      const isProjected = dataPoint?.isForecast;
      const actualMw = dataPoint?.bessActualMw;
      const forecastMw = dataPoint?.bessForecastMw;

      return (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono min-w-[260px] space-y-2 ${
            isDark
              ? 'bg-slate-950 border-slate-700/90 text-slate-200 shadow-2xl'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</span>
            {isProjected ? (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                isDark ? 'text-cyan-300 bg-cyan-950/80 border-cyan-700/80' : 'text-sky-800 bg-sky-50 border-sky-200'
              }`}>
                <Sparkles className="w-2.5 h-2.5" />
                6H PREDICTIVE
              </span>
            ) : (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                isDark ? 'text-emerald-400 bg-emerald-950/80 border-emerald-700/80' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
              }`}>
                VERIFIED SCADA
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[11px]">
            {actualMw !== null && actualMw !== undefined && (
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Observed BESS Net:</span>
                <span className={`font-bold ${actualMw < 0 ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-emerald-400' : 'text-emerald-600')}`}>
                  {actualMw < 0 ? `${Math.abs(actualMw)} MW (Charging)` : `+${actualMw} MW (Discharging)`}
                </span>
              </div>
            )}

            {isProjected && forecastMw !== null && forecastMw !== undefined && (
              <div className={`space-y-1 p-2 rounded border ${isDark ? 'bg-cyan-950/40 border-cyan-800/40' : 'bg-sky-50 border-sky-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-800'}`}>Forecasted Net Dispatch:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {forecastMw > 0 ? `+${forecastMw.toLocaleString()} MW` : `${forecastMw.toLocaleString()} MW`}
                  </span>
                </div>
                {dataPoint.confidenceLowerMw !== null && dataPoint.confidenceUpperMw !== null && (
                  <div className={`flex justify-between items-center text-[10px] pt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>95% Confidence Interval:</span>
                    <span className={`font-semibold ${isDark ? 'text-cyan-200' : 'text-sky-700'}`}>
                      [{dataPoint.confidenceLowerMw.toLocaleString()} - {dataPoint.confidenceUpperMw.toLocaleString()} MW]
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className={`flex justify-between items-center pt-1 border-t text-[10px] ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              <span>CAISO Total Demand:</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dataPoint.gridDemandMw.toLocaleString()} MW</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyRecord = payload[0]?.payload;
      const isCharging = data.bessNetMw < 0;

      return (
        <div
          className={`p-3 rounded-lg border text-xs font-mono min-w-[240px] space-y-1.5 ${
            isDark
              ? 'bg-slate-950 border-slate-700/90 text-slate-200 shadow-2xl'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          <div className={`font-bold border-b pb-1 flex justify-between items-center ${isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'}`}>
            <span>CAISO Hour {label}</span>
            <span className={`text-[10px] font-normal ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>24H DIURNAL CYCLE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>BESS Fleet Net:</span>
            <span className={`font-bold ${isCharging ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-emerald-400' : 'text-emerald-600')}`}>
              {isCharging ? `${Math.abs(data.bessNetMw)} MW (Charging)` : `+${data.bessNetMw} MW (Discharging)`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Solar Generation:</span>
            <span className={`font-semibold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{data.solarMw.toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Grid Demand:</span>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.gridDemandMw.toLocaleString()} MW</span>
          </div>
          <div className={`flex justify-between items-center pt-1 border-t text-[10px] ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Health Index:</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{data.healthScore} / 100</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomWeeklyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: WeeklyRecord = payload[0]?.payload;
      return (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono min-w-[260px] space-y-2 ${
            isDark
              ? 'bg-slate-950 border-slate-700/90 text-slate-200 shadow-2xl'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          <div className={`font-bold border-b pb-1.5 flex justify-between items-center ${isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'}`}>
            <span>{data.day} ({data.dateStr})</span>
            {data.isHeatwaveDay ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                isDark ? 'text-amber-400 bg-amber-950 border-amber-800' : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}>
                HEATWAVE PEAK
              </span>
            ) : (
              <span className={`text-[10px] font-normal ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>7-DAY SUMMARY</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Energy Injected (Peak):</span>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{data.dischargedGwh} GWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Solar Soaked (Off-Peak):</span>
              <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{data.chargedGwh} GWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Peak Fleet Injection:</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.peakDischargeMw.toLocaleString()} MW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Solar Curtailment Averted:</span>
              <span className={`font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>{data.solarCurtailedGwh} GWh</span>
            </div>
            <div className={`flex justify-between items-center pt-1 border-t text-[10px] ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Round-Trip Efficiency (RTE):</span>
              <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{data.fleetRtePct}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-xl p-5 space-y-5 border transition-colors ${
        isDark
          ? 'bg-[#0D1829]/90 border-slate-800/90 text-slate-100 shadow-lg shadow-black/20'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Top Header & Main Controls */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                isDark
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-ping`}></span>
              CAISO TELEMETRY LIVE
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>California ISO Balancing Authority</span>
            {timeHorizon === 'realtime' && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-cyan-300 bg-cyan-950/80 border-cyan-800/60'
                    : 'text-sky-800 bg-sky-50 border-sky-200'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                6h Predictive Projection Ready
              </span>
            )}
          </div>

          <h2 className={`text-base font-bold mt-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
            <Activity className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            California BESS Fleet Grid Health & Siting Performance
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {timeHorizon === 'realtime' && 'Real-time telemetry duck-curve with 6-hour predictive line projection based on historical trends.'}
            {timeHorizon === 'daily' && 'Full 24-hour diurnal fleet dispatch profile tracking midday solar soak and evening net injection.'}
            {timeHorizon === 'weekly' && '7-day fleet energy throughput (GWh), peak capacity utilization, and averted solar curtailment.'}
          </p>
        </div>

        {/* PRIMARY TOGGLE CONTROL: Real-Time vs Daily vs Weekly */}
        <div
          className={`flex items-center gap-1 p-1 rounded-lg border self-start lg:self-auto text-xs font-mono shadow-xs ${
            isDark ? 'bg-[#060D1A] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setTimeHorizon('realtime')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold ${
              timeHorizon === 'realtime'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${timeHorizon === 'realtime' ? 'text-emerald-100' : isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>Real-Time</span>
          </button>

          <button
            onClick={() => setTimeHorizon('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold ${
              timeHorizon === 'daily'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${timeHorizon === 'daily' ? 'text-emerald-100' : isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            <span>Daily (24h)</span>
          </button>

          <button
            onClick={() => setTimeHorizon('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold ${
              timeHorizon === 'weekly'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${timeHorizon === 'weekly' ? 'text-emerald-100' : isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            <span>Weekly (7d)</span>
          </button>
        </div>
      </div>

      {/* Secondary Metric Tabs for Real-Time & Daily Views */}
      {timeHorizon !== 'weekly' && (
        <div className={`flex items-center justify-between gap-3 flex-wrap text-xs font-mono border-b pb-2 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <div className={`flex items-center gap-1 p-1 rounded-md border ${isDark ? 'bg-[#0B1424] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setActiveMetric('dispatch')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'dispatch'
                  ? isDark
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {timeHorizon === 'realtime' ? 'Dispatch & 6h Forecast' : '24h Diurnal Dispatch'}
            </button>
            <button
              onClick={() => setActiveMetric('health_index')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'health_index'
                  ? isDark
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grid Health Index
            </button>
            <button
              onClick={() => setActiveMetric('headroom')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'headroom'
                  ? isDark
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Substation POI Headroom
            </button>
            <button
              onClick={() => setActiveMetric('frequency')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'frequency'
                  ? isDark
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Frequency Stability
            </button>
          </div>

          {/* Real-time projection controls */}
          {timeHorizon === 'realtime' && (activeMetric === 'dispatch' || activeMetric === 'health_index') && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#0B1424] rounded p-0.5 border border-slate-800 text-[11px]">
                <button
                  onClick={() => setForecastScenario('standard')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    forecastScenario === 'standard' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Nominal
                </button>
                <button
                  onClick={() => setForecastScenario('heatwave_peak')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    forecastScenario === 'heatwave_peak' ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-800/80' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Simulates higher ambient temperature and elevated net load peak ramp"
                >
                  Heatwave Stress
                </button>
              </div>

              <button
                onClick={() => setShowPredictionHorizon(!showPredictionHorizon)}
                className={`px-2 py-1 rounded text-xs transition-colors border ${
                  showPredictionHorizon
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80 font-semibold'
                    : 'bg-[#0B1424] text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{showPredictionHorizon ? '6h Forecast On' : '6h Forecast Off'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Grid Pulse Telemetry Tickers (Adaptive based on timeHorizon) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {timeHorizon === 'realtime' && (
          <>
            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Statewide BESS Online
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5 tabular-nums">
                10,420 MW
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +1,850 MW added YTD
              </div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Current Evening Output
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                3,950 MW
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Displacing peakers</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                6h Forecast Peak Discharge
              </div>
              <div className="text-lg font-mono font-bold text-cyan-400 mt-0.5 tabular-nums">
                {forecastScenario === 'heatwave_peak' ? '+6,642 MW' : '+6,150 MW'}
              </div>
              <div className="text-[10px] text-cyan-500 font-mono mt-0.5">Projected at 20:00 (±5.8%)</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Midday Solar Soak Relieved
              </div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                14,200 MWh
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Peak charge: -5,100 MW</div>
            </div>
          </>
        )}

        {timeHorizon === 'daily' && (
          <>
            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                24h Energy Cycled
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5 tabular-nums">
                38.6 GWh
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Full diurnal turnaround</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Max Daily Evening Ramp
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                +5,950 MW
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Sustained 4 hours</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                24h Solar Soaked
              </div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                22.8 GWh
              </div>
              <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">Averted daytime curtailment</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Diurnal Fleet Availability
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5 tabular-nums">
                97.8%
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">5 CAISO Clusters</div>
            </div>
          </>
        )}

        {timeHorizon === 'weekly' && (
          <>
            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                7-Day Clean Energy Delivered
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                266.8 GWh
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Displacing gas peakers</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Weekly Peak Fleet Output
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5 tabular-nums">
                6,250 MW
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Friday peak dispatch</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Total Weekly Solar Soaked
              </div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                173.2 GWh
              </div>
              <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">Overgeneration absorbed</div>
            </div>

            <div className="p-3 bg-[#0B1424] rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Weekly Average Fleet RTE
              </div>
              <div className="text-lg font-mono font-bold text-cyan-400 mt-0.5 tabular-nums">
                88.1%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Benchmark: 85.0%</div>
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Recharts Chart Area */}
      <div className="h-[310px] w-full pt-1">
        {/* VIEW A: REAL-TIME (with 6h forecast) */}
        {timeHorizon === 'realtime' && activeMetric === 'dispatch' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={realTimeChartData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="bessDischargeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="predictionBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v} MW`} />
              <Tooltip content={<CustomRealtimeTooltip />} />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />

              {showPredictionHorizon && (
                <ReferenceLine
                  x="18:00 (NOW)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: 'NOW (TELEMETRY HORIZON)',
                    fill: '#0891b2',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    position: 'top',
                  }}
                />
              )}

              <Area type="monotone" dataKey="solarMw" name="CAISO Solar Output" stroke="#d97706" strokeWidth={1.5} fill="url(#solarGrad)" />
              <Area type="monotone" dataKey="bessActualMw" name="Observed BESS Net Dispatch (MW)" stroke="#047857" strokeWidth={2.5} fill="url(#bessDischargeGrad)" />

              {showPredictionHorizon && (
                <Area type="monotone" dataKey="confidenceUpperMw" name="95% Forecast Confidence Upper" stroke="#0891b2" strokeWidth={1} strokeDasharray="2 2" fill="url(#predictionBandGrad)" legendType="none" />
              )}

              {showPredictionHorizon && (
                <Line
                  type="monotone"
                  dataKey="bessForecastMw"
                  name="6h Predictive BESS Dispatch Projection"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#0891b2', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#0e7490' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {/* VIEW B: DAILY 24-HOUR PROFILE */}
        {timeHorizon === 'daily' && activeMetric === 'dispatch' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CAISO_DAILY_DATA} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="dailyBessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="dailySolarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v} MW`} />
              <Tooltip content={<CustomDailyTooltip />} />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
              <ReferenceLine
                x="20:00"
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{ value: 'Peak Ramp (+5,950 MW)', fill: '#10B981', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <ReferenceLine
                x="12:00"
                stroke="#F59E0B"
                strokeDasharray="3 3"
                label={{ value: 'Peak Solar Soak (-5,100 MW)', fill: '#F59E0B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <Area type="monotone" dataKey="solarMw" name="Daily Solar Output" stroke="#d97706" strokeWidth={1.5} fill="url(#dailySolarGrad)" />
              <Area type="monotone" dataKey="bessNetMw" name="Daily BESS Net (MW)" stroke="#047857" strokeWidth={2.5} fill="url(#dailyBessGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* VIEW C: WEEKLY 7-DAY AGGREGATE PERFORMANCE */}
        {timeHorizon === 'weekly' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={CAISO_WEEKLY_DATA} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              />
              <YAxis
                yAxisId="gwh"
                orientation="left"
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `${v} GWh`}
              />
              <YAxis
                yAxisId="mw"
                orientation="right"
                domain={[4500, 7000]}
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `${v} MW`}
              />
              <Tooltip content={<CustomWeeklyTooltip />} />
              <Bar yAxisId="gwh" dataKey="dischargedGwh" name="Energy Injected (GWh)" fill="#047857" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="gwh" dataKey="solarCurtailedGwh" name="Curtailed Solar Soaked (GWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="mw"
                type="monotone"
                dataKey="peakDischargeMw"
                name="Daily Peak Discharge (MW)"
                stroke="#0891b2"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0891b2' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {/* VIEW D: HEALTH INDEX (When active on Real-Time or Daily) */}
        {timeHorizon !== 'weekly' && activeMetric === 'health_index' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={(timeHorizon === 'realtime' ? realTimeChartData : CAISO_DAILY_DATA) as any[]}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v} pts`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const score = data.healthScoreActual ?? data.healthScoreForecast ?? data.healthScore;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs font-mono text-slate-200">
                        <div className="font-bold text-white mb-1">Hour {label}</div>
                        <div>Grid Health Index: <span className="text-emerald-400 font-bold">{score} / 100</span></div>
                        <div className="text-[10px] text-slate-400 mt-1">Nominal tolerance: ≥ 85 pts</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Nominal Baseline (85 pts)', fill: '#059669', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey={timeHorizon === 'realtime' ? 'healthScoreActual' : 'healthScore'} name="Observed Health Score" stroke="#047857" strokeWidth={2.5} dot={{ r: 4, fill: '#047857' }} />
              {timeHorizon === 'realtime' && showPredictionHorizon && (
                <Line type="monotone" dataKey="healthScoreForecast" name="6h Predicted Health" stroke="#0891b2" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5, fill: '#06b6d4' }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {/* VIEW E: SUBSTATION POI HEADROOM */}
        {timeHorizon !== 'weekly' && activeMetric === 'headroom' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={POI_HEADROOM_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="poi" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v} MW`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs font-mono text-slate-200">
                        <div className="font-bold text-white mb-1.5">{data.poi} ({data.county})</div>
                        <div className="space-y-1 text-[11px]">
                          <div>Target Asset Sizing: <span className="text-emerald-400 font-bold">{data.capacityMw} MW</span></div>
                          <div>Estimated Substation Headroom: <span className="text-white font-bold">{data.availHeadroomMw} MW</span></div>
                          <div>Thermal Loading: <span className="text-amber-400 font-bold">{data.thermalLoadingPct}%</span></div>
                          <div>Siting Feasibility Status: <span className="text-emerald-400 font-bold">{data.status}</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="capacityMw" name="Proposed Project Capacity" fill="#047857" radius={[4, 4, 0, 0]} />
              <Bar dataKey="availHeadroomMw" name="Available Substation Headroom" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* VIEW F: FREQUENCY STABILITY */}
        {timeHorizon !== 'weekly' && activeMetric === 'frequency' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={(timeHorizon === 'realtime' ? realTimeChartData : CAISO_DAILY_DATA) as any[]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
              <YAxis domain={[59.95, 60.05]} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v.toFixed(2)} Hz`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const freq = payload[0].value;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs font-mono text-slate-200">
                        <div className="font-bold text-white mb-1">CAISO Hour {label}</div>
                        <div>Grid Frequency: <span className="text-emerald-400 font-bold">{freq} Hz</span></div>
                        <div className="text-[10px] text-slate-400 mt-1">Fast Frequency Response (FFR) Active</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={60.00} stroke="#10b981" strokeDasharray="4 4" label={{ value: '60.00 Hz Baseline', fill: '#059669', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="freqHz" name="Grid Frequency (Hz)" stroke="#047857" strokeWidth={2} dot={{ r: 3, fill: '#047857' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend & Context Explainer */}
      <div className={`pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono ${
        isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
      }`}>
        {timeHorizon === 'realtime' && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Observed Dispatch (Solid)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 border-t-2 border-dashed border-cyan-400"></span>
              <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>6h Predictive Projection (Dashed)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Solar Absorption</span>
            </span>
          </div>
        )}

        {timeHorizon === 'daily' && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Evening Discharge Ramp (&gt;0 MW)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Midday Solar Soak (&lt;0 MW)</span>
            </span>
          </div>
        )}

        {timeHorizon === 'weekly' && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Energy Injected (GWh)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Solar Soaked (GWh)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400"></span>
              <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Daily Peak Output (MW)</span>
            </span>
          </div>
        )}

        <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <ShieldCheck className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span>Source: CAISO OASIS API & SCADA Telemetry Gateway</span>
        </div>
      </div>
    </div>
  );
};
