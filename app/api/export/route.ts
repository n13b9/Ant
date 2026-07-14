import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";
import { RATING_LABELS } from "@/lib/ratings";

export async function GET() {
  if (!(await isAdmin())) return new Response("unauthorized", { status: 401 });

  const rows = await sql`
    select q.text as question, r.model, r.content as response,
           i.label as reviewer, f.rating, f.comment, f.created_at
    from feedback f
    join responses r on r.id = f.response_id
    join questions q on q.id = r.question_id
    join invites i on i.id = f.invite_id
    order by f.created_at
  `;

  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = "question,model,response,reviewer,rating,comment,created_at";
  const csv = [
    header,
    ...rows.map((r) =>
      [r.question, r.model, r.response, r.reviewer, RATING_LABELS[r.rating as number] ?? r.rating, r.comment, r.created_at]
        .map(esc)
        .join(",")
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="feedback.csv"',
    },
  });
}
