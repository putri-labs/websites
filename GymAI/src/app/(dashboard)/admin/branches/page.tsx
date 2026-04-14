"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, IndianRupee, Activity } from "lucide-react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type BranchOverview = {
  branch_id: string | null;
  branch_name: string;
  revenue: string;
  payment_count: number;
  member_count: number;
  checkin_count: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Branch card ───────────────────────────────────────────────────────────────

function BranchCard({ branch }: { branch: BranchOverview }) {
  const revenue = parseFloat(branch.revenue);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <CardTitle className="text-base truncate">{branch.branch_name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <IndianRupee className="h-3 w-3" />
              <span className="text-xs">Revenue</span>
            </div>
            <p className="text-lg font-bold">{fmtINR(revenue)}</p>
            <p className="text-xs text-muted-foreground">{branch.payment_count} payment{branch.payment_count !== 1 ? "s" : ""}</p>
          </div>

          <div className="text-center border-x">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Members</span>
            </div>
            <p className="text-lg font-bold">{branch.member_count}</p>
            <p className="text-xs text-muted-foreground">assigned</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Activity className="h-3 w-3" />
              <span className="text-xs">Check-Ins</span>
            </div>
            <p className="text-lg font-bold">{branch.checkin_count}</p>
            <p className="text-xs text-muted-foreground">all time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BranchesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";

  const { data: branches = [], isLoading } = useQuery<BranchOverview[]>({
    queryKey: ["branch-overview"],
    queryFn: async () => {
      const res = await api.get("/analytics/branches/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const totals = branches.reduce(
    (acc, b) => ({
      revenue: acc.revenue + parseFloat(b.revenue),
      members: acc.members + b.member_count,
      checkins: acc.checkins + b.checkin_count,
    }),
    { revenue: 0, members: 0, checkins: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Member count, revenue, and check-ins per branch
        </p>
      </div>

      {/* Totals row */}
      {!isLoading && branches.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{fmtINR(totals.revenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totals.members}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Check-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totals.checkins}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Branch cards */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : branches.length === 0 ? (
        <p className="text-sm text-muted-foreground">No branch data available.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <BranchCard key={b.branch_id ?? "unassigned"} branch={b} />
          ))}
        </div>
      )}
    </div>
  );
}
