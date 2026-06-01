"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardList,
  Globe,
  Mail,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
  UsersRound,
  Zap,
} from "lucide-react";

type LeadStatus = "Discovered" | "Contacted" | "Replied" | "Call Booked" | "Won" | "Lost";

type Lead = {
  id: string;
  business: string;
  niche: string;
  city: string;
  website: string;
  issue: string;
  email: string;
  score: number;
  status: LeadStatus;
};

const statuses: LeadStatus[] = ["Discovered", "Contacted", "Replied", "Call Booked", "Won", "Lost"];

const starterLeads: Lead[] = [
  {
    id: "1",
    business: "Olive Table",
    niche: "Restaurant",
    city: "Dubai",
    website: "olivetable.example",
    issue: "No booking CTA and weak mobile menu",
    email: "owner@olivetable.example",
    score: 38,
    status: "Discovered",
  },
  {
    id: "2",
    business: "Aurum Studio",
    niche: "Salon",
    city: "Mumbai",
    website: "aurumstudio.example",
    issue: "Outdated gallery and slow homepage",
    email: "hello@aurumstudio.example",
    score: 51,
    status: "Contacted",
  },
];

function scoreLead(issue: string, website: string) {
  let score = 72;
  const text = `${issue} ${website}`.toLowerCase();
  if (text.includes("no website")) score -= 34;
  if (text.includes("slow")) score -= 16;
  if (text.includes("outdated")) score -= 14;
  if (text.includes("booking") || text.includes("cta")) score -= 12;
  if (!website.trim()) score -= 24;
  return Math.max(18, Math.min(92, score));
}

function createPitch(lead: Lead) {
  return `Hi ${lead.business}, I found your ${lead.niche.toLowerCase()} while researching businesses in ${lead.city}. I noticed ${lead.issue.toLowerCase()}. I help businesses improve their website so more visitors turn into calls, bookings, and inquiries. I can send a quick homepage improvement idea for ${lead.business}. Would you like me to share it?`;
}

export default function Home() {
  const [videoReady, setVideoReady] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(starterLeads);
  const [selectedId, setSelectedId] = useState("1");
  const [csv, setCsv] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    business: "",
    niche: "",
    city: "",
    website: "",
    issue: "",
    email: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setVideoReady(true), 700);
    const saved = window.localStorage.getItem("atelier-leads-data");
    if (saved) {
      const parsed = JSON.parse(saved) as Lead[];
      setLeads(parsed);
      setSelectedId(parsed[0]?.id ?? "");
    }
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("atelier-leads-data", JSON.stringify(leads));
  }, [leads]);

  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? leads[0];
  const pitch = selectedLead ? createPitch(selectedLead) : "Add a lead to generate a personalized outreach message.";

  const pipeline = useMemo(
    () => statuses.map((status) => ({ status, count: leads.filter((lead) => lead.status === status).length })),
    [leads],
  );

  function addLead() {
    if (!form.business.trim()) return;
    const lead: Lead = {
      id: crypto.randomUUID(),
      business: form.business.trim(),
      niche: form.niche.trim() || "Local Business",
      city: form.city.trim() || "Your City",
      website: form.website.trim(),
      issue: form.issue.trim() || "website could convert more visitors",
      email: form.email.trim(),
      score: scoreLead(form.issue, form.website),
      status: "Discovered",
    };
    setLeads((current) => [lead, ...current]);
    setSelectedId(lead.id);
    setForm({ business: "", niche: "", city: "", website: "", issue: "", email: "" });
  }

  function importCsv() {
    const rows = csv.split("\n").map((row) => row.trim()).filter(Boolean);
    const imported = rows.map((row) => {
      const [business = "", niche = "Local Business", city = "", website = "", issue = "Needs better website", email = ""] = row.split(",").map((item) => item.trim());
      return {
        id: crypto.randomUUID(),
        business,
        niche,
        city,
        website,
        issue,
        email,
        score: scoreLead(issue, website),
        status: "Discovered" as LeadStatus,
      };
    }).filter((lead) => lead.business);
    if (!imported.length) return;
    setLeads((current) => [...imported, ...current]);
    setSelectedId(imported[0].id);
    setCsv("");
  }

  function updateStatus(id: string, status: LeadStatus) {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  async function copyPitch() {
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="fixed inset-0">
        <video
          className={`h-full w-full object-cover transition-opacity duration-[1800ms] ease-out ${videoReady ? "opacity-35" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          poster="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=80"
        >
          <source src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_28rem),linear-gradient(180deg,rgba(5,5,7,0.45),rgba(5,5,7,0.98))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,7,0.92),rgba(5,5,7,0.42),rgba(5,5,7,0.92))]" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl"><Sparkles className="size-5" /></div>
          <span className="text-xl font-semibold">Atelier-Leads</span>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm text-white/78 backdrop-blur-2xl md:flex md:gap-8">
          <a href="#dashboard">Dashboard</a><a href="#import">CSV Import</a><a href="#pitch">Outreach</a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-8 text-center">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur-2xl">
          <BriefcaseBusiness className="size-4" /> Helping freelancers find better clients faster.
        </div>
        <h1 className="mx-auto max-w-6xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-8xl">
          Find Clients. Build Authority. Grow Faster.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68">
          Add leads, score their website problems, track outreach status, and generate personalized cold messages.
        </p>
      </section>

      <section id="dashboard" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-6 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Plus className="size-5" /> Add a lead</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["business", "Business name"], ["niche", "Niche"], ["city", "City"], ["website", "Website"], ["email", "Email"], ["issue", "Main issue"],
              ].map(([key, label]) => (
                <input key={key} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/30" />
              ))}
            </div>
            <button onClick={addLead} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black"><Plus className="size-4" /> Add Lead</button>
          </div>

          <div id="import" className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Upload className="size-5" /> CSV Import</h2>
            <p className="mt-2 text-sm text-white/50">Format: business,niche,city,website,issue,email</p>
            <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="Olive Table,Restaurant,Dubai,olivetable.com,No booking CTA,owner@email.com" className="mt-4 h-28 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-sm outline-none placeholder:text-white/30" />
            <button onClick={importCsv} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold"><Upload className="size-4" /> Import Leads</button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {pipeline.map((item) => (
              <div key={item.status} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-2xl">
                <p className="text-3xl font-semibold">{item.count}</p><p className="mt-1 text-xs text-white/45">{item.status}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><UsersRound className="size-5" /> Leads CRM</h2>
            <div className="mt-5 space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} onClick={() => setSelectedId(lead.id)} className={`cursor-pointer rounded-2xl border p-4 transition ${selectedId === lead.id ? "border-white/35 bg-white/15" : "border-white/10 bg-black/20 hover:bg-white/10"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-semibold">{lead.business}</h3><p className="mt-1 text-sm text-white/50">{lead.niche} • {lead.city} • {lead.issue}</p></div>
                    <div className="text-right"><p className="text-2xl font-semibold">{lead.score}</p><p className="text-xs text-white/45">audit score</p></div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)} onClick={(e) => e.stopPropagation()} className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs">
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <button onClick={(e) => { e.stopPropagation(); setLeads((current) => current.filter((item) => item.id !== lead.id)); }} className="rounded-full border border-red-400/20 bg-red-500/10 p-2 text-red-100"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="pitch" className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Mail className="size-5" /> Outreach Generator</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/72">{pitch}</div>
            <button onClick={copyPitch} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black">{copied ? <CheckCircle2 className="size-4" /> : <ClipboardList className="size-4" />} {copied ? "Copied" : "Copy Pitch"}</button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 px-6 py-6 text-sm text-white/50">
        <span>© 2026 Atelier-Leads. Working MVP stored in your browser.</span>
        <div className="flex items-center gap-3">
          <Camera className="size-4" /><Send className="size-4" /><Globe className="size-4" />
        </div>
      </footer>
    </main>
  );
}
