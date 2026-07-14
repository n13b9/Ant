import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verify } from "@/lib/session";
import { isValidRating } from "@/lib/ratings";

export async function POST(req: Request) {
  const raw = (await cookies()).get("rv_session")?.value;
  const inviteId = raw ? verify(raw) : null;
  if (!inviteId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { responseId, rating, comment } = await req.json();
  if (!responseId || !isValidRating(rating))
    return NextResponse.json({ error: "bad input" }, { status: 400 });

  await sql`
    insert into feedback (response_id, invite_id, rating, comment)
    values (${responseId}, ${inviteId}, ${rating}, ${comment || null})
    on conflict (response_id, invite_id) do update
      set rating = excluded.rating, comment = excluded.comment
  `;
  return NextResponse.json({ ok: true });
}
