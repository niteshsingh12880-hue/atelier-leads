import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] px-6 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.18),transparent_28rem),linear-gradient(180deg,#050507,#09090c)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><ArrowLeft className="size-4" /> Home</Link>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70"><ShieldCheck className="size-4" /> Role based access</div>
      </nav>

      <section className="relative z-10 mx-auto max-w-5xl pb-10 pt-16 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur-2xl"><Sparkles className="size-4" /> Login first</div>
        <h1 className="font-serif text-5xl font-semibold leading-none tracking-[-0.04em] md:text-7xl">Choose how you want to enter.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/62">Login ke baad role save hoga. Freelancer ko sirf CRM dikhega, business owner ko sirf requirement portal dikhega.</p>
      </section>

      <div className="relative z-10 pb-16">
        <LoginForm />
      </div>
    </main>
  );
}
