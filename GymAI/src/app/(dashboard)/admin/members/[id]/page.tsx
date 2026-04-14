"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Snowflake, Sun, AlertCircle } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  member_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  joined_at: string | null;
  is_active: boolean;
};

type Membership = {
  id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: "active" | "frozen" | "expired" | "cancelled";
};

type Due = {
  id: string;
  invoice_id: string;
  total_amount: string;
  paid_amount: string;
  due_amount: string;
  due_date: string | null;
  status: "open" | "partial" | "cleared";
};

// ── Status badge colors ───────────────────────────────────────────────────────

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  active: "default",
  frozen: "secondary",
  expired: "destructive",
  cancelled: "destructive",
};

// ── Freeze / Unfreeze inline form ─────────────────────────────────────────────

function FreezeForm({
  membershipId,
  token,
  onDone,
}: {
  membershipId: string;
  token: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const [freezeStart, setFreezeStart] = useState(today);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const freeze = useMutation({
    mutationFn: async () => {
      await api.post(
        `/memberships/${membershipId}/freeze`,
        { freeze_start: freezeStart, reason: reason || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memberships"] });
      onDone();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setError(err?.response?.data?.detail ?? "Failed to freeze. Try again.");
    },
  });

  return (
    <div className="mt-3 rounded-lg border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">Freeze Membership</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="freeze_start" className="text-xs">
            Freeze Start *
          </Label>
          <Input
            id="freeze_start"
            type="date"
            value={freezeStart}
            onChange={(e) => setFreezeStart(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="freeze_reason" className="text-xs">
            Reason (optional)
          </Label>
          <Input
            id="freeze_reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Injury, travel, etc."
          />
        </div>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onDone}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={freeze.isPending}
          onClick={() => freeze.mutate()}
        >
          {freeze.isPending ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Snowflake className="mr-1 h-3 w-3" />
          )}
          Confirm Freeze
        </Button>
      </div>
    </div>
  );
}

function UnfreezeForm({
  membershipId,
  token,
  onDone,
}: {
  membershipId: string;
  token: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const [freezeEnd, setFreezeEnd] = useState(today);
  const [error, setError] = useState<string | null>(null);

  const unfreeze = useMutation({
    mutationFn: async () => {
      await api.post(
        `/memberships/${membershipId}/unfreeze`,
        { freeze_end: freezeEnd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memberships"] });
      onDone();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setError(err?.response?.data?.detail ?? "Failed to unfreeze. Try again.");
    },
  });

  return (
    <div className="mt-3 rounded-lg border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">Unfreeze Membership</p>
      <div className="space-y-1 max-w-[200px]">
        <Label htmlFor="freeze_end" className="text-xs">
          Freeze End Date *
        </Label>
        <Input
          id="freeze_end"
          type="date"
          value={freezeEnd}
          onChange={(e) => setFreezeEnd(e.target.value)}
        />
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onDone}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={unfreeze.isPending}
          onClick={() => unfreeze.mutate()}
        >
          {unfreeze.isPending ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Sun className="mr-1 h-3 w-3" />
          )}
          Confirm Unfreeze
        </Button>
      </div>
    </div>
  );
}

// ── Membership card ───────────────────────────────────────────────────────────

function MembershipCard({
  membership,
  token,
}: {
  membership: Membership;
  token: string;
}) {
  const [action, setAction] = useState<"freeze" | "unfreeze" | null>(null);

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant={STATUS_VARIANT[membership.status] ?? "secondary"} className="capitalize">
            {membership.status}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {membership.start_date} → {membership.end_date}
          </p>
        </div>
        <div className="flex gap-2">
          {membership.status === "active" && !action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAction("freeze")}
            >
              <Snowflake className="mr-1 h-3 w-3" />
              Freeze
            </Button>
          )}
          {membership.status === "frozen" && !action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAction("unfreeze")}
            >
              <Sun className="mr-1 h-3 w-3" />
              Unfreeze
            </Button>
          )}
        </div>
      </div>

      {action === "freeze" && (
        <FreezeForm
          membershipId={membership.id}
          token={token}
          onDone={() => setAction(null)}
        />
      )}
      {action === "unfreeze" && (
        <UnfreezeForm
          membershipId={membership.id}
          token={token}
          onDone={() => setAction(null)}
        />
      )}
    </div>
  );
}

// ── Dues card ─────────────────────────────────────────────────────────────────

const DUE_STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  open: "destructive",
  partial: "secondary",
  cleared: "default",
};

function PayDueForm({
  due,
  token,
  onDone,
}: {
  due: Due;
  token: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(due.due_amount);
  const [error, setError] = useState<string | null>(null);

  const pay = useMutation({
    mutationFn: async () => {
      await api.post(
        `/dues/${due.id}/pay`,
        { amount: parseFloat(amount).toFixed(2) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dues"] });
      onDone();
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setError(err?.response?.data?.detail ?? "Payment failed.");
    },
  });

  return (
    <div className="mt-2 flex items-center gap-2">
      <Input
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-8 w-28 text-sm"
      />
      <Button size="sm" disabled={pay.isPending} onClick={() => { setError(null); pay.mutate(); }}>
        {pay.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay ₹"}
      </Button>
      <button type="button" onClick={onDone} className="text-muted-foreground text-xs hover:underline">
        Cancel
      </button>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

function DuesCard({ memberId, token }: { memberId: string; token: string }) {
  const [payingDueId, setPayingDueId] = useState<string | null>(null);

  const { data: dues = [], isLoading } = useQuery<Due[]>({
    queryKey: ["dues", memberId],
    queryFn: async () => {
      const res = await api.get(`/dues?member_id=${memberId}&open_only=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!memberId && !!token,
  });

  const openDues = dues.filter((d) => d.status !== "cleared");
  const totalOutstanding = openDues.reduce(
    (sum, d) => sum + parseFloat(d.due_amount),
    0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">Dues</CardTitle>
        {totalOutstanding > 0 && (
          <div className="flex items-center gap-1.5 text-destructive text-sm font-semibold">
            <AlertCircle className="h-4 w-4" />
            Outstanding: ₹{totalOutstanding.toFixed(2)}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-muted-foreground text-sm">Loading dues…</p>
        )}
        {!isLoading && dues.length === 0 && (
          <p className="text-muted-foreground text-sm">No dues recorded.</p>
        )}
        <div className="space-y-3">
          {dues.map((due) => (
            <div key={due.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant={DUE_STATUS_VARIANT[due.status]} className="capitalize text-xs">
                    {due.status}
                  </Badge>
                  {due.due_date && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      Due {new Date(due.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">₹{parseFloat(due.due_amount).toFixed(2)} remaining</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{parseFloat(due.paid_amount).toFixed(2)} paid of ₹{parseFloat(due.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
              {due.status !== "cleared" && (
                payingDueId === due.id ? (
                  <PayDueForm
                    due={due}
                    token={token}
                    onDone={() => setPayingDueId(null)}
                  />
                ) : (
                  <button
                    type="button"
                    className="mt-2 text-xs text-primary hover:underline"
                    onClick={() => setPayingDueId(due.id)}
                  >
                    Record payment →
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Member profile page ───────────────────────────────────────────────────────

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";

  const { data: member, isLoading: memberLoading } = useQuery<Member>({
    queryKey: ["member", id],
    queryFn: async () => {
      const res = await api.get(`/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id && !!token,
  });

  const { data: memberships = [] } = useQuery<Membership[]>({
    queryKey: ["memberships", id],
    queryFn: async () => {
      const res = await api.get(`/memberships/member/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id && !!token,
  });

  if (memberLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Member not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{member.name}</h1>
          <p className="text-muted-foreground text-sm font-mono mt-0.5">
            {member.member_code}
          </p>
        </div>
        <Badge
          variant={member.is_active ? "default" : "secondary"}
          className="ml-auto"
        >
          {member.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Member info card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {member.phone && (
              <>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{member.phone}</dd>
              </>
            )}
            {member.email && (
              <>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{member.email}</dd>
              </>
            )}
            {member.gender && (
              <>
                <dt className="text-muted-foreground">Gender</dt>
                <dd className="capitalize">{member.gender}</dd>
              </>
            )}
            {member.dob && (
              <>
                <dt className="text-muted-foreground">Date of Birth</dt>
                <dd>
                  {new Date(member.dob).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </>
            )}
            {member.joined_at && (
              <>
                <dt className="text-muted-foreground">Joined</dt>
                <dd>
                  {new Date(member.joined_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Memberships card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Memberships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {memberships.length === 0 && (
            <p className="text-muted-foreground text-sm">No memberships found.</p>
          )}
          {memberships.map((ms) => (
            <MembershipCard key={ms.id} membership={ms} token={token} />
          ))}
        </CardContent>
      </Card>

      {/* Dues card */}
      <DuesCard memberId={id} token={token} />
    </div>
  );
}
