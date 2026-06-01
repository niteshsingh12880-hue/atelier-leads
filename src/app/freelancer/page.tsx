"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Home, Mail, MessageCircle, Plus, Send, Trash2, Upload, UsersRound } from "lucide-react";
import { createPitch, Lead, LeadStatus, normalizeLeads, scoreLead, ServiceIntent, serviceBenefit, services, starterLeads, statuses, storageKey } from "@/lib/leads";

function getStoredLeads() {
  if (typeof window === "undefined") return starterLeads;
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return starterLeads;
  try {
    return normalizeLeads(JSON.parse(saved) as Partial<Lead>[]);
  } catch {
    return starterLeads;
  }
}

export default function FreelancerPage() {
  const [leads, setLeads] = useState<Lead[]>(getStoredLeads);
  const [selectedId, setSelectedId] = useState(() => getStoredLeads()[0]?.id ?? "");
  const [csv, setCsv] = useState("");
  const [copied, setCopied] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceIntent | "All">("All");
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "AI", text: "Freelancer assistant ready. Ask me for a pitch angle, audit checklist, or follow-up message." },
  ]);
  const [form, setForm] = useState({ business: "", niche: "", city: "", website: "", issue: "", email: "", service: "Website" as ServiceIntent });

  useEffect(() => window.localStorage.setItem(storageKey, JSON.stringify(leads)), [leads]);

  const filteredLeads = serviceFilter === "All" ? leads : leads.filter((lead) => lead.service === serviceFilter);
  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? leads[0];
  const pitch = selectedLead ? createPitch(selectedLead) : "Add or select a lead to generate outreach.";

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
      service: form.service,
      source: "Prospecting",
      score: scoreLead(form.issue, form.website, form.service),
      status: "Discovered",
    };
    setLeads((current) => [lead, ...current]);
    setSelectedId(lead.id);
    setForm({ business: "", niche: "", city: "", website: "", issue: "", email: "", service: "Website" });
  }

  function importCsv() {
    const imported = csv.split("\n").map((row) => {
      const [business = "", niche = "Local Business", city = "", website = "", issue = "Needs better website", email = "", serviceRaw = "Website"] = row.split(",").map((item) => item.trim());
      const service = services.includes(serviceRaw as ServiceIntent) ? serviceRaw as ServiceIntent : "Website";
      return { id: crypto.randomUUID(), business, niche, city, website, issue, email, service, source: "Prospecting", score: scoreLead(issue, website, service), status: "Discovered" as LeadStatus } satisfies Lead;
    }).filter((lead) => lead.business);
    if (!imported.length) return;
    setLeads((current) => [...imported, ...current]);
    setSelectedId(imported[0].id);
    setCsv("");
  }

  function buildChatReply(text: string) {
    const lower = text.toLowerCase();
    const service = services.find((item) => lower.includes(item.toLowerCase().split(" ")[0])) ?? selectedLead?.service ?? "Website";
    const leadName = selectedLead?.business ?? "this lead";
    if (lower.includes("follow")) {
      return `Follow-up for ${leadName}: remind them of one missed opportunity, offer a quick fix, and ask for a 10-minute call. Service angle: ${serviceBenefit(service)}.`;
    }
    if (lower.includes("audit") || lower.includes("checklist")) {
      return `Audit checklist for ${service}: 1) find conversion leaks, 2) capture screenshots/proof, 3) suggest one fast win, 4) end with a simple call-to-action for ${leadName}.`;
    }
    if (lower.includes("price") || lower.includes("budget")) {
      return `Pricing angle for ${service}: offer 3 tiers: starter quick fix, growth implementation, and monthly optimization. Anchor it around revenue, calls, bookings, or saved support time.`;
    }
    return `Pitch angle for ${service}: lead with a specific pain point, show one quick win, then offer a free 3-point audit for ${leadName}. Benefit: ${serviceBenefit(service)}.`;
  }

  function askChatbot(prompt?: string) {
    const text = (prompt ?? chatInput).trim();
    if (!text) return;
    const reply = buildChatReply(text);
    setChatLog((current) => [...current, { role: "You", text }, { role: "AI", text: reply }]);
    setChatInput("");
  }

  async function copyPitch() {
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.14),transparent_28rem),linear-gradient(180deg,#050507,#09090c)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div><p className="text-xs uppercase tracking-[0.28em] text-cyan-100/60">Freelancer Workspace</p><h1 className="text-2xl font-semibold">Atelier-Leads CRM</h1></div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><Home className="size-4" /> Home</Link>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-8">
        <h2 className="max-w-4xl font-serif text-5xl font-semibold leading-none md:text-7xl">Manage prospects and inbound requirements separately.</h2>
        <p className="mt-4 max-w-2xl text-white/60">This page is only for freelancers: CRM, CSV import, pipeline, outreach generator, and AI sales assistant.</p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-5 px-6 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><Plus className="size-5" /> Add prospect lead</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[ ["business", "Business name"], ["niche", "Niche"], ["city", "City"], ["website", "Website"], ["email", "Email"], ["issue", "Main issue"] ].map(([key, label]) => (
                <input key={key} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35" />
              ))}
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value as ServiceIntent })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm sm:col-span-2">
                {services.map((service) => <option key={service}>{service}</option>)}
              </select>
            </div>
            <button onClick={addLead} className="mt-4 w-full rounded-full bg-white px-5 py-3 font-bold text-black">Add Lead</button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><Upload className="size-5" /> CSV Import</h3>
            <p className="mt-2 text-sm text-white/50">business,niche,city,website,issue,email,service</p>
            <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="Olive Table,Restaurant,Dubai,site.com,No booking CTA,owner@email.com,Website" className="mt-4 h-28 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-sm outline-none placeholder:text-white/30" />
            <button onClick={importCsv} className="mt-3 w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold">Import Leads</button>
          </div>

          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/[0.08] p-5 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-xl font-semibold"><MessageCircle className="size-5" /> AI Sales Assistant</h3><span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs text-emerald-100">Working 24x7</span></div>
            <p className="mt-2 text-sm text-white/55">Type a question or use a quick prompt. Press Enter or click Ask AI.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Pitch SEO for this lead", "Audit checklist", "Follow-up message", "Pricing angle"].map((prompt) => (
                <button key={prompt} onClick={() => askChatbot(prompt)} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/15">{prompt}</button>
              ))}
            </div>
            <div className="mt-4 max-h-72 space-y-3 overflow-auto rounded-2xl border border-white/10 bg-black/25 p-4" aria-live="polite">
              {chatLog.map((message, index) => <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm ${message.role === "AI" ? "bg-white/10 text-white/75" : "bg-white text-black"}`}><b>{message.role}:</b> {message.text}</div>)}
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") askChatbot(); }} placeholder="Ask AI: pitch SEO for a salon, make follow-up, audit checklist..." className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35" /><button onClick={() => askChatbot()} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-300 px-5 py-3 font-bold text-black"><Send className="size-4" /> Ask AI</button></div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{pipeline.map((item) => <div key={item.status} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><p className="text-3xl font-semibold">{item.count}</p><p className="mt-1 text-xs text-white/45">{item.status}</p></div>)}</div>
          <div className="grid gap-3 sm:grid-cols-4">{services.map((service) => <button key={service} onClick={() => setServiceFilter(serviceFilter === service ? "All" : service)} className={`rounded-2xl border p-4 text-left ${serviceFilter === service ? "border-cyan-200/50 bg-cyan-300/15" : "border-white/10 bg-white/[0.08]"}`}><p className="text-sm font-semibold">{service}</p><p className="mt-1 text-2xl font-bold">{leads.filter((lead) => lead.service === service).length}</p></button>)}</div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-xl font-semibold"><UsersRound className="size-5" /> Leads CRM</h3><select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as ServiceIntent | "All")} className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs"><option>All</option>{services.map((service) => <option key={service}>{service}</option>)}</select></div>
            <div className="mt-5 space-y-3">{filteredLeads.map((lead) => <div key={lead.id} onClick={() => setSelectedId(lead.id)} className={`cursor-pointer rounded-2xl border p-4 ${selectedId === lead.id ? "border-white/35 bg-white/15" : "border-white/10 bg-black/20"}`}><div className="flex items-start justify-between gap-3"><div><h4 className="font-semibold">{lead.business}</h4><p className="mt-1 text-sm text-white/50">{lead.source} • {lead.service} • {lead.city}</p><p className="mt-1 text-xs text-white/40">{lead.issue}</p></div><div className="text-right"><p className="text-2xl font-semibold">{lead.score}</p><p className="text-xs text-white/45">score</p></div></div><div className="mt-3 flex gap-2"><select value={lead.status} onChange={(e) => setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status: e.target.value as LeadStatus } : item))} onClick={(e) => e.stopPropagation()} className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs">{statuses.map((status) => <option key={status}>{status}</option>)}</select><button onClick={(e) => { e.stopPropagation(); setLeads((current) => current.filter((item) => item.id !== lead.id)); }} className="rounded-full border border-red-400/20 bg-red-500/10 p-2 text-red-100"><Trash2 className="size-4" /></button></div></div>)}</div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><Mail className="size-5" /> Outreach Generator</h3>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/72">{pitch}</div>
            <button onClick={copyPitch} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black">{copied ? <CheckCircle2 className="size-4" /> : <ClipboardList className="size-4" />} {copied ? "Copied" : "Copy Pitch"}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
