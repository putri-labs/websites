"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Wifi, WifiOff, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type Device = {
  id: string;
  name: string;
  ip_address: string | null;
  port: number;
  brand: string;
  model: string | null;
  serial_number: string | null;
  branch_id: string | null;
  is_active: boolean;
  registered_at: string;
  last_synced_at: string | null;
};

type Branch = { id: string; name: string };

const BRANDS = ["zkteco", "essl", "suprema", "hikvision", "anviz", "other"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDatetime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function brandLabel(brand: string) {
  const labels: Record<string, string> = {
    zkteco: "ZKTeco",
    essl: "eSSL",
    suprema: "Suprema",
    hikvision: "Hikvision",
    anviz: "Anviz",
    other: "Other",
  };
  return labels[brand] ?? brand;
}

// ── Register form ─────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  ip_address: string;
  port: string;
  brand: string;
  model: string;
  serial_number: string;
  branch_id: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  ip_address: "",
  port: "4370",
  brand: "zkteco",
  model: "",
  serial_number: "",
  branch_id: "",
};

function RegisterForm({
  token,
  branches,
  onDone,
}: {
  token: string;
  branches: Branch[];
  onDone: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(
        "/devices",
        {
          name: form.name,
          ip_address: form.ip_address || null,
          port: parseInt(form.port) || 4370,
          brand: form.brand,
          model: form.model || null,
          serial_number: form.serial_number || null,
          branch_id: form.branch_id || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: onDone,
  });

  function set(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Register Device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Device Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Front Entrance" autoFocus />
          </div>
          <div className="space-y-1">
            <Label>Brand</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            >
              {BRANDS.map((b) => <option key={b} value={b}>{brandLabel(b)}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label>IP Address</Label>
            <Input value={form.ip_address} onChange={(e) => set("ip_address", e.target.value)} placeholder="192.168.1.100" />
          </div>
          <div className="space-y-1">
            <Label>Port</Label>
            <Input value={form.port} onChange={(e) => set("port", e.target.value)} placeholder="4370" type="number" />
          </div>
          <div className="space-y-1">
            <Label>Model</Label>
            <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="K40" />
          </div>
          <div className="space-y-1">
            <Label>Serial Number</Label>
            <Input value={form.serial_number} onChange={(e) => set("serial_number", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Branch</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.branch_id}
              onChange={(e) => set("branch_id", e.target.value)}
            >
              <option value="">All branches</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">Failed to register device. Please check the details.</p>
        )}

        <div className="flex gap-2">
          <Button onClick={() => mutation.mutate()} disabled={!form.name.trim() || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
          <Button variant="outline" onClick={onDone}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Device card ───────────────────────────────────────────────────────────────

function DeviceCard({
  device,
  token,
  branchMap,
  onChanged,
}: {
  device: Device;
  token: string;
  branchMap: Record<string, string>;
  onChanged: () => void;
}) {
  const deactivate = useMutation({
    mutationFn: async () => {
      await api.delete(`/devices/${device.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: onChanged,
  });

  return (
    <Card className={device.is_active ? "" : "opacity-60"}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{device.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {brandLabel(device.brand)}
              {device.model ? ` · ${device.model}` : ""}
            </p>
          </div>
          <Badge variant={device.is_active ? "default" : "secondary"}>
            {device.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-1">
          {device.ip_address && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP</span>
              <span className="font-mono">{device.ip_address}:{device.port}</span>
            </div>
          )}
          {device.serial_number && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serial</span>
              <span className="font-mono text-xs">{device.serial_number}</span>
            </div>
          )}
          {device.branch_id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span>{branchMap[device.branch_id] ?? "—"}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-2 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            {device.last_synced_at ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span>Last sync: {fmtDatetime(device.last_synced_at)}</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Never synced</span>
              </>
            )}
          </div>
          <p>Registered: {fmtDatetime(device.registered_at)}</p>
        </div>

        {device.is_active && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => deactivate.mutate()}
            disabled={deactivate.isPending}
          >
            {deactivate.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Deactivate
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DevicesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: devices = [], isLoading, refetch, isFetching } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await api.get("/devices", { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await api.get("/branches", { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    },
    enabled: !!token,
  });

  const branchMap = Object.fromEntries(branches.map((b) => [b.id, b.name]));
  const invalidate = () => qc.invalidateQueries({ queryKey: ["devices"] });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biometric Devices</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Register and monitor biometric attendance devices
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <RegisterForm
          token={token}
          branches={branches}
          onDone={() => { setShowForm(false); invalidate(); }}
        />
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : devices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No devices registered yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => (
            <DeviceCard
              key={d.id}
              device={d}
              token={token}
              branchMap={branchMap}
              onChanged={invalidate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
