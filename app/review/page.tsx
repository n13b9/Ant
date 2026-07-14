import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verify } from "@/lib/session";
import ReviewClient from "./ReviewClient";

export default async function ReviewPage() {
  const raw = (await cookies()).get("rv_session")?.value;
  const inviteId = raw ? verify(raw) : null;
  if (!inviteId) redirect("/invalid-link");

  const items = await sql`
    select r.id, r.content, r.model, q.text as question
    from responses r
    join questions q on q.id = r.question_id
    left join feedback f on f.response_id = r.id and f.invite_id = ${inviteId}
    where f.id is null
    order by r.created_at
  `;

  if (items.length === 0) redirect("/review/done");

  return <ReviewClient items={JSON.parse(JSON.stringify(items))} />;
}
