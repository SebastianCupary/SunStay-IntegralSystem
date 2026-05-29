import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/reservations",
  "/guests",
  "/rooms",
  "/billing",
  "/inventory",
  "/staff",
  "/attendance",
  "/common-areas",
  "/reports",
  "/users",
  "/roles",
  "/profile",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sunstay_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reservations/:path*",
    "/guests/:path*",
    "/rooms/:path*",
    "/billing/:path*",
    "/inventory/:path*",
    "/staff/:path*",
    "/attendance/:path*",
    "/common-areas/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/roles/:path*",
    "/profile/:path*",
  ],
};
