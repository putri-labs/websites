"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { SanityFaqItem } from "@/sanity/queries";

const FALLBACK = [
  {
    question: "I'm a complete beginner. Can I still use GymAI?",
    answer: "Absolutely. GymAI is designed to be simple from day one. You can be up and running in under 10 minutes — no technical background required. Our onboarding guides you through every step.",
  },
  {
    question: "Do I need to install anything on my server?",
    answer: "No. GymAI is fully cloud-based. Everything runs in your browser — no downloads, no server setup, no IT team required.",
  },
  {
    question: "Which biometric devices are supported?",
    answer: "GymAI supports ZKTeco, eSSL, Suprema, Realand, Virdi, and other major brands. You register devices from the dashboard and sync attendance logs directly.",
  },
  {
    question: "Are GST invoices generated automatically?",
    answer: "Yes. Every time a payment is recorded, GymAI generates a PDF GST invoice and stores it securely in the cloud. You can download or share it at any time.",
  },
  {
    question: "Can I freeze or pause a member's membership?",
    answer: "Yes. Members can have their memberships frozen for any duration — medical, travel, or personal reasons. The remaining days are preserved and resumed when the freeze ends.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from your account settings. There are no lock-in contracts. You won't be charged for the next billing cycle after cancellation.",
  },
];

function Item({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#222] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <span className="shrink-0 text-[#888]">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-[#888] leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export function DarkFaq({ items }: { items?: SanityFaqItem[] }) {
  const list = items && items.length > 0 ? items : FALLBACK;
  return (
    <div>
      {list.map((item) => (
        <Item key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
