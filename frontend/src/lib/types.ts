export interface ParsedOpportunity {
  email_id: string;
  is_opportunity: boolean;
  classification_confidence: number;
  classification_reason: string;
  title?: string;
  organization?: string;
  opportunity_type?: string;
  deadline?: string;
  eligibility_criteria?: string[];
  required_documents?: string[];
  application_link?: string;
  contact_email?: string;
  stipend_or_benefit?: string;
  location?: string;
  days_remaining?: number | null;
  urgency_score?: number;
  fit_score?: number;
  fit_evidence?: string[];
  fit_gaps?: string[];
  why_this_matters?: string;
  completeness_score?: number;
  priority_score?: number;
  priority_rank?: number;
  action_steps?: string[];
}

// Alias for backward compatibility
export type RankedOpportunity = ParsedOpportunity;

export interface StudentProfile {
  name: string;
  university: string;
  degree: string;
  program: string;
  semester: number;
  cgpa: number;
  graduation_year: number;
  skills: string[];
  interests: string[];
  preferred_types: string[];
  financial_need: boolean;
  location_preference: string;
  nationality: string;
  gender: string;
  past_experience: string;
}

export interface RawEmail {
  id: string;
  subject: string;
  sender: string;
  body: string;
  received_date?: string;
}

export interface NearMiss {
  email_id: string;
  title: string | null;
  organization?: string | null;
  fit_score: number;
  bridge_message: string;
  gaps: string[];
}

export interface ProcessResponse {
  session_id: string;
  total_scanned: number;
  total_real: number;
  noise_count: number;
  dedup_count: number;
  ranked_opportunities: ParsedOpportunity[];
  near_miss_opportunities: NearMiss[];
  reasoning_steps: string[];
}
