"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ── Schemas ──────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
});

const paymentSchema = z.object({
  payment_mode: z.string().min(1, "Select a payment mode"),
  discount_amount: z.string().optional(),
  reference_number: z.string().optional(),
});

type PersonalData = z.infer<typeof personalSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

// ── Types ─────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  name: string;
  duration_days: number;
  price: string;
  gst_pct: string;
  description?: string | null;
  is_active: boolean;
};

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
] as const;

const STEPS = ["Personal Info", "Choose Plan", "Payment"] as const;

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              i <= current
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span
            className={`text-sm ${
              i === current ? "font-medium" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-1 h-px w-8 ${
                i < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function RegisterMemberForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active plans on step 2
  const { data: plans = [], isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: step === 1 && !!token,
  });

  const activePlans = plans.filter((p) => p.is_active);

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
  });

  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { payment_mode: "cash" },
  });

  // Step 1 → Step 2
  const handlePersonalSubmit = (data: PersonalData) => {
    setPersonalData(data);
    setStep(1);
  };

  // Step 2 → Step 3
  const handlePlanContinue = () => {
    if (!selectedPlan) return;
    setStep(2);
  };

  // Step 3: final submission
  const handlePaymentSubmit = async (data: PaymentData) => {
    if (!personalData || !selectedPlan || !token) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Create member
      const memberRes = await api.post(
        "/members",
        {
          name: personalData.name,
          phone: personalData.phone || undefined,
          email: personalData.email || undefined,
          gender: personalData.gender || undefined,
          dob: personalData.dob || undefined,
        },
        { headers }
      );
      const member = memberRes.data;

      // 2. Assign membership (start today)
      const today = new Date().toISOString().split("T")[0];
      const membershipRes = await api.post(
        "/memberships",
        {
          member_id: member.id,
          plan_id: selectedPlan.id,
          start_date: today,
        },
        { headers }
      );
      const membership = membershipRes.data;

      // 3. Record payment
      const planPrice = parseFloat(selectedPlan.price);
      const discount = parseFloat(data.discount_amount || "0") || 0;
      const amount = Math.max(planPrice - discount, 0.01);

      await api.post(
        "/payments",
        {
          member_id: member.id,
          membership_id: membership.id,
          amount: amount.toFixed(2),
          payment_mode: data.payment_mode,
          reference_number: data.reference_number || undefined,
          discount_amount: discount.toFixed(2),
        },
        { headers }
      );

      router.push("/admin/members");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setSubmitError(
        e?.response?.data?.detail ?? "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <StepIndicator current={step} />

      {/* ── Step 1: Personal Info ──────────────────────────────────────── */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...personalForm.register("name")}
                  placeholder="e.g. Priya Sharma"
                />
                {personalForm.formState.errors.name && (
                  <p className="text-destructive text-xs">
                    {personalForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...personalForm.register("phone")}
                    placeholder="9876543210"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...personalForm.register("email")}
                    placeholder="priya@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...personalForm.register("gender")}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    {...personalForm.register("dob")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Next — Choose Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Plan Selection ─────────────────────────────────────── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Membership Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plansLoading && (
              <p className="text-muted-foreground text-sm">Loading plans…</p>
            )}
            {!plansLoading && activePlans.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No active plans found. Create a plan first.
              </p>
            )}

            <div className="grid gap-3">
              {activePlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedPlan?.id === plan.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium">{plan.name}</span>
                      {plan.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-primary">
                        ₹{parseFloat(plan.price).toFixed(0)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {plan.duration_days} days
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(0)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedPlan}
                onClick={handlePlanContinue}
              >
                Next — Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Payment ───────────────────────────────────────────── */}
      {step === 2 && selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Plan summary */}
            <div className="rounded-lg bg-muted/50 p-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{selectedPlan.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPlan.duration_days} days
                </p>
              </div>
              <p className="text-xl font-bold">
                ₹{parseFloat(selectedPlan.price).toFixed(2)}
              </p>
            </div>

            <form
              onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="payment_mode">Payment Mode *</Label>
                <select
                  id="payment_mode"
                  {...paymentForm.register("payment_mode")}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="discount_amount">Discount (₹)</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...paymentForm.register("discount_amount")}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reference_number">Reference No.</Label>
                  <Input
                    id="reference_number"
                    {...paymentForm.register("reference_number")}
                    placeholder="e.g. UPI txn ID"
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-destructive text-sm">{submitError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering…" : "Complete Registration"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
