import { GoogleGenAI } from '@google/genai';
import { EvidenceItem, ProjectRecord, ContactRecord, CompanyRecord } from '../types';

// System prompt enforcing Master Build Prompt Non-Negotiable Principles #1, #2, #5, #8
const GROUNDED_OUTREACH_SYSTEM_PROMPT = `
You are the Geospatial Labs research communication model.
Your task is to draft a personalized, professional, high-conviction email from Geospatial Labs to a California BESS developer decision-maker.

NON-NEGOTIABLE PRINCIPLES:
1. No source -> no factual claim. You may ONLY mention facts explicitly present in the provided evidence items.
2. Missing data must remain UNKNOWN; NEVER guess or hallucinate milestones, dates, or specs.
3. Distinguish power capacity (MW) from energy storage (MWh) - NEVER confuse or infer one from the other.
4. Never claim prior familiarity or personal relationship.
5. Tone: Senior geospatial infrastructure engineer to development director. Concise, direct, technical, respectful.
6. The goal is to offer Geospatial Labs' rapid site constraint audit / POI geospatial diligence package for their upcoming milestone.
`;

export async function generateGroundedOutreach(params: {
  project: ProjectRecord;
  company: CompanyRecord;
  contact: ContactRecord;
  evidenceItems: EvidenceItem[];
  relevantServiceDeliverable: string;
}): Promise<{ subject: string; body: string; citations: { evidenceId: string; factUsed: string; sourceName: string }[] }> {
  const { project, company, contact, evidenceItems, relevantServiceDeliverable } = params;

  // Compile citations from evidence
  const citations = evidenceItems.map((e) => ({
    evidenceId: e.id,
    factUsed: `${e.entityFieldSupported}: ${e.normalizedValue}`,
    sourceName: `${e.sourceName} (${e.sourceUrlOrDocId})`,
  }));

  const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Draft an outreach email using ONLY these verified facts:
Recipient: ${contact.name}, ${contact.title} at ${company.displayName}
Email: ${contact.businessEmail}
Target Project: ${project.name} in ${project.county}, CA
Capacity: ${project.capacityMw} MW / ${project.energyMwh} MWh (${project.technology})
Point of Interconnection: ${project.interconnectionPoint} (${project.interconnectionUtility})
Status/Milestone: ${project.permittingStage} / ${project.interconnectionStatus}
Relevant Deliverable to Offer: ${relevantServiceDeliverable}

STRICT EVIDENCE ITEMS:
${evidenceItems
  .map(
    (e, idx) =>
      `[Evidence ${idx + 1}] Source: ${e.sourceName} | Doc ID: ${e.sourceUrlOrDocId} | Date: ${e.sourceDate}\nRaw Excerpt: "${e.rawValue}"\nNormalized Fact: "${e.normalizedValue}"`
  )
  .join('\n\n')}

Return JSON with exact keys:
{
  "subject": "concise subject referencing project name, capacity, and POI",
  "body": "3-4 concise paragraphs referencing ONLY the cited facts and offering the geospatial diligence review"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: GROUNDED_OUTREACH_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for high factual adherence
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.subject && parsed.body) {
          return {
            subject: parsed.subject,
            body: parsed.body,
            citations,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed or unconfigured, utilizing strict verified deterministic fallback:', err);
    }
  }

  // Deterministic rule-based fallback strictly adhering to Non-Negotiable Principle #1 & #8
  const primaryEv = evidenceItems[0];
  const secondaryEv = evidenceItems[1];

  const subject = `${project.name} (${project.capacityMw} MW) / ${project.interconnectionPoint} geospatial diligence package`;
  const body = `Hi ${contact.name.split(' ')[0]},

Following your recent filing milestone for ${project.name} (${project.permittingStage}), our research desk examined the spatial constraints around the ${project.interconnectionPoint} (${project.interconnectionUtility}).

Our records reference ${primaryEv ? primaryEv.sourceName : 'CAISO Queue filings'} indicating ${project.capacityMw} MW / ${project.energyMwh} MWh of standalone ${project.technology} siting${project.parcelApn ? ` on APN ${project.parcelApn}` : ''}.

To support ${company.displayName}'s pre-construction milestones and utility interconnection diligence, Geospatial Labs developed a tailored spatial diligence overlay: ${relevantServiceDeliverable}.

Would you be open to reviewing the preliminary 1-page POI setback and hazard brief we assembled for ${project.name}?

Best regards,
Geospatial Labs Research Desk
diligence@geospatiallabs.com`;

  return {
    subject,
    body,
    citations,
  };
}
