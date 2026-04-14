"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { useDebounce } from "@/lib/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  member_code: string;
  name: string;
  phone: string | null;
  is_active: boolean;
};

type CheckInResult = {
  id: string;
  is_blocked: boolean;
  block_reason: string | null;
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ManualCheckInPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState<Member | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["member-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      const res = await api.get(`/members?search=${encodeURIComponent(debouncedSearch)}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && debouncedSearch.trim().length > 0,
  });

  const mutation = useMutation({
    mutationFn: async (member: Member) => {
      const res = await api.post(
        "/checkins",
        { member_id: member.id, source: "manual" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data as CheckInResult;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  function handleSelect(member: Member) {
    setSelected(member);
    setResult(null);
    setSearch("");
  }

  function handleSubmit() {
    if (!selected) return;
    mutation.mutate(selected);
  }

  function handleReset() {
    setSelected(null);
    setResult(null);
    setSearch("");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manual Check-In</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Search for a member and log a manual entry
        </p>
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            result.is_blocked
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {result.is_blocked ? (
            <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" />
          )}
          <div className="flex-1">
            <p className="font-semibold">
              {result.is_blocked ? "Access denied" : "Entry allowed"}
            </p>
            {result.is_blocked && result.block_reason && (
              <p className="text-sm mt-0.5">{result.block_reason}</p>
            )}
            <p className="text-sm mt-0.5">
              Check-in recorded for <span className="font-medium">{selected?.name}</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            New entry
          </Button>
        </div>
      )}

      {!result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Member search */}
            {!selected ? (
              <div className="space-y-2">
                <Label htmlFor="search">Name, code, or phone</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    className="pl-9"
                    placeholder="Search…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {isLoading && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Searching…
                  </p>
                )}

                {!isLoading && debouncedSearch.trim() && members.length === 0 && (
                  <p className="text-sm text-muted-foreground">No members found.</p>
                )}

                {members.length > 0 && (
                  <ul className="divide-y border rounded-md overflow-hidden">
                    {members.map((m) => (
                      <li key={m.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center justify-between gap-3"
                          onClick={() => handleSelect(m)}
                        >
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.member_code}
                              {m.phone ? ` · ${m.phone}` : ""}
                            </p>
                          </div>
                          <Badge variant={m.is_active ? "default" : "secondary"}>
                            {m.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              /* Selected member — confirm */
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border px-4 py-3">
                  <div>
                    <p className="font-medium">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selected.member_code}
                      {selected.phone ? ` · ${selected.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selected.is_active ? "default" : "secondary"}>
                      {selected.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Change
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="flex-1"
                  >
                    {mutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Log Manual Check-In
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Cancel
                  </Button>
                </div>

                {mutation.isError && (
                  <p className="text-sm text-red-600">
                    Failed to log check-in. Please try again.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
