import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Globe, MapPinned, MessageCircle, Search, Sparkles } from "lucide-react";

const roles = [
  {
    title: "Join as Freelancer",
    href: "/freelancer",
    icon: BriefcaseBusiness,
    kicker: "CRM + outreach workspace",
    copy: "Find leads, track pipeline, generate pitches, and convert website, SEO, Google Profile, and AI chatbot prospects.",
    cta: "Open freelancer dashboard",
  },
  {
    title: "Join as Business Owner",
    href: "/business",
    icon: Building2,
    kicker: "Post your project requirement",
    copy: "Tell freelancers what you want built or optimized: website, SEO, Google Business Profile, or 24x7 AI chatbot.",
    cta: "Post requirement",
  },
];

const services = [
  [Globe, "Website", "New website, redesign, landing page, booking CTA"],
  [Search, "SEO", "Ranking, pages, technical SEO, local keywords"],
  [MapPinned, "Google Profile", "Maps ranking, reviews, photos, posts, calls"],
  [MessageCircle, "AI Chatbot", "24x7 support, lead capture, FAQ, booking"],
] as const;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.18),transparent_28rem),linear-gradient(180deg,#050507,#09090c)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl"><Sparkles className="size-5" /></div>
          <span className="text-xl font-semibold">Atelier-Leads</span>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm text-white/78 backdrop-blur-2xl md:flex md:gap-8">
          <Link href="/freelancer">Freelancer</Link><Link href="/business">Business Owner</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-12 text-center">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur-2xl">
          <Sparkles className="size-4" /> Choose your workspace
        </div>
        <h1 className="mx-auto max-w-6xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-8xl">
          One platform. Two clear journeys.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68">
          Freelancers manage leads and outreach. Business owners post requirements. No mixed dashboard, no confusion.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-5 px-6 pb-12 md:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link key={role.title} href={role.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.08] p-7 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.12]">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-white text-black"><Icon className="size-6" /></div>
                <ArrowRight className="size-6 text-white/45 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">{role.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold">{role.title}</h2>
              <p className="mt-4 min-h-20 text-sm leading-7 text-white/58">{role.copy}</p>
              <div className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-black">{role.cta}</div>
            </Link>
          );
        })}
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-6 pb-16 md:grid-cols-4">
        {services.map(([Icon, title, copy]) => (
          <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
            <Icon className="size-6" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
