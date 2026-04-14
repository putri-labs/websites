"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle, Circle, Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Types ─────────────────────────────────────────────────────────────────────

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assigned_to: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
};

type StaffUser = {
  id: string;
  name: string;
  role: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<string, "destructive" | "default" | "secondary"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
};

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── Create task form ───────────────────────────────────────────────────────────

function CreateTaskForm({
  token,
  staff,
  onCreated,
}: {
  token: string;
  staff: StaffUser[];
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(
        "/tasks",
        {
          title,
          priority,
          assigned_to: assignedTo || null,
          due_date: dueDate || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      setTitle("");
      setPriority("medium");
      setAssignedTo("");
      setDueDate("");
      setOpen(false);
      onCreated();
    },
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task description…"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="task-priority">Priority</Label>
            <select
              id="task-priority"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="task-assign">Assign to</Label>
            <select
              id="task-assign"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {staff.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="task-due">Due date</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={!title.trim() || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  token,
  staff,
  onChanged,
  isManager,
}: {
  task: Task;
  token: string;
  staff: StaffUser[];
  onChanged: () => void;
  isManager: boolean;
}) {
  const isCompleted = task.status === "completed";

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await api.patch(
        `/tasks/${task.id}`,
        { status: isCompleted ? "open" : "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: onChanged,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: onChanged,
  });

  const assigneeName = task.assigned_to
    ? staff.find((u) => u.id === task.assigned_to)?.name ?? "Unknown"
    : null;

  return (
    <div className={`flex items-start gap-3 py-3 border-b last:border-b-0 ${isCompleted ? "opacity-50" : ""}`}>
      <button
        className="mt-0.5 shrink-0"
        onClick={() => toggleMutation.mutate()}
        disabled={toggleMutation.isPending}
        title={isCompleted ? "Mark open" : "Mark complete"}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-green-500 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isCompleted ? "line-through" : ""}`}>{task.title}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
          {assigneeName && <span>→ {assigneeName}</span>}
          {task.due_date && <span>Due {fmtDate(task.due_date)}</span>}
          <span>{STATUS_LABEL[task.status]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={PRIORITY_BADGE[task.priority]}>{task.priority}</Badge>
        {isManager && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["all", "open", "in_progress", "completed"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function TasksPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? "";
  const role = session?.user?.role ?? "";
  const isManager = role === "admin" || role === "manager";
  const qc = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await api.get(`/tasks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: staff = [] } = useQuery<StaffUser[]>({
    queryKey: ["users-staff"],
    queryFn: async () => {
      const res = await api.get("/users?limit=200", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && isManager,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["tasks"] });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isManager ? "Assign and track staff tasks" : "Your assigned tasks"}
          </p>
        </div>
        {isManager && <CreateTaskForm token={token} staff={staff} onCreated={invalidate} />}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : STATUS_LABEL[s]}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground py-8 text-center flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          )}
          {!isLoading && tasks.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No tasks found.</p>
          )}
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              token={token}
              staff={staff}
              onChanged={invalidate}
              isManager={isManager}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
