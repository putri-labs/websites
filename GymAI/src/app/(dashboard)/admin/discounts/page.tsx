"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2, Clock } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ── Types ─────────────────────────────────────────────────────────────────────

type Discount = {
  id: string;
  member_id: string;
  invoice_id: string;
  requested_amount: string;
  approved_amount: string | null;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  resolved_at: string | null;
  created_at: string;
};

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  approved: <Check className="h-3 w-3" />,
  rejected: <X className="h-3 w-3" />,
};

// ── Approve inline form ───────────────────────────────────────────────────────

function ApproveForm({
  discount,
  token,
  onDone,
}: {
  discount: Discount;
  token: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(discount.requested_amount);
  const [error, setError] = useState<string | null>(null);

  const approve = useMutation({
    mutationFn: async () => {
      await api.post(
        `/discounts/${discount.id}/approve`,
        { approved_amount: parseFloat(amount).toFixed(2) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
      onDone();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setError(err?.response?.data?.detail ?? "Approval failed.");
    },
  });

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor="approve_amount" className="text-xs">
          Approved Amount (₹)
        </Label>
        <Input
          id="approve_amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-8 w-32 text-sm"
        />
      </div>
      <div className="flex items-end gap-2 pb-0.5">
        <Button size="sm" disabled={approve.isPending} onClick={() => { setError(null); approve.mutate(); }}>
          {approve.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Check className="h-3 w-3 mr-1" />
          )}
          Approve
        </Button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs text-muted-foreground hover:underline"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-destructive text-xs ml-2">{error}</p>}
    </div>
  );
}

// ── Discount row ──────────────────────────────────────────────────────────────

function DiscountRow({
  discount,
  token,
}: {
  discount: Discount;
  token: string;
}) {
  const qc = useQueryClient();
  const [approving, setApproving] = useState(false);
  const [rejectConfirm, setRejectConfirm] = useState(false);

  const reject = useMutation({
    mutationFn: async () => {
      await api.post(
        `/discounts/${discount.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
      setRejectConfirm(false);
    },
  });

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: info */}
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={STATUS_VARIANT[discount.status]} className="capitalize gap-1 text-xs">
              {STATUS_ICON[discount.status]}
              {discount.status}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Invoice {discount.invoice_id.slice(0, 8)}…
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span>
              Requested:{" "}
              <span className="font-semibold">
                ₹{parseFloat(discount.requested_amount).toFixed(2)}
              </span>
            </span>
            {discount.approved_amount && (
              <span>
                Approved:{" "}
                <span className="font-semibold text-primary">
                  ₹{parseFloat(discount.approved_amount).toFixed(2)}
                </span>
              </span>
            )}
          </div>

          {discount.reason && (
            <p className="text-xs text-muted-foreground">
              Reason: {discount.reason}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {discount.resolved_at
              ? `Resolved ${new Date(discount.resolved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
              : `Requested ${new Date(discount.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
          </p>
        </div>

        {/* Right: actions (only for pending) */}
        {discount.status === "pending" && (
          <div className="flex items-center gap-2 shrink-0">
            {!approving && !rejectConfirm && (
              <>
                <Button
                  size="sm"
                  onClick={() => setApproving(true)}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectConfirm(true)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Reject
                </Button>
              </>
            )}
            {rejectConfirm && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-destructive">Reject this discount?</span>
                <button
                  type="button"
                  className="text-destructive hover:underline"
                  disabled={reject.isPending}
                  onClick={() => reject.mutate()}
                >
                  {reject.isPending ? "…" : "Yes"}
                </button>
                <button
                  type="button"
                  className="hover:underline"
                  onClick={() => setRejectConfirm(false)}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approve inline form */}
      {approving && (
        <ApproveForm
          discount={discount}
          token={token}
          onDone={() => setApproving(false)}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DiscountsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const [pendingOnly, setPendingOnly] = useState(true);

  const { data: discounts = [], isLoading } = useQuery<Discount[]>({
    queryKey: ["discounts", pendingOnly],
    queryFn: async () => {
      const params = pendingOnly ? "?pending_only=true" : "";
      const res = await api.get(`/discounts${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const pending = discounts.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discount Approvals</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Loading…"
              : pending > 0
              ? `${pending} pending approval${pending !== 1 ? "s" : ""}`
              : "No pending approvals"}
          </p>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
            className="rounded"
          />
          Pending only
        </label>
      </div>

      {/* Discount list */}
      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading…</p>
      )}
      {!isLoading && discounts.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground text-sm">
          {pendingOnly
            ? "No pending discount requests."
            : "No discount requests yet."}
        </div>
      )}
      <div className="space-y-3">
        {discounts.map((d) => (
          <DiscountRow key={d.id} discount={d} token={token} />
        ))}
      </div>
    </div>
  );
}
