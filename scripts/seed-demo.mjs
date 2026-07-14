// Seeds 5 demo interview questions with real Groq-generated responses (one
// question gets a deliberately lazy second response for rating contrast),
// plus a used demo invite with feedback so Results isn't empty either.
//
// Run with: npm run seed:demo

import postgres from "postgres";
import OpenAI from "openai";
import crypto from "crypto";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });
const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
const MODEL = "openai/gpt-oss-20b";

const QUESTIONS = [
  "Tell me about a time you disagreed with your manager.",
  "Why do you want this role?",
  "Describe a project that failed and what you learned.",
  "How do you prioritize tasks when everything feels urgent?",
  "Tell me about a time you had to learn something new quickly.",
];

const GOOD_SYSTEM_PROMPT =
  "You are a job candidate answering interview questions. Be concise, professional, 120-200 words. " +
  "Respond in plain text only. Do not use markdown, headings, or bold. Do not repeat the question — begin directly with the answer.";

const LAZY_SYSTEM_PROMPT =
  "You are a job candidate answering interview questions half-heartedly. Give a short, vague, generic answer " +
  "in 1-2 sentences with no specific details or examples. Respond in plain text only, no markdown.";

function stripMarkdown(raw) {
  return raw.replace(/\*\*/g, "").replace(/^#+\s*/gm, "").trim();
}

async function generate(question, systemPrompt, temperature) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    temperature,
    max_tokens: 500,
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  if (!raw) throw new Error(`empty response for: ${question}`);
  return stripMarkdown(raw);
}

async function main() {
  const [{ count }] = await sql`select count(*)::int as count from questions where is_demo`;
  if (count > 0) {
    console.log("Demo data already present — clear it from the admin Questions page first.");
    await sql.end();
    return;
  }

  const responseIds = [];

  for (let i = 0; i < QUESTIONS.length; i++) {
    const text = QUESTIONS[i];
    console.log(`Generating response for: "${text}"`);
    const content = await generate(text, GOOD_SYSTEM_PROMPT, 0.7);

    const [question] = await sql`
      insert into questions (text, is_demo) values (${text}, true) returning id
    `;
    const [response] = await sql`
      insert into responses (question_id, model, content, prompt_version)
      values (${question.id}, ${MODEL}, ${content}, 'v1')
      returning id
    `;
    responseIds.push(response.id);

    if (i === 1) {
      console.log(`Generating a deliberately lazy second response for: "${text}"`);
      const lazyContent = await generate(text, LAZY_SYSTEM_PROMPT, 0.9);
      const [lazyResponse] = await sql`
        insert into responses (question_id, model, content, prompt_version)
        values (${question.id}, ${MODEL}, ${lazyContent}, 'v1-lazy')
        returning id
      `;
      responseIds.push(lazyResponse.id);
    }
  }

  const token = crypto.randomBytes(24).toString("hex");
  const [invite] = await sql`
    insert into invites (token, label, expires_at, used_at)
    values (${token}, 'Demo Reviewer', now() + interval '30 days', now())
    returning id
  `;

  const ratings = [
    { rating: 4, comment: "Strong, specific example with a clear resolution." },
    { rating: 3, comment: "Solid but could be more specific to our company." },
    { rating: 1, comment: "Too vague, doesn't answer the question." },
    { rating: 3, comment: null },
    { rating: 4, comment: "Clear prioritization framework." },
    { rating: 2, comment: "Answer felt generic, lacked a specific example." },
  ];

  for (let i = 0; i < responseIds.length; i++) {
    const { rating, comment } = ratings[i];
    await sql`
      insert into feedback (response_id, invite_id, rating, comment)
      values (${responseIds[i]}, ${invite.id}, ${rating}, ${comment})
    `;
  }

  console.log(`Seeded ${QUESTIONS.length} demo questions, ${responseIds.length} responses, ${ratings.length} feedback entries.`);
  await sql.end();
}

main().catch(async (e) => {
  console.error(e);
  await sql.end();
  process.exit(1);
});
