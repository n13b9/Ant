import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { sign } from "@/lib/session";

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  if (!t) return NextResponse.redirect(new URL("/invalid-link", req.url));

  const [invite] = await sql`
    select id from invites
    where token = ${t} and (expires_at is null or expires_at > now())
  `;
  if (!invite) return NextResponse.redirect(new URL("/invalid-link", req.url));

  await sql`update invites set used_at = coalesce(used_at, now()) where id = ${invite.id}`;

  const res = NextResponse.redirect(new URL("/review", req.url));
  res.cookies.set("rv_session", sign(invite.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 604800,
    path: "/",
  });
  return res;
}
