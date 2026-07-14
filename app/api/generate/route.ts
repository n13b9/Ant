import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";
import { groq, GENERATION_MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { questionId } = await req.json();
  const [q] = await sql`select id, text from questions where id = ${questionId}`;
  if (!q) return NextResponse.json({ error: "not found" }, { status: 404 });

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: GENERATION_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a job candidate answering interview questions. Be concise, professional, 120-200 words. " +
            "Respond in plain text only. Do not use markdown, headings, or bold. Do not repeat the question — begin directly with the answer.",
        },
        { role: "user", content: q.text },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
  } catch (e: unknown) {
    const status = (e as { status?: number })?.status;
    if (status === 429)
      return NextResponse.json({ error: "rate limited, retry shortly" }, { status: 429 });
    return NextResponse.json({ error: "groq call failed" }, { status: 502 });
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  if (!raw) return NextResponse.json({ error: "empty response" }, { status: 502 });
  const content = raw.replace(/\*\*/g, "").replace(/^#+\s*/gm, "").trim();

  const [row] = await sql`
    insert into responses (question_id, model, content, prompt_version)
    values (${q.id}, ${GENERATION_MODEL}, ${content}, 'v1')
    returning id, content, model
  `;
  return NextResponse.json(row);
}
