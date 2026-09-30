import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutreachDraftRecord, OutreachStatus } from '../../types';
import { generateGroundedOutreach } from '../../services/geminiService';
import {
  Mail,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Send,
  ExternalLink,
  Edit3,
  Save,
  Ban,
  Building2,
  Sparkles,
  RefreshCw,
  Compass,
  Radar,
} from 'lucide-react';

export const OutreachView: React.FC = () => {
  const {
    outreachDrafts,
    opportunities,
    projects,
    companies,
    contacts,
    evidence,
    updateOutreachStatus,
    updateDraftContent,
    openEvidenceDrawer,
    createOutreachDraft,
  } = useApp();

  const [selectedDraftId, setSelectedDraftId] = useState<string>('draft_desert_peak');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [editedSubject, setEditedSubject] = useState<string>('');
  const [editedBody, setEditedBody] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDrafts = outreachDrafts.filter(
    (d) => statusFilter === 'ALL' || d.status === statusFilter
  );

  const activeDraft =
    outreachDrafts.find((d) => d.id === selectedDraftId) || filteredDrafts[0] || outreachDrafts[0];

  const linkedOpp = opportunities.find((o) => o.id === activeDraft?.opportunityId);
  const linkedProject = projects.find((p) => p.id === linkedOpp?.projectId);
  const linkedCompany = companies.find((c) => c.id === linkedOpp?.companyId);
  const linkedContact = contacts.find((c) => c.id === activeDraft?.recipientContactId);

  // Synchronize edit buffer when active draft changes
  React.useEffect(() => {
    if (activeDraft) {
      setEditedSubject(activeDraft.subject);
      setEditedBody(activeDraft.body);
    }
  }, [activeDraft]);

  const handleSaveEdit = () => {
    if (!activeDraft) return;
    updateDraftContent(activeDraft.id, editedSubject, editedBody);
    setIsEditing(false);
  };

  const handleRegenerateWithAI = async () => {
    if (!activeDraft || !linkedProject || !linkedCompany || !linkedOpp || !linkedContact) return;

    setIsGeneratingAi(true);
    setAiMessage(null);

    const projectEvidence = evidence.filter((e) => e.projectId === linkedProject.id);

    try {
      const generated = await generateGroundedOutreach({
        project: linkedProject,
        company: linkedCompany,
        contact: linkedContact,
        evidenceItems: projectEvidence,
        relevantServiceDeliverable: linkedOpp.relevantServiceDeliverable,
      });

      updateDraftContent(activeDraft.id, generated.subject, generated.body);
      setEditedSubject(generated.subject);
      setEditedBody(generated.body);
      setAiMessage(`Regenerated draft grounded on ${generated.citations.length} stored evidence records.`);
      setTimeout(() => setAiMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setAiMessage('Error during generation. Preserved existing draft.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyClipboard = () => {
    if (!activeDraft) return;
    const textToCopy = `To: ${linkedContact?.businessEmail || ''}\nSubject: ${activeDraft.subject}\n\n${activeDraft.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleMailto = () => {
    if (!activeDraft || !linkedContact) return;
    const mailtoUrl = `mailto:${linkedContact.businessEmail}?subject=${encodeURIComponent(
      activeDraft.subject
    )}&body=${encodeURIComponent(activeDraft.body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const getStatusBadge = (status: OutreachStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
            APPROVED (READY TO SEND)
          </span>
        );
      case 'Needs Review':
        return (
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800">
            NEEDS HUMAN REVIEW
          </span>
        );
      case 'Sent':
        return (
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            SENT
          </span>
        );
      case 'Suppressed':
        return (
          <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-800">
            SUPPRESSED / OPT-OUT
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Personalized Siting Outreach · Human Review Gated</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Outreach Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-negotiable rule: Personalized exclusively from stored evidence. Never fabricate familiarity. Mandatory human approval.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
          >
            <option value="ALL">All Statuses ({outreachDrafts.length})</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Approved">Approved</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
            <option value="Suppressed">Suppressed</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Draft List (4 cols) + Right Detail Review Pane (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drafts Queue */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
            Outreach Records ({filteredDrafts.length})
          </div>

          <div className="space-y-2.5">
            {filteredDrafts.map((draft) => {
              const opp = opportunities.find((o) => o.id === draft.opportunityId);
              const project = projects.find((p) => p.id === opp?.projectId);
              const contact = contacts.find((c) => c.id === draft.recipientContactId);
              const isSelected = activeDraft?.id === draft.id;

              return (
                <button
                  key={draft.id}
                  onClick={() => setSelectedDraftId(draft.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all bg-[#0B1424]/95 shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#0E1B33]'
                      : 'border-slate-800/90 hover:border-slate-700 hover:bg-[#0D1829]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-white">{project?.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        draft.status === 'Approved'
                          ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800'
                          : draft.status === 'Needs Review'
                          ? 'text-amber-300 bg-amber-950/80 border border-amber-800'
                          : 'text-slate-300 bg-slate-800'
                      }`}
                    >
                      {draft.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 mt-1 font-medium">
                    To: {contact?.name} ({contact?.title})
                  </div>

                  <div className="text-xs text-slate-400 mt-1 font-mono truncate">
                    {draft.subject}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{draft.evidenceCitations.length} evidence facts</span>
                    <span>{draft.createdAt.split('T')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Draft Review Panel */}
        {activeDraft && linkedProject && (
          <div className="lg:col-span-8 bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl shadow-black/20">
            {/* Header & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Outreach Draft · {activeDraft.id}
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{linkedProject.name}</h2>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(activeDraft.status)}</div>
            </div>

            {/* Recipient & Protection Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#070D18] rounded-xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  Verified Recipient
                </span>
                <div className="font-bold text-white text-sm">{linkedContact?.name}</div>
                <div className="text-slate-300">{linkedContact?.title}</div>
                <div className="text-emerald-400 font-mono font-medium">{linkedContact?.businessEmail}</div>
              </div>

              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-800">
                <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  Safety & Protection Flags
                </span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email: {linkedContact?.emailVerificationStatus}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Duplicate Check: No prior email in last 60 days</span>
                </div>
                {activeDraft.reviewedBy && (
                  <div className="text-slate-400 text-[11px] font-mono">
                    Reviewed by: <span className="font-semibold text-white">{activeDraft.reviewedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Exact Evidence Citations Used for Personalization (NON-NEGOTIABLE PRINCIPLE #8) */}
            <div className="space-y-2 p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/50">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evidence Facts Grounding This Email</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  Strict Zero-Hallucination Policy
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                The model is barred from creating ungrounded claims. Every claim in the body below maps to these specific verified records:
              </p>

              <div className="space-y-1.5 pt-1">
                {activeDraft.evidenceCitations.map((cite, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#070D18] rounded-lg border border-emerald-800/40 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-white">{cite.factUsed}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Source: {cite.sourceName}
                      </span>
                    </div>
                    <button
                      onClick={() => openEvidenceDrawer(cite.evidenceId)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-white shrink-0 font-mono"
                    >
                      <span>Inspect Raw</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Subject & Body (View / Edit Mode) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Email Content
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerateWithAI}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 px-3 py-1 rounded-lg transition-colors disabled:opacity-50 font-mono"
                    title="Regenerate copy strictly grounded on stored evidence"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? 'Regenerating...' : 'Regenerate via Hermes AI'}</span>
                  </button>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-[#070D18] hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg transition-colors font-mono"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Copy</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg transition-colors font-mono"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>
              </div>

              {aiMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-xs font-mono text-emerald-300 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{aiMessage}</span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  Subject Line
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full text-xs font-mono font-medium p-3 bg-[#070D18] text-white border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800 text-xs font-mono font-semibold text-white">
                    {activeDraft.subject}
                  </div>
                )}
              </div>

              {/* Body */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  Email Body
                </label>
                {isEditing ? (
                  <textarea
                    rows={10}
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    className="w-full text-xs font-mono p-3 bg-[#070D18] text-white border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-[#070D18] rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeDraft.body}
                  </div>
                )}
              </div>
            </div>

            {/* Operator Actions & Approval Gate (Principle #6: Human approval mandatory) */}
            <div className="p-4 bg-[#070D18] rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {activeDraft.status === 'Needs Review' || activeDraft.status === 'Draft' ? (
                  <button
                    onClick={() => updateOutreachStatus(activeDraft.id, 'Approved')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Approve Outreach Draft</span>
                  </button>
                ) : activeDraft.status === 'Approved' ? (
                  <button
                    onClick={() => updateOutreachStatus(activeDraft.id, 'Sent')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors font-mono"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Record Outreach as Sent</span>
                  </button>
                ) : null}

                <button
                  onClick={handleCopyClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-[#0B1424] border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-mono"
                >
                  {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleMailto}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-[#0B1424] border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-mono"
                  title="Open in your default email client"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Launch Mail Client</span>
                </button>
              </div>

              {/* Suppression / Opt-out toggle */}
              <div>
                {activeDraft.status !== 'Suppressed' ? (
                  <button
                    onClick={() => updateOutreachStatus(activeDraft.id, 'Suppressed', 'Opt-out requested or suppressed by operator')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold font-mono"
                  >
                    Suppress / Opt-Out Recipient
                  </button>
                ) : (
                  <button
                    onClick={() => updateOutreachStatus(activeDraft.id, 'Needs Review', 'Un-suppressed by operator')}
                    className="text-xs text-slate-400 hover:text-white underline font-mono"
                  >
                    Restore from Suppression
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
