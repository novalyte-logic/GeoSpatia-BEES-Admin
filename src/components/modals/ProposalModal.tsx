import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityRecord, ProjectRecord, CompanyRecord, ContactRecord } from '../../types';
import { X, FileText, CheckCircle2, Copy, Check, Download, DollarSign, ShieldCheck, Compass } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: OpportunityRecord | null;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose, opportunity }) => {
  const { projects, companies, contacts, updateOpportunityStage } = useApp();

  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !opportunity) return null;

  const project = projects.find((p) => p.id === opportunity.projectId);
  const company = companies.find((c) => c.id === opportunity.companyId);
  const contact = contacts.find((c) => c.id === opportunity.primaryContactId);

  const tiers = {
    tier1: {
      name: 'Rapid POI Siting Feasibility Brief',
      turnaround: '48 Hours',
      fee: '$4,800 USD',
      deliverables: [
        `High-resolution POI buffer analysis for ${project?.interconnectionPoint}`,
        `Preliminary parcel APN boundary verification (${project?.parcelApn || 'Target Area'})`,
        'CAL FIRE / Seismic / Flood 100-year geohazard screen',
        'Executive PDF Summary (4-6 pages) with surveyor-grade maps',
      ],
    },
    tier2: {
      name: 'Comprehensive Pre-EPC BESS Site Constraint Dossier',
      turnaround: '5 Business Days',
      fee: '$11,500 USD',
      deliverables: [
        `Complete boundary & gen-tie corridor GIS mapping into ${project?.interconnectionPoint}`,
        `Adjacent land ownership & agricultural setback analysis for APN ${project?.parcelApn || 'site'}`,
        'Full CEQA / NEPA environmental clearance overlay (biological & cultural)',
        'Surveyor-verified GeoPackage / Shapefiles ready for EPC engineering integration',
        '1-hour technical walkthrough with Geospatial Labs principal engineer',
      ],
    },
    tier3: {
      name: 'Turnkey Permitting & Regulatory Hearing Siting Package',
      turnaround: '10 Business Days',
      fee: '$22,000 USD',
      deliverables: [
        'All deliverables from Tier 2 Comprehensive Dossier',
        'Expert witness & planning commission hearing exhibit maps',
        'Defensive coastal hazard & tsunami/sea-level rise inundation modeling',
        'CAISO Cluster 14/15 queue capacity and upgrade headroom validation',
        'Dedicated senior geospatial engineer on-call through permit approval',
      ],
    },
  };

  const activeTier = tiers[selectedTier];

  const proposalText = `GEOSPATIAL LABS COMMERCIAL DILIGENCE SCOPE & PROPOSAL
Project: ${project?.name} (${project?.capacityMw} MW / ${project?.energyMwh} MWh BESS)
Client: ${company?.displayName} (${company?.legalName})
Prepared for: ${contact?.name || 'Development Director'}, ${contact?.title || 'BESS Siting'}
Point of Interconnection: ${project?.interconnectionPoint} (${project?.interconnectionUtility})
Date: ${new Date().toISOString().split('T')[0]}

PACKAGE: ${activeTier.name}
INVESTMENT: ${activeTier.fee}
DELIVERY TIMELINE: ${activeTier.turnaround}

SCOPE OF WORK & DELIVERABLES:
${activeTier.deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}

ACCEPTANCE & NEXT STEPS:
To authorize this engagement and initiate diligence on ${project?.name}, reply to this proposal confirming acceptance of ${activeTier.fee} terms. Geospatial Labs will dispatch the initial spatial briefing within ${activeTier.turnaround}.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceToProposalStage = () => {
    updateOpportunityStage(
      opportunity.id,
      'Proposal',
      `Commercial proposal generated: ${activeTier.name} (${activeTier.fee})`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-[#0B1424] rounded-2xl shadow-2xl border border-slate-700 max-w-3xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-[#070D18] rounded-t-2xl">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 inline-block">
              Revenue Conversion Tool
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Geospatial Labs Site Diligence Proposal Generator
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Target Opportunity Strip */}
          <div className="p-4 bg-[#070D18] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-slate-400 font-mono uppercase text-[10px]">Target Asset</div>
              <div className="font-bold text-white text-sm mt-0.5">{project?.name}</div>
              <div className="text-slate-400">
                {company?.displayName} · {project?.county} County, CA · POI: {project?.interconnectionPoint}
              </div>
            </div>
            <div className="text-left sm:text-right font-mono">
              <div className="text-slate-400 text-[10px] uppercase">Decision Maker</div>
              <div className="font-semibold text-white">{contact?.name || 'Unassigned'}</div>
              <div className="text-emerald-400 font-medium">{contact?.businessEmail}</div>
            </div>
          </div>

          {/* Pricing Tiers Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
              Select Diligence Package Tier
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['tier1', 'tier2', 'tier3'] as const).map((tKey) => {
                const t = tiers[tKey];
                const isSelected = selectedTier === tKey;

                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setSelectedTier(tKey)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-[#0E1B33] ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-[#070D18] hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-emerald-400">{t.turnaround}</div>
                    <div className="text-lg font-bold text-white mt-1 font-mono">{t.fee}</div>
                    <div className="text-xs font-medium text-slate-300 mt-1 leading-snug">{t.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deliverables List */}
          <div className="p-4 bg-[#070D18] rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-mono block">
              Contracted Deliverables Included:
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              {activeTier.deliverables.map((d, i) => (
                <li key={i} className="leading-relaxed">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Proposal Document Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
                Generated Commercial Scope Copy
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-white font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#050A14] text-slate-200 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all border border-slate-800">
              {proposalText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#070D18] rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Principle #10: Optimize for first customer revenue</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 font-medium text-slate-300 bg-[#0B1424] border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg font-mono transition-colors"
            >
              Copy Proposal
            </button>
            <button
              onClick={handleAdvanceToProposalStage}
              className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors font-mono"
            >
              Advance to "Proposal" Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
