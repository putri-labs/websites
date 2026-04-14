"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
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

const FALLBACK_PLANS: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 999,
    yearlyPrice: 799,
    description: "Perfect for a single gym with one branch.",
    features: [
      "Up to 200 members",
      "1 branch",
      "3 staff accounts",
      "Member management",
      "Payments & GST invoices",
      "Basic attendance",
      "Email support",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    description: "Everything you need to run a growing multi-branch gym.",
    features: [
      "Unlimited members",
      "Up to 5 branches",
      "Unlimited staff",
      "Biometric device sync",
      "Live check-in feed",
      "Revenue analytics & charts",
      "Expiry alerts & automation",
      "Discount approvals",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom pricing for gym chains with 10+ branches.",
    features: [
      "Unlimited everything",
      "Unlimited branches",
      "Custom integrations",
      "Dedicated onboarding",
      "SLA guarantee",
      "24/7 phone support",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PricingSection({ plans: cmsPlansProp }: { plans?: SanityPricingPlan[] }) {
  const [yearly, setYearly] = useState(false);
  const plans: Plan[] =
    cmsPlansProp && cmsPlansProp.length > 0 ? cmsPlansProp : FALLBACK_PLANS;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Simple, transparent pricing</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          No hidden fees. Cancel anytime. Switch plans as your gym grows.
        </p>

        {/* Monthly / Yearly toggle */}
        <div className="inline-flex items-center gap-3 rounded-full border bg-muted/30 p-1">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !yearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
              yearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            Yearly
            <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.name}
              className={`rounded-xl border p-7 flex flex-col gap-6 relative ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-md"
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div>
                {price !== null ? (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">{fmtINR(price)}</span>
                      <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
                    </div>
                    {yearly && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually ({fmtINR(price * 12)}/yr)
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-2xl font-bold">Custom</p>
                )}
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border hover:bg-accent"
                }`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </section>
  );
}
