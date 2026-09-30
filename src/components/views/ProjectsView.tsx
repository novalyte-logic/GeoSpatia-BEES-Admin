import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectRecord } from '../../types';
import { GeospatialMap } from '../gis/GeospatialMap';
import {
  Search,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Building2,
  ChevronRight,
  Layers,
  History,
  Zap,
  Map,
  Compass,
  Radar,
  Activity,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, companies, evidence, auditLogs, openEvidenceDrawer } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj_desert_peak');
  const [searchQuery, setSearchQuery] = useState('');
  const [countyFilter, setCountyFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'dossier'>('both');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.interconnectionPoint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCounty = countyFilter === 'ALL' || p.county === countyFilter;

    return matchesSearch && matchesCounty;
  });

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || filteredProjects[0] || projects[0];

  const activeCompany = companies.find((c) => c.id === activeProject?.developerCompanyId);

  const projectEvidence = evidence.filter((e) => e.projectId === activeProject?.id);

  const projectAuditHistory = auditLogs.filter(
    (l) => l.targetId === activeProject?.id || l.details.includes(activeProject?.name || '---')
  );

  const counties = Array.from(new Set(projects.map((p) => p.county)));

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canonical Infrastructure Intelligence · PostGIS System of Record</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">California BESS Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified technical specifications, CAISO queue positions, environmental dockets, and source provenance.
          </p>
        </div>

        {/* Filter controls & View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#070D18] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'both' ? 'bg-[#0B1424] text-white font-semibold border border-slate-700 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-[#0B1424] text-white font-semibold border border-slate-700 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3 h-3 text-emerald-400" />
              <span>GIS Map</span>
            </button>
            <button
              onClick={() => setViewMode('dossier')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'dossier' ? 'bg-[#0B1424] text-white font-semibold border border-slate-700 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dossiers
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name, POI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
          >
            <option value="ALL">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Geospatial Labs GIS Map Section */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <section aria-label="California BESS Transmission and Siting GIS Map" className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geospatial Labs High-Precision BESS Transmission & Siting Map</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Click any project node to inspect specs & primary evidence
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl shadow-black/20">
            <GeospatialMap
              projects={filteredProjects}
              companies={companies}
              selectedProjectId={activeProject?.id}
              onSelectProject={(id) => setSelectedProjectId(id)}
              onOpenEvidence={(evId) => openEvidenceDrawer(evId)}
            />
          </div>
        </section>
      )}

      {/* Main Grid: Projects List (4 cols) + Canonical Project Record (8 cols) */}
      {(viewMode === 'both' || viewMode === 'dossier') && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Project Selector List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
            Projects ({filteredProjects.length})
          </div>

          <div className="space-y-2.5">
            {filteredProjects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;
              const hasConflict = proj.conflictingFields.length > 0;
              const comp = companies.find((c) => c.id === proj.developerCompanyId);

              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all bg-[#0B1424]/95 shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#0E1B33]'
                      : 'border-slate-800/90 hover:border-slate-700 hover:bg-[#0D1829]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-white">{proj.name}</span>
                    {hasConflict && (
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800 font-semibold shrink-0">
                        Conflict
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="font-medium text-slate-200">{comp?.displayName}</span>
                    <span>·</span>
                    <span className="font-mono text-cyan-400">{proj.county} County</span>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>
                      {proj.capacityMw} MW / {proj.energyMwh} MWh
                    </span>
                    <span className="text-emerald-400 font-semibold">{proj.interconnectionUtility}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Canonical Intelligence Dossier */}
        {activeProject && (
          <div className="lg:col-span-8 bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl shadow-black/20">
            {/* Title & Metadata Strip */}
            <div className="border-b border-slate-800/80 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span>Slug: {activeProject.slug}</span>
                  <span>·</span>
                  <span>Last Checked: {activeProject.lastCheckedDate}</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  PostGIS Point: [{activeProject.coordinates.lat.toFixed(4)},{' '}
                  {activeProject.coordinates.lng.toFixed(4)}]
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mt-2">{activeProject.name}</h2>

              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-200">{activeCompany?.displayName}</span>
                <span>·</span>
                <span>{activeProject.cityOrArea}, {activeProject.county} County, CA</span>
                <span>·</span>
                <span className="font-mono text-cyan-400">APN: {activeProject.parcelApn || 'UNKNOWN'}</span>
              </div>
            </div>

            {/* Conflicting Source Warning Banner (if present) */}
            {activeProject.conflictingFields.length > 0 && (
              <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Active Source Discrepancy (Principle #4 Enforced)</span>
                </div>
                {activeProject.conflictingFields.map((cf, idx) => (
                  <div key={idx} className="text-xs text-amber-200/90 space-y-1">
                    <p className="leading-relaxed">{cf.description}</p>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-amber-400">
                      <span>Queue Study: {cf.sourceA}</span>
                      <span>·</span>
                      <span>Permit EIR: {cf.sourceB}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Specifications Grid (MW and MWh strictly separated) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#070D18] rounded-xl border border-slate-800">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                  Power Capacity
                </div>
                <div className="text-xl font-mono font-bold text-white mt-0.5 tabular-nums">
                  {activeProject.capacityMw} MW
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Strictly primary record</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                  Energy Storage
                </div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                  {activeProject.energyMwh} MWh
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Never inferred from MW</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                  Discharge Duration
                </div>
                <div className="text-xl font-mono font-bold text-white mt-0.5 tabular-nums">
                  {activeProject.durationHours} Hours
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Utility standard</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                  Technology Class
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {activeProject.technology}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Standalone Grid BESS</div>
              </div>
            </div>

            {/* Interconnection & Permitting Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Interconnection Box */}
              <div className="bg-[#070D18] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interconnection Context</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Point of Interconnection (POI):</span>
                    <div className="font-semibold text-white mt-0.5 font-mono text-cyan-400">
                      {activeProject.interconnectionPoint}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Participating Transmission Owner (PTO):</span>
                    <div className="font-mono text-slate-200 font-medium">
                      {activeProject.interconnectionUtility}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">CAISO Queue Position:</span>
                    <div className="font-mono text-emerald-400 font-bold">
                      #{activeProject.sourceIds.caisoQueueId || 'UNKNOWN'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Queue Stage:</span>
                    <div className="text-slate-300 font-medium">{activeProject.interconnectionStatus}</div>
                  </div>
                </div>
              </div>

              {/* Permitting Box */}
              <div className="bg-[#070D18] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Permitting & Environmental Siting</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Permitting Agency Docket:</span>
                    <div className="font-mono text-white font-medium mt-0.5">
                      {activeProject.sourceIds.countyPermitId ||
                        activeProject.sourceIds.blmCaseId ||
                        'Pending County Docket'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">CEQA / NEPA Status:</span>
                    <div className="text-slate-200 font-semibold">{activeProject.ceqaStatus}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Current Milestone:</span>
                    <div className="text-slate-300">{activeProject.permittingStage}</div>
                  </div>
                  {activeProject.sourceIds.stateClearinghouseId && (
                    <div>
                      <span className="text-slate-400">State Clearinghouse:</span>
                      <span className="font-mono text-slate-200 ml-1">
                        SCH# {activeProject.sourceIds.stateClearinghouseId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Documented Unknowns */}
            {activeProject.unknownFields && activeProject.unknownFields.length > 0 && (
              <div className="p-3.5 bg-[#070D18] rounded-xl border border-slate-800 text-xs">
                <span className="font-mono font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Documented Unknowns (Principle #3: Never Guessed)
                </span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5 font-mono text-[11px]">
                  {activeProject.unknownFields.map((u, idx) => (
                    <li key={idx}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inspectable Evidence Ledger for this project */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Primary Source Evidence Ledger ({projectEvidence.length})
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Click fact to open drawer</span>
              </div>

              <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden bg-[#070D18]">
                {projectEvidence.map((ev) => {
                  const getExternalUrl = () => {
                    if (ev.sourceUrlOrDocId.startsWith('http://') || ev.sourceUrlOrDocId.startsWith('https://')) return ev.sourceUrlOrDocId;
                    if (ev.sourceType === 'CAISO_QUEUE') return 'https://www.caiso.com/library/interconnection-queue-reports';
                    if (ev.sourceUrlOrDocId.includes('SCH#')) {
                      const match = ev.sourceUrlOrDocId.match(/20\d{7}/);
                      if (match) return `https://ceqanet.opr.ca.gov/${match[0]}/1`;
                    }
                    return 'https://ceqanet.opr.ca.gov/';
                  };

                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 hover:bg-slate-900 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1 cursor-pointer" onClick={() => openEvidenceDrawer(ev)}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{ev.sourceName}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                              ev.verificationState === 'VERIFIED'
                                ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                                : ev.verificationState === 'CONFLICTING'
                                ? 'text-amber-300 bg-amber-950/80 border-amber-800'
                                : 'text-sky-300 bg-sky-950/80 border-sky-800'
                            }`}
                          >
                            {ev.verificationState}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">{ev.sourceDate}</span>
                        </div>
                        <div className="text-slate-300 font-medium">{ev.normalizedValue}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={getExternalUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] font-mono font-medium text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 hover:bg-cyan-900/60 rounded flex items-center gap-1 transition-colors"
                          title="Open official source record in a new tab"
                        >
                          <span>Open source record</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => openEvidenceDrawer(ev)}
                          className="px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded transition-colors cursor-pointer"
                        >
                          Provenance
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit & Change History */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Change & Ingestion Audit Trail</span>
              </div>
              <div className="text-xs space-y-1.5">
                {projectAuditHistory.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-2.5 bg-[#070D18] rounded-lg border border-slate-800 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-slate-200">
                        {log.actorName} · {log.action}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      {log.timestamp.split('T')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
