"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ExpiringMembership = {
  membership_id: string;
  member_id: string;
  member_name: string;
  member_code: string;
  end_date: string;
  days_until_expiry: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function urgencyVariant(days: number): "destructive" | "default" | "secondary" {
  if (days <= 3) return "destructive";
  if (days <= 7) return "default";
  return "secondary";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Main page ─────────────────────────────────────────────────────────────────

const DAYS_OPTIONS = [7, 14, 30] as const;

export default function ExpiringMembershipsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [days, setDays] = useState<number>(7);

  const { data: memberships = [], isLoading, refetch, isFetching } = useQuery<ExpiringMembership[]>({
    queryKey: ["expiring-memberships", days],
    queryFn: async () => {
      const res = await api.get(`/memberships/expiring?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expiring Memberships</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Members whose memberships expire soon
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Days filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Expiring within:</span>
        {DAYS_OPTIONS.map((d) => (
          <Button
            key={d}
            variant={days === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDays(d)}
          >
            {d} days
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {isLoading ? "Loading…" : `${memberships.length} member${memberships.length === 1 ? "" : "s"} expiring within ${days} days`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && memberships.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No memberships expiring within {days} days.
            </p>
          )}

          {memberships.length > 0 && (
            <div className="divide-y">
              {memberships.map((m) => (
                <div key={m.membership_id} className="flex items-center gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{m.member_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.member_code} &middot; expires {fmtDate(m.end_date)}
                    </p>
                  </div>

                  <Badge variant={urgencyVariant(m.days_until_expiry)}>
                    {m.days_until_expiry === 0
                      ? "Today"
                      : m.days_until_expiry === 1
                      ? "1 day"
                      : `${m.days_until_expiry} days`}
                  </Badge>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/members/${m.member_id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/payments/new?member_id=${m.member_id}`}
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      Renew
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
