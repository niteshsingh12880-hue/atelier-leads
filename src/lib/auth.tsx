"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Building2, LockKeyhole, LogOut, UserRound } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";

export type UserRole = "freelancer" | "business";

export type AuthSession = {
  name: string;
  email: string;
  role: UserRole;
};

export const authStorageKey = "atelier-auth-session";

const roleLabels: Record<UserRole, string> = {
  freelancer: "Freelancer",
  business: "Business Owner",
};

const roleHome: Record<UserRole, string> = {
  freelancer: "/freelancer",
  business: "/business",
};

function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(authStorageKey);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as Partial<AuthSession>;
    if (!parsed.name || !parsed.email || (parsed.role !== "freelancer" && parsed.role !== "business")) return null;
    return { name: parsed.name, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

export function getSession() {
  return readSession();
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(authStorageKey);
}

export function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const session = readSession();
    if (session) router.replace(roleHome[session.role]);
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;
    saveSession({ name: name.trim(), email: email.trim(), role });
    router.replace(roleHome[role]);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 text-left backdrop-blur-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-white/70">
          Your name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Arjun" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-200/50" />
        </label>
        <label className="space-y-2 text-sm text-white/70">
          Email / login ID
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-200/50" />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button type="button" onClick={() => setRole("freelancer")} className={`rounded-[1.5rem] border p-5 text-left transition ${role === "freelancer" ? "border-cyan-200 bg-cyan-300/15" : "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"}`}>
          <BriefcaseBusiness className="size-8" />
          <h3 className="mt-4 text-2xl font-semibold">Login as Freelancer</h3>
          <p className="mt-2 text-sm leading-6 text-white/55">CRM, leads, outreach generator aur AI sales assistant access milega.</p>
        </button>
        <button type="button" onClick={() => setRole("business")} className={`rounded-[1.5rem] border p-5 text-left transition ${role === "business" ? "border-emerald-200 bg-emerald-300/15" : "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"}`}>
          <Building2 className="size-8" />
          <h3 className="mt-4 text-2xl font-semibold">Login as Business Owner</h3>
          <p className="mt-2 text-sm leading-6 text-white/55">Requirement post karne ka portal milega, freelancer CRM hidden rahega.</p>
        </button>
      </div>

      <button type="submit" disabled={!name.trim() || !email.trim() || !role} className="mt-6 w-full rounded-full bg-white px-6 py-4 font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-40">
        Continue to {role ? roleLabels[role] : "selected workspace"}
      </button>
    </form>
  );
}

export function AuthGate({ allowedRole, children }: { allowedRole: UserRole; children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => setSession(readSession()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (session === undefined) {
    return <AccessShell title="Checking login..." copy="Workspace verify ho raha hai." />;
  }

  if (!session) {
    return <AccessShell title="Login required" copy="Pehle login karo, phir role ke according dashboard open hoga." ctaHref="/login" ctaText="Go to login" />;
  }

  if (session.role !== allowedRole) {
    return (
      <AccessShell
        title="Wrong workspace"
        copy={`Aap ${roleLabels[session.role]} ke roop me login ho. Isliye ${roleLabels[allowedRole]} page hidden hai.`}
        ctaHref={roleHome[session.role]}
        ctaText={`Open ${roleLabels[session.role]} dashboard`}
        secondaryAction={() => {
          clearSession();
          router.replace("/login");
        }}
      />
    );
  }

  return <>{children}</>;
}

export function SessionBadge() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setSession(readSession()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!session) return <Link href="/login" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm">Login</Link>;
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80"><UserRound className="size-4" /> {session.name} · {roleLabels[session.role]}</div>
      <button onClick={() => { clearSession(); router.replace("/login"); }} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><LogOut className="size-4" /> Logout</button>
    </div>
  );
}

function AccessShell({ title, copy, ctaHref, ctaText, secondaryAction }: { title: string; copy: string; ctaHref?: string; ctaText?: string; secondaryAction?: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050507] px-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_32rem),linear-gradient(180deg,#050507,#09090c)]" />
      <div className="relative z-10 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.08] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-black"><LockKeyhole className="size-6" /></div>
        <h1 className="mt-6 text-4xl font-semibold">{title}</h1>
        <p className="mt-3 leading-7 text-white/60">{copy}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {ctaHref && <Link href={ctaHref} className="rounded-full bg-white px-5 py-3 font-bold text-black">{ctaText}</Link>}
          {secondaryAction && <button onClick={secondaryAction} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold">Switch role</button>}
        </div>
      </div>
    </main>
  );
}
