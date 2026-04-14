"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type HeatmapCell = { dow: number; hour: number; count: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const PERIODS = ["week", "month", "year"] as const;
type Period = (typeof PERIODS)[number];
const PERIOD_LABEL: Record<Period, string> = { week: "This Week", month: "This Month", year: "This Year" };

function intensity(count: number, max: number): string {
  if (max === 0 || count === 0) return "bg-muted";
  const ratio = count / max;
  if (ratio < 0.2) return "bg-primary/20";
  if (ratio < 0.4) return "bg-primary/40";
  if (ratio < 0.6) return "bg-primary/60";
  if (ratio < 0.8) return "bg-primary/80";
  return "bg-primary";
}

// ── Heatmap grid ──────────────────────────────────────────────────────────────

function HeatmapGrid({ data }: { data: HeatmapCell[] }) {
  // Build lookup: map[dow][hour] = count
  const map: Record<number, Record<number, number>> = {};
  let max = 0;
  for (const cell of data) {
    if (!map[cell.dow]) map[cell.dow] = {};
    map[cell.dow][cell.hour] = cell.count;
    if (cell.count > max) max = cell.count;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Hour labels */}
        <div className="flex ml-10 mb-1">
          {HOURS.map((h) => (
            <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">
              {h % 3 === 0 ? `${h}h` : ""}
            </div>
          ))}
        </div>

        {/* Rows */}
        {DAYS.map((day, dow) => (
          <div key={dow} className="flex items-center gap-0.5 mb-0.5">
            <div className="w-10 text-xs text-muted-foreground text-right pr-2 shrink-0">{day}</div>
            {HOURS.map((h) => {
              const count = map[dow]?.[h] ?? 0;
              return (
                <div
                  key={h}
                  className={cn(
                    "flex-1 aspect-square rounded-sm transition-colors",
                    intensity(count, max)
                  )}
                  title={`${day} ${h}:00 — ${count} check-in${count !== 1 ? "s" : ""}`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-xs text-muted-foreground">Less</span>
          {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary/80", "bg-primary"].map((cls) => (
            <div key={cls} className={cn("h-3 w-3 rounded-sm", cls)} />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AttendanceHeatmapPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const [period, setPeriod] = useState<Period>("month");

  const { data: heatmapData = [], isLoading } = useQuery<HeatmapCell[]>({
    queryKey: ["attendance-heatmap", period],
    queryFn: async () => {
      const res = await api.get(`/analytics/attendance/heatmap?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const total = heatmapData.reduce((s, c) => s + c.count, 0);
  const max = heatmapData.reduce((m, c) => Math.max(m, c.count), 0);

  // Find peak slot
  const peakCell = heatmapData.reduce<HeatmapCell | null>(
    (best, c) => (!best || c.count > best.count ? c : best),
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Heatmap</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Peak hours by day of week — allowed check-ins only
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Peak Hour (max)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {peakCell ? `${DAYS[peakCell.dow]} ${peakCell.hour}:00` : "—"}
            </p>
            {peakCell && <p className="text-xs text-muted-foreground">{peakCell.count} check-ins</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Busiest Day</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const byDow = DAYS.map((_, dow) =>
                heatmapData.filter((c) => c.dow === dow).reduce((s, c) => s + c.count, 0)
              );
              const maxDow = byDow.indexOf(Math.max(...byDow));
              return (
                <>
                  <p className="text-2xl font-bold">{byDow.some((v) => v > 0) ? DAYS[maxDow] : "—"}</p>
                  {byDow.some((v) => v > 0) && (
                    <p className="text-xs text-muted-foreground">{byDow[maxDow]} check-ins</p>
                  )}
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Check-ins by day &amp; hour — {PERIOD_LABEL[period]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
          ) : heatmapData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">
              No check-in data for {PERIOD_LABEL[period].toLowerCase()}.
            </p>
          ) : (
            <HeatmapGrid data={heatmapData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
