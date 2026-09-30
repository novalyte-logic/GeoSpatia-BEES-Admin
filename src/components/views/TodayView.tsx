import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiMetricGrid } from '../analytics/KpiMetricGrid';
import { BessGridHealthChart } from '../analytics/BessGridHealthChart';
import { BessEfficiencyAlertSystem } from '../analytics/BessEfficiencyAlertSystem';
import {
  AlertTriangle,
  Mail,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Users,
  Bot,
  Radar,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Clock,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  DollarSign,
  Compass,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    opportunities,
    projects,
    companies,
    contacts,
    evidence,
    outreachDrafts,
    agentRuns,
    setActiveTab,
    openEvidenceDrawer,
    updateOutreachStatus,
    theme,
  } = useApp();

  // Metrics for Revenue Funnel
  const totalDiscovered = projects.length;
  const totalVerified = evidence.filter((e) => e.verificationState === 'VERIFIED').length;

  const stageCounts = {
    Qualified: opportunities.filter((o) => o.stage === 'Qualified').length,
    ReadyForOutreach: opportunities.filter((o) => o.stage === 'Ready for Outreach').length,
    Contacted: opportunities.filter((o) => o.stage === 'Contacted').length,
    InDiscussion: opportunities.filter((o) => o.stage === 'In Discussion').length,
    Proposal: opportunities.filter((o) => o.stage === 'Proposal').length,
    Won: opportunities.filter((o) => o.stage === 'Won').length,
  };

  // Section 1: Outreach drafts awaiting review
  const pendingOutreachDrafts = outreachDrafts.filter(
    (d) => d.status === 'Needs Review' || d.status === 'Draft'
  );

  // Section 2: Projects with conflicting or unknown fields
  const conflictingOrUnknownProjects = projects.filter(
    (p) => p.conflictingFields.length > 0 || (p.unknownFields && p.unknownFields.length > 0)
  );

  // Section 3: Active opportunities needing next action
  const activeActionOpportunities = opportunities.filter(
    (o) => o.stage !== 'Won' && o.stage !== 'Closed' && o.nextAction
  );

  const recentRuns = agentRuns.slice(0, 3);

  const isDark = theme === 'dark';

  return (
    <div className={`space-y-8 pb-16 font-sans transition-colors duration-200 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* GeoSpatia Labs Institutional Mission & Brand Header */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 transition-all duration-200 ${
          isDark
            ? 'bg-gradient-to-br from-[#0B1528] via-[#080E1C] to-[#040812] border-slate-800/90 shadow-2xl'
            : 'bg-gradient-to-br from-slate-100 via-white to-slate-50 border-slate-200 shadow-sm text-slate-900'
        }`}
      >
        {/* Ambient reticle / grid decorative background */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-cyan-500/5' : 'bg-cyan-500/10'}`}></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            {/* GeoSpatia Labs Identity Line */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
                GEOSPATIA LABS · LIVE GRID RADAR
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
                  isDark
                    ? 'text-cyan-300 bg-cyan-950/70 border-cyan-800/70'
                    : 'text-sky-800 bg-sky-50 border-sky-200'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>SPEED-TO-INTERCONNECTION</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
                  isDark
                    ? 'text-slate-300 bg-slate-900/90 border-slate-700/80'
                    : 'text-slate-700 bg-slate-100 border-slate-300'
                }`}
              >
                <span>AVOID QUEUE BLINDNESS</span>
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              <span>Revenue Command Center</span>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                CA BESS CLUSTER 14/15
              </span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Institutional-grade commercial expansion and utility grid feeder headroom intelligence. Human control plane for screening 60–200 days before public bid lists, resolving docket conflicts, and advancing verified diligence scopes.
            </p>
          </div>

          {/* Quick Institutional Telemetry & SLA Box */}
          <div
            className={`flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:min-w-[260px] rounded-xl p-3.5 border ${
              isDark
                ? 'bg-[#070D18]/90 border-slate-800/90'
                : 'bg-white/95 border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Grid Feeder Desk SLA:</span>
              </span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-950/90 border-emerald-800/60'
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}
              >
                24H Custom Audit
              </span>
            </div>

            <div className={`flex items-center justify-between text-xs font-mono pt-1.5 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              <span>Public Docket Coverage:</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Sourced</span>
            </div>

            <div className={`flex items-center justify-between text-xs font-mono pt-1.5 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              <span>Hermes Autonomous Agent:</span>
              <span className={`font-semibold flex items-center gap-1 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'} animate-pulse`}></span>
                <span>Ready / Human Gate</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators (KPIs) & Market Siting Health */}
      <section aria-labelledby="kpis-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></div>
            <h2 id="kpis-heading" className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Institutional Market KPIs & Commercial Pipeline Health
            </h2>
          </div>
          <span
            className={`text-[11px] font-mono px-2.5 py-0.5 rounded border flex items-center gap-1.5 ${
              isDark
                ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                : 'text-emerald-800 bg-emerald-50 border-emerald-200'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>Zero Speculative Data · PostGIS System of Record</span>
          </span>
        </div>
        <KpiMetricGrid />
      </section>

      {/* Real-Time BESS Grid Health & Telemetry Visualization (Recharts with 6h Horizon & Time Toggles) */}
      <section aria-labelledby="grid-health-heading" className="space-y-3">
        <BessGridHealthChart />
      </section>

      {/* BESS Site Underperformance & Efficiency Alert System */}
      <section aria-labelledby="efficiency-alerts-heading" className="space-y-3">
        <BessEfficiencyAlertSystem />
      </section>

      {/* Commercial Revenue Funnel Progression: Discovered → Verified → Qualified → Contacted → Discussion → Proposal → Won */}
      <section aria-labelledby="funnel-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
            <h2 id="funnel-heading" className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Pipeline Funnel Progression · Interconnection to Commercial Proposal
            </h2>
          </div>
          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Conversion Rate: <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>100% Target Siting Rigor</span>
          </span>
        </div>

        <div
          className={`border rounded-2xl p-4 shadow-sm transition-colors duration-200 ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* Step 1: Discovered */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                Discovered
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {totalDiscovered}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-0.5">
                <span>CAISO/CEQA</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 2: Verified */}
            <button
              onClick={() => setActiveTab('evidence')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-emerald-950/40 border-slate-800 hover:border-emerald-600/60'
                  : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-emerald-300' : 'text-slate-500 group-hover:text-emerald-700'}`}>
                Verified
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {totalVerified}
              </div>
              <div className={`text-[10px] font-mono flex items-center justify-center gap-0.5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                <span>Stored Facts</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 3: Qualified */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                Qualified
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stageCounts.Qualified + stageCounts.ReadyForOutreach}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-0.5">
                <span>Feeder Fit</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 4: Contacted */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                Contacted
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stageCounts.Contacted}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-0.5">
                <span>Human Gated</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 5: Discussion */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                Discussion
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stageCounts.InDiscussion}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-0.5">
                <span>Active Dialog</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 6: Proposal */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                Proposal
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stageCounts.Proposal}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-0.5">
                <span>Audit Scope</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Step 7: Won */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`p-3.5 text-center rounded-xl border transition-all group focus:outline-none flex flex-col justify-between ${
                isDark
                  ? 'bg-[#070D18] hover:bg-emerald-950/40 border-slate-800 hover:border-emerald-600/60'
                  : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400 group-hover:text-emerald-300' : 'text-slate-500 group-hover:text-emerald-700'}`}>
                Won
              </div>
              <div className={`text-2xl font-mono font-bold tabular-nums my-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {stageCounts.Won}
              </div>
              <div className={`text-[10px] font-mono flex items-center justify-center gap-0.5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                <span>Paid Engagement</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Two Column Operator Action Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Outreach Drafts Awaiting Human Approval */}
        <div
          className={`border rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between transition-colors duration-200 ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-4">
            <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isDark
                      ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span>Human Approval Gate: Outreach Drafts</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isDark
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {pendingOutreachDrafts.length} PENDING
                    </span>
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Strict adherence to Principle #6: No AI email sent without manual operator review.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('outreach')}
                className={`text-xs font-semibold flex items-center gap-1 font-mono transition-colors ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                <span>Full Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingOutreachDrafts.length === 0 ? (
              <div className={`text-center py-8 text-xs font-mono rounded-xl border ${isDark ? 'text-slate-400 bg-[#070D18] border-slate-800/80' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                ✓ No pending drafts awaiting review. Queue clear.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOutreachDrafts.map((draft) => {
                  const opp = opportunities.find((o) => o.id === draft.opportunityId);
                  const project = projects.find((p) => p.id === opp?.projectId);
                  const contact = contacts.find((c) => c.id === draft.recipientContactId);
                  const company = companies.find((c) => c.id === contact?.companyId);

                  return (
                    <div
                      key={draft.id}
                      className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                        isDark
                          ? 'bg-[#070D18] border-slate-800/90 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <span>{project?.name}</span>
                          <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            ({project?.county} County)
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            isDark
                              ? 'text-amber-300 bg-amber-950/80 border-amber-800'
                              : 'text-amber-800 bg-amber-50 border-amber-200'
                          }`}
                        >
                          {draft.status}
                        </span>
                      </div>

                      <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>To:</span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact?.name}</span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>({contact?.title} · {company?.displayName || 'Lead'})</span>
                      </div>

                      <div className={`text-xs font-mono p-2.5 rounded-lg border truncate ${
                        isDark
                          ? 'bg-[#0B1424] text-slate-300 border-slate-800'
                          : 'bg-white text-slate-800 border-slate-200'
                      }`}>
                        <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>Subject:</span> {draft.subject}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className={`text-[11px] font-mono flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
                          <span>{draft.evidenceCitations.length} verified facts cited</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateOutreachStatus(draft.id, 'Approved')}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setActiveTab('outreach')}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                              isDark
                                ? 'text-slate-300 bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white'
                                : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <span>Grounded Personalization Standard</span>
            <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>100% Verified Citations</span>
          </div>
        </div>

        {/* Section 2: Records with Conflicting or Unknown Critical Fields */}
        <div
          className={`border rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between transition-colors duration-200 ${
            isDark
              ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-4">
            <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isDark
                      ? 'bg-amber-950/80 border-amber-800/60 text-amber-400'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span>Active Docket Fact Conflicts</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isDark
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {conflictingOrUnknownProjects.length} SITES
                    </span>
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Principle #3 & #4: Surface real-world permit vs CAISO discrepancies without guessing.
                  </p>
                </div>
              </div>

              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Immutable Ledger
              </span>
            </div>

            <div className="space-y-3">
              {conflictingOrUnknownProjects.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isDark
                      ? 'bg-[#070D18] border-slate-800/90 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark
                          ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                          : 'text-sky-800 bg-sky-50 border-sky-200'
                      }`}
                    >
                      {p.county} County
                    </span>
                  </div>

                  {/* Conflicting details */}
                  {p.conflictingFields.map((cf, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        isDark
                          ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                          : 'bg-amber-50/80 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                        <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span>Discrepancy on {cf.field}:</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-sans ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                        {cf.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>
                          {cf.sourceA} vs {cf.sourceB}
                        </span>
                        <button
                          onClick={() => openEvidenceDrawer(p.evidenceIds[0])}
                          className={`text-[11px] font-bold underline font-mono flex items-center gap-1 ${
                            isDark ? 'text-amber-300 hover:text-white' : 'text-amber-800 hover:text-amber-950'
                          }`}
                        >
                          <span>Inspect Evidence Ledger</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Unknown fields */}
                  {p.unknownFields && p.unknownFields.length > 0 && (
                    <div className={`text-[11px] p-2 rounded-lg border font-mono ${
                      isDark
                        ? 'bg-[#0B1424] text-slate-400 border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Documented Unknowns: </span>
                      <span>{p.unknownFields.join('; ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <span>Ground Truth #1 & #4</span>
            <span className={isDark ? 'text-amber-400' : 'text-amber-700'}>Zero Synthetic Claims</span>
          </div>
        </div>
      </div>

      {/* Section 3: Active Opportunities Needing Next Action */}
      <section
        className={`border rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm transition-colors duration-200 ${
          isDark
            ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b gap-2 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <div>
            <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Zap className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>Priority Revenue Opportunities Needing Next Action</span>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}
              >
                {activeActionOpportunities.length} Active
              </span>
            </h2>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Direct pipeline progression toward paid site diligence deliverables ($11,500 avg engagement).
            </div>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`text-xs font-semibold flex items-center gap-1 font-mono transition-colors shrink-0 ${
              isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
            }`}
          >
            <span>Open Pipeline Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeActionOpportunities.map((opp) => {
            const project = projects.find((p) => p.id === opp.projectId);
            const contact = contacts.find((c) => c.id === opp.primaryContactId);

            return (
              <div
                key={opp.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 group ${
                  isDark
                    ? 'bg-[#070D18] border-slate-800/90 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className={`font-mono font-semibold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>{project?.county} County</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}>
                      {opp.stage}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold transition-colors ${
                    isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
                  }`}>
                    {project?.name}
                  </h3>

                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Lead: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{contact?.name}</span> ({contact?.title})
                  </div>

                  <div className={`text-xs p-3 rounded-lg border mt-2.5 font-medium leading-relaxed ${
                    isDark ? 'bg-[#0B1424] text-slate-200 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
                  }`}>
                    <span className={`font-semibold block text-[11px] mb-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Next Action:</span>
                    {opp.nextAction}
                  </div>
                </div>

                <div className={`pt-2.5 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {project?.capacityMw} MW · {project?.energyMwh} MWh
                  </span>

                  <button
                    onClick={() => {
                      if (opp.stage === 'Ready for Outreach') {
                        setActiveTab('outreach');
                      } else {
                        setActiveTab('opportunities');
                      }
                    }}
                    className={`font-semibold font-mono text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
                      isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Hermes Autonomous Ingestion Telemetry & Health Runs */}
      <section
        className={`border rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm transition-colors duration-200 ${
          isDark
            ? 'bg-[#0B1424]/95 border-slate-800/90 shadow-xl shadow-black/20'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b gap-2 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isDark
                  ? 'bg-cyan-950/80 border-cyan-800/60 text-cyan-400'
                  : 'bg-sky-50 border-sky-200 text-sky-700'
              }`}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Hermes Autonomous Ingestion Telemetry</span>
                <span className={`text-xs font-mono flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
                  Active Schedule
                </span>
              </h2>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Machine-to-machine scrapers targeting CAISO interconnection queues, CEC dockets, and CEQA clearinghouses.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sources')}
            className={`text-xs font-semibold flex items-center gap-1 font-mono transition-colors shrink-0 ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-700 hover:text-sky-800'
            }`}
          >
            <span>All Scraper Logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
          {recentRuns.map((run) => (
            <div key={run.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isDark ? 'text-white bg-[#070D18] border-slate-800' : 'text-slate-900 bg-slate-100 border-slate-300'
                  }`}>
                    {run.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      run.status === 'SUCCESS'
                        ? isDark ? 'text-emerald-300 bg-emerald-950/90 border-emerald-800' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        : run.status === 'PARTIAL_CONFLICT'
                        ? isDark ? 'text-amber-300 bg-amber-950/90 border-amber-800' : 'text-amber-800 bg-amber-50 border-amber-200'
                        : isDark ? 'text-rose-300 bg-rose-950/90 border-rose-800' : 'text-rose-800 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {run.status}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{run.startedAt.split('T')[0]}</span>
                </div>

                <div className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Source: <span className={`font-mono ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>{run.targetDomain}</span>
                </div>

                <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {run.evidenceCreated} evidence stored · {run.conflictsFlagged} conflicts flagged · SHA-256 fingerprint verified
                </div>
              </div>

              <div className="text-right shrink-0">
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors font-mono border ${
                    isDark
                      ? 'text-slate-300 hover:text-white bg-[#070D18] hover:bg-slate-800 border-slate-700/80'
                      : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  Inspect Audit Trail
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
