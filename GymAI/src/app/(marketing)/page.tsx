import Link from "next/link";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/landing/animated-section";
import { getPricingPlans, getFaqItems } from "@/sanity/queries";
import { PricingSection } from "@/components/landing/pricing";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FaqSection } from "@/components/landing/faq";
import { DemoRequestSection } from "@/components/landing/demo-form";
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Users,
  CreditCard,
  Bell,
  Fingerprint,
  ClipboardList,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";

// ── Feature data ───────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Register members, track active memberships, manage renewals, and see the full history of every member.",
  },
  {
    icon: Shield,
    title: "Access Control",
    description:
      "QR code check-in, biometric device sync, and a live entry feed keep your gym secure around the clock.",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "Daily, monthly, and branch-level revenue charts with date range pickers give you instant financial clarity.",
  },
  {
    icon: Zap,
    title: "Smart Automation",
    description:
      "Expiry alerts, auto-generated GST invoices, and biometric attendance sync run without lifting a finger.",
  },
  {
    icon: CreditCard,
    title: "Payments & Invoices",
    description:
      "Record cash, UPI, and online payments. PDF GST invoices are generated and stored automatically.",
  },
  {
    icon: Bell,
    title: "Expiry Notifications",
    description:
      "Know exactly which members are expiring in 7, 14, or 30 days so your team can follow up before churn.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Devices",
    description:
      "Manage ZKTeco, eSSL, and Suprema devices from one dashboard. Sync logs and view the last sync time.",
  },
  {
    icon: ClipboardList,
    title: "Visitor Log",
    description:
      "Track walk-ins and prospects. Convert visitors to members without losing the paper trail.",
  },
];

const HIGHLIGHTS = [
  "Multi-branch support",
  "Role-based access (admin, manager, staff, trainer, receptionist)",
  "Real-time check-in WebSocket feed",
  "Attendance heatmap by day & hour",
  "Discount approval workflow",
  "Membership freeze & due tracking",
  "Staff task assignment",
  "PDF invoice generation",
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const [pricingPlans, faqItems] = await Promise.all([
    getPricingPlans(),
    getFaqItems(),
  ]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Nav */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">GymAI</span>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <FadeIn delay={0}>
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-8">
          <Zap className="h-3 w-3 text-primary" />
          Intelligent gym management, built for India
        </div>
        </FadeIn>

        <FadeIn delay={0.1}>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Run your gym
          <br />
          <span className="text-primary">without the chaos</span>
        </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          GymAI handles memberships, payments, attendance, staff, and analytics — so you can
          focus on your members, not your spreadsheets.
        </p>
        </FadeIn>

        <FadeIn delay={0.3}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start managing your gym <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Sign in to dashboard
          </Link>
        </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get your gym running on GymAI in three simple steps — no technical setup required.
            </p>
          </div>

          <FadeInStagger className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Connector line (desktop only) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" />

            {[
              {
                step: "1",
                title: "Set up your gym",
                description:
                  "Add your branches, create membership plans, and invite your staff — takes less than 10 minutes.",
              },
              {
                step: "2",
                title: "Register members",
                description:
                  "Add members, assign memberships, collect payments, and generate GST invoices automatically.",
              },
              {
                step: "3",
                title: "Track everything",
                description:
                  "Monitor attendance live, review revenue charts, and get expiry alerts before members churn.",
              },
            ].map(({ step, title, description }) => (
              <FadeInItem key={step}>
                <div className="flex flex-col items-center text-center gap-4 relative">
                  <div className="h-20 w-20 rounded-full border-2 border-primary bg-background flex items-center justify-center shrink-0 z-10">
                    <span className="text-2xl font-bold text-primary">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-3">See it in action</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A clean, role-scoped dashboard gives every team member exactly what they need — nothing more.
          </p>
        </div>
        </FadeIn>

        {/* Browser chrome mock */}
        <FadeIn delay={0.1}>
        <div className="rounded-xl border shadow-lg overflow-hidden bg-card">
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/40">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <div className="mx-auto flex-1 max-w-xs">
              <div className="h-5 rounded-md bg-muted flex items-center px-3">
                <span className="text-[10px] text-muted-foreground">app.gymai.in/admin/dashboard</span>
              </div>
            </div>
          </div>

          {/* Mock dashboard layout */}
          <div className="flex h-72 sm:h-96">
            {/* Sidebar */}
            <div className="w-44 shrink-0 border-r bg-muted/20 p-3 space-y-1 hidden sm:block">
              <div className="h-6 w-16 rounded bg-muted mb-4" />
              {["Dashboard", "Members", "Payments", "Attendance", "Analytics"].map((label, i) => (
                <div
                  key={label}
                  className={`h-7 rounded-md px-2 flex items-center text-[11px] font-medium ${
                    i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Revenue Today", value: "₹18,400" },
                  { label: "Active Members", value: "342" },
                  { label: "Check-Ins Today", value: "89" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border bg-background p-3">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-lg font-bold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-lg border bg-background p-3 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground mb-2">Revenue — Last 30 Days</p>
                <div className="flex items-end gap-1 h-20">
                  {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 88, 62, 78, 92, 68, 84, 58, 76, 89, 64, 82, 71, 94, 67, 79, 86, 73, 91, 77].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-primary/40"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Everything your gym needs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From the front desk to the finance report — GymAI covers the full workflow so
            nothing falls through the cracks.
          </p>
        </div>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <FadeInItem key={title}>
              <div className="rounded-xl border bg-card p-6 space-y-3 hover:shadow-sm hover:border-primary/30 transition-all h-full">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* Highlights checklist */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Built for multi-branch gyms
              </h2>
              <p className="text-muted-foreground mb-6">
                Whether you run one gym or a chain of ten, GymAI scales with you. Every feature
                respects branch boundaries and role permissions.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t">
        <PricingSection plans={pricingPlans} />
      </section>

      {/* Testimonials */}
      <section className="border-t bg-muted/20">
        <TestimonialsSection />
      </section>

      {/* FAQ */}
      <section className="border-t">
        <FaqSection items={faqItems} />
      </section>

      {/* Demo request */}
      <DemoRequestSection />

      {/* Bottom CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to modernise your gym?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join gyms across India already using GymAI to save time, reduce no-shows, and grow
            revenue.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started today <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-8">
          {/* Top grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {/* Brand col */}
            <div className="col-span-2 sm:col-span-1">
              <span className="font-bold text-lg tracking-tight">GymAI</span>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-[180px]">
                Intelligent gym management software built for India.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {/* Twitter/X */}
                <a
                  href="https://twitter.com/gymai_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/gymai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com/gymai.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product col */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3">Product</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Changelog", href: "#" },
                  { label: "Roadmap", href: "#" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company col */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3">Company</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {[
                  { label: "About", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact col */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3">Contact</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <a href="mailto:hello@gymai.in" className="hover:text-foreground transition-colors">
                    hello@gymai.in
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <a href="tel:+918000000000" className="hover:text-foreground transition-colors">
                    +91 80000 00000
                  </a>
                </li>
                <li className="mt-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                  >
                    Sign in to dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} GymAI. All rights reserved.</span>
            <span>Made with care in India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
