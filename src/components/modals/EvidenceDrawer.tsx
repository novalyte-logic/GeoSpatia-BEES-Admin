import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ExternalLink, ShieldCheck, AlertTriangle, HelpCircle, Sparkles, Check, Ban } from 'lucide-react';

export const EvidenceDrawer: React.FC = () => {
  const { activeEvidenceDrawerItem, closeEvidenceDrawer, confirmOrRejectInference, projects } = useApp();

  if (!activeEvidenceDrawerItem) return null;

  const item = activeEvidenceDrawerItem;
  const project = projects.find((p) => p.id === item.projectId);

  const getStatusBadge = () => {
    switch (item.verificationState) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            VERIFIED SOURCE RECORD
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            CONFLICTING SOURCES
          </span>
        );
      case 'INFERENCE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            AI INFERENCE (REQUIRES HUMAN CONFIRMATION)
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            UNKNOWN / UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Evidence Ledger Item · {item.id}
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Source Provenance & Verification Audit
            </h2>
          </div>
          <button
            onClick={closeEvidenceDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Status Header */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1">Current Verification State</div>
              {getStatusBadge()}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-0.5">Confidence Metric</div>
              <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                {(item.confidenceScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Project & Supported Field */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-medium text-slate-500">Target Project</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {project ? project.name : item.projectId}
              </div>
              {project && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {project.county}, CA · {project.technology}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Entity Field Supported</div>
              <div className="text-sm font-mono font-semibold text-slate-800 mt-0.5 bg-slate-100 px-2 py-0.5 rounded inline-block">
                {item.entityFieldSupported}
              </div>
            </div>
          </div>

          {/* Conflict Details if any */}
          {item.verificationState === 'CONFLICTING' && item.conflictDetails && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-300">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Active Source Discrepancy (Principle #4)
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">{item.conflictDetails}</p>
            </div>
          )}

          {/* Normalized Value vs Raw Excerpt */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Normalized Fact Value
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm font-medium text-slate-900">
                {item.normalizedValue}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Raw Unaltered Evidence Excerpt</span>
                <span className="text-[11px] text-slate-400 font-normal">Verbatim Extraction</span>
              </div>
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-md font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-600">
                {item.rawValue}
              </div>
            </div>
          </div>

          {/* Provenance Metadata Table */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
            <div className="p-3 flex justify-between">
              <span className="text-slate-500">Source Name</span>
              <span className="font-medium text-slate-900 text-right">{item.sourceName}</span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-slate-500">Document ID / Location</span>
              <span className="font-mono text-slate-800 text-right max-w-xs truncate flex items-center gap-1">
                {item.sourceUrlOrDocId}
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-slate-500">Source Publication Date</span>
              <span className="font-mono tabular-nums text-slate-800">{item.sourceDate || 'UNKNOWN'}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-slate-500">Retrieved At (Timestamp)</span>
              <span className="font-mono tabular-nums text-slate-800">{item.retrievedAt}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-slate-500">Ingesting Agent Run</span>
              <span className="font-mono text-emerald-700 font-semibold">{item.agentRunId}</span>
            </div>
            {item.reviewedBy && (
              <div className="p-3 flex justify-between bg-emerald-50/50">
                <span className="text-emerald-800 font-medium">Human Operator Verification</span>
                <span className="text-emerald-900 font-semibold">{item.reviewedBy}</span>
              </div>
            )}
          </div>

          {/* Inference Human Action Gate */}
          {item.verificationState === 'INFERENCE' && !item.humanReviewed && (
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 space-y-3">
              <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Human Control Plane Review Required
              </div>
              <p className="text-xs text-sky-900 leading-relaxed">
                Per Non-Negotiable Principle #5, AI inferences must be verified by a human before they are treated as factual project claims. Confirming or rejecting does not delete the original source evidence.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => confirmOrRejectInference(item.id, 'CONFIRM', 'Managing Partner (Human Control Plane)')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Confirm as Verified Fact
                </button>
                <button
                  onClick={() => confirmOrRejectInference(item.id, 'REJECT', 'Managing Partner (Human Control Plane)')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <Ban className="w-3.5 h-3.5 text-slate-500" />
                  Reject Inference
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Non-Negotiable Principle #2: Every material fact retains provenance</span>
          <button
            onClick={closeEvidenceDrawer}
            className="px-3 py-1.5 font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
