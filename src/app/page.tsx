"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Globe,
  LockKeyhole,
  Mail,
  Send,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";

const features = [
  { icon: UsersRound, label: "Client discovery", value: "Find local businesses ready for a better online presence." },
  { icon: BadgeCheck, label: "Authority builder", value: "Turn audits, case studies, and outreach into trust signals." },
  { icon: Zap, label: "Faster outreach", value: "Create sharper pitches and follow-ups without sounding generic." },
];

const stats = ["Designers", "Developers", "Copywriters", "Agencies", "Service Providers"];

export default function Home() {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVideoReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="absolute inset-0">
        <video
          className={`h-full w-full object-cover transition-opacity duration-[1800ms] ease-out ${
            videoReady ? "opacity-45" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          poster="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=80"
        >
          <source
            src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_28rem),linear-gradient(180deg,rgba(5,5,7,0.35),rgba(5,5,7,0.94))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,7,0.92),rgba(5,5,7,0.36),rgba(5,5,7,0.92))]" />
      </div>

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[130px]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 shadow-2xl shadow-white/10 backdrop-blur-xl">
            <Sparkles className="size-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight md:text-xl">Atelier-Leads</span>
        </a>

        <div className="hidden rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm text-white/78 shadow-2xl shadow-black/20 backdrop-blur-2xl md:flex md:items-center md:gap-8">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#pricing" className="transition hover:text-white">Pricing</a>
          <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <a className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/15 sm:inline-flex" href="#signup">
            Sign Up
          </a>
          <a className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90" href="#login">
            Login
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/80 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <LockKeyhole className="size-4" />
          Helping freelancers find better clients faster.
        </div>

        <h1 className="max-w-6xl text-balance font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white drop-shadow-2xl md:text-8xl lg:text-[9.5rem]">
          Find Clients. Build Authority. Grow Faster.
        </h1>

        <p className="mt-7 max-w-3xl text-balance text-base leading-8 text-white/72 md:text-xl">
          Atelier-Leads helps freelancers discover potential clients, improve their online presence, and turn cold outreach into real business opportunities.
        </p>

        <form className="mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] border border-white/15 bg-white/[0.09] p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:flex-row">
          <label className="relative flex flex-1 items-center">
            <Mail className="pointer-events-none absolute left-5 size-5 text-white/45" />
            <input
              type="email"
              placeholder="Enter your email to get early access"
              className="h-14 w-full rounded-full border border-white/10 bg-black/20 pl-13 pr-5 text-sm text-white outline-none ring-0 placeholder:text-white/43 focus:border-white/30"
            />
          </label>
          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-white/90" type="button">
            Get Client Leads <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
          <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/20 backdrop-blur-2xl transition hover:bg-white/14">
            Start Finding Clients <BriefcaseBusiness className="size-4" />
          </a>
          <p className="text-sm text-white/48">Made for {stats.join(", ")}</p>
        </div>

        <div id="features" className="mt-14 grid w-full gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.label} className="rounded-[1.6rem] border border-white/12 bg-white/[0.075] p-6 text-left shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="mb-5 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10">
                <feature.icon className="size-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold">{feature.label}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{feature.value}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 px-6 py-6 text-sm text-white/50">
        <span>© 2026 Atelier-Leads. Premium client acquisition workspace.</span>
        <div className="flex items-center gap-3">
          <a aria-label="Instagram" className="rounded-full border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl transition hover:text-white" href="#"><Camera className="size-4" /></a>
          <a aria-label="Twitter" className="rounded-full border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl transition hover:text-white" href="#"><Send className="size-4" /></a>
          <a aria-label="Website" className="rounded-full border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl transition hover:text-white" href="#"><Globe className="size-4" /></a>
        </div>
      </footer>
    </main>
  );
}
