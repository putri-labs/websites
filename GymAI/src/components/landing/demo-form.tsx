"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, X } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  gym_name: string;
  city: string;
  num_branches: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  gym_name: "",
  city: "",
  num_branches: "",
  message: "",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function DemoForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setError(null);
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          gym_name: form.gym_name || null,
          city: form.city || null,
          num_branches: form.num_branches ? parseInt(form.num_branches, 10) : null,
          message: form.message || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold">Request received!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thanks for your interest. Our team will reach out within one business day.
        </p>
        <button
          onClick={onClose}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5">
            Your name <span className="text-destructive">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Rajesh Sharma"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@gym.com"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 98765 43210"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5">Gym name</label>
          <input
            value={form.gym_name}
            onChange={set("gym_name")}
            placeholder="Iron Forge Gym"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5">City</label>
          <input
            value={form.city}
            onChange={set("city")}
            placeholder="Delhi"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5">Number of branches</label>
          <select
            value={form.num_branches}
            onChange={set("num_branches")}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Select…</option>
            <option value="1">1</option>
            <option value="2">2–3</option>
            <option value="5">4–5</option>
            <option value="10">6–10</option>
            <option value="20">10+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5">Message (optional)</label>
        <textarea
          value={form.message}
          onChange={set("message")}
          rows={3}
          placeholder="Tell us about your gym and what you're looking for…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request demo"}
          {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </form>
  );
}

export function DemoRequestSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Want a personalised walkthrough?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
            Book a free 20-minute demo with our team. We&apos;ll show you exactly how GymAI fits your gym — no sales pressure.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Request a demo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-lg rounded-xl border bg-background shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">Request a demo</h3>
                <p className="text-xs text-muted-foreground mt-0.5">We&apos;ll get back to you within one business day.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DemoForm onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
