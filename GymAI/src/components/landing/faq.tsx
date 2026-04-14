"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SanityFaqItem } from "@/sanity/queries";

const FAQ_ITEMS = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes — all plans include a 14-day free trial with no credit card required. You get full access to every feature in your chosen plan from day one.",
  },
  {
    question: "Can I manage multiple gym branches from one account?",
    answer:
      "Absolutely. GymAI is built for multi-branch operations. Admins see data across all branches while branch managers and staff are scoped to their own location.",
  },
  {
    question: "Which biometric devices are supported?",
    answer:
      "GymAI currently supports ZKTeco, eSSL, Suprema, Realand, Virdi, and other devices. You can register devices from the Devices section and sync attendance logs directly from the dashboard.",
  },
  {
    question: "How are GST invoices generated?",
    answer:
      "Invoices are generated automatically every time a payment is recorded. A PDF invoice is created using the member's details and uploaded to secure cloud storage. You can download it from the Invoices section anytime.",
  },
  {
    question: "What payment modes are supported?",
    answer:
      "GymAI supports cash, UPI, credit/debit cards, bank transfer, and cheque. Each payment is recorded individually and reflected in your revenue analytics in real time.",
  },
  {
    question: "Can staff roles be customised?",
    answer:
      "GymAI has five built-in roles: admin, manager, staff, trainer, and receptionist. Each role has a carefully scoped set of permissions — for example, receptionists can check in members and log visitors but cannot see revenue data.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All data is encrypted in transit (TLS) and at rest. Each gym's data is logically isolated — no other tenant can access your records. Invoices are stored in private cloud storage accessible only to your team.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. There are no lock-in contracts. You can cancel your subscription at any time from your account settings, and you will not be charged for the next billing cycle.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium hover:text-primary transition-colors"
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export function FaqSection({ items: cmsItems }: { items?: SanityFaqItem[] }) {
  const items = cmsItems && cmsItems.length > 0 ? cmsItems : FAQ_ITEMS;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Frequently asked questions</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Everything you need to know before getting started with GymAI.
        </p>
      </div>

      <div className="rounded-xl border bg-card divide-y-0 px-6">
        {items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
