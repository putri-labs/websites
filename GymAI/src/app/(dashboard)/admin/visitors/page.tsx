"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, X } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Visitor = {
  id: string;
  name: string;
  phone: string | null;
  purpose: string | null;
  visited_at: string;
  logged_by: string | null;
};

// ── Schema ────────────────────────────────────────────────────────────────────

const visitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  purpose: z.string().optional(),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

// ── Add visitor form ──────────────────────────────────────────────────────────

function AddVisitorForm({
  token,
  today,
  onClose,
}: {
  token: string;
  today: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
  });

  const addVisitor = useMutation({
    mutationFn: async (data: VisitorFormData) => {
      const res = await api.post(
        "/visitors",
        {
          name: data.name,
          phone: data.phone || undefined,
          purpose: data.purpose || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors", today] });
      qc.invalidateQueries({ queryKey: ["visitors", "all"] });
      reset();
      onClose();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setSubmitError(
        err?.response?.data?.detail ?? "Failed to log visitor. Try again."
      );
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-base">Log New Visitor</CardTitle>
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
            addVisitor.mutate(data);
          })}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="v_name">Visitor Name *</Label>
            <Input
              id="v_name"
              {...register("name")}
              placeholder="e.g. Rahul Verma"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="v_phone">Phone</Label>
              <Input
                id="v_phone"
                {...register("phone")}
                placeholder="9876543210"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v_purpose">Purpose</Label>
              <Input
                id="v_purpose"
                {...register("purpose")}
                placeholder="Gym tour, enquiry, etc."
              />
            </div>
          </div>
          {submitError && (
            <p className="text-destructive text-sm">{submitError}</p>
          )}
          <Button type="submit" className="w-full" disabled={addVisitor.isPending}>
            {addVisitor.isPending ? "Logging…" : "Log Visitor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Visitor table ─────────────────────────────────────────────────────────────

function VisitorTable({
  visitors,
  isLoading,
}: {
  visitors: Visitor[];
  isLoading: boolean;
}) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Phone
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Purpose
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                Loading…
              </td>
            </tr>
          )}
          {!isLoading && visitors.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No visitors recorded.
              </td>
            </tr>
          )}
          {visitors.map((v) => (
            <tr
              key={v.id}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 font-medium">{v.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {v.phone ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {v.purpose ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {new Date(v.visited_at).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function VisitorLogPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";

  const today = new Date().toISOString().split("T")[0];
  const [viewAll, setViewAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const queryKey = viewAll ? ["visitors", "all"] : ["visitors", today];

  const { data: visitors = [], isLoading } = useQuery<Visitor[]>({
    queryKey,
    queryFn: async () => {
      const url = viewAll
        ? "/visitors?limit=200"
        : `/visitors?visit_date=${today}&limit=200`;
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visitor Log</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Loading…"
              : `${visitors.length} visitor${visitors.length !== 1 ? "s" : ""} ${viewAll ? "total" : "today"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Today / All toggle */}
          <div className="flex rounded-md border overflow-hidden text-sm">
            <button
              className={cn(
                "px-3 py-1.5 transition-colors",
                !viewAll ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              onClick={() => setViewAll(false)}
            >
              Today
            </button>
            <button
              className={cn(
                "px-3 py-1.5 transition-colors border-l",
                viewAll ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              onClick={() => setViewAll(true)}
            >
              All
            </button>
          </div>

          <Button onClick={() => setShowForm((v) => !v)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Log Visitor
          </Button>
        </div>
      </div>

      {/* Add visitor form (inline, collapsible) */}
      {showForm && (
        <AddVisitorForm
          token={token}
          today={today}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Visitor table */}
      <VisitorTable visitors={visitors} isLoading={isLoading} />
    </div>
  );
}
