import { sql } from "@/lib/db";
import AdminNav from "../AdminNav";
import ResultsClient from "./ResultsClient";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const summary = await sql`
    select r.id, q.text as question, r.model,
           count(f.id) filter (where f.rating = 1) as poor,
           count(f.id) filter (where f.rating = 2) as okay,
           count(f.id) filter (where f.rating = 3) as good,
           count(f.id) filter (where f.rating = 4) as excellent,
           avg(f.rating) as avg_rating,
           count(f.id) as total
    from responses r
    join questions q on q.id = r.question_id
    left join feedback f on f.response_id = r.id
    group by r.id, q.text, r.model
    order by total desc
  `;

  const comments = await sql`
    select f.response_id, f.rating, f.comment, i.label as reviewer
    from feedback f
    join invites i on i.id = f.invite_id
    where f.comment is not null
    order by f.created_at desc
  `;

  return (
    <>
      <AdminNav />
      <ResultsClient
        summary={JSON.parse(JSON.stringify(summary))}
        comments={JSON.parse(JSON.stringify(comments))}
      />
    </>
  );
}
