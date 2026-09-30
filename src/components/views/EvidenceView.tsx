import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationState, SourceType } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Check,
  Ban,
  FileText,
  Compass,
  Radar,
  Activity,
} from 'lucide-react';

export const EvidenceView: React.FC = () => {
  const { evidence, projects, openEvidenceDrawer, confirmOrRejectInference } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('ALL');

  const filteredEvidence = evidence.filter((item) => {
    const project = projects.find((p) => p.id === item.projectId);
    const matchesSearch =
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rawValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.normalizedValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entityFieldSupported.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = stateFilter === 'ALL' || item.verificationState === stateFilter;
    const matchesSourceType = sourceTypeFilter === 'ALL' || item.sourceType === sourceTypeFilter;

    return matchesSearch && matchesState && matchesSourceType;
  });

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidence Ledger · Non-Negotiable Principle #1 & #2</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Source Evidence Ledger</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chain of provenance: no source = no factual claim. Inspect raw citations, verify inferences, and audit conflicting filings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search evidence text, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 w-52 sm:w-60"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
          >
            <option value="ALL">All States ({evidence.length})</option>
            <option value="VERIFIED">VERIFIED ({evidence.filter((e) => e.verificationState === 'VERIFIED').length})</option>
            <option value="CONFLICTING">CONFLICTING ({evidence.filter((e) => e.verificationState === 'CONFLICTING').length})</option>
            <option value="INFERENCE">INFERENCE ({evidence.filter((e) => e.verificationState === 'INFERENCE').length})</option>
            <option value="UNKNOWN">UNKNOWN ({evidence.filter((e) => e.verificationState === 'UNKNOWN').length})</option>
          </select>

          <select
            value={sourceTypeFilter}
            onChange={(e) => setSourceTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
          >
            <option value="ALL">All Source Connectors</option>
            <option value="CAISO_QUEUE">CAISO Queue</option>
            <option value="COUNTY_CEQA">County CEQA</option>
            <option value="BLM_REGISTER">BLM DRECP</option>
            <option value="UTILITY_FILING">Utility Filing</option>
          </select>
        </div>
      </div>

      {/* Verification State Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#0B1424]/95 border border-slate-800 rounded-xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-800/80">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">VERIFIED</div>
            <div className="text-[11px] text-slate-400">Official docket match</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#0B1424]/95 border border-slate-800 rounded-xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-800/80">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">CONFLICTING</div>
            <div className="text-[11px] text-slate-400">Multiple sources disagree</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#0B1424]/95 border border-slate-800 rounded-xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-800/80">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">INFERENCE</div>
            <div className="text-[11px] text-slate-400">Requires human sign-off</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#0B1424]/95 border border-slate-800 rounded-xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">UNKNOWN</div>
            <div className="text-[11px] text-slate-400">Unverifiable or missing</div>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-5 py-3.5 bg-[#070D18] border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300 font-mono">
            Showing {filteredEvidence.length} Ledger Items
          </span>
          <span className="text-slate-400 font-mono text-[11px]">Immutable Evidence Audit</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredEvidence.map((item) => {
            const project = projects.find((p) => p.id === item.projectId);

            return (
              <div key={item.id} className="p-5 hover:bg-slate-900/50 transition-colors space-y-3">
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        item.verificationState === 'VERIFIED'
                          ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                          : item.verificationState === 'CONFLICTING'
                          ? 'text-amber-300 bg-amber-950/80 border-amber-800'
                          : item.verificationState === 'INFERENCE'
                          ? 'text-cyan-300 bg-cyan-950/80 border-cyan-800'
                          : 'text-slate-400 bg-slate-900 border-slate-700'
                      }`}
                    >
                      {item.verificationState}
                    </span>

                    <span className="text-sm font-bold text-white">
                      {project?.name || item.projectId}
                    </span>

                    <span className="text-xs font-mono text-slate-600">·</span>

                    <span className="text-xs font-mono font-semibold text-slate-300 bg-[#070D18] px-2 py-0.5 rounded border border-slate-800">
                      Field: {item.entityFieldSupported}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Conf: {(item.confidenceScore * 100).toFixed(0)}%</span>
                    <span>·</span>
                    <span>{item.sourceDate}</span>
                  </div>
                </div>

                {/* Normalized Claim & Raw Excerpt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Normalized Extraction
                    </div>
                    <div className="text-emerald-400 font-mono font-semibold text-sm">
                      {item.normalizedValue}
                    </div>
                  </div>

                  <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Raw Citation Text (Source: {item.sourceName})
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-2">
                      "{item.rawValue}"
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Provenance Drawer Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-slate-400 font-mono text-[11px] flex items-center gap-2">
                    <span>Connector: {item.sourceType}</span>
                    <span>·</span>
                    <span className="truncate max-w-xs">{item.sourceUrlOrDocId}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Inference confirmation buttons */}
                    {item.verificationState === 'INFERENCE' && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <button
                          onClick={() => confirmOrRejectInference(item.id, 'CONFIRM', 'Managing Partner (Human Control Plane)')}
                          className="px-2 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => confirmOrRejectInference(item.id, 'REJECT', 'Managing Partner (Human Control Plane)')}
                          className="px-2 py-1 text-xs font-semibold text-rose-300 bg-rose-950 border border-rose-800 hover:bg-rose-900 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => openEvidenceDrawer(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-white bg-[#070D18] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 font-mono"
                    >
                      <span>Inspect Provenance</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
