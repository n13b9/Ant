import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";

export async function DELETE() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await sql.begin(async (tx) => {
    await tx`
      delete from feedback where response_id in (
        select r.id from responses r join questions q on q.id = r.question_id where q.is_demo
      )
    `;
    await tx`delete from responses where question_id in (select id from questions where is_demo)`;
    await tx`delete from questions where is_demo`;
  });

  return NextResponse.json({ ok: true });
}
