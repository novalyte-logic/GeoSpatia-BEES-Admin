import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Inbox,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Mail,
  Zap,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  UserCheck,
  Send,
  HelpCircle,
  Layers,
  FileSpreadsheet,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export type RequestLifecycleStatus =
  | "NEW"
  | "TRIAGE"
  | "WAITING_FOR_CLIENT"
  | "SCOPE_AND_FEE_CONFIRMATION"
  | "APPROVED_TO_RESEARCH"
  | "RESEARCH_IN_PROGRESS"
  | "BRIEF_DRAFT"
  | "HUMAN_REVIEW"
  | "READY_TO_DELIVER"
  | "DELIVERED"
  | "CLOSED"
  | "DECLINED"
  | "ON_HOLD";

export interface DeveloperRequestRecord {
  id: string;
  receivedAt: string;
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  candidateSite: string;
  projectType: string;
  capacityMw?: number;
  durationHours?: number;
  developmentStage: string;
  decisionQuestion: string;
  notes?: string;
  status: RequestLifecycleStatus;
  scopeFeeConfirmed: boolean;
  assignedReviewer?: string;
  resolvedJurisdiction?: string;
  briefId?: string;
  deliveredAt?: string;
  deliveryMethod?: string;
  auditTrail: {
    timestamp: string;
    fromStatus: RequestLifecycleStatus;
    toStatus: RequestLifecycleStatus;
    actor: string;
    note: string;
  }[];
}

export const RequestsView: React.FC = () => {
  const { theme } = useApp();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Operational requests store (Real customer intake pipeline)
  const [requests, setRequests] = useState<DeveloperRequestRecord[]>([
    {
      id: "req_2026_0929_kern",
      receivedAt: "2026-09-29T23:53:07.060Z",
      fullName: "Marcus Vance",
      workEmail: "admin@geospatialabs.com",
      company: "Pacific Storage & Power",
      role: "VP Interconnection",
      candidateSite: "35.3214, -119.0431 (APN 042-120-008, Kern County, CA)",
      projectType: "Utility-scale BESS",
      capacityMw: 200,
      durationHours: 4,
      developmentStage: "Site control / option",
      decisionQuestion: "Evaluating CAISO Cluster 15 queue congestion, 230kV bus capacity, and Kern County CUP zoning requirements.",
      notes: "Prioritized intake request for preliminary Single-Site Intelligence Brief.",
      status: "TRIAGE",
      scopeFeeConfirmed: true,
      assignedReviewer: "Lead Diligence Engineer",
      resolvedJurisdiction: "Unincorporated Kern County (Kern County Planning Dept)",
      auditTrail: [
        {
          timestamp: "2026-09-29T23:53:07Z",
          fromStatus: "NEW",
          toStatus: "TRIAGE",
          actor: "System Intake",
          note: "Inquiry received via verified Supabase site_screen_requests pipeline."
        }
      ]
    }
  ]);

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0] || null;

  const updateRequestStatus = (
    requestId: string,
    newStatus: RequestLifecycleStatus,
    note: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: newStatus,
          auditTrail: [
            ...r.auditTrail,
            {
              timestamp: new Date().toISOString(),
              fromStatus: r.status,
              toStatus: newStatus,
              actor: "Human Operator",
              note
            }
          ]
        };
      })
    );
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateSite.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-emerald-400" />
            Site Screen Requests Inbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Human-operated control plane for triaging developer requests, compiling evidence, and delivering Single-Site Briefs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            Operator Guide
          </button>
        </div>
      </div>

      {/* Main Grid: Inbox on Left, Detail Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requests List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="TRIAGE">Triage</option>
              <option value="RESEARCH_IN_PROGRESS">Researching</option>
              <option value="HUMAN_REVIEW">Human Review</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-medium text-slate-400">No requests found</p>
              <p className="text-[11px] text-slate-500">Incoming submissions from geospatialabs.com/request appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredRequests.map((req) => {
                const isSelected = activeRequest?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-emerald-500/80 shadow-md shadow-black/40 ring-1 ring-emerald-500/30"
                        : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">{req.company}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        {req.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{req.fullName} ({req.role})</h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {req.candidateSite}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{req.capacityMw} MW · {req.projectType}</span>
                      <span>{new Date(req.receivedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Active Request Detail & Research Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {activeRequest ? (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{activeRequest.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-400">Received {new Date(activeRequest.receivedAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{activeRequest.company} — {activeRequest.fullName}</h3>
                  <p className="text-xs text-slate-400">{activeRequest.role} · <a href={`mailto:${activeRequest.workEmail}`} className="text-emerald-400 hover:underline">{activeRequest.workEmail}</a></p>
                </div>

                {/* Status Switcher Action */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Stage:</span>
                  <select
                    value={activeRequest.status}
                    onChange={(e) => updateRequestStatus(activeRequest.id, e.target.value as RequestLifecycleStatus, "Operator updated lifecycle status")}
                    className="px-3 py-1.5 rounded-md bg-slate-950 border border-emerald-600 text-xs text-emerald-300 font-mono font-semibold focus:outline-none"
                  >
                    <option value="NEW">1. NEW</option>
                    <option value="TRIAGE">2. TRIAGE</option>
                    <option value="WAITING_FOR_CLIENT">3. WAITING FOR CLIENT</option>
                    <option value="SCOPE_AND_FEE_CONFIRMATION">4. SCOPE & FEE CONFIRMATION</option>
                    <option value="APPROVED_TO_RESEARCH">5. APPROVED TO RESEARCH</option>
                    <option value="RESEARCH_IN_PROGRESS">6. RESEARCH IN PROGRESS</option>
                    <option value="BRIEF_DRAFT">7. BRIEF DRAFT</option>
                    <option value="HUMAN_REVIEW">8. HUMAN REVIEW</option>
                    <option value="READY_TO_DELIVER">9. READY TO DELIVER</option>
                    <option value="DELIVERED">10. DELIVERED</option>
                    <option value="CLOSED">11. CLOSED</option>
                    <option value="DECLINED">DECLINED</option>
                    <option value="ON_HOLD">ON HOLD</option>
                  </select>
                </div>
              </div>

              {/* Submitted Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Candidate Location
                  </div>
                  <p className="text-slate-100 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-800">{activeRequest.candidateSite}</p>
                  <p className="text-[11px] text-slate-400"><strong className="text-slate-300">Resolved Jurisdiction:</strong> {activeRequest.resolvedJurisdiction || "Pending Geocode Check"}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Project Assumptions
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div><strong className="text-slate-300">Type:</strong> {activeRequest.projectType}</div>
                    <div><strong className="text-slate-300">Capacity:</strong> {activeRequest.capacityMw ? `${activeRequest.capacityMw} MW` : "Unspecified"} · {activeRequest.durationHours ? `${activeRequest.durationHours} Hours` : "4 Hours"}</div>
                    <div><strong className="text-slate-300">Development Stage:</strong> {activeRequest.developmentStage}</div>
                  </div>
                </div>
              </div>

              {/* Decision Question */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  Developer Evaluation Question
                </div>
                <p className="text-slate-200 text-xs italic leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                  "{activeRequest.decisionQuestion}"
                </p>
              </div>

              {/* Action Buttons for Research Pipeline */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => updateRequestStatus(activeRequest.id, "RESEARCH_IN_PROGRESS", "Triggered automated CAISO and GIS source connectors")}
                  className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Run Source Connectors
                </button>

                <button
                  onClick={() => updateRequestStatus(activeRequest.id, "BRIEF_DRAFT", "Compiled verified preliminary brief")}
                  className="px-3.5 py-2 rounded-md bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate Single-Site Brief
                </button>

                <button
                  onClick={() => updateRequestStatus(activeRequest.id, "HUMAN_REVIEW", "Submitted brief to Lead Diligence Engineer review")}
                  className="px-3.5 py-2 rounded-md border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Submit for Human Review
                </button>

                <button
                  onClick={() => updateRequestStatus(activeRequest.id, "DELIVERED", "Delivered brief directly to client email via secure delivery")}
                  className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  Record Delivery
                </button>
              </div>

              {/* Audit Trail */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Audit Log & State Transitions</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[10px]">
                  {activeRequest.auditTrail.map((entry, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between text-slate-300">
                      <div>
                        <span className="text-emerald-400 font-semibold">{entry.fromStatus} → {entry.toStatus}</span>
                        <span className="text-slate-500 ml-2">[{entry.actor}]</span>
                        <p className="text-slate-400 text-[10px] mt-0.5">{entry.note}</p>
                      </div>
                      <span className="text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              Select a request from the inbox to begin research and brief compilation.
            </div>
          )}
        </div>
      </div>

      {/* Operator Guide Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Operator Standard Operating Procedure: Request Fulfillment
              </h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white cursor-pointer font-mono text-sm">✕</button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-300 max-h-[70vh] overflow-y-auto pr-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">1. Intake & Scope Triage</h4>
                <p>Verify that the candidate site is in California and represents a Battery Energy Storage System (BESS) or hybrid solar+storage project. Reject or mark OUT_OF_SCOPE non-CA inquiries.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">2. Scope & Fee Confirmation</h4>
                <p>Confirm the required research depth and turnaround agreement with the developer before initiating deep diligence tasks.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">3. Source Execution & Evidence Compilation</h4>
                <p>Execute the CAISO Queue and Mapbox connectors. For distribution and county zoning checks, execute the assigned manual research tasks using the provided direct portal links.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">4. Human Review & Brief Approval</h4>
                <p>Every brief must be reviewed and signed off by a Lead Diligence Engineer before delivery. Never deliver without mandatory legal disclaimers.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">5. Record Delivery & Close</h4>
                <p>Dispatch the completed brief to the developer's work email and record the delivery method in the audit trail.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
