"use client";
import { useState } from "react";

type Response = { id: string; model: string; content: string };
type Question = { id: string; text: string; is_demo: boolean; created_at: string; responses: Response[] };

export default function QuestionsClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newText, setNewText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearingDemo, setClearingDemo] = useState(false);
  const [error, setError] = useState("");
  const hasDemoData = questions.some((q) => q.is_demo);

  async function clearDemoData() {
    if (!confirm("Remove all demo questions, responses, and feedback? This can't be undone.")) return;
    setClearingDemo(true);
    setError("");
    const res = await fetch("/api/admin/demo", { method: "DELETE" });
    setClearingDemo(false);
    if (!res.ok) {
      setError("Failed to clear demo data");
      return;
    }
    setQuestions(questions.filter((q) => !q.is_demo));
  }

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
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-xl font-semibold text-slate-800">Questions</h1>
        {hasDemoData && (
          <button
            onClick={clearDemoData}
            disabled={clearingDemo}
            className="btn-ghost text-xs px-3 py-1.5 shrink-0 text-rose-600 hover:bg-rose-50"
          >
            {clearingDemo ? "Clearing…" : "Clear demo data"}
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-6">Add interview questions and generate AI responses for reviewers to rate.</p>

      <form onSubmit={addQuestion} className="flex gap-2 mb-6">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New interview question"
          className="input flex-1"
        />
        <button className="btn-primary shrink-0">Add</button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card p-10 text-center text-sm text-slate-400">
          No questions yet. Add one above to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="card p-5">
              <div className="flex justify-between items-start gap-4 mb-3">
                <p className="font-medium text-slate-800">
                  {q.text}
                  {q.is_demo && <span className="badge-neutral ml-2 align-middle">Demo</span>}
                </p>
                <button
                  onClick={() => generate(q.id)}
                  disabled={busyId === q.id}
                  className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                >
                  {busyId === q.id ? "Generating…" : "Generate response"}
                </button>
              </div>
              {q.responses.length === 0 ? (
                <p className="text-sm text-slate-400">No responses yet</p>
              ) : (
                <ul className="space-y-2">
                  {q.responses.map((r) => (
                    <li key={r.id} className="text-sm bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="badge-neutral mb-2">{r.model}</p>
                      <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{r.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
