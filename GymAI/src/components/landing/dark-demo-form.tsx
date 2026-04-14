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

const EMPTY: FormState = { name: "", email: "", phone: "", gym_name: "", city: "", num_branches: "", message: "" };
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#888] mb-2">
        {label}{required && <span className="text-[#C8FF00] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-[#222] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#C8FF00] transition-colors";

export function DarkDemoModal({ onClose }: { onClose: () => void }) {
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
          name: form.name, email: form.email,
          phone: form.phone || null, gym_name: form.gym_name || null,
          city: form.city || null,
          num_branches: form.num_branches ? parseInt(form.num_branches, 10) : null,
          message: form.message || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Something went wrong.");
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
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="h-12 w-12 text-[#C8FF00]" />
        <h3 className="text-xl font-bold text-white">Request received!</h3>
        <p className="text-sm text-[#888] max-w-xs">Our team will reach out within one business day.</p>
        <button onClick={onClose} className="mt-2 bg-[#C8FF00] text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#d4ff1a] transition-colors">
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name" required>
          <input required value={form.name} onChange={set("name")} placeholder="Rajesh Sharma" className={inputCls} />
        </Field>
        <Field label="Email" required>
          <input required type="email" value={form.email} onChange={set("email")} placeholder="you@gym.com" className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone">
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" className={inputCls} />
        </Field>
        <Field label="Gym name">
          <input value={form.gym_name} onChange={set("gym_name")} placeholder="Iron Forge Gym" className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City">
          <input value={form.city} onChange={set("city")} placeholder="Delhi" className={inputCls} />
        </Field>
        <Field label="Branches">
          <select value={form.num_branches} onChange={set("num_branches")} className={inputCls + " text-[#888]"}>
            <option value="">Select…</option>
            <option value="1">1</option>
            <option value="2">2–3</option>
            <option value="5">4–5</option>
            <option value="10">6–10</option>
            <option value="20">10+</option>
          </select>
        </Field>
      </div>
      <Field label="Message">
        <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Tell us about your gym…" className={inputCls + " resize-none"} />
      </Field>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className="rounded-xl border border-[#333] px-5 py-2.5 text-sm text-[#888] hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#d4ff1a] transition-colors disabled:opacity-60">
          {submitting ? "Sending…" : <><span>Request demo</span><ArrowRight className="h-3.5 w-3.5" /></>}
        </button>
      </div>
    </form>
  );
}

export function DarkDemoButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-[#d4ff1a] transition-all"
      >
        Request a demo <ArrowRight className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#0F0F0F] border border-[#222] shadow-2xl p-7">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Request a demo</h3>
                <p className="text-xs text-[#888] mt-1">We&apos;ll get back to you within one business day.</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DarkDemoModal onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
