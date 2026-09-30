import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Zap,
  MapPin,
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Command,
  Clock,
  Filter,
} from 'lucide-react';

interface SitePerformanceMetadata {
  status: 'CRITICAL' | 'WATCH' | 'NOMINAL';
  rtePct: number;
  deltaPct: number;
  cellTempC: number;
  issue?: string;
}

const BESS_PERFORMANCE_LOOKUP: Record<string, SitePerformanceMetadata> = {
  proj_morro_bay: {
    status: 'CRITICAL',
    rtePct: 78.6,
    deltaPct: -6.4,
    cellTempC: 41.8,
    issue: 'Substation step-up transformer thermal derating & Block 4 coolant loop pressure drop',
  },
  proj_canyon_country: {
    status: 'WATCH',
    rtePct: 83.2,
    deltaPct: -1.8,
    cellTempC: 34.6,
    issue: 'Inverter string clipping during high-ambient afternoon peak injection cycle',
  },
  proj_willow_glen: {
    status: 'WATCH',
    rtePct: 84.5,
    deltaPct: -0.5,
    cellTempC: 31.5,
    issue: 'Auxiliary HVAC parasitic consumption increase during midday thermal load',
  },
  proj_desert_peak: {
    status: 'NOMINAL',
    rtePct: 89.4,
    deltaPct: 4.4,
    cellTempC: 27.4,
  },
  proj_sonoran_west: {
    status: 'NOMINAL',
    rtePct: 91.1,
    deltaPct: 6.1,
    cellTempC: 28.9,
  },
};

export const GlobalHeaderSearch: React.FC = () => {
  const {
    globalSearchQuery,
    setGlobalSearchQuery,
    projects,
    opportunities,
    companies,
    setActiveTab,
    theme,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = globalSearchQuery.trim().toLowerCase();

  // Search logic for BESS Sites by:
  // 1. ID (Project ID, CAISO Queue ID, State Clearinghouse ID, County Permit ID, APN)
  // 2. Location (County, City/Area, POI Substation, Utility)
  // 3. Performance Status (Critical, Watch, Nominal, Alert, Degraded, Underperforming, Optimal, Temperature, RTE)
  const matchedSites = useMemo(() => {
    if (!query) return [];

    return projects
      .map((proj) => {
        const perf = BESS_PERFORMANCE_LOOKUP[proj.id] || {
          status: 'NOMINAL',
          rtePct: 88.0,
          deltaPct: 0,
          cellTempC: 28.0,
        };

        const caisoId = proj.sourceIds.caisoQueueId?.toLowerCase() || '';
        const permitId = proj.sourceIds.countyPermitId?.toLowerCase() || '';
        const blmId = proj.sourceIds.blmCaseId?.toLowerCase() || '';
        const schId = proj.sourceIds.stateClearinghouseId?.toLowerCase() || '';
        const apn = proj.parcelApn?.toLowerCase() || '';

        // Match by ID
        const matchId =
          proj.id.toLowerCase().includes(query) ||
          caisoId.includes(query) ||
          permitId.includes(query) ||
          blmId.includes(query) ||
          schId.includes(query) ||
          apn.includes(query) ||
          `caiso #${caisoId}`.includes(query);

        // Match by Location
        const matchLocation =
          proj.county.toLowerCase().includes(query) ||
          proj.cityOrArea.toLowerCase().includes(query) ||
          proj.interconnectionPoint.toLowerCase().includes(query) ||
          proj.interconnectionUtility.toLowerCase().includes(query) ||
          `${proj.county} county`.toLowerCase().includes(query);

        // Match by Performance Status
        const matchStatus =
          perf.status.toLowerCase().includes(query) ||
          (perf.status === 'CRITICAL' && (query.includes('alert') || query.includes('critical') || query.includes('degraded') || query.includes('fail') || query.includes('throttl') || query.includes('risk') || query.includes('deficit'))) ||
          (perf.status === 'WATCH' && (query.includes('watch') || query.includes('warn') || query.includes('underperform') || query.includes('clip') || query.includes('parasit'))) ||
          (perf.status === 'NOMINAL' && (query.includes('nominal') || query.includes('optimal') || query.includes('pass') || query.includes('healthy') || query.includes('good'))) ||
          (perf.issue && perf.issue.toLowerCase().includes(query)) ||
          `${perf.rtePct}%`.includes(query) ||
          `${perf.cellTempC}°c`.toLowerCase().includes(query);

        // Match by Name & Tech
        const matchGeneral =
          proj.name.toLowerCase().includes(query) ||
          proj.technology.toLowerCase().includes(query) ||
          proj.projectStatus.toLowerCase().includes(query);

        const isMatch = matchId || matchLocation || matchStatus || matchGeneral;

        let matchType: 'ID' | 'LOCATION' | 'PERFORMANCE' | 'NAME' = 'NAME';
        if (matchStatus) matchType = 'PERFORMANCE';
        else if (matchLocation) matchType = 'LOCATION';
        else if (matchId) matchType = 'ID';

        return {
          project: proj,
          performance: perf,
          isMatch,
          matchType,
        };
      })
      .filter((item) => item.isMatch);
  }, [projects, query]);

  // Secondary matches for Companies & Opportunities
  const matchedCompanies = useMemo(() => {
    if (!query) return [];
    return companies.filter(
      (c) =>
        c.displayName.toLowerCase().includes(query) ||
        c.legalName.toLowerCase().includes(query) ||
        c.domain.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [companies, query]);

  const totalMatches = matchedSites.length + matchedCompanies.length;

  const handleSelectProject = (projectId: string) => {
    setActiveTab('projects');
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    setActiveTab('today');
    setIsOpen(false);
  };

  const handleSelectCompany = () => {
    setActiveTab('companies');
    setIsOpen(false);
  };

  const handleApplyPreset = (presetQuery: string) => {
    setGlobalSearchQuery(presetQuery);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-52 sm:w-64 md:w-80 lg:w-96">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
        <input
          ref={inputRef}
          type="text"
          value={globalSearchQuery}
          onChange={(e) => {
            setGlobalSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search BESS sites by ID, location, or status..."
          className={`w-full pl-9 pr-14 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans shadow-xs transition-all ${
            theme === 'dark'
              ? 'bg-[#0B1424] hover:bg-[#0D1829] focus:bg-[#070D18] border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
              : 'bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
          }`}
        />

        {/* Clear or Keyboard Hint */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {globalSearchQuery ? (
            <button
              onClick={() => {
                setGlobalSearchQuery('');
                setIsOpen(false);
              }}
              className={`p-0.5 rounded focus:outline-none ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded ${
              theme === 'dark'
                ? 'text-slate-400 bg-slate-800 border border-slate-700'
                : 'text-slate-600 bg-slate-200 border border-slate-300'
            }`}>
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Quick Results Overlay */}
      {isOpen && (
        <div className={`absolute left-0 right-0 mt-1.5 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto divide-y ${
          theme === 'dark'
            ? 'bg-[#0B1528] border border-slate-700/90 text-slate-200 divide-slate-800/80'
            : 'bg-white border border-slate-200 text-slate-900 divide-slate-100 shadow-xl'
        }`}>
          {/* Header Bar */}
          <div className={`px-3.5 py-2 border-b flex items-center justify-between text-[11px] font-mono ${
            theme === 'dark'
              ? 'bg-[#070D18] border-slate-800 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className={`flex items-center gap-1.5 font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>BESS Site Intelligence Search</span>
            </span>
            <span>{query ? `${totalMatches} match${totalMatches === 1 ? '' : 'es'}` : 'Press Esc to close'}</span>
          </div>

          {/* Quick Filter Presets (When input is empty or operator wants quick filters) */}
          {!query && (
            <div className={`p-3 space-y-2 border-b ${
              theme === 'dark'
                ? 'bg-[#0B1528] border-slate-800'
                : 'bg-white border-slate-100'
            }`}>
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Quick Lookups by ID, Location & Status:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleApplyPreset('Critical')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <AlertOctagon className={`w-3 h-3 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} />
                  <span>Status: Critical (&lt;85% RTE)</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('Watch')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className={`w-3 h-3 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span>Status: Watch</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('Nominal')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <ShieldCheck className={`w-3 h-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Status: Nominal (≥85%)</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('Kern')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Kern County</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('#1504')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>CAISO Queue #1504</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('230kV')}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>230kV Interconnection</span>
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && totalMatches === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-white">No BESS sites found for "{globalSearchQuery}"</div>
              <p className="text-[11px] text-slate-500">
                Try searching by ID (e.g. <code>#1504</code>, <code>proj_desert_peak</code>), location (e.g. <code>Kern</code>, <code>Morro Bay</code>, <code>230kV</code>), or status (e.g. <code>Critical</code>, <code>Watch</code>, <code>Nominal</code>).
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {/* Group 1: BESS Sites Matches (Highlighted with Status Badges & Telemetry) */}
              {matchedSites.length > 0 && (
                <div className="p-2 space-y-1.5">
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    <span>BESS SITES ({matchedSites.length})</span>
                    <span>MATCHED BY {matchedSites[0].matchType}</span>
                  </div>

                  {matchedSites.map(({ project: proj, performance: perf }) => {
                    const isCritical = perf.status === 'CRITICAL';
                    const isWarning = perf.status === 'WATCH';
                    const isNominal = perf.status === 'NOMINAL';

                    return (
                      <div
                        key={proj.id}
                        onClick={() => handleSelectProject(proj.id)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/70 transition-all border border-transparent hover:border-slate-700 cursor-pointer space-y-1.5 group"
                      >
                        {/* Title and Color-Coded Performance Status Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                              <span>{proj.name}</span>
                              <span className="text-[10px] font-mono text-slate-500 font-normal">
                                ({proj.id})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span>{proj.county} County, CA</span>
                              </span>
                              <span>·</span>
                              <span className="font-mono text-slate-300">
                                {proj.capacityMw} MW / {proj.energyMwh} MWh
                              </span>
                              <span>·</span>
                              <span className="font-mono text-slate-300">
                                POI: {proj.interconnectionPoint}
                              </span>
                            </div>
                          </div>

                          {/* Color-Coded Status Badge */}
                          <div className="shrink-0">
                            {isCritical && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                <AlertOctagon className="w-3 h-3 text-rose-400 shrink-0" />
                                <span>CRITICAL ({perf.rtePct}% RTE)</span>
                              </span>
                            )}
                            {isWarning && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>WATCH ({perf.rtePct}% RTE)</span>
                              </span>
                            )}
                            {isNominal && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>NOMINAL ({perf.rtePct}% RTE)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ID Provenance and Root Cause if Underperforming */}
                        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                          <div className="flex items-center gap-2">
                            {proj.sourceIds.caisoQueueId && (
                              <span className="bg-[#070D18] px-1.5 py-0.2 rounded text-slate-300 border border-slate-800">
                                CAISO Queue #{proj.sourceIds.caisoQueueId}
                              </span>
                            )}
                            {proj.sourceIds.countyPermitId && (
                              <span className="bg-[#070D18] px-1.5 py-0.2 rounded text-slate-300 border border-slate-800">
                                Permit: {proj.sourceIds.countyPermitId}
                              </span>
                            )}
                            <span className="text-slate-400">
                              Temp: {perf.cellTempC}°C
                            </span>
                          </div>

                          <span className="text-emerald-400 text-xs font-semibold group-hover:underline flex items-center gap-0.5">
                            <span>Open Dossier</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Cause Snippet */}
                        {perf.issue && (
                          <div className="text-[10px] text-rose-300 bg-rose-950/60 p-1.5 rounded border border-rose-800/60 font-sans">
                            <span className="font-semibold text-rose-200">Diagnostic Signal:</span> {perf.issue}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Group 2: Companies Matches */}
              {matchedCompanies.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    DEVELOPERS & OPERATORS ({matchedCompanies.length})
                  </div>
                  {matchedCompanies.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleSelectCompany()}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center justify-between text-xs group"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{comp.displayName}</span>
                          <span className="text-[10px] font-mono text-slate-500">({comp.domain})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate font-sans">
                          {comp.relevanceRationale}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Guide */}
          <div className="px-3.5 py-2 bg-[#070D18] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Filter syntax: by ID (<code>#1428</code>), County (<code>Kern</code>), or Status (<code>Critical</code>, <code>Nominal</code>)</span>
            <span className="text-emerald-400 font-semibold cursor-pointer hover:underline" onClick={() => handleSelectToday()}>
              View Today Queue →
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
