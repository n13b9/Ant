import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const invites = await sql`
    select i.id, i.token, i.label, i.expires_at, i.used_at, i.created_at,
           count(f.id) as feedback_count
    from invites i
    left join feedback f on f.invite_id = i.id
    group by i.id
    order by i.created_at desc
  `;
  return NextResponse.json(invites);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { label } = await req.json();
  const token = crypto.randomBytes(24).toString("hex");

  const [invite] = await sql`
    insert into invites (token, label, expires_at)
    values (${token}, ${label || null}, now() + interval '30 days')
    returning id
  `;

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.json({ id: invite.id, link: `${base}/api/session?t=${token}` });
}
