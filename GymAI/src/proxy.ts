import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/studio", "/api/auth"];

// Role-to-prefix map: each role may only access its own prefix (and shared paths)
const ROLE_PREFIX: Record<string, string> = {
  super_admin: "/admin",
  admin: "/admin",
  manager: "/admin",
  trainer: "/trainer",
  staff: "/staff",
  receptionist: "/receptionist",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users to login
  if (!req.auth && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route guard: authenticated users may not access other roles' routes
  if (req.auth && !isPublic) {
    const role = req.auth.user?.role as string | undefined;
    const allowedPrefix = role ? ROLE_PREFIX[role] : undefined;

    const ROLE_PREFIXES = Object.values(ROLE_PREFIX);
    const isRoleRoute = ROLE_PREFIXES.some((p) => pathname.startsWith(p));

    if (isRoleRoute && allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      // Redirect to the user's own dashboard instead of a 403
      return NextResponse.redirect(new URL(`${allowedPrefix}/dashboard`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
