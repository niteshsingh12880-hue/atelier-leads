import type { AuthSession, UserRole } from "@/lib/auth";
import { Lead, LeadStatus, ServiceIntent, normalizeLeads, scoreLead, starterLeads, storageKey } from "@/lib/leads";

export type RequirementStatus = "Open" | "Matched" | "In Progress" | "Completed" | "Archived";
export type ProviderMode = "local" | "supabase-ready";

export type UserProfile = AuthSession & {
  id: string;
  role: UserRole;
  company?: string;
  createdAt: string;
};

export type BusinessRequirement = {
  id: string;
  business: string;
  owner: string;
  city: string;
  phone: string;
  email: string;
  budget: string;
  service: ServiceIntent;
  requirement: string;
  status: RequirementStatus;
  createdAt: string;
  createdByEmail: string;
};

export type MarketplaceStats = {
  openRequirements: number;
  inboundRequirements: number;
  activeFreelancers: number;
  estimatedPipelineValue: string;
};

export const requirementsStorageKey = "atelier-requirements-data";
export const profilesStorageKey = "atelier-profiles-data";

export const providerMode: ProviderMode = process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase-ready" : "local";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function upsertProfile(session: AuthSession) {
  const profiles = safeRead<UserProfile[]>(profilesStorageKey, []);
  const existing = profiles.find((profile) => profile.email.toLowerCase() === session.email.toLowerCase());
  const profile: UserProfile = {
    id: existing?.id ?? crypto.randomUUID(),
    name: session.name,
    email: session.email,
    role: session.role,
    company: existing?.company,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  safeWrite(profilesStorageKey, [profile, ...profiles.filter((item) => item.id !== profile.id)]);
  return profile;
}

export function getProfiles() {
  return safeRead<UserProfile[]>(profilesStorageKey, []);
}

export function getLeads() {
  return normalizeLeads(safeRead<Partial<Lead>[]>(storageKey, starterLeads));
}

export function saveLeads(leads: Lead[]) {
  safeWrite(storageKey, leads);
}

export function getRequirements() {
  return safeRead<BusinessRequirement[]>(requirementsStorageKey, []);
}

export function saveRequirements(requirements: BusinessRequirement[]) {
  safeWrite(requirementsStorageKey, requirements);
}

export function createRequirement(input: Omit<BusinessRequirement, "id" | "status" | "createdAt">) {
  const requirement: BusinessRequirement = {
    ...input,
    id: crypto.randomUUID(),
    status: "Open",
    createdAt: new Date().toISOString(),
  };
  saveRequirements([requirement, ...getRequirements()]);
  return requirement;
}

export function requirementToLead(requirement: BusinessRequirement): Lead {
  const contact = [requirement.email, requirement.phone].filter(Boolean).join(" / ");
  const issue = `${requirement.requirement}${requirement.budget ? ` | Budget: ${requirement.budget}` : ""}${requirement.owner ? ` | Owner: ${requirement.owner}` : ""}`;
  return {
    id: requirement.id,
    business: requirement.business,
    niche: "Inbound Requirement",
    city: requirement.city || "Unknown City",
    website: "",
    issue,
    email: contact,
    service: requirement.service,
    source: "Inbound Requirement",
    score: scoreLead(issue, "", requirement.service),
    status: "Discovered" satisfies LeadStatus,
  };
}

export function addRequirementToPipeline(requirement: BusinessRequirement) {
  const leads = getLeads();
  const lead = requirementToLead(requirement);
  saveLeads([lead, ...leads.filter((item) => item.id !== lead.id)]);
  return lead;
}

export function getMarketplaceStats(): MarketplaceStats {
  const requirements = getRequirements();
  const leads = getLeads();
  const profiles = getProfiles();
  const openRequirements = requirements.filter((item) => item.status === "Open").length;
  const inboundRequirements = leads.filter((lead) => lead.source === "Inbound Requirement").length;
  const activeFreelancers = Math.max(1, profiles.filter((profile) => profile.role === "freelancer").length);
  const estimated = requirements.reduce((total, item) => {
    const match = item.budget.match(/\d+/g);
    if (!match) return total + 250;
    return total + Number(match[match.length - 1]);
  }, 0);
  return {
    openRequirements,
    inboundRequirements,
    activeFreelancers,
    estimatedPipelineValue: `$${estimated.toLocaleString()}`,
  };
}
