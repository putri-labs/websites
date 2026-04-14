"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, X, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  price: string;
  gst_pct: string;
  max_freezes_days: number;
  is_active: boolean;
  created_at: string;
};

// ── Schema ────────────────────────────────────────────────────────────────────

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration_days: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
  gst_pct: z.string().optional(),
  max_freezes_days: z.string().optional(),
});

type PlanFormData = z.infer<typeof planSchema>;

// ── Plan form ─────────────────────────────────────────────────────────────────

function PlanForm({
  plan,
  token,
  onClose,
}: {
  plan: Plan | null; // null = create mode
  token: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: plan
      ? {
          name: plan.name,
          description: plan.description ?? "",
          duration_days: String(plan.duration_days),
          price: plan.price,
          gst_pct: plan.gst_pct,
          max_freezes_days: String(plan.max_freezes_days),
        }
      : {
          gst_pct: "18.00",
          max_freezes_days: "0",
        },
  });

  const save = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        duration_days: parseInt(data.duration_days),
        price: parseFloat(data.price).toFixed(2),
        gst_pct: parseFloat(data.gst_pct || "18").toFixed(2),
        max_freezes_days: parseInt(data.max_freezes_days || "0"),
      };
      if (plan) {
        await api.patch(`/plans/${plan.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/plans", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      onClose();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setSubmitError(err?.response?.data?.detail ?? "Save failed. Try again.");
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-base">
          {plan ? "Edit Plan" : "New Plan"}
        </CardTitle>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => {
            setSubmitError(null);
            save.mutate(data);
          })}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="p_name">Plan Name *</Label>
            <Input
              id="p_name"
              {...register("name")}
              placeholder="e.g. Monthly Premium"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="p_desc">Description</Label>
            <Input
              id="p_desc"
              {...register("description")}
              placeholder="Optional short description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="p_days">Duration (days) *</Label>
              <Input
                id="p_days"
                type="number"
                min="1"
                {...register("duration_days")}
                placeholder="30"
              />
              {errors.duration_days && (
                <p className="text-destructive text-xs">
                  {errors.duration_days.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="p_price">Price (₹) *</Label>
              <Input
                id="p_price"
                type="number"
                min="0"
                step="0.01"
                {...register("price")}
                placeholder="1500.00"
              />
              {errors.price && (
                <p className="text-destructive text-xs">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="p_gst">GST (%)</Label>
              <Input
                id="p_gst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...register("gst_pct")}
                placeholder="18.00"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p_freeze">Max Freeze Days</Label>
              <Input
                id="p_freeze"
                type="number"
                min="0"
                {...register("max_freezes_days")}
                placeholder="0"
              />
            </div>
          </div>

          {submitError && (
            <p className="text-destructive text-sm">{submitError}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {plan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  token,
  onEdit,
}: {
  plan: Plan;
  token: string;
  onEdit: () => void;
}) {
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const deactivate = useMutation({
    mutationFn: async () => {
      await api.delete(`/plans/${plan.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      setConfirming(false);
    },
  });

  const price = parseFloat(plan.price);
  const gst = parseFloat(plan.gst_pct);
  const gstAmount = (price * gst) / 100;
  const total = price + gstAmount;

  return (
    <div
      className={`rounded-lg border p-4 ${plan.is_active ? "" : "opacity-60"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{plan.name}</span>
            <Badge
              variant={plan.is_active ? "default" : "secondary"}
              className="text-xs"
            >
              {plan.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          {plan.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {plan.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
            <span>{plan.duration_days} days</span>
            <span>₹{price.toFixed(0)} + {gst.toFixed(0)}% GST = ₹{total.toFixed(2)}</span>
            {plan.max_freezes_days > 0 && (
              <span>Freeze up to {plan.max_freezes_days} days</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit plan"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {plan.is_active && (
            confirming ? (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-destructive">Deactivate?</span>
                <button
                  type="button"
                  className="text-destructive hover:underline"
                  disabled={deactivate.isPending}
                  onClick={() => deactivate.mutate()}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="hover:underline"
                  onClick={() => setConfirming(false)}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-muted-foreground hover:text-destructive transition-colors text-xs"
                title="Deactivate plan"
              >
                Deactivate
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const displayed = activeOnly ? plans.filter((p) => p.is_active) : plans;

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Loading…"
              : `${displayed.length} plan${displayed.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded"
            />
            Active only
          </label>
          <Button onClick={() => { setEditingPlan(null); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      {/* New plan form */}
      {showForm && (
        <PlanForm plan={null} token={token} onClose={handleCloseForm} />
      )}

      {/* Edit plan form */}
      {editingPlan && (
        <PlanForm plan={editingPlan} token={token} onClose={handleCloseForm} />
      )}

      {/* Plans list */}
      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading plans…</p>
      )}
      {!isLoading && displayed.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No plans yet. Create your first plan.
        </p>
      )}
      <div className="space-y-3">
        {displayed.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            token={token}
            onEdit={() => handleEdit(plan)}
          />
        ))}
      </div>
    </div>
  );
}
