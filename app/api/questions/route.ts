import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const questions = await sql`
    select q.id, q.text, q.created_at,
           coalesce(json_agg(json_build_object('id', r.id, 'model', r.model, 'content', r.content)
             order by r.created_at) filter (where r.id is not null), '[]') as responses
    from questions q
    left join responses r on r.question_id = q.id
    group by q.id
    order by q.created_at desc
  `;
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { text } = await req.json();
  if (typeof text !== "string" || !text.trim())
    return NextResponse.json({ error: "text required" }, { status: 400 });

  const [row] = await sql`
    insert into questions (text) values (${text.trim()}) returning id, text, created_at
  `;
  return NextResponse.json(row);
}
