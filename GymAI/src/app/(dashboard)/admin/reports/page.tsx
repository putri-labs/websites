"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

type AttendanceSummary = {
  total: number;
  allowed: number;
  blocked: number;
};

type PeakHour = {
  hour: number;
  count: number;
};

type Member = {
  id: string;
  is_active: boolean;
  joined_at: string | null;
};

type MembershipStatus = {
  active: number;
  expired: number;
  frozen: number;
  cancelled: number;
};

type NoShow = {
  member_id: string;
  member_name: string;
  member_code: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const PERIODS = ["today", "week", "month"] as const;
type Period = (typeof PERIODS)[number];

const PERIOD_LABEL: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: "green" | "red" | "amber";
}) {
  const colors = {
    green: "text-green-500",
    red: "text-red-500",
    amber: "text-amber-500",
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${accent ? colors[accent] : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function PeakHoursBar({ data }: { data: PeakHour[] }) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground text-center py-4">No data</p>;
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1 h-24">
      {Array.from({ length: 24 }, (_, h) => {
        const entry = data.find((d) => d.hour === h);
        const count = entry?.count ?? 0;
        const pct = max > 0 ? (count / max) * 100 : 0;
        return (
          <div key={h} className="flex-1 flex flex-col items-center gap-1" title={`${h}:00 — ${count} check-ins`}>
            <div
              className="w-full rounded-sm bg-primary transition-all"
              style={{ height: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
            />
            {h % 6 === 0 && <span className="text-[10px] text-muted-foreground">{h}h</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const role = session?.user?.role ?? "";
  const isManager = role === "admin" || role === "manager";

  const [period, setPeriod] = useState<Period>("today");

  const headers = { Authorization: `Bearer ${token}` };

  const { data: attendance } = useQuery<AttendanceSummary>({
    queryKey: ["report-attendance", period],
    queryFn: async () => {
      const res = await api.get(`/analytics/attendance?period=${period}`, { headers });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: peakHours = [] } = useQuery<PeakHour[]>({
    queryKey: ["report-peak-hours", period],
    queryFn: async () => {
      const res = await api.get(`/analytics/attendance/peak-hours?period=${period}`, { headers });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: noShows = [] } = useQuery<NoShow[]>({
    queryKey: ["report-no-shows"],
    queryFn: async () => {
      const res = await api.get("/analytics/attendance/no-shows?days=7", { headers });
      return res.data;
    },
    enabled: !!token && isManager,
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["report-members"],
    queryFn: async () => {
      const res = await api.get("/members?limit=500", { headers });
      return res.data;
    },
    enabled: !!token && isManager,
  });

  // Derive member status breakdown from member list
  const activeCount = members.filter((m) => m.is_active).length;
  const inactiveCount = members.length - activeCount;
  const newThisMonth = members.filter((m) => {
    if (!m.joined_at) return false;
    const d = new Date(m.joined_at);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Attendance summary and member status overview
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {PERIOD_LABEL[p]}
            </Button>
          ))}
        </div>
      </div>

      {/* Attendance summary */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Attendance — {PERIOD_LABEL[period]}
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <StatCard
            title="Total Check-Ins"
            value={attendance?.total ?? "—"}
            icon={Activity}
          />
          <StatCard
            title="Allowed"
            value={attendance?.allowed ?? "—"}
            subtitle={
              attendance
                ? `${attendance.total > 0 ? Math.round((attendance.allowed / attendance.total) * 100) : 0}% of total`
                : undefined
            }
            icon={CheckCircle}
            accent="green"
          />
          <StatCard
            title="Blocked"
            value={attendance?.blocked ?? "—"}
            subtitle={
              attendance
                ? `${attendance.total > 0 ? Math.round((attendance.blocked / attendance.total) * 100) : 0}% of total`
                : undefined
            }
            icon={XCircle}
            accent="red"
          />
        </div>
      </section>

      {/* Peak hours chart */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Peak Hours — {PERIOD_LABEL[period]}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <PeakHoursBar data={peakHours} />
          </CardContent>
        </Card>
      </section>

      {/* Member status breakdown — managers only */}
      {isManager && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Member Status
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <StatCard
              title="Active Members"
              value={activeCount}
              subtitle={`${members.length} total`}
              icon={UserCheck}
              accent="green"
            />
            <StatCard
              title="Inactive Members"
              value={inactiveCount}
              icon={UserX}
              accent="red"
            />
            <StatCard
              title="New This Month"
              value={newThisMonth}
              subtitle="joined this month"
              icon={Users}
              accent="amber"
            />
          </div>
        </section>
      )}

      {/* No-shows — managers only */}
      {isManager && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            No-Shows (last 7 days)
          </h2>
          <Card>
            <CardContent className="pt-4">
              {noShows.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  All active members have checked in recently.
                </p>
              ) : (
                <div className="divide-y">
                  {noShows.map((m) => (
                    <div key={m.member_id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-sm">{m.member_name}</p>
                        <p className="text-xs text-muted-foreground">{m.member_code}</p>
                      </div>
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
