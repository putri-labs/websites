"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckInEvent = {
  checkin_id: string;
  member_name: string;
  member_code: string;
  granted: boolean;
  block_reason: string | null;
  source: string;
  checked_in_at: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function wsUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const ws = base.replace(/^http/, "ws");
  return `${ws}/ws/checkins?token=${encodeURIComponent(token)}`;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function sourceLabel(source: string) {
  return { qr: "QR", biometric: "Biometric", manual: "Manual" }[source] ?? source;
}

// ── Row component ─────────────────────────────────────────────────────────────

function FeedRow({ event }: { event: CheckInEvent }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0 animate-in fade-in duration-300">
      <div className="flex-none">
        {event.granted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{event.member_name}</p>
        <p className="text-xs text-muted-foreground">
          {event.member_code} &middot; {sourceLabel(event.source)}
          {event.block_reason && (
            <span className="ml-1 text-red-500">&mdash; {event.block_reason}</span>
          )}
        </p>
      </div>
      <div className="flex-none text-right">
        <Badge variant={event.granted ? "default" : "destructive"} className="text-xs">
          {event.granted ? "Allowed" : "Blocked"}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">{fmtTime(event.checked_in_at)}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const MAX_EVENTS = 100;

export default function CheckInFeedPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket(wsUrl(token!));
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (e) => {
        try {
          const event: CheckInEvent = JSON.parse(e.data);
          setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Reconnect after 3 s
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Check-In Feed</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time entry log — updates automatically
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {connected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Connecting…</span>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span>Recent entries</span>
            <span>{events.length > 0 ? `${events.length} event${events.length === 1 ? "" : "s"}` : ""}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              {connected ? "Waiting for check-ins…" : "Connecting to live feed…"}
            </p>
          ) : (
            <div>
              {events.map((ev) => (
                <FeedRow key={ev.checkin_id} event={ev} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
