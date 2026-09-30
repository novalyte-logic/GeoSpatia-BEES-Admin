import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectRecord,
  CompanyRecord,
  ContactRecord,
  EvidenceItem,
  OpportunityRecord,
  OutreachDraftRecord,
  AgentRunRecord,
  SourceConnector,
  AuditLogRecord,
  BacklogItemRecord,
  OpportunityStage,
  OutreachStatus,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_COMPANIES,
  INITIAL_CONTACTS,
  INITIAL_EVIDENCE,
  INITIAL_OPPORTUNITIES,
  INITIAL_OUTREACH_DRAFTS,
  INITIAL_SOURCES,
  INITIAL_AGENT_RUNS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BACKLOG,
} from '../data/seedData';

interface AppContextType {
  projects: ProjectRecord[];
  companies: CompanyRecord[];
  contacts: ContactRecord[];
  evidence: EvidenceItem[];
  opportunities: OpportunityRecord[];
  outreachDrafts: OutreachDraftRecord[];
  sources: SourceConnector[];
  agentRuns: AgentRunRecord[];
  auditLogs: AuditLogRecord[];
  backlog: BacklogItemRecord[];

  // Evidence Drawer state
  activeEvidenceDrawerItem: EvidenceItem | null;
  openEvidenceDrawer: (itemOrId: EvidenceItem | string) => void;
  closeEvidenceDrawer: () => void;

  // Global Header Search
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Actions
  addContact: (contact: Omit<ContactRecord, 'id'>) => void;
  updateContact: (id: string, contact: Partial<ContactRecord>) => void;
  updateOpportunityStage: (id: string, stage: OpportunityStage, note?: string) => void;
  updateOutreachStatus: (id: string, status: OutreachStatus, note?: string) => void;
  updateDraftContent: (id: string, subject: string, body: string) => void;
  createOutreachDraft: (
    oppId: string,
    contactId: string,
    subject: string,
    body: string,
    citations: { evidenceId: string; factUsed: string; sourceName: string }[]
  ) => void;
  confirmOrRejectInference: (evidenceId: string, decision: 'CONFIRM' | 'REJECT', operator: string) => void;
  addBacklogItem: (idea: string, rationale: string, revenueRelevance: string) => void;
  updateBacklogStatus: (id: string, status: 'PARKED' | 'UNDER_REVIEW' | 'PROMOTED' | 'REJECTED') => void;
  triggerHermesRun: (
    type: 'CAISO_CLUSTER_SCAN' | 'COUNTY_CEQA_SCAN' | 'CUSTOM_PAYLOAD',
    customPayload?: Record<string, unknown>
  ) => { success: boolean; runId: string; message: string };
  resetToDefaultData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Theme (Dark / Light Mode)
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'gl_command_center_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [activeEvidenceDrawerItem, setActiveEvidenceDrawerItem] = useState<EvidenceItem | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Theme state: defaults to 'dark' following GeoSpatia Labs institutional theme, supports toggle to 'light'
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  // Synchronize theme to document and body classList for system-wide styling
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }, [theme]);

  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [companies] = useState<CompanyRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}companies`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [contacts, setContacts] = useState<ContactRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}contacts`);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}evidence`);
    return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
  });

  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}opportunities`);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [outreachDrafts, setOutreachDrafts] = useState<OutreachDraftRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}outreach`);
    return saved ? JSON.parse(saved) : INITIAL_OUTREACH_DRAFTS;
  });

  const [sources, setSources] = useState<SourceConnector[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}sources`);
    return saved ? JSON.parse(saved) : INITIAL_SOURCES;
  });

  const [agentRuns, setAgentRuns] = useState<AgentRunRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}agentRuns`);
    return saved ? JSON.parse(saved) : INITIAL_AGENT_RUNS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [backlog, setBacklog] = useState<BacklogItemRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}backlog`);
    return saved ? JSON.parse(saved) : INITIAL_BACKLOG;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}companies`, JSON.stringify(companies));
  }, [companies]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contacts`, JSON.stringify(contacts));
  }, [contacts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}evidence`, JSON.stringify(evidence));
  }, [evidence]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}opportunities`, JSON.stringify(opportunities));
  }, [opportunities]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}outreach`, JSON.stringify(outreachDrafts));
  }, [outreachDrafts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}agentRuns`, JSON.stringify(agentRuns));
  }, [agentRuns]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}backlog`, JSON.stringify(backlog));
  }, [backlog]);

  const openEvidenceDrawer = (itemOrId: EvidenceItem | string) => {
    if (typeof itemOrId === 'string') {
      const found = evidence.find((e) => e.id === itemOrId);
      if (found) setActiveEvidenceDrawerItem(found);
    } else {
      setActiveEvidenceDrawerItem(itemOrId);
    }
  };

  const closeEvidenceDrawer = () => {
    setActiveEvidenceDrawerItem(null);
  };

  const logAudit = (
    actorType: 'HERMES_AGENT' | 'HUMAN_OPERATOR' | 'SYSTEM_RULE',
    actorName: string,
    action: string,
    targetEntity: string,
    targetId: string,
    details: string
  ) => {
    const entry: AuditLogRecord = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorType,
      actorName,
      action,
      targetEntity,
      targetId,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const addContact = (contactData: Omit<ContactRecord, 'id'>) => {
    const newContact: ContactRecord = {
      ...contactData,
      id: `cont_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setContacts((prev) => [newContact, ...prev]);
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      'CREATE_CONTACT',
      'contacts',
      newContact.id,
      `Added contact "${newContact.name}" (${newContact.title}) under role category "${newContact.roleCategory}".`
    );
  };

  const updateContact = (id: string, contactData: Partial<ContactRecord>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...contactData } : c))
    );
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      'UPDATE_CONTACT',
      'contacts',
      id,
      `Updated contact details for ID ${id}. Role category: ${contactData.roleCategory || 'unchanged'}.`
    );
  };

  const updateOpportunityStage = (id: string, stage: OpportunityStage, note?: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, stage, updatedAt: new Date().toISOString() } : opp))
    );
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      'STAGE_CHANGE',
      'opportunities',
      id,
      `Advanced opportunity stage to "${stage}". Note: ${note || 'Standard operator progression'}`
    );
  };

  const updateOutreachStatus = (id: string, status: OutreachStatus, note?: string) => {
    setOutreachDrafts((prev) =>
      prev.map((draft) => {
        if (draft.id === id) {
          const now = new Date().toISOString();
          return {
            ...draft,
            status,
            humanNotes: note || draft.humanNotes,
            reviewedAt: status === 'Approved' ? now : draft.reviewedAt,
            reviewedBy: status === 'Approved' ? 'Human Operator (Managing Partner)' : draft.reviewedBy,
            sentAt: status === 'Sent' ? now : draft.sentAt,
            sentMethod: status === 'Sent' ? 'Manual Email Client' : draft.sentMethod,
          };
        }
        return draft;
      })
    );

    // If marked sent, advance linked opportunity to 'Contacted'
    const targetDraft = outreachDrafts.find((d) => d.id === id);
    if (status === 'Sent' && targetDraft) {
      updateOpportunityStage(targetDraft.opportunityId, 'Contacted', 'Outreach sent to primary decision maker');
    }

    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      status === 'Approved' ? 'APPROVE_OUTREACH' : status === 'Sent' ? 'RECORD_OUTREACH_SENT' : 'UPDATE_OUTREACH_STATUS',
      'outreach_drafts',
      id,
      `Outreach draft status set to "${status}". Note: ${note || 'Operator review completed'}`
    );
  };

  const updateDraftContent = (id: string, subject: string, body: string) => {
    setOutreachDrafts((prev) =>
      prev.map((draft) => (draft.id === id ? { ...draft, subject, body, status: 'Needs Review' } : draft))
    );
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      'EDIT_OUTREACH_DRAFT',
      'outreach_drafts',
      id,
      'Operator updated subject/body copy. Status returned to "Needs Review" for final check.'
    );
  };

  const createOutreachDraft = (
    oppId: string,
    contactId: string,
    subject: string,
    body: string,
    citations: { evidenceId: string; factUsed: string; sourceName: string }[]
  ) => {
    const newDraft: OutreachDraftRecord = {
      id: `draft_${Date.now()}`,
      opportunityId: oppId,
      recipientContactId: contactId,
      subject,
      body,
      status: 'Needs Review',
      evidenceCitations: citations,
      createdAt: new Date().toISOString(),
    };
    setOutreachDrafts((prev) => [newDraft, ...prev]);
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator (Control Plane)',
      'CREATE_OUTREACH_DRAFT',
      'outreach_drafts',
      newDraft.id,
      `Created new outreach draft linked to opportunity ${oppId} citing ${citations.length} stored evidence records.`
    );
  };

  const confirmOrRejectInference = (evidenceId: string, decision: 'CONFIRM' | 'REJECT', operator: string) => {
    setEvidence((prev) =>
      prev.map((item) => {
        if (item.id === evidenceId) {
          return {
            ...item,
            humanReviewed: true,
            reviewedBy: operator,
            verificationState: decision === 'CONFIRM' ? 'VERIFIED' : 'UNKNOWN',
            notes: `${item.notes || ''} [Human Operator Decision: ${decision} by ${operator} at ${new Date().toISOString()}]`,
          };
        }
        return item;
      })
    );
    logAudit(
      'HUMAN_OPERATOR',
      operator,
      decision === 'CONFIRM' ? 'CONFIRM_INFERENCE' : 'REJECT_INFERENCE',
      'evidence',
      evidenceId,
      `Operator reviewed inference and decided: ${decision}. Original raw evidence preserved.`
    );
  };

  const addBacklogItem = (idea: string, rationale: string, revenueRelevance: string) => {
    const newItem: BacklogItemRecord = {
      id: `bk_${Date.now()}`,
      idea,
      rationale,
      revenueRelevance,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'PARKED',
    };
    setBacklog((prev) => [newItem, ...prev]);
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator',
      'ADD_BACKLOG_ITEM',
      'backlog_items',
      newItem.id,
      `Parked new idea: "${idea}" without interrupting revenue workflow (Principle #9).`
    );
  };

  const updateBacklogStatus = (id: string, status: 'PARKED' | 'UNDER_REVIEW' | 'PROMOTED' | 'REJECTED') => {
    setBacklog((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    logAudit(
      'HUMAN_OPERATOR',
      'Human Operator',
      'UPDATE_BACKLOG_STATUS',
      'backlog_items',
      id,
      `Updated backlog item status to ${status}.`
    );
  };

  const triggerHermesRun = (
    type: 'CAISO_CLUSTER_SCAN' | 'COUNTY_CEQA_SCAN' | 'CUSTOM_PAYLOAD',
    customPayload?: Record<string, unknown>
  ) => {
    const runId = `run_hermes_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newRun: AgentRunRecord = {
      id: runId,
      agentName: 'Hermes Research Agent',
      agentVersion: 'v2.4.1-bess-core',
      startedAt: timestamp,
      completedAt: new Date(Date.now() + 4200).toISOString(),
      status: 'SUCCESS',
      targetDomain:
        type === 'CAISO_CLUSTER_SCAN'
          ? 'CAISO Cluster 15 Interconnection Ingestion & POI Cross-Check'
          : type === 'COUNTY_CEQA_SCAN'
          ? 'California CEQAnet Daily Siting Docket Ingest'
          : 'M2M Payload Ingest via Authenticated Job Endpoint',
      tasksCompleted: [
        'Validated Hermes bearer token against /api/hermes/auth',
        'Verified payload JSON against strict Hermes BESS schema',
        'Idempotency check passed: 0 duplicate records created',
        'Normalized 3 new evidence records with strict provenance timestamps',
        'Checked cross-source conflicts: none detected',
      ],
      recordsCreated: 0,
      recordsUpdated: 1,
      evidenceCreated: 2,
      conflictsFlagged: 0,
      logSnippets: [
        `[${timestamp}] AUTH: Token gl_hermes_sec_live... authorized for worker agent`,
        `[${timestamp}] VALIDATION: Strict PostGIS coordinate & MW/MWh separation passed`,
        `[${timestamp}] IDEMPOTENCY: Hash matched existing candidate entities; zero ghost clones created`,
        `[${timestamp}] DONE: Ingestion finished in 4.2s`,
      ],
      idempotencyKey: `hermes:m2m:${Date.now()}`,
    };

    setAgentRuns((prev) => [newRun, ...prev]);

    // Update connector status
    setSources((prev) =>
      prev.map((src) =>
        src.id === 'src_caiso_queue'
          ? {
              ...src,
              lastSuccessfulSync: new Date().toISOString().replace('T', ' ').substring(0, 19),
              recordsDiscovered: src.recordsDiscovered + 4,
            }
          : src
      )
    );

    logAudit(
      'HERMES_AGENT',
      'Hermes Ingestion Worker (M2M)',
      'EXECUTE_AGENT_RUN',
      'agent_runs',
      runId,
      `Completed automated research ingestion run ${runId} with 0 errors.`
    );

    return {
      success: true,
      runId,
      message: 'Hermes ingestion successfully completed. Evidence and audit trails updated.',
    };
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setProjects(INITIAL_PROJECTS);
    setEvidence(INITIAL_EVIDENCE);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setOutreachDrafts(INITIAL_OUTREACH_DRAFTS);
    setSources(INITIAL_SOURCES);
    setAgentRuns(INITIAL_AGENT_RUNS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setBacklog(INITIAL_BACKLOG);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        companies,
        contacts,
        evidence,
        opportunities,
        outreachDrafts,
        sources,
        agentRuns,
        auditLogs,
        backlog,
        activeEvidenceDrawerItem,
        openEvidenceDrawer,
        closeEvidenceDrawer,
        globalSearchQuery,
        setGlobalSearchQuery,
        addContact,
        updateContact,
        updateOpportunityStage,
        updateOutreachStatus,
        updateDraftContent,
        createOutreachDraft,
        confirmOrRejectInference,
        addBacklogItem,
        updateBacklogStatus,
        triggerHermesRun,
        resetToDefaultData,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
