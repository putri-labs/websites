import Link from "next/link";
import { getPricingPlans, getFaqItems } from "@/sanity/queries";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/landing/animated-section";
import { DarkFaq } from "@/components/landing/dark-faq";
import { DarkPricing } from "@/components/landing/dark-pricing";
import { DarkDemoButton } from "@/components/landing/dark-demo-form";
import {
  ArrowRight, Users, CreditCard, BarChart3, Fingerprint,
  Bell, Shield, ClipboardList, CheckSquare, Star, Mail, Phone,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    title: "Member Management",
    desc: "Register members, assign memberships, track renewals, and view the complete history of every member — all in one place.",
  },
  {
    num: "02",
    title: "Payments & GST Invoices",
    desc: "Record cash, UPI, and card payments. PDF GST invoices are generated and stored automatically with every transaction.",
  },
  {
    num: "03",
    title: "Attendance & Check-Ins",
    desc: "Live check-in feed via WebSocket, QR code scanning, manual entry, and biometric device sync from one dashboard.",
  },
  {
    num: "04",
    title: "Revenue Analytics",
    desc: "Daily, monthly, and branch-level revenue charts with date range pickers. Attendance heatmaps and peak-hour reports.",
  },
  {
    num: "05",
    title: "Staff & Task Management",
    desc: "Role-based access for admin, manager, trainer, staff, and receptionist. Assign tasks, track completion, manage attendance.",
  },
];

const WHY = [
  {
    title: "Simple, human experience",
    desc: "Clean dashboard designed for non-technical gym owners. Get up and running in under 10 minutes.",
  },
  {
    title: "No chaos, just results",
    desc: "Expiry alerts, auto invoices, and biometric sync run without lifting a finger. Less admin, more gym time.",
  },
  {
    title: "Built for India",
    desc: "GST-compliant invoicing, INR pricing, UPI payment tracking, and WhatsApp-ready notifications.",
  },
  {
    title: "Plans that fit real gyms",
    desc: "From single-location studios to 10-branch chains — flexible memberships with no pressure to commit.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Book a Free Intro Call",
    desc: "Tell us about your gym. We'll walk you through GymAI, answer every question, and set up your account on the spot.",
  },
  {
    num: "02",
    title: "Set Up Your Gym Profile",
    desc: "Add your branches, create membership plans, configure GST details — guided setup takes less than 10 minutes.",
  },
  {
    num: "03",
    title: "Invite Your Team",
    desc: "Add staff with the right roles. Managers see everything; receptionists only see check-ins. Full role-based access control.",
  },
  {
    num: "04",
    title: "Register Members & Collect Payments",
    desc: "Add members, assign memberships, record payments — GST invoices are generated automatically with every transaction.",
  },
  {
    num: "05",
    title: "Track Everything, Grow Faster",
    desc: "Monitor attendance live, review revenue charts, get expiry alerts before members churn. Data-backed decisions every day.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    role: "Owner, Iron Forge Gym — Delhi",
    rating: 5,
    body: "GymAI replaced three separate tools we were using. The GST invoice generation alone saves my accountant hours every month.",
    initials: "RS",
  },
  {
    name: "Priya Nair",
    role: "Manager, FitZone — Bangalore",
    rating: 5,
    body: "The biometric sync and live check-in feed have completely changed how we manage peak-hour crowds. We catch issues before they become problems.",
    initials: "PN",
  },
  {
    name: "Amit Verma",
    role: "Owner, PowerHouse Fitness — Mumbai (3 branches)",
    rating: 5,
    body: "Running three branches used to mean three spreadsheets. Now I see revenue, attendance, and staff from one screen.",
    initials: "AV",
  },
  {
    name: "Sunita Reddy",
    role: "Receptionist, Flex Fitness — Hyderabad",
    rating: 5,
    body: "Manual check-in is a lifesaver when the biometric device is down. I find any member in seconds — no paperwork.",
    initials: "SR",
  },
  {
    name: "Karan Mehta",
    role: "Owner, Alpha Gym — Pune",
    rating: 5,
    body: "The expiry alerts mean we always reach out before members lapse. Our renewal rate went up 22% in the first two months.",
    initials: "KM",
  },
  {
    name: "Deepa Iyer",
    role: "Manager, Zenith Health Club — Chennai",
    rating: 5,
    body: "Discount approvals keep our offers consistent. No more staff handing out random discounts without review.",
    initials: "DI",
  },
];

const STATS = [
  { value: "10K+", label: "Members Managed" },
  { value: "50K+", label: "Transactions Processed" },
  { value: "200+", label: "Gyms Onboarded" },
  { value: "99.9%", label: "Uptime SLA" },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const [pricingPlans, faqItems] = await Promise.all([
    getPricingPlans(),
    getFaqItems(),
  ]);

  return (
    <div className="bg-[#0A0A0A] text-white font-sans antialiased">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#0A0A0A]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight">
            GymAI<span className="text-[#C8FF00]">.</span>
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            {["About", "Services", "Pricing", "Testimonials", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors hidden md:block">
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-[#C8FF00] text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#d4ff1a] transition-colors"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-24 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-[#222] bg-[#111] rounded-full px-4 py-1.5 text-xs text-[#888] uppercase tracking-widest mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              Intelligent gym management — built for India
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] mb-8">
              Run your gym
              <br />
              <span className="text-[#C8FF00]">like a pro.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
              Just simple, powerful management — memberships, payments, attendance, staff, and analytics — guided by data that actually helps.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold px-7 py-3.5 rounded-xl hover:bg-[#d4ff1a] transition-all text-sm"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <DarkDemoButton />
            </div>
          </FadeIn>

          {/* Stats strip */}
          <FadeIn delay={0.4}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#1a1a1a]">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-[#0A0A0A] px-6 py-7 text-center">
                  <p className="text-3xl font-black text-[#C8FF00]">{value}</p>
                  <p className="text-xs text-[#555] uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-[#555] uppercase tracking-widest">
            {[
              "14-day free trial",
              "No credit card required",
              "GST-compliant invoicing",
              "Cancel anytime",
              "Multi-branch support",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#C8FF00]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / STATS ── */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-28">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">About GymAI</p>
          <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-3xl mb-6">
            Not just a tool.
            <br />A complete system.
          </h2>
          <p className="text-[#888] max-w-xl leading-relaxed mb-16">
            GymAI was built by people who understand what it takes to run a gym in India — the payments, the paperwork, the people. We handle the operations so you can focus on your members.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Users, stat: "10,000+", label: "Members Managed", desc: "Active members across gyms using GymAI today" },
            { icon: CreditCard, stat: "₹5 Cr+", label: "Payments Processed", desc: "Transactions recorded with auto-generated GST invoices" },
            { icon: BarChart3, stat: "200+", label: "Gyms Onboarded", desc: "Single-location studios to 10-branch chains" },
          ].map(({ icon: Icon, stat, label, desc }) => (
            <FadeInItem key={label}>
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-7 h-full">
                <div className="h-10 w-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-[#C8FF00]" />
                </div>
                <p className="text-3xl font-black mb-1">{stat}</p>
                <p className="text-sm font-bold text-white mb-2">{label}</p>
                <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="border-t border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">What we offer</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-2xl mb-16">
              Not just features.
              <br />A whole approach.
            </h2>
          </FadeIn>

          <div className="space-y-px">
            {SERVICES.map(({ num, title, desc }, i) => (
              <FadeIn key={num} delay={i * 0.06}>
                <div className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-[#0D0D0D] hover:bg-[#111] border border-[#1a1a1a] rounded-2xl px-8 py-7 transition-all cursor-default">
                  <span className="text-5xl font-black text-[#1f1f1f] group-hover:text-[#C8FF00]/20 transition-colors shrink-0 w-16">
                    {num}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-2">{title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed max-w-xl">{desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#333] group-hover:text-[#C8FF00] transition-colors shrink-0 hidden sm:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">Why GymAI</p>
          <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-2xl mb-16">
            Management should
            <br />feel effortless.
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {WHY.map(({ title, desc }) => (
            <FadeInItem key={title}>
              <div className="border border-[#1a1a1a] rounded-2xl p-8 h-full hover:border-[#C8FF00]/20 transition-colors">
                <div className="h-2 w-8 bg-[#C8FF00] rounded-full mb-6" />
                <h3 className="text-base font-bold uppercase tracking-wide mb-3">{title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{desc}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">Getting started</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-2xl mb-16">
              Simple to start.
              <br />Easier to stay.
            </h2>
          </FadeIn>

          <div className="space-y-5">
            {STEPS.map(({ num, title, desc }, i) => (
              <FadeIn key={num} delay={i * 0.07}>
                <div className="flex gap-8 items-start">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/5 flex items-center justify-center">
                      <span className="text-xs font-black text-[#C8FF00]">{num}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-12 bg-gradient-to-b from-[#C8FF00]/20 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-base font-bold uppercase tracking-wide mb-2">{title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed max-w-xl">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-28">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-2xl mb-4">
            Join the way that
            <br />feels right for you.
          </h2>
          <p className="text-[#666] mb-16 max-w-lg">
            No hidden fees. No long-term lock-ins. Switch plans as your gym grows.
          </p>
        </FadeIn>
        <DarkPricing plans={pricingPlans} />
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="border-t border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-2xl mb-16">
              Because managing
              <br />should feel good.
            </h2>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, rating, body, initials }) => (
              <FadeInItem key={name}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-7 flex flex-col gap-5 h-full hover:border-[#C8FF00]/20 transition-colors">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#C8FF00] text-[#C8FF00]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#aaa] leading-relaxed flex-1">&ldquo;{body}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#C8FF00]">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{name}</p>
                      <p className="text-xs text-[#555] mt-0.5">{role}</p>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight mb-6">
              Frequently
              <br />asked questions.
            </h2>
            <p className="text-[#666] leading-relaxed mb-8">
              Everything you need to know before getting started with GymAI. Can&apos;t find what you&apos;re looking for?
            </p>
            <Link
              href="mailto:hello@gymai.in"
              className="inline-flex items-center gap-2 border border-[#222] text-sm text-[#888] px-5 py-2.5 rounded-xl hover:text-white hover:border-[#444] transition-colors"
            >
              <Mail className="h-4 w-4" /> Email us
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <DarkFaq items={faqItems} />
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT / DEMO CTA ── */}
      <section className="border-t border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-4">Get in touch</p>
              <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight mb-6">
                Let&apos;s get your
                <br />gym running.
              </h2>
              <p className="text-[#666] leading-relaxed mb-8 max-w-md">
                Book a free 20-minute walkthrough. We&apos;ll show you exactly how GymAI fits your gym — no sales pressure, just answers.
              </p>
              <div className="space-y-4 mb-8 text-sm text-[#666]">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#C8FF00]" />
                  <a href="mailto:hello@gymai.in" className="hover:text-white transition-colors">hello@gymai.in</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#C8FF00]" />
                  <a href="tel:+918000000000" className="hover:text-white transition-colors">+91 80000 00000</a>
                </div>
              </div>
              <DarkDemoButton />
            </FadeIn>

            {/* Locations */}
            <FadeIn delay={0.1}>
              <div className="space-y-4">
                {[
                  {
                    city: "Bangalore",
                    address: "GymAI HQ, 4th Floor, Koramangala,\nBangalore — 560034",
                    hours: "Mon – Sat, 9 AM – 7 PM IST",
                  },
                  {
                    city: "Mumbai",
                    address: "GymAI Office, Bandra Kurla Complex,\nMumbai — 400051",
                    hours: "Mon – Sat, 9 AM – 7 PM IST",
                  },
                ].map(({ city, address, hours }) => (
                  <div key={city} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#C8FF00] mb-3">{city}</p>
                    <p className="text-sm text-[#aaa] whitespace-pre-line mb-2">{address}</p>
                    <p className="text-xs text-[#555]">{hours}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="border-t border-[#1a1a1a]">
        <div className="mx-auto max-w-7xl px-6 py-28 text-center">
          <FadeIn>
            <h2 className="text-5xl sm:text-7xl font-black uppercase leading-tight mb-6">
              Ready to run
              <br />
              <span className="text-[#C8FF00]">your best gym?</span>
            </h2>
            <p className="text-[#666] mb-10 max-w-lg mx-auto">
              Join 200+ gyms across India already using GymAI to save time, reduce no-shows, and grow revenue.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#d4ff1a] transition-all text-sm"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <DarkDemoButton />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1a1a1a] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="font-black text-xl tracking-tight">
                GymAI<span className="text-[#C8FF00]">.</span>
              </span>
              <p className="text-xs text-[#555] mt-3 leading-relaxed max-w-[180px]">
                Intelligent gym management software built for India.
              </p>
              <div className="flex items-center gap-4 mt-5">
                {[
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { label: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map(({ label, path }) => (
                  <a key={label} href="#" aria-label={label} className="text-[#444] hover:text-[#C8FF00] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#444] mb-4">Product</p>
              <ul className="space-y-3 text-sm text-[#555]">
                {["Features", "Pricing", "Changelog", "Roadmap"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#444] mb-4">Company</p>
              <ul className="space-y-3 text-sm text-[#555]">
                {["About", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#444] mb-4">Contact</p>
              <ul className="space-y-3 text-sm text-[#555]">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#C8FF00]" />
                  <a href="mailto:hello@gymai.in" className="hover:text-white transition-colors">hello@gymai.in</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#C8FF00]" />
                  <a href="tel:+918000000000" className="hover:text-white transition-colors">+91 80000 00000</a>
                </li>
                <li className="mt-4">
                  <Link href="/login" className="inline-flex items-center gap-1.5 border border-[#222] rounded-lg px-3 py-2 text-xs text-[#666] hover:text-white hover:border-[#444] transition-colors">
                    Sign in to dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#444]">
            <span>© {new Date().getFullYear()} GymAI. All rights reserved.</span>
            <span>Made with care in India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
