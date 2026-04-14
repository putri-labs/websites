"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Calendar,
  CalendarDays,
  IndianRupee,
  Users,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type Payment = {
  id: string;
  amount: string;
  status: string;
  paid_at: string;
};

type Member = {
  id: string;
  is_active: boolean;
  joined_at: string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

function isSameYear(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear();
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["payments-all"],
    queryFn: async () => {
      // Fetch in batches; for MVP assume < 200 payments
      const res = await api.get("/payments?limit=200", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["members-all"],
    queryFn: async () => {
      const res = await api.get("/members?limit=200", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const isLoading = paymentsLoading || membersLoading;

  const stats = useMemo(() => {
    const now = new Date();
    const successPayments = payments.filter((p) => p.status === "success");

    // Revenue aggregation
    let today = 0;
    let thisMonth = 0;
    let thisYear = 0;

    for (const p of successPayments) {
      const dt = new Date(p.paid_at);
      const amt = parseFloat(p.amount);
      if (isSameDay(dt, now)) today += amt;
      if (isSameMonth(dt, now)) thisMonth += amt;
      if (isSameYear(dt, now)) thisYear += amt;
    }

    // Member stats
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.is_active).length;
    const newThisMonth = members.filter((m) => {
      if (!m.joined_at) return false;
      return isSameMonth(new Date(m.joined_at), now);
    }).length;

    return { today, thisMonth, thisYear, totalMembers, activeMembers, newThisMonth };
  }, [payments, members]);

  const currentMonth = new Date().toLocaleString("en-IN", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Revenue and membership overview
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : (
        <>
          {/* Revenue cards */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Revenue
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <StatCard
                title="Today"
                value={fmt(stats.today)}
                subtitle={new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                icon={IndianRupee}
              />
              <StatCard
                title={`This Month — ${currentMonth}`}
                value={fmt(stats.thisMonth)}
                subtitle={`${payments.filter((p) => isSameMonth(new Date(p.paid_at), new Date()) && p.status === "success").length} transactions`}
                icon={Calendar}
              />
              <StatCard
                title={`This Year — ${currentYear}`}
                value={fmt(stats.thisYear)}
                subtitle={`${payments.filter((p) => isSameYear(new Date(p.paid_at), new Date()) && p.status === "success").length} transactions`}
                icon={TrendingUp}
              />
            </div>
          </div>

          {/* Member cards */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Members
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <StatCard
                title="Total Members"
                value={stats.totalMembers.toLocaleString("en-IN")}
                icon={Users}
              />
              <StatCard
                title="Active Members"
                value={stats.activeMembers.toLocaleString("en-IN")}
                subtitle={`${stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% of total`}
                icon={UserCheck}
              />
              <StatCard
                title={`New in ${currentMonth}`}
                value={stats.newThisMonth.toLocaleString("en-IN")}
                subtitle="joined this month"
                icon={UserPlus}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
