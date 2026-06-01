"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, Building2, CheckCircle2, Home, Send, Sparkles } from "lucide-react";
import { AuthGate, getSession, SessionBadge } from "@/lib/auth";
import { addRequirementToPipeline, createRequirement, getMarketplaceStats } from "@/lib/platform";
import { ServiceIntent, services } from "@/lib/leads";

function getStats() {
  if (typeof window === "undefined") return { openRequirements: 0, inboundRequirements: 0, activeFreelancers: 1, estimatedPipelineValue: "$0" };
  return getMarketplaceStats();
}

export default function BusinessPage() {
  const [stats, setStats] = useState(getStats);
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({
    business: "",
    owner: "",
    city: "",
    phone: "",
    email: "",
    budget: "",
    service: "Website" as ServiceIntent,
    requirement: "",
  });

  function postRequirement() {
    if (!form.business.trim() || !form.requirement.trim()) return;
    const session = getSession();
    const requirement = createRequirement({
      business: form.business.trim(),
      owner: form.owner.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      budget: form.budget.trim(),
      service: form.service,
      requirement: form.requirement.trim(),
      createdByEmail: session?.email ?? form.email.trim(),
    });
    addRequirementToPipeline(requirement);
    setStats(getStats());
    setPosted(true);
    setForm({ business: "", owner: "", city: "", phone: "", email: "", budget: "", service: "Website", requirement: "" });
  }

  return (
    <AuthGate allowedRole="business">
      <main className="min-h-screen bg-[#050507] text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30rem),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_28rem),linear-gradient(180deg,#050507,#09090c)]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div><p className="text-xs uppercase tracking-[0.28em] text-cyan-100/60">Business Owner Portal</p><h1 className="text-2xl font-semibold">Post your requirement</h1></div>
          <div className="flex flex-wrap items-center justify-end gap-2"><SessionBadge /><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><Home className="size-4" /> Home</Link></div>
        </nav>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-20 pt-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-7 backdrop-blur-2xl">
              <div className="grid size-14 place-items-center rounded-2xl bg-cyan-200 text-black"><Building2 className="size-6" /></div>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-none">Tell us what you need built.</h2>
              <p className="mt-5 text-sm leading-7 text-white/60">This page is only for business owners. Submit one clear request and it becomes a marketplace requirement plus an inbound CRM lead.</p>
            </div>

            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/[0.08] p-5 backdrop-blur-2xl">
              <h3 className="flex items-center gap-2 font-semibold"><BarChart3 className="size-5" /> Marketplace snapshot</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Open requests" value={stats.openRequirements} />
                <Stat label="CRM inbound" value={stats.inboundRequirements} />
                <Stat label="Freelancers" value={stats.activeFreelancers} />
                <Stat label="Pipeline" value={stats.estimatedPipelineValue} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
              <h3 className="flex items-center gap-2 font-semibold"><Sparkles className="size-5" /> You can request</h3>
              <div className="mt-4 grid gap-3">
                {services.map((service) => <div key={service} className="rounded-2xl border border-white/10 bg-black/20 p-4"><b>{service}</b><p className="mt-1 text-sm text-white/50">Website, SEO, Google Profile, or 24x7 AI chatbot work.</p></div>)}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-400/[0.08] p-6 backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold">Business Requirement Form</h2>
            <p className="mt-2 text-sm text-white/55">Fill details so freelancers can understand your project and contact you.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["business", "Business name"], ["owner", "Owner name"], ["city", "City"], ["phone", "Phone / WhatsApp"], ["email", "Email"], ["budget", "Budget range"],
              ].map(([key, label]) => (
                <input key={key} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-cyan-200/50" />
              ))}
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value as ServiceIntent })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none sm:col-span-2">
                {services.map((service) => <option key={service}>{service}</option>)}
              </select>
              <textarea value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} placeholder="Example: meri bakery ke liye website + Google profile optimize karwani hai, online orders aur WhatsApp button chahiye..." className="h-40 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm outline-none placeholder:text-white/35 focus:border-cyan-200/50 sm:col-span-2" />
            </div>
            <button onClick={postRequirement} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-200 px-5 py-4 font-bold text-black"><Send className="size-4" /> {posted ? "Requirement Posted" : "Submit Requirement"}</button>
            {posted && <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100"><CheckCircle2 className="size-5" /> Submitted. Requirement marketplace aur freelancer CRM me add ho gaya.</div>}
          </div>
        </section>
      </main>
    </AuthGate>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-white/45">{label}</p></div>;
}
