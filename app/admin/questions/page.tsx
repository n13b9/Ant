import { sql } from "@/lib/db";
import AdminNav from "../AdminNav";
import QuestionsClient from "./QuestionsClient";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const questions = await sql`
    select q.id, q.text, q.created_at,
           coalesce(json_agg(json_build_object('id', r.id, 'model', r.model, 'content', r.content)
             order by r.created_at) filter (where r.id is not null), '[]') as responses
    from questions q
    left join responses r on r.question_id = q.id
    group by q.id
    order by q.created_at desc
  `;

  return (
    <>
      <AdminNav />
      <QuestionsClient initialQuestions={JSON.parse(JSON.stringify(questions))} />
    </>
  );
}
