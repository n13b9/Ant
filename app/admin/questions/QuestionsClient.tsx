"use client";
import { useState } from "react";

type Response = { id: string; model: string; content: string };
type Question = { id: string; text: string; created_at: string; responses: Response[] };

export default function QuestionsClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newText, setNewText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText.trim() }),
    });
    if (!res.ok) {
      setError("Failed to add question");
      return;
    }
    const q = await res.json();
    setQuestions([{ ...q, responses: [] }, ...questions]);
    setNewText("");
  }

  async function generate(questionId: string) {
    setBusyId(questionId);
    setError("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    });
    setBusyId(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Generation failed");
      return;
    }
    const response = await res.json();
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, responses: [...q.responses, response] } : q
      )
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Questions</h1>

      <form onSubmit={addQuestion} className="flex gap-2 mb-6">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New interview question"
          className="flex-1 border rounded-lg p-2"
        />
        <button className="bg-black text-white rounded-lg px-4 py-2">Add</button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start gap-4 mb-2">
              <p className="font-medium">{q.text}</p>
              <button
                onClick={() => generate(q.id)}
                disabled={busyId === q.id}
                className="shrink-0 border rounded-lg px-3 py-1 text-sm disabled:opacity-40"
              >
                {busyId === q.id ? "Generating…" : "Generate response"}
              </button>
            </div>
            {q.responses.length === 0 ? (
              <p className="text-sm text-gray-400">No responses yet</p>
            ) : (
              <ul className="space-y-2">
                {q.responses.map((r) => (
                  <li key={r.id} className="text-sm bg-gray-50 border rounded-lg p-3">
                    <p className="text-gray-400 mb-1">{r.model}</p>
                    <p className="whitespace-pre-wrap">{r.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
