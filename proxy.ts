import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== process.env.ADMIN_COOKIE_VALUE) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/questions/:path*", "/admin/invites/:path*", "/admin/results/:path*"],
};
