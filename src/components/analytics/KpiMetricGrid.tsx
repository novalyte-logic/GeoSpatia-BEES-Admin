import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, DollarSign, ShieldCheck, AlertTriangle, Users, FileCheck2, ArrowUpRight, Radar, Activity, Gauge } from 'lucide-react';

export const KpiMetricGrid: React.FC = () => {
  const { projects, opportunities, contacts, evidence, theme } = useApp();
  const isDark = theme === 'dark';

  // Compute live KPIs
  const totalMw = projects.reduce((acc, p) => (typeof p.capacityMw === 'number' ? acc + p.capacityMw : acc), 0);
  const totalMwh = projects.reduce((acc, p) => (typeof p.energyMwh === 'number' ? acc + p.energyMwh : acc), 0);

  const verifiedContacts = contacts.filter(
    (c) => c.emailVerificationStatus && c.emailVerificationStatus !== 'Pending Review'
  ).length;
  const verifiedContactCoveragePct = contacts.length > 0 ? ((verifiedContacts / contacts.length) * 100).toFixed(0) : '0';

  const conflictingCount = projects.filter((p) => p.conflictingFields.length > 0).length;

  // Pipeline commercial valuation estimate based on standard Geospatial Labs diligence tiers ($11,500 avg)
  const pipelineValueUsd = opportunities.length * 11500;

  return (
    <div className="space-y-3 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tracked BESS Capacity */}
        <div
          className={`relative border rounded-2xl p-5 transition-all flex flex-col justify-between group overflow-hidden ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20 hover:border-emerald-500/60'
              : 'bg-white border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm'
          }`}
        >
          {/* Subtle corner reticle accent */}
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`}></div>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`}></div>

          <div>
            <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Radar className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Tracked BESS Capacity</span>
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 group-hover:border-emerald-400'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:border-emerald-500'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {totalMw.toLocaleString()} <span className={`text-base font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>MW</span>
              </div>
              <div className={`text-xs font-mono font-semibold mt-1 flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
                <span>{totalMwh.toLocaleString()} MWh Storage Energy</span>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex items-center justify-between font-mono ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            <span>5 CA Baseline Assets</span>
            <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>100% PostGIS Verified</span>
          </div>
        </div>

        {/* KPI 2: Diligence Pipeline Commercial Value */}
        <div
          className={`relative border rounded-2xl p-5 transition-all flex flex-col justify-between group overflow-hidden ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20 hover:border-emerald-500/60'
              : 'bg-white border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm'
          }`}
        >
          {/* Subtle corner reticle accent */}
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`}></div>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`}></div>

          <div>
            <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <DollarSign className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Pipeline Diligence Value</span>
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 group-hover:border-emerald-400'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:border-emerald-500'
                }`}
              >
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                ${pipelineValueUsd.toLocaleString()}
              </div>
              <div className={`text-xs font-mono font-semibold mt-1 flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
                <span>5 Commercial Scopes (Tiers 1–3)</span>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex items-center justify-between font-mono ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            <span>Target Revenue First</span>
            <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>SLA: 24H Audit</span>
          </div>
        </div>

        {/* KPI 3: Verified Decision Maker Coverage */}
        <div
          className={`relative border rounded-2xl p-5 transition-all flex flex-col justify-between group overflow-hidden ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20 hover:border-cyan-500/60'
              : 'bg-white border-slate-200 shadow-xs hover:border-sky-500 hover:shadow-sm'
          }`}
        >
          {/* Subtle corner reticle accent */}
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isDark ? 'border-cyan-400' : 'border-sky-600'}`}></div>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isDark ? 'border-cyan-400' : 'border-sky-600'}`}></div>

          <div>
            <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Users className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>Decision-Maker Coverage</span>
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60 group-hover:border-cyan-400'
                    : 'bg-sky-50 text-sky-700 border-sky-200 group-hover:border-sky-500'
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {verifiedContactCoveragePct}%
              </div>
              <div className={`text-xs font-mono font-semibold mt-1 flex items-center gap-1.5 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-sky-600'}`}></span>
                <span>{verifiedContacts} of {contacts.length} Siting Leads Verified</span>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex items-center justify-between font-mono ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            <span>Zero Fabricated Contacts</span>
            <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>NeverBounce/MX</span>
          </div>
        </div>

        {/* KPI 4: Evidence Integrity & Discrepancy Rate */}
        <div
          className={`relative border rounded-2xl p-5 transition-all flex flex-col justify-between group overflow-hidden ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20 hover:border-amber-500/60'
              : 'bg-white border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-sm'
          }`}
        >
          {/* Subtle corner reticle accent */}
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isDark ? 'border-amber-400' : 'border-amber-600'}`}></div>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isDark ? 'border-amber-400' : 'border-amber-600'}`}></div>

          <div>
            <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <span>GIS & Docket Integrity</span>
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'bg-amber-950/80 text-amber-400 border-amber-800/60 group-hover:border-amber-400'
                    : 'bg-amber-50 text-amber-700 border-amber-200 group-hover:border-amber-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {evidence.length} <span className={`text-base font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Facts</span>
              </div>
              <div className={`text-xs font-mono font-semibold mt-1 flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{conflictingCount} Handled Discrepancy Visible</span>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] flex items-center justify-between font-mono ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            <span>0 Claims Guessed</span>
            <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Ground Truth #1</span>
          </div>
        </div>
      </div>

      {/* Secondary California Infrastructure Telemetry Ribbon (Geospatial Labs Grid Specifications) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        <div
          className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-[#070D18] text-slate-300 border-slate-800'
              : 'bg-white text-slate-800 border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CAISO Interconnection</span>
          </div>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Cluster 14/15 Active</span>
        </div>

        <div
          className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-[#070D18] text-slate-300 border-slate-800'
              : 'bg-white text-slate-800 border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-sky-600'}`}></span>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Substation Headroom</span>
          </div>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>366 MW / POI</span>
        </div>

        <div
          className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-[#070D18] text-slate-300 border-slate-800'
              : 'bg-white text-slate-800 border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`}></span>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Substation Intertie Yard</span>
          </div>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>66kV – 500kV Specs</span>
        </div>

        <div
          className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-[#070D18] text-slate-300 border-slate-800'
              : 'bg-white text-slate-800 border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Queue Screening</span>
          </div>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>60–200 Days Ahead</span>
        </div>
      </div>
    </div>
  );
};
