"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ── Types ─────────────────────────────────────────────────────────────────────

type DailyRevenue = { date: string; total: string; count: number };
type MonthlyRevenue = { month: number; total: string; count: number };
type ModeRevenue = { mode: string; total: string; count: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return { from: toDateStr(start), to: toDateStr(end) };
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background p-3 text-sm shadow">
      <p className="font-medium mb-1">{label}</p>
      <p className="text-primary">{fmtINR(payload[0].value)}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const YEARS = [new Date().getFullYear() - 1, new Date().getFullYear()];

export default function RevenueChartsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const headers = { Authorization: `Bearer ${token}` };

  const defaultR = defaultRange();
  const [from, setFrom] = useState(defaultR.from);
  const [to, setTo] = useState(defaultR.to);
  const [appliedFrom, setAppliedFrom] = useState(defaultR.from);
  const [appliedTo, setAppliedTo] = useState(defaultR.to);
  const [year, setYear] = useState(new Date().getFullYear());

  function applyRange() {
    setAppliedFrom(from);
    setAppliedTo(to);
  }

  // Daily revenue
  const { data: daily = [], isLoading: dailyLoading } = useQuery<DailyRevenue[]>({
    queryKey: ["revenue-daily", appliedFrom, appliedTo],
    queryFn: async () => {
      const res = await api.get(`/analytics/revenue/daily?from_date=${appliedFrom}&to_date=${appliedTo}`, { headers });
      return res.data;
    },
    enabled: !!token,
  });

  // Monthly revenue
  const { data: monthly = [], isLoading: monthlyLoading } = useQuery<MonthlyRevenue[]>({
    queryKey: ["revenue-monthly", year],
    queryFn: async () => {
      const res = await api.get(`/analytics/revenue/monthly?year=${year}`, { headers });
      return res.data;
    },
    enabled: !!token,
  });

  // By-mode revenue
  const { data: byMode = [] } = useQuery<ModeRevenue[]>({
    queryKey: ["revenue-by-mode"],
    queryFn: async () => {
      const res = await api.get("/analytics/revenue/by-mode?period=month", { headers });
      return res.data;
    },
    enabled: !!token,
  });

  // Transform for charts
  const dailyChartData = daily.map((d) => ({
    date: d.date.slice(5), // MM-DD
    revenue: parseFloat(d.total),
    transactions: d.count,
  }));

  const monthlyChartData = monthly.map((m) => ({
    month: MONTH_NAMES[m.month - 1],
    revenue: parseFloat(m.total),
    transactions: m.count,
  }));

  const modeChartData = byMode.map((m) => ({
    mode: m.mode.charAt(0).toUpperCase() + m.mode.slice(1),
    revenue: parseFloat(m.total),
    transactions: m.count,
  }));

  // Summaries
  const totalDaily = daily.reduce((s, d) => s + parseFloat(d.total), 0);
  const totalMonthly = monthly.reduce((s, m) => s + parseFloat(m.total), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Charts and trends for payment revenue</p>
      </div>

      {/* Daily revenue section */}
      <section className="space-y-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Daily Revenue
            </h2>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="space-y-1">
                <Label htmlFor="from-date">From</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="to-date">To</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={applyRange} size="sm">Apply</Button>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Total in range</p>
            <p className="text-2xl font-bold">{fmtINR(totalDaily)}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {dailyLoading ? (
              <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
            ) : dailyChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No revenue in this range.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dailyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={55} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Monthly revenue section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Monthly Revenue — {year}
          </h2>
          <div className="flex gap-2 items-center">
            {YEARS.map((y) => (
              <Button
                key={y}
                variant={year === y ? "default" : "outline"}
                size="sm"
                onClick={() => setYear(y)}
              >
                {y}
              </Button>
            ))}
            <span className="text-sm text-muted-foreground ml-2">Total: {fmtINR(totalMonthly)}</span>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {monthlyLoading ? (
              <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
            ) : monthlyChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No data for {year}.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={55} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Revenue by payment mode */}
      {modeChartData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            By Payment Mode — This Month
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={modeChartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="mode" tick={{ fontSize: 11 }} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
