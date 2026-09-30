import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityStage, OpportunityRecord } from '../../types';
import { ProposalModal } from '../modals/ProposalModal';
import {
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Building2,
  Mail,
  Zap,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Compass,
  Radar,
  Activity,
  Layers,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const {
    opportunities,
    projects,
    companies,
    contacts,
    outreachDrafts,
    updateOpportunityStage,
    openEvidenceDrawer,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);

  const stages: OpportunityStage[] = [
    'New',
    'Researching',
    'Qualified',
    'Ready for Outreach',
    'Contacted',
    'In Discussion',
    'Proposal',
    'Won',
    'Closed',
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    const project = projects.find((p) => p.id === opp.projectId);
    const company = companies.find((c) => c.id === opp.companyId);
    const contact = contacts.find((c) => c.id === opp.primaryContactId);

    const matchesSearch =
      project?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'ALL' || opp.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const activeOpp = selectedOppId
    ? opportunities.find((o) => o.id === selectedOppId) || opportunities[0]
    : opportunities[0];

  const activeProject = projects.find((p) => p.id === activeOpp?.projectId);
  const activeCompany = companies.find((c) => c.id === activeOpp?.companyId);
  const activeContact = contacts.find((c) => c.id === activeOpp?.primaryContactId);
  const activeDraft = outreachDrafts.find((d) => d.opportunityId === activeOpp?.id);

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Revenue Working Queue · California BESS Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Opportunities</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Screen, qualify, and advance source-grounded infrastructure deals toward engagement.
          </p>
        </div>

        {/* Search & Stage Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project, county, developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 w-56 sm:w-64"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
          >
            <option value="ALL">All Stages ({opportunities.length})</option>
            {stages.map((st) => (
              <option key={st} value={st}>
                {st} ({opportunities.filter((o) => o.stage === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left List (Queue) + Right Detail & Explainable Qualification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Opportunity Working Table / Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Active Pipeline Records ({filteredOpportunities.length})</span>
            <span className="text-emerald-400">Zero Speculative AI Scoring</span>
          </div>

          <div className="space-y-3">
            {filteredOpportunities.map((opp) => {
              const project = projects.find((p) => p.id === opp.projectId);
              const company = companies.find((c) => c.id === opp.companyId);
              const contact = contacts.find((c) => c.id === opp.primaryContactId);
              const isSelected = activeOpp?.id === opp.id;

              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOppId(opp.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left bg-[#0B1424]/95 shadow-lg shadow-black/20 ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#0E1B33]'
                      : 'border-slate-800/90 hover:border-slate-700 hover:bg-[#0D1829]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{project?.name}</span>
                        <span className="text-xs font-mono font-medium text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 tabular-nums">
                          {project?.capacityMw} MW / {project?.energyMwh} MWh
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-200">{company?.displayName}</span>
                        <span>·</span>
                        <span className="font-mono text-cyan-400">{project?.county} County</span>
                        <span>·</span>
                        <span className="text-slate-400">{project?.technology}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-slate-200 bg-[#070D18] px-2.5 py-1 rounded border border-slate-700">
                        {opp.stage}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">
                        {opp.owner.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Fit reason preview */}
                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed bg-[#070D18] p-2.5 rounded-lg border border-slate-800">
                    {opp.fitReason}
                  </p>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>Target: {contact?.name || 'No Contact Verified'}</span>
                      {contact?.emailVerificationStatus && (
                        <span className="text-[11px] font-mono text-emerald-400 font-medium">
                          ({contact.emailVerificationStatus})
                        </span>
                      )}
                    </div>
                    <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1 font-mono text-xs">
                      <span>Inspect Qualification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Qualification Breakdown & Stage Advancement (5 cols) */}
        {activeOpp && activeProject && (
          <div className="lg:col-span-5 bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-20 shadow-xl shadow-black/20">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Opportunity Profile · {activeOpp.id}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/80">
                  {activeOpp.stage}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1.5">{activeProject.name}</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {activeCompany?.displayName} · {activeProject.county} County, CA · POI: {activeProject.interconnectionPoint}
              </div>
            </div>

            {/* Quick Stage Advancement Controls */}
            <div className="p-3.5 bg-[#070D18] rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Advance Pipeline Stage
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {stages
                  .filter((s) => s !== 'Won' && s !== 'Closed')
                  .map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOpportunityStage(activeOpp.id, st)}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors text-left truncate ${
                        activeOpp.stage === st
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'bg-[#0B1424] text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
              </div>
            </div>

            {/* Explainable Qualification Factors (Non-Negotiable Principle: No mystery AI score) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Explainable Qualification Factors
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Rule-Backed Audit
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 text-xs bg-[#070D18]">
                <div className="p-3">
                  <div className="text-slate-400 font-mono text-[11px]">BESS Site Diligence Relevance</div>
                  <div className="text-slate-200 mt-0.5 leading-relaxed font-sans">
                    {activeOpp.qualificationFactors.bessSiteDiligenceRelevance}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-slate-400 font-mono text-[11px]">Documented Project Activity</div>
                  <div className="text-slate-200 mt-0.5 leading-relaxed font-sans">
                    {activeOpp.qualificationFactors.documentedStageActivity}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-slate-400 font-mono text-[11px]">Evidence Recency & Quality</div>
                  <div className="text-slate-200 mt-0.5 flex items-center justify-between">
                    <span>{activeOpp.qualificationFactors.recencySignal}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {activeOpp.qualificationFactors.evidenceQuality}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-slate-400 font-mono text-[11px]">Relevant Service / Deliverable</div>
                  <div className="text-emerald-300 font-semibold mt-0.5">
                    {activeOpp.relevantServiceDeliverable}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-slate-400 font-mono text-[11px]">Decision-Maker Contact Availability</div>
                  <div className="text-slate-200 mt-0.5">
                    {activeContact ? (
                      <span>
                        {activeContact.name} ({activeContact.title}) ·{' '}
                        <span className="font-semibold text-emerald-400 font-mono">
                          {activeContact.emailVerificationStatus}
                        </span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold font-mono">No Contact Verified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Action Box */}
            <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1.5">
              <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                Immediate Next Action
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                {activeOpp.nextAction}
              </p>
            </div>

            {/* Commercial Proposal & Outreach Action Triggers */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-100" />
                <span>Generate Commercial Diligence Scope & Proposal ($)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('outreach')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {activeDraft ? 'Review Grounded Outreach Draft' : 'Draft Personalized Outreach'}
                  </span>
                </button>

                <button
                  onClick={() => openEvidenceDrawer(activeProject.evidenceIds[0])}
                  className="px-3 py-2 text-xs font-medium text-slate-300 bg-[#070D18] border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Inspect linked primary sources"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Commercial Diligence Scope & Proposal Modal */}
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        opportunity={activeOpp || null}
      />
    </div>
  );
};
