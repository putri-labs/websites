"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Pencil, UserX, UserCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type StaffUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  branch_id: string | null;
  is_active: boolean;
};

type Branch = { id: string; name: string };

const ROLES = ["admin", "manager", "staff", "trainer", "receptionist"] as const;
type Role = (typeof ROLES)[number];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
  trainer: "Trainer",
  receptionist: "Receptionist",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleBadgeVariant(role: string): "destructive" | "default" | "secondary" {
  if (role === "admin") return "destructive";
  if (role === "manager") return "default";
  return "secondary";
}

// ── Add/Edit staff form ────────────────────────────────────────────────────────

type FormState = {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  branch_id: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  role: "staff",
  phone: "",
  branch_id: "",
};

function StaffForm({
  token,
  branches,
  editing,
  onDone,
}: {
  token: string;
  branches: Branch[];
  editing: StaffUser | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    editing
      ? { name: editing.name, email: editing.email, password: "", role: editing.role as Role, phone: editing.phone ?? "", branch_id: editing.branch_id ?? "" }
      : EMPTY_FORM
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        await api.put(
          `/users/${editing.id}`,
          {
            name: form.name || undefined,
            role: form.role,
            phone: form.phone || null,
            branch_id: form.branch_id || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post(
          "/users",
          {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            phone: form.phone || null,
            branch_id: form.branch_id || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    },
    onSuccess: onDone,
  });

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const isEdit = !!editing;
  const canSubmit = form.name.trim() && (isEdit || (form.email.trim() && form.password.trim()));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Staff Member" : "Add Staff Member"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="staff-name">Name</Label>
            <Input id="staff-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
          </div>
          {!isEdit && (
            <div className="space-y-1">
              <Label htmlFor="staff-email">Email</Label>
              <Input id="staff-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          )}
          {!isEdit && (
            <div className="space-y-1">
              <Label htmlFor="staff-password">Password</Label>
              <Input id="staff-password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="staff-phone">Phone</Label>
            <Input id="staff-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="staff-role">Role</Label>
            <select
              id="staff-role"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.role}
              onChange={(e) => set("role", e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="staff-branch">Branch</Label>
            <select
              id="staff-branch"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.branch_id}
              onChange={(e) => set("branch_id", e.target.value)}
            >
              <option value="">All branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">Failed to save. Please check the details and try again.</p>
        )}

        <div className="flex gap-2">
          <Button onClick={() => mutation.mutate()} disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Staff"}
          </Button>
          <Button variant="outline" onClick={onDone}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const qc = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);

  const { data: staff = [], isLoading } = useQuery<StaffUser[]>({
    queryKey: ["staff-users"],
    queryFn: async () => {
      const res = await api.get("/users?limit=200", { headers: { Authorization: `Bearer ${token}` } });
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

  const toggleActive = useMutation({
    mutationFn: async (user: StaffUser) => {
      await api.put(
        `/users/${user.id}`,
        { is_active: !user.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff-users"] }),
  });

  function openEdit(user: StaffUser) {
    setEditing(user);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["staff-users"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage staff accounts, roles, and branch assignments</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        )}
      </div>

      {showForm && (
        <StaffForm token={token} branches={branches} editing={editing} onDone={closeForm} />
      )}

      <Card>
        <CardContent className="pt-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground py-8 text-center flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          )}
          {!isLoading && staff.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No staff members yet.</p>
          )}
          {staff.map((user) => (
            <div key={user.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-medium ${!user.is_active ? "text-muted-foreground line-through" : ""}`}>
                    {user.name}
                  </p>
                  <Badge variant={roleBadgeVariant(user.role)}>{ROLE_LABEL[user.role as Role] ?? user.role}</Badge>
                  {!user.is_active && <Badge variant="secondary">Inactive</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.email}
                  {user.phone ? ` · ${user.phone}` : ""}
                  {user.branch_id ? ` · ${branchMap[user.branch_id] ?? "Branch"}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(user)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive.mutate(user)}
                  disabled={toggleActive.isPending}
                  title={user.is_active ? "Deactivate" : "Reactivate"}
                >
                  {user.is_active ? (
                    <UserX className="h-4 w-4 text-red-500" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
