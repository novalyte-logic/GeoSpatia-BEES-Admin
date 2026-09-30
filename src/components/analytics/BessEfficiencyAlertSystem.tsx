import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Filter,
  ArrowRight,
  ExternalLink,
  Flame,
  BatteryWarning,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export interface BessSiteEfficiencyRecord {
  projectId: string;
  siteName: string;
  developerName: string;
  county: string;
  capacityMw: number;
  energyMwh: number;
  currentEfficiencyPct: number; // Measured 24h Round-Trip Efficiency (RTE %)
  benchmarkRtePct: number;      // Contractual / Benchmark baseline (e.g. 88.0%)
  availabilityPct: number;      // Mechanical & Inverter Availability
  cellMaxTempC: number;         // Peak cell enclosure temperature in Celsius
  lastSyncTime: string;
  poiName: string;
  primaryCause?: string;
  telemetrySource: string;
  isSimulatedRecovered?: boolean;
}

const INITIAL_BESS_TELEMETRY: BessSiteEfficiencyRecord[] = [
  {
    projectId: 'proj_morro_bay',
    siteName: 'Morro Bay Energy Storage Center',
    developerName: 'Vistra Corp',
    county: 'San Luis Obispo',
    capacityMw: 400,
    energyMwh: 1600,
    currentEfficiencyPct: 78.6,
    benchmarkRtePct: 88.0,
    availabilityPct: 84.1,
    cellMaxTempC: 41.8,
    lastSyncTime: '4m ago',
    poiName: 'Morro Bay 230kV Substation',
    primaryCause: 'Substation step-up transformer thermal derating & Block 4 coolant loop pressure drop',
    telemetrySource: 'CAISO OASIS RTD Telemetry & CPUC Resource Adequacy Monthly Filing',
  },
  {
    projectId: 'proj_canyon_country',
    siteName: 'Canyon Country Storage Hub',
    developerName: 'Strata Clean Energy',
    county: 'Los Angeles',
    capacityMw: 150,
    energyMwh: 600,
    currentEfficiencyPct: 83.2,
    benchmarkRtePct: 87.5,
    availabilityPct: 92.5,
    cellMaxTempC: 34.6,
    lastSyncTime: '8m ago',
    poiName: 'Pardee 230kV Substation',
    primaryCause: 'Inverter string clipping during high-ambient afternoon peak injection cycle',
    telemetrySource: 'SCE Interconnection Study Telemetry & SCADA Modbus Gateway',
  },
  {
    projectId: 'proj_willow_glen',
    siteName: 'Willow Glen Storage Project',
    developerName: 'Plus Power',
    county: 'San Joaquin',
    capacityMw: 200,
    energyMwh: 800,
    currentEfficiencyPct: 84.5,
    benchmarkRtePct: 88.0,
    availabilityPct: 94.0,
    cellMaxTempC: 31.5,
    lastSyncTime: '12m ago',
    poiName: 'Bellota 230kV Substation',
    primaryCause: 'Auxiliary HVAC parasitic consumption increase during midday thermal load',
    telemetrySource: 'PG&E Rule 21 Distributed Energy Monitoring Log',
  },
  {
    projectId: 'proj_desert_peak',
    siteName: 'Desert Peak Energy Storage',
    developerName: 'Arevon Energy',
    county: 'Kern',
    capacityMw: 250,
    energyMwh: 1000,
    currentEfficiencyPct: 89.4,
    benchmarkRtePct: 88.0,
    availabilityPct: 98.2,
    cellMaxTempC: 27.4,
    lastSyncTime: '2m ago',
    poiName: 'Whirlwind 230kV Substation',
    telemetrySource: 'CAISO SCADA EMS Telemetry Node #WHR230',
  },
  {
    projectId: 'proj_sonoran_west',
    siteName: 'Sonoran West BESS',
    developerName: 'Recurrent Energy',
    county: 'Riverside',
    capacityMw: 350,
    energyMwh: 1400,
    currentEfficiencyPct: 91.1,
    benchmarkRtePct: 88.5,
    availabilityPct: 99.1,
    cellMaxTempC: 28.9,
    lastSyncTime: '6m ago',
    poiName: 'Red Bluff 500kV Substation',
    telemetrySource: 'BLM Monitoring & CAISO Cluster 14 Phase II Dispatch Node',
  },
];

export const BessEfficiencyAlertSystem: React.FC = () => {
  const { setActiveTab, theme } = useApp();
  const isDark = theme === 'dark';

  // Configurable efficiency threshold (default: 85.0%, standard CAISO Resource Adequacy contract threshold)
  const [thresholdPct, setThresholdPct] = useState<number>(85.0);
  const [filterMode, setFilterMode] = useState<'all' | 'alerts_only' | 'critical_only'>('all');
  const [siteTelemetry, setSiteTelemetry] = useState<BessSiteEfficiencyRecord[]>(INITIAL_BESS_TELEMETRY);

  // Analyze sites against the current threshold
  const analyzedSites = useMemo(() => {
    return siteTelemetry.map((site) => {
      const delta = site.currentEfficiencyPct - thresholdPct;
      let status: 'CRITICAL' | 'WARNING' | 'NOMINAL';

      if (delta < -3.0) {
        status = 'CRITICAL';
      } else if (delta < 0) {
        status = 'WARNING';
      } else {
        status = 'NOMINAL';
      }

      return {
        ...site,
        delta,
        status,
      };
    });
  }, [siteTelemetry, thresholdPct]);

  // Alert metrics
  const belowThresholdSites = useMemo(
    () => analyzedSites.filter((s) => s.status === 'CRITICAL' || s.status === 'WARNING'),
    [analyzedSites]
  );
  const criticalSites = useMemo(() => analyzedSites.filter((s) => s.status === 'CRITICAL'), [analyzedSites]);
  const affectedCapacityMw = useMemo(
    () => belowThresholdSites.reduce((acc, s) => acc + s.capacityMw, 0),
    [belowThresholdSites]
  );

  // Filtered list based on view mode
  const displayedSites = useMemo(() => {
    if (filterMode === 'alerts_only') {
      return belowThresholdSites;
    }
    if (filterMode === 'critical_only') {
      return criticalSites;
    }
    return analyzedSites;
  }, [analyzedSites, belowThresholdSites, criticalSites, filterMode]);

  // Toggle simulate recovery for a site
  const handleToggleRecoverySimulation = (projectId: string) => {
    setSiteTelemetry((prev) =>
      prev.map((site) => {
        if (site.projectId === projectId) {
          const isRecovered = !site.isSimulatedRecovered;
          return {
            ...site,
            isSimulatedRecovered: isRecovered,
            currentEfficiencyPct: isRecovered
              ? site.benchmarkRtePct + 1.2
              : INITIAL_BESS_TELEMETRY.find((s) => s.projectId === projectId)?.currentEfficiencyPct || site.currentEfficiencyPct,
            cellMaxTempC: isRecovered ? 28.2 : INITIAL_BESS_TELEMETRY.find((s) => s.projectId === projectId)?.cellMaxTempC || site.cellMaxTempC,
            primaryCause: isRecovered ? undefined : INITIAL_BESS_TELEMETRY.find((s) => s.projectId === projectId)?.primaryCause,
          };
        }
        return site;
      })
    );
  };

  const resetAllTelemetry = () => {
    setSiteTelemetry(INITIAL_BESS_TELEMETRY);
    setThresholdPct(85.0);
  };

  return (
    <div
      className={`rounded-xl p-5 space-y-5 border transition-colors ${
        isDark
          ? 'bg-[#0D1829]/90 border-slate-800/90 text-slate-100 shadow-lg shadow-black/20'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Alert System Header & Controls */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                belowThresholdSites.length > 0
                  ? isDark
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                  : isDark
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  belowThresholdSites.length > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                }`}
              ></span>
              {belowThresholdSites.length > 0
                ? `${belowThresholdSites.length} BESS SITES BELOW THRESHOLD`
                : 'ALL FLEET OPERATING ABOVE BENCHMARK'}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Telemetry Alert Engine</span>
          </div>

          <h2 className={`text-base font-bold mt-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
            <BatteryWarning className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            BESS Fleet Efficiency & Underperformance Alert System
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Monitors measured 24h Round-Trip Efficiency (RTE) against contractual thresholds to detect parasitic losses, thermal deratings, and commercial capacity risks.
          </p>
        </div>

        {/* Interactive Threshold Adjustment Control */}
        <div className={`border rounded-lg p-3 space-y-2 lg:min-w-[340px] ${isDark ? 'bg-[#0B1424] border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Sliders className="w-3.5 h-3.5" />
              Efficiency Alert Threshold:
            </span>
            <span className={`font-bold px-2 py-0.5 rounded border tabular-nums ${isDark ? 'text-white bg-slate-900 border-slate-700' : 'text-slate-900 bg-white border-slate-300 shadow-xs'}`}>
              {thresholdPct.toFixed(1)}% RTE
            </span>
          </div>

          {/* Slider */}
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>75%</span>
            <input
              type="range"
              min="75.0"
              max="92.0"
              step="0.5"
              value={thresholdPct}
              onChange={(e) => setThresholdPct(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>92%</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-mono">
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Presets:</span>
            {[82.0, 85.0, 88.0].map((preset) => (
              <button
                key={preset}
                onClick={() => setThresholdPct(preset)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  thresholdPct === preset
                    ? 'bg-emerald-600 text-white font-bold'
                    : isDark
                    ? 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {preset.toFixed(0)}%
                {preset === 85.0 ? ' (CAISO RA)' : preset === 88.0 ? ' (High-Perf)' : ' (Min)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Status Banner */}
      {belowThresholdSites.length > 0 ? (
        <div className={`border rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertOctagon className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
            <div>
              <div className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-rose-950'}`}>
                <span>Active Commercial Capacity Alert</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border ${
                  isDark ? 'bg-rose-900/80 text-rose-200 border-rose-700' : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {belowThresholdSites.length} SITES FLAGGED
                </span>
              </div>
              <div className={`mt-0.5 ${isDark ? 'text-rose-200/90' : 'text-rose-800'}`}>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{affectedCapacityMw.toLocaleString()} MW</span> of California storage capacity is currently operating below the <span className={`font-semibold ${isDark ? 'text-rose-300' : 'text-rose-900'}`}>{thresholdPct.toFixed(1)}% RTE</span> threshold. Risk of CAISO Resource Adequacy delivery penalties and reduced energy arbitrage capture.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 font-mono">
            <button
              onClick={() => setFilterMode('alerts_only')}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium border cursor-pointer ${
                filterMode === 'alerts_only'
                  ? 'bg-rose-700 text-white border-rose-600 font-bold'
                  : isDark
                  ? 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                  : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-100 shadow-xs'
              }`}
            >
              Filter Underperforming ({belowThresholdSites.length})
            </button>
            {filterMode !== 'all' && (
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white bg-slate-900 border-slate-700' : 'text-slate-600 hover:text-slate-900 bg-white border-slate-300 shadow-xs'
                }`}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`border rounded-lg p-3 flex items-center justify-between text-xs ${
          isDark ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className="font-medium">
              All 5 California BESS project sites are operating at or above the specified{' '}
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{thresholdPct.toFixed(1)}% RTE</span> threshold.
            </span>
          </div>
          <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>100% NOMINAL COMPLIANCE</span>
        </div>
      )}

      {/* Filter Tabs and Quick Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] uppercase tracking-wider font-semibold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Display Filter:
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              filterMode === 'all'
                ? isDark
                  ? 'bg-slate-800 text-white border-slate-700 font-bold'
                  : 'bg-white text-slate-900 border-slate-300 font-bold shadow-xs'
                : isDark
                ? 'bg-[#0B1424] text-slate-400 border-slate-800 hover:text-white'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            All Sites ({analyzedSites.length})
          </button>
          <button
            onClick={() => setFilterMode('alerts_only')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              filterMode === 'alerts_only'
                ? 'bg-rose-700 text-white border-rose-600 font-bold'
                : isDark
                ? 'bg-[#0B1424] text-slate-400 border-slate-800 hover:text-white'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${belowThresholdSites.length > 0 ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
            Underperforming ({belowThresholdSites.length})
          </button>
          <button
            onClick={() => setFilterMode('critical_only')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              filterMode === 'critical_only'
                ? 'bg-rose-900 text-white border-rose-700 font-bold'
                : isDark
                ? 'bg-[#0B1424] text-slate-400 border-slate-800 hover:text-white'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Critical Only ({criticalSites.length})
          </button>
        </div>

        <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Nominal (≥ {thresholdPct.toFixed(1)}%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Watch ({(thresholdPct - 3.0).toFixed(1)}% - {thresholdPct.toFixed(1)}%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Critical Alert (&lt; {(thresholdPct - 3.0).toFixed(1)}%)</span>
          </span>
        </div>
      </div>

      {/* Grid of BESS Site Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSites.map((site) => {
          const isCritical = site.status === 'CRITICAL';
          const isWarning = site.status === 'WARNING';
          const isNominal = site.status === 'NOMINAL';

          return (
            <div
              key={site.projectId}
              className={`rounded-xl border transition-all p-4 flex flex-col justify-between relative overflow-hidden ${
                isCritical
                  ? isDark
                    ? 'bg-[#190B14] border-rose-900/80 hover:border-rose-700 shadow-md shadow-rose-950/30'
                    : 'bg-rose-50/60 border-rose-200 hover:border-rose-300 shadow-xs'
                  : isWarning
                  ? isDark
                    ? 'bg-[#19140B] border-amber-900/80 hover:border-amber-700 shadow-md shadow-amber-950/30'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-300 shadow-xs'
                  : isDark
                  ? 'bg-[#0B1528] border-slate-800 hover:border-slate-700 shadow-md shadow-black/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />

              <div className="space-y-3 pt-0.5">
                {/* Header: Site Name & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {site.siteName}
                    </h3>
                    <div className={`text-xs flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>{site.developerName}</span>
                      <span>·</span>
                      <span className="font-mono">{site.county} County</span>
                    </div>
                  </div>

                  {/* Color-coded Status Badge */}
                  <div>
                    {isCritical && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        isDark ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        <AlertOctagon className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>CRITICAL ({site.delta.toFixed(1)}%)</span>
                      </span>
                    )}
                    {isWarning && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        isDark ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>WATCH ({site.delta.toFixed(1)}%)</span>
                      </span>
                    )}
                    {isNominal && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>NOMINAL (+{site.delta.toFixed(1)}%)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Efficiency Meter & Benchmark Comparison */}
                <div className={`p-2.5 rounded-lg border space-y-1.5 ${isDark ? 'bg-[#070D18]/90 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Round-Trip Efficiency:</span>
                    <span
                      className={`text-base font-bold tabular-nums ${
                        isCritical
                          ? isDark ? 'text-rose-400' : 'text-rose-600'
                          : isWarning
                          ? isDark ? 'text-amber-400' : 'text-amber-600'
                          : isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    >
                      {site.currentEfficiencyPct.toFixed(1)}% RTE
                    </span>
                  </div>

                  {/* Progress Bar with Threshold Marker */}
                  <div className={`relative w-full rounded-full h-2.5 overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isCritical
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (site.currentEfficiencyPct / 100) * 100))}%` }}
                    />
                  </div>

                  <div className={`flex items-center justify-between text-[10px] font-mono pt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <span>Benchmark: {site.benchmarkRtePct.toFixed(1)}%</span>
                    <span>Alert Cutoff: {thresholdPct.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Telemetry Detail Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded border ${isDark ? 'bg-[#070D18]/90 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Asset Sizing</div>
                    <div className={`font-mono font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {site.capacityMw} MW <span className={`font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ {site.energyMwh} MWh</span>
                    </div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-[#070D18]/90 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`text-[10px] font-mono uppercase flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Max Enclosure Temp</span>
                      {site.cellMaxTempC > 38 ? (
                        <Flame className="w-3 h-3 text-rose-500" />
                      ) : null}
                    </div>
                    <div
                      className={`font-mono font-bold mt-0.5 ${
                        site.cellMaxTempC > 38
                          ? isDark ? 'text-rose-400' : 'text-rose-600'
                          : site.cellMaxTempC > 32
                          ? isDark ? 'text-amber-400' : 'text-amber-600'
                          : isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {site.cellMaxTempC.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                {/* Primary Cause Alert Description (if underperforming) */}
                {site.primaryCause && (
                  <div className={`p-2.5 rounded-md border text-xs space-y-1 ${
                    isDark ? 'bg-rose-950/60 border-rose-800/70 text-rose-200' : 'bg-rose-100/70 border-rose-200 text-rose-900'
                  }`}>
                    <div className={`font-bold flex items-center gap-1.5 text-[11px] ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                      <span>Diagnosed Degradation Cause:</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-rose-200/90' : 'text-rose-900'}`}>
                      {site.primaryCause}
                    </p>
                  </div>
                )}

                {/* Substation & Telemetry Provenance */}
                <div className={`text-[11px] font-mono space-y-1 pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <div className="flex justify-between items-center">
                    <span>POI:</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{site.poiName}</span>
                  </div>
                  <div className={`flex justify-between items-center text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>Synced:</span>
                    <span>{site.lastSyncTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`pt-3 mt-3 border-t flex items-center gap-2 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <button
                  onClick={() => {
                    setActiveTab('projects');
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors border cursor-pointer ${
                    isDark
                      ? 'text-slate-200 bg-[#070D18] border-slate-700/80 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-800 bg-white border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <span>Project Dossier</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>

                {/* Simulation toggle button */}
                <button
                  onClick={() => handleToggleRecoverySimulation(site.projectId)}
                  title={site.isSimulatedRecovered ? 'Reset to active live telemetry' : 'Simulate cooling cycle recovery'}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                    site.isSimulatedRecovered
                      ? isDark
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800 font-bold'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : isDark
                      ? 'bg-[#070D18] text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${site.isSimulatedRecovered ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>{site.isSimulatedRecovered ? 'Recovered' : 'Simulate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Provenance Note */}
      <div className={`pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${
        isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
          <span>
            Threshold breaches dynamically alert operators to propose Geospatial Labs Siting & Interconnection Thermal Diligence services.
          </span>
        </div>
        <button
          onClick={resetAllTelemetry}
          className={`underline self-start sm:self-auto cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Reset Telemetry Baseline
        </button>
      </div>
    </div>
  );
};
