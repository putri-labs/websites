"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { SanityPricingPlan } from "@/sanity/queries";

interface Plan {
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const FALLBACK: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 999,
    yearlyPrice: 799,
    description: "Perfect for a single gym with one branch.",
    features: ["Up to 200 members", "1 branch", "3 staff accounts", "Member management", "Payments & GST invoices", "Basic attendance", "Email support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    description: "Everything you need to run a growing multi-branch gym.",
    features: ["Unlimited members", "Up to 5 branches", "Unlimited staff", "Biometric device sync", "Live check-in feed", "Revenue analytics", "Expiry alerts", "Discount approvals", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom pricing for gym chains with 10+ branches.",
    features: ["Unlimited everything", "Unlimited branches", "Custom integrations", "Dedicated onboarding", "SLA guarantee", "24/7 phone support"],
    cta: "Contact us",
    highlighted: false,
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function DarkPricing({ plans: cms }: { plans?: SanityPricingPlan[] }) {
  const [yearly, setYearly] = useState(false);
  const plans: Plan[] = cms && cms.length > 0 ? cms : FALLBACK;

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-1 rounded-full border border-[#222] bg-[#111] p-1">
          {["Monthly", "Yearly"].map((label) => {
            const active = label === "Yearly" ? yearly : !yearly;
            return (
              <button
                key={label}
                onClick={() => setYearly(label === "Yearly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  active ? "bg-[#C8FF00] text-black" : "text-[#888] hover:text-white"
                }`}
              >
                {label}
                {label === "Yearly" && (
                  <span className={`ml-1.5 text-[10px] font-bold ${active ? "text-black/60" : "text-[#888]"}`}>
                    −20%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                plan.highlighted
                  ? "bg-[#C8FF00] text-black"
                  : "bg-[#111] border border-[#222] text-white"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-[#C8FF00] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlighted ? "text-black/50" : "text-[#888]"}`}>
                  {plan.name}
                </p>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-black/70" : "text-[#888]"}`}>
                  {plan.description}
                </p>
              </div>

              <div>
                {price !== null ? (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black">{fmt(price)}</span>
                      <span className={`text-sm mb-1 ${plan.highlighted ? "text-black/50" : "text-[#888]"}`}>/mo</span>
                    </div>
                    {yearly && (
                      <p className={`text-xs mt-1 ${plan.highlighted ? "text-black/50" : "text-[#555]"}`}>
                        Billed annually ({fmt(price * 12)}/yr)
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-4xl font-black">Custom</span>
                )}
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-black" : "text-[#C8FF00]"}`} />
                    <span className={plan.highlighted ? "text-black/80" : "text-[#aaa]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                  plan.highlighted
                    ? "bg-black text-[#C8FF00] hover:bg-black/80"
                    : "bg-[#C8FF00] text-black hover:bg-[#d4ff1a]"
                }`}
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#555] mt-8">
        No hidden fees. No long-term lock-ins. 14-day free trial on all plans.
      </p>
    </div>
  );
}
