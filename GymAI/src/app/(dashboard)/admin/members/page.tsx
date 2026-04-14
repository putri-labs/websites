"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { UserPlus, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { api } from "@/lib/axios";
import { useDebounce } from "@/lib/use-debounce";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  member_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  branch_id: string | null;
  is_active: boolean;
  joined_at: string | null;
};

type Branch = {
  id: string;
  name: string;
};

// ── Column helper ─────────────────────────────────────────────────────────────

const col = createColumnHelper<Member>();

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (!sorted) return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-40" />;
  if (sorted === "asc") return <ArrowUp className="ml-1 h-3 w-3 inline" />;
  return <ArrowDown className="ml-1 h-3 w-3 inline" />;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminMembersPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters] = useState<ColumnFiltersState>([]);

  // Fetch members (API-level search + active_only)
  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["members", debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "200" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await api.get(`/members?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // Fetch branches for filter dropdown
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await api.get("/branches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // Client-side filtering: status + branch
  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter === "active" && !m.is_active) return false;
      if (statusFilter === "inactive" && m.is_active) return false;
      if (branchFilter !== "all" && m.branch_id !== branchFilter) return false;
      return true;
    });
  }, [members, statusFilter, branchFilter]);

  const columns = useMemo(
    () => [
      col.accessor("member_code", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-muted-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Code
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      col.accessor("name", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-muted-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <div>
            <Link
              href={`/admin/members/${info.row.original.id}`}
              className="font-medium hover:underline"
            >
              {info.getValue()}
            </Link>
            {info.row.original.email && (
              <p className="text-xs text-muted-foreground">
                {info.row.original.email}
              </p>
            )}
          </div>
        ),
      }),
      col.accessor("phone", {
        header: () => (
          <span className="font-medium text-muted-foreground">Phone</span>
        ),
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() ?? "—"}</span>
        ),
      }),
      col.accessor("joined_at", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-muted-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Joined
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          if (!val) return <span className="text-muted-foreground">—</span>;
          return (
            <span className="text-muted-foreground">
              {new Date(val).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          );
        },
        sortingFn: "datetime",
      }),
      col.accessor("is_active", {
        header: () => (
          <span className="font-medium text-muted-foreground">Status</span>
        ),
        cell: (info) => (
          <Badge variant={info.getValue() ? "default" : "secondary"}>
            {info.getValue() ? "Active" : "Inactive"}
          </Badge>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Loading…"
              : `${table.getRowModel().rows.length} member${table.getRowModel().rows.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/admin/members/new" className={cn(buttonVariants())}>
          <UserPlus className="mr-2 h-4 w-4" />
          Register Member
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 w-64"
            placeholder="Search name, phone, or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex rounded-md border overflow-hidden text-sm">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors border-l first:border-l-0",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Branch filter */}
        {branches.length > 0 && (
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TanStack Table */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/50">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading members…
                </td>
              </tr>
            )}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {search
                    ? `No members found for "${search}"`
                    : "No members match the selected filters."}
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
