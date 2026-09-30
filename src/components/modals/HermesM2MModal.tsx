import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Play,
  Copy,
  Check,
  FileCode,
  Key,
} from 'lucide-react';

interface HermesM2MModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HermesM2MModal: React.FC<HermesM2MModalProps> = ({ isOpen, onClose }) => {
  const { triggerHermesRun } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('evidence');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const machineToken = 'gl_hermes_sec_live_948f2a7b8e19c43d001e';

  const endpoints = [
    {
      id: 'evidence',
      method: 'POST',
      path: '/api/v1/hermes/evidence',
      summary: 'Submit discovered source evidence record',
      payload: `{
  "agent_name": "Hermes Research Agent",
  "agent_version": "v2.4.1-bess-core",
  "run_id": "run_hermes_20260929_live",
  "idempotency_key": "caiso:cluster15:poi_bellota_20260929",
  "evidence": {
    "project_id": "proj_willow_glen",
    "source_type": "CAISO_QUEUE",
    "source_name": "CAISO Cluster 15 Interconnection Queue",
    "source_url_or_doc_id": "CAISO Queue Position #1689",
    "source_date": "2026-09-29",
    "entity_field_supported": "capacityMw",
    "raw_value": "Net 200.00 MW BESS / Bellota 230kV / Execution LGIA",
    "normalized_value": "200 MW Lithium-ion BESS",
    "verification_state": "VERIFIED",
    "confidence_score": 0.99
  }
}`,
    },
    {
      id: 'project',
      method: 'POST',
      path: '/api/v1/hermes/project-candidate',
      summary: 'Propose or update project record with new evidence',
      payload: `{
  "agent_name": "Hermes Research Agent",
  "run_id": "run_hermes_20260929_live",
  "idempotency_key": "hermes:proj:desert_peak:20260929",
  "project": {
    "name": "Desert Peak Energy Storage",
    "state": "CA",
    "county": "Kern County",
    "technology": "Lithium-ion BESS",
    "capacity_mw": 250,
    "energy_mwh": 1000,
    "interconnection_point": "Whirlwind 230 kV Substation",
    "interconnection_utility": "SCE",
    "evidence_references": ["ev_caiso_1822", "ev_ceqa_kern_mnd"]
  }
}`,
    },
    {
      id: 'outreach',
      method: 'POST',
      path: '/api/v1/hermes/outreach-draft',
      summary: 'Request generation of evidence-grounded outreach draft',
      payload: `{
  "opportunity_id": "opp_desert_peak",
  "recipient_contact_id": "cont_mark_gallagher",
  "evidence_ids_used": ["ev_caiso_1822", "ev_ceqa_kern_mnd"],
  "grounding_constraint": "STRICT_STORED_EVIDENCE_ONLY",
  "max_tokens": 400
}`,
    },
  ];

  const activeEp = endpoints.find((e) => e.id === selectedEndpoint) || endpoints[0];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(machineToken);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRunSimulatedPayload = () => {
    setTestStatus('Executing machine ingestion via authenticated boundary...');
    setTimeout(() => {
      const res = triggerHermesRun('CAISO_CLUSTER_SCAN');
      setTestStatus(`SUCCESS: Run ID ${res.runId} completed. Evidence and audit trails updated.`);
      setTimeout(() => setTestStatus(null), 4000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                M2M Machine Boundary
              </span>
              <span className="text-xs text-slate-500">Hermes Worker Operating Contract</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-700" />
              Hermes Research Agent Integration & Contract
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Machine Auth Token Banner */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Hermes Bearer Token (Scanned & Verified)
              </div>
              <div className="font-mono text-xs text-slate-300 mt-1 select-all">
                Authorization: Bearer {machineToken}
              </div>
            </div>
            <button
              onClick={handleCopyKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Header'}</span>
            </button>
          </div>

          {/* Permitted vs Prohibited Contract Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Hermes Permitted Capabilities
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside">
                <li>Submit discovered source records & raw evidence</li>
                <li>Propose project records with strict PostGIS geometry</li>
                <li>Propose company-project relationships & affiliations</li>
                <li>Submit prospect/contact candidates with verification metadata</li>
                <li>Create opportunity candidates with fit explanations</li>
                <li>Request evidence-grounded outreach draft generation</li>
                <li>Report job status, failures, and source discrepancies</li>
              </ul>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-lg border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                Hermes Prohibited Actions (Non-Negotiable)
              </div>
              <ul className="text-xs text-rose-900 space-y-1.5 list-disc list-inside">
                <li>Cannot mark unverifiable claims as verified</li>
                <li>Cannot silently overwrite human-reviewed facts</li>
                <li>Cannot delete stored evidence or source trails</li>
                <li>Cannot approve or send external outreach</li>
                <li>Cannot advance opportunity stage to "Won"</li>
                <li>Cannot bypass authorization or tamper with audit logs</li>
              </ul>
            </div>
          </div>

          {/* Endpoint Schema Browser & Interactive Runner */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  M2M API Contract Schema
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded text-xs">
                {endpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep.id)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      selectedEndpoint === ep.id
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ep.path.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {activeEp.method}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-800">{activeEp.path}</span>
                <span className="text-xs text-slate-500">· {activeEp.summary}</span>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-md font-mono text-xs overflow-x-auto leading-relaxed max-h-56">
                  {activeEp.payload}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Idempotency enforced: duplicate payloads with identical keys are acknowledged safely without ghost writes.
                </span>
                <button
                  onClick={handleRunSimulatedPayload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  Dispatch Test Ingestion Payload
                </button>
              </div>

              {testStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 rounded animate-in fade-in">
                  {testStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
          <span>Non-Negotiable Principle #6: Human approval is mandatory before any outreach is sent</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Close Contract
          </button>
        </div>
      </div>
    </div>
  );
};
