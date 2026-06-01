"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ShieldCheck, UsersRound, ClipboardList, Send, LockKeyhole } from "lucide-react";
import { ApplicationStatus, BusinessRequirement, getApplications, getMarketplaceStats, getProfiles, getRequirements, RequirementStatus, updateApplicationStatus, updateRequirementStatus } from "@/lib/platform";

const adminAuthKey = "atelier-admin-unlocked";
const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Atelier@Admin2026";

function loadAdminData() {
  if (typeof window === "undefined") return { stats: { openRequirements: 0, inboundRequirements: 0, activeFreelancers: 1, totalApplications: 0, estimatedPipelineValue: "$0" }, requirements: [] as BusinessRequirement[], applications: [] as ReturnType<typeof getApplications>, profiles: [] as ReturnType<typeof getProfiles> };
  return { stats: getMarketplaceStats(), requirements: getRequirements(), applications: getApplications(), profiles: getProfiles() };
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => typeof window !== "undefined" && window.sessionStorage.getItem(adminAuthKey) === "true");
  const [data, setData] = useState(loadAdminData);

  function refresh() {
    setData(loadAdminData());
  }

  function setRequirement(id: string, status: RequirementStatus) {
    updateRequirementStatus(id, status);
    refresh();
  }

  function setApplication(id: string, status: ApplicationStatus) {
    updateApplicationStatus(id, status);
    refresh();
  }

  if (!unlocked) return <AdminPasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <main className="min-h-screen bg-[#050507] px-6 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.2),transparent_30rem),linear-gradient(180deg,#050507,#09090c)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><ArrowLeft className="size-4" /> Home</Link>
        <button onClick={() => { window.sessionStorage.removeItem(adminAuthKey); setUnlocked(false); }} className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-sm text-purple-100"><ShieldCheck className="size-4" /> Lock Admin</button>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl py-12">
        <h1 className="font-serif text-5xl font-semibold leading-none md:text-7xl">Platform control room.</h1>
        <p className="mt-4 max-w-2xl text-white/60">Moderate requirements, review proposals, and monitor profiles. Current mode is local fallback, Supabase-ready.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-5">
          <Stat label="Open requests" value={data.stats.openRequirements} />
          <Stat label="Inbound leads" value={data.stats.inboundRequirements} />
          <Stat label="Freelancers" value={data.stats.activeFreelancers} />
          <Stat label="Proposals" value={data.stats.totalApplications} />
          <Stat label="Pipeline" value={data.stats.estimatedPipelineValue} />
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-5 pb-16 lg:grid-cols-2">
        <Panel title="Requirements" icon={<ClipboardList className="size-5" />}>
          {data.requirements.length ? data.requirements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3"><div><b>{item.business}</b><p className="mt-1 text-sm text-white/50">{item.service} • {item.city || "Remote"}</p></div><Status>{item.status}</Status></div>
              <p className="mt-2 text-sm leading-6 text-white/60">{item.requirement}</p>
              <div className="mt-3 flex flex-wrap gap-2">{(["Open", "Matched", "In Progress", "Completed", "Archived"] as RequirementStatus[]).map((status) => <button key={status} onClick={() => setRequirement(item.id, status)} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">{status}</button>)}</div>
            </div>
          )) : <Empty>No requirements yet.</Empty>}
        </Panel>

        <Panel title="Proposals" icon={<Send className="size-5" />}>
          {data.applications.length ? data.applications.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3"><div><b>{item.freelancerName}</b><p className="mt-1 text-sm text-white/50">{item.freelancerEmail}</p></div><Status>{item.status}</Status></div>
              <p className="mt-2 text-sm leading-6 text-white/60">{item.pitch}</p>
              <div className="mt-3 flex flex-wrap gap-2">{(["Submitted", "Shortlisted", "Accepted", "Rejected"] as ApplicationStatus[]).map((status) => <button key={status} onClick={() => setApplication(item.id, status)} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">{status}</button>)}</div>
            </div>
          )) : <Empty>No proposals yet.</Empty>}
        </Panel>

        <Panel title="Profiles" icon={<UsersRound className="size-5" />}>
          {data.profiles.length ? data.profiles.map((profile) => <div key={profile.id} className="rounded-2xl border border-white/10 bg-black/25 p-4"><b>{profile.name}</b><p className="mt-1 text-sm text-white/50">{profile.email} • {profile.role}</p></div>) : <Empty>No profiles yet.</Empty>}
        </Panel>
      </section>
    </main>
  );
}

function AdminPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== adminPassword) {
      setError("Wrong admin password.");
      return;
    }
    window.sessionStorage.setItem(adminAuthKey, "true");
    setError("");
    onUnlock();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#050507] px-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.2),transparent_30rem),linear-gradient(180deg,#050507,#09090c)]" />
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.08] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-black"><LockKeyhole className="size-6" /></div>
        <h1 className="mt-6 text-4xl font-semibold">Admin locked</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">Admin console open karne ke liye password required hai.</p>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter admin password" className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-purple-200/60" />
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button type="submit" className="mt-5 w-full rounded-full bg-white px-6 py-3 font-bold text-black">Unlock admin</button>
        <Link href="/" className="mt-4 inline-flex text-sm text-white/55 hover:text-white">Back to home</Link>
      </form>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-white/45">{label}</p></div>;
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-2xl"><h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">{icon}{title}</h2><div className="space-y-3">{children}</div></div>;
}

function Status({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">{children}</span>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/50">{children}</p>;
}
