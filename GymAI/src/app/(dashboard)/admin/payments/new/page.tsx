"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/axios";
import { useDebounce } from "@/lib/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  member_code: string;
  name: string;
  phone: string | null;
};

type Membership = {
  id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: string;
};

// ── Schema ────────────────────────────────────────────────────────────────────

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  payment_mode: z.string().min(1, "Select a payment mode"),
  reference_number: z.string().optional(),
  discount_amount: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
] as const;

// ── Member search combobox ────────────────────────────────────────────────────

function MemberSearch({
  token,
  selected,
  onSelect,
}: {
  token: string;
  selected: Member | null;
  onSelect: (m: Member | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery<Member[]>({
    queryKey: ["member-search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await api.get(
        `/members?search=${encodeURIComponent(debouncedQuery)}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    enabled: !!debouncedQuery && !!token,
  });

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 px-3 py-2">
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{selected.name}</p>
          <p className="text-xs text-muted-foreground">
            {selected.member_code}
            {selected.phone ? ` · ${selected.phone}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-8"
          placeholder="Search member by name, phone, or code…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && debouncedQuery && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-md">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No members found
            </p>
          ) : (
            results.map((m) => (
              <button
                key={m.id}
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                onClick={() => {
                  onSelect(m);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground text-xs">
                  {m.member_code}
                </span>
                {m.phone && (
                  <span className="ml-auto text-muted-foreground text-xs">
                    {m.phone}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CollectPaymentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch memberships when member selected
  const { data: memberships = [] } = useQuery<Membership[]>({
    queryKey: ["memberships", selectedMember?.id],
    queryFn: async () => {
      const res = await api.get(`/memberships/member/${selectedMember!.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!selectedMember && !!token,
  });

  const activeMemberships = memberships.filter(
    (m) => m.status === "active" || m.status === "frozen"
  );

  // Auto-select if only one active membership
  useEffect(() => {
    if (activeMemberships.length === 1) {
      setSelectedMembership(activeMemberships[0]);
    } else {
      setSelectedMembership(null);
    }
  }, [activeMemberships.length, selectedMember?.id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { payment_mode: "cash" },
  });

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedMember || !selectedMembership || !token) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const discount = parseFloat(data.discount_amount || "0") || 0;
      const amount = parseFloat(data.amount);

      await api.post(
        "/payments",
        {
          member_id: selectedMember.id,
          membership_id: selectedMembership.id,
          amount: amount.toFixed(2),
          payment_mode: data.payment_mode,
          reference_number: data.reference_number || undefined,
          discount_amount: discount.toFixed(2),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      reset();
      setSelectedMember(null);
      setSelectedMembership(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setSubmitError(
        e?.response?.data?.detail ?? "Payment failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Collect Payment</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Record a payment against an existing membership.
        </p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Payment recorded successfully.{" "}
          <button
            className="underline ml-auto"
            onClick={() => setSuccess(false)}
          >
            Record another
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Member</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberSearch
            token={token}
            selected={selectedMember}
            onSelect={(m) => {
              setSelectedMember(m);
              setSelectedMembership(null);
            }}
          />
        </CardContent>
      </Card>

      {selectedMember && (
        <>
          {activeMemberships.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground text-sm">
                No active memberships found for this member.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Membership selector (only if multiple active) */}
              {activeMemberships.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Select Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeMemberships.map((ms) => (
                      <button
                        key={ms.id}
                        type="button"
                        onClick={() => setSelectedMembership(ms)}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                          selectedMembership?.id === ms.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="capitalize font-medium">{ms.status}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {ms.start_date} → {ms.end_date}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Payment form */}
              {selectedMembership && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      {/* Amount + Mode on same row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="amount">Amount (₹) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            {...register("amount")}
                            placeholder="0.00"
                          />
                          {errors.amount && (
                            <p className="text-destructive text-xs">
                              {errors.amount.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="payment_mode">Payment Mode *</Label>
                          <select
                            id="payment_mode"
                            {...register("payment_mode")}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {PAYMENT_MODES.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="discount_amount">Discount (₹)</Label>
                          <Input
                            id="discount_amount"
                            type="number"
                            min="0"
                            step="0.01"
                            {...register("discount_amount")}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="reference_number">Reference No.</Label>
                          <Input
                            id="reference_number"
                            {...register("reference_number")}
                            placeholder="UPI txn ID, cheque no., etc."
                          />
                        </div>
                      </div>

                      {submitError && (
                        <p className="text-destructive text-sm">{submitError}</p>
                      )}

                      <div className="flex gap-3 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.back()}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing…" : "Record Payment"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
