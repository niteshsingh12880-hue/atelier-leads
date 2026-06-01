export type LeadStatus = "Discovered" | "Contacted" | "Replied" | "Call Booked" | "Won" | "Lost";
export type ServiceIntent = "Website" | "SEO" | "Google Profile" | "AI Chatbot";

export type Lead = {
  id: string;
  business: string;
  niche: string;
  city: string;
  website: string;
  issue: string;
  email: string;
  service: ServiceIntent;
  source: "Prospecting" | "Inbound Requirement";
  score: number;
  status: LeadStatus;
};

export const statuses: LeadStatus[] = ["Discovered", "Contacted", "Replied", "Call Booked", "Won", "Lost"];
export const services: ServiceIntent[] = ["Website", "SEO", "Google Profile", "AI Chatbot"];
export const storageKey = "atelier-leads-data";

export const starterLeads: Lead[] = [
  {
    id: "1",
    business: "Olive Table",
    niche: "Restaurant",
    city: "Dubai",
    website: "olivetable.example",
    issue: "No booking CTA and weak mobile menu",
    email: "owner@olivetable.example",
    service: "Website",
    source: "Prospecting",
    score: 38,
    status: "Discovered",
  },
  {
    id: "2",
    business: "Aurum Studio",
    niche: "Salon",
    city: "Mumbai",
    website: "aurumstudio.example",
    issue: "Outdated gallery, weak SEO pages, and slow homepage",
    email: "hello@aurumstudio.example",
    service: "SEO",
    source: "Prospecting",
    score: 51,
    status: "Contacted",
  },
];

export function scoreLead(issue: string, website: string, service: ServiceIntent = "Website") {
  let score = service === "AI Chatbot" ? 68 : 72;
  const text = `${issue} ${website} ${service}`.toLowerCase();
  if (text.includes("no website")) score -= 34;
  if (text.includes("slow")) score -= 16;
  if (text.includes("outdated")) score -= 14;
  if (text.includes("booking") || text.includes("cta")) score -= 12;
  if (text.includes("seo") || text.includes("ranking")) score -= 10;
  if (text.includes("google") || text.includes("maps") || text.includes("profile")) score -= 10;
  if (text.includes("chat") || text.includes("support")) score -= 8;
  if (!website.trim()) score -= 24;
  return Math.max(18, Math.min(92, score));
}

export function serviceBenefit(service: ServiceIntent) {
  if (service === "SEO") return "rank better on Google and attract more organic inquiries";
  if (service === "Google Profile") return "optimize Google Business Profile so Maps visitors convert into calls and visits";
  if (service === "AI Chatbot") return "add a 24x7 AI chatbot that captures leads, answers FAQs, and books calls even after hours";
  return "build a high-converting website that turns visitors into calls, bookings, and inquiries";
}

export function createPitch(lead: Lead) {
  const sourceLine = lead.source === "Inbound Requirement" ? "You shared a requirement with us" : `I found your ${lead.niche.toLowerCase()} while researching businesses in ${lead.city}`;
  return `Hi ${lead.business}, ${sourceLine}. I noticed ${lead.issue.toLowerCase()}. I help businesses ${serviceBenefit(lead.service)}. I can send a quick ${lead.service.toLowerCase()} action plan for ${lead.business}. Would you like me to share it?`;
}

export function normalizeLeads(raw: Partial<Lead>[]) {
  return raw.map((lead) => ({
    id: lead.id ?? crypto.randomUUID(),
    business: lead.business ?? "Untitled Business",
    niche: lead.niche ?? "Local Business",
    city: lead.city ?? "Unknown City",
    website: lead.website ?? "",
    issue: lead.issue ?? "Needs digital growth help",
    email: lead.email ?? "",
    service: lead.service ?? "Website",
    source: lead.source ?? "Prospecting",
    score: lead.score ?? scoreLead(lead.issue ?? "", lead.website ?? "", lead.service ?? "Website"),
    status: lead.status ?? "Discovered",
  })) as Lead[];
}
