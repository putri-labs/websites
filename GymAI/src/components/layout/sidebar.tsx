"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Tag,
  BarChart3,
  UserCog,
  Building2,
  Settings,
  Dumbbell,
  Apple,
  Calendar,
  ScanLine,
  CheckSquare,
  UserPlus,
  ClipboardList,
  Server,
  Radio,
  AlertTriangle,
  FileText,
  TrendingUp,
  Grid3x3,
  Fingerprint,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NAV_BY_ROLE, type NavItem } from "./nav-items";
import type { UserRole } from "@/stores/auth-store";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Tag,
  BarChart3,
  UserCog,
  Building2,
  Settings,
  Dumbbell,
  Apple,
  Calendar,
  ScanLine,
  CheckSquare,
  UserPlus,
  ClipboardList,
  Server,
  Radio,
  AlertTriangle,
  FileText,
  TrendingUp,
  Grid3x3,
  Fingerprint,
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const role = (session?.user?.role ?? "staff") as UserRole;
  const name = session?.user?.name ?? "User";
  const navItems = NAV_BY_ROLE[role] ?? [];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 font-bold text-lg tracking-tight">
        GymAI
      </div>
      <Separator />

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <Separator />

      {/* User footer */}
      <div className="flex items-center gap-3 px-3 py-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground capitalize">
            {role.replace("_", " ")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
