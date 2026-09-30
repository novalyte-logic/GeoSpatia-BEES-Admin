export type VerificationState = 'VERIFIED' | 'UNKNOWN' | 'CONFLICTING' | 'INFERENCE';

export type OpportunityStage =
  | 'New'
  | 'Researching'
  | 'Qualified'
  | 'Ready for Outreach'
  | 'Contacted'
  | 'In Discussion'
  | 'Proposal'
  | 'Won'
  | 'Closed';

export type OutreachStatus = 'Draft' | 'Needs Review' | 'Approved' | 'Sent' | 'Replied' | 'Suppressed';

export type RoleCategory =
  | 'Development'
  | 'Project Development'
  | 'Origination'
  | 'Site Acquisition'
  | 'Interconnection'
  | 'Senior Development Leadership'
  | 'Senior Leadership';

export type SourceType =
  | 'CAISO_QUEUE'
  | 'COUNTY_CEQA'
  | 'CPUC_DOCKET'
  | 'CEC_EP100'
  | 'BLM_REGISTER'
  | 'UTILITY_FILING';

export type ConnectorStatus =
  | 'Connected'
  | 'Setup Needed'
  | 'Waiting'
  | 'Manual'
  | 'Temporarily Failed'
  | 'Stale'
  | 'Unsupported';

export interface EvidenceItem {
  id: string;
  projectId: string;
  sourceType: SourceType;
  sourceName: string;
  sourceUrlOrDocId: string;
  sourceDate: string;
  retrievedAt: string;
  entityFieldSupported: string;
  rawValue: string;
  normalizedValue: string;
  verificationState: VerificationState;
  confidenceScore: number; // 0.0 - 1.0
  agentRunId: string;
  notes?: string;
  humanReviewed?: boolean;
  reviewedBy?: string;
  conflictDetails?: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  slug: string;
  sourceIds: {
    caisoQueueId?: string;
    countyPermitId?: string;
    blmCaseId?: string;
    stateClearinghouseId?: string;
  };
  state: 'CA';
  county: string;
  cityOrArea: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parcelApn?: string;
  technology: 'Lithium-ion BESS' | 'Flow Battery' | 'Hybrid Solar+BESS';
  capacityMw: number | 'UNKNOWN';
  energyMwh: number | 'UNKNOWN';
  durationHours?: number | 'UNKNOWN';
  interconnectionPoint: string;
  interconnectionUtility: 'SCE' | 'PG&E' | 'SDG&E' | 'CAISO';
  interconnectionStatus: string;
  developerCompanyId: string;
  applicantName?: string;
  projectStatus: string;
  permittingStage: string;
  ceqaStatus: string;
  lastCheckedDate: string;
  criticalIssues: string[];
  conflictingFields: {
    field: string;
    description: string;
    sourceA: string;
    sourceB: string;
  }[];
  unknownFields: string[];
  evidenceIds: string[];
}

export interface CompanyRecord {
  id: string;
  legalName: string;
  displayName: string;
  domain: string;
  parentCompany?: string;
  subsidiaries?: string[];
  headquarters: string;
  primaryTechnologyFocus: string[];
  associatedProjectIds: string[];
  relevanceRationale: string;
  provenance: string;
}

export interface ContactRecord {
  id: string;
  companyId: string;
  associatedOpportunityId?: string;
  name: string;
  title: string;
  roleCategory: RoleCategory;
  businessEmail: string;
  emailVerificationStatus: 'NeverBounce Verified' | 'Hunter Deliverable' | 'MX Validated' | 'Pending Review';
  emailVerifiedDate: string;
  verificationProvider: string;
  linkedinUrl?: string;
  provenance: string;
  isSuppressed?: boolean;
}

export interface OpportunityRecord {
  id: string;
  projectId: string;
  companyId: string;
  primaryContactId?: string;
  stage: OpportunityStage;
  fitReason: string;
  relevantServiceDeliverable: string;
  qualificationFactors: {
    bessSiteDiligenceRelevance: string;
    documentedStageActivity: string;
    recencySignal: string;
    evidenceQuality: 'HIGH' | 'MEDIUM' | 'NEEDS_VERIFICATION';
    serviceDeliverableMatch: string;
    contactAvailability: 'VERIFIED_DECISION_MAKER' | 'GENERAL_CONTACT' | 'UNAVAILABLE';
    geographicFit: string;
  };
  priorityRule: string;
  humanPriorityOverride?: 'HIGH' | 'STANDARD' | 'LOW';
  nextAction: string;
  targetDeliverableDeadline?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export interface OutreachDraftRecord {
  id: string;
  opportunityId: string;
  recipientContactId: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  evidenceCitations: {
    evidenceId: string;
    factUsed: string;
    sourceName: string;
  }[];
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  sentAt?: string;
  sentMethod?: 'Manual Email Client' | 'Direct Dispatch';
  humanNotes?: string;
}

export interface AgentRunRecord {
  id: string;
  agentName: string;
  agentVersion: string;
  startedAt: string;
  completedAt: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL_CONFLICT' | 'IN_PROGRESS';
  targetDomain: string;
  tasksCompleted: string[];
  recordsCreated: number;
  recordsUpdated: number;
  evidenceCreated: number;
  conflictsFlagged: number;
  logSnippets: string[];
  idempotencyKey: string;
}

export interface SourceConnector {
  id: string;
  name: string;
  type: SourceType;
  jurisdiction: string;
  status: ConnectorStatus;
  lastSuccessfulSync: string;
  lastAttemptedSync: string;
  recordsDiscovered: number;
  errorCount: number;
  endpointDescription: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actorType: 'HERMES_AGENT' | 'HUMAN_OPERATOR' | 'SYSTEM_RULE';
  actorName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
}

export interface BacklogItemRecord {
  id: string;
  idea: string;
  rationale: string;
  revenueRelevance: string;
  dateAdded: string;
  status: 'PARKED' | 'UNDER_REVIEW' | 'PROMOTED' | 'REJECTED';
}
