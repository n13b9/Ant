"use client";
import { useState } from "react";

type Item = { id: string; content: string; model: string; question: string };

export default function ReviewClient({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const [rating, setRating] = useState<"good" | "poor" | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const item = items[idx];
  const progress = ((idx + (busy ? 1 : 0)) / items.length) * 100;

  async function submit(skip = false) {
    if (!skip && !rating) return;
    setBusy(true);
    if (!skip) {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId: item.id, rating, comment }),
      });
      if (!res.ok) {
        setBusy(false);
        alert("Failed, try again");
        return;
      }
    }
    if (idx + 1 >= items.length) window.location.href = "/review/done";
    else {
      setIdx(idx + 1);
      setRating(null);
      setComment("");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col h-dvh">
      <div className="w-full max-w-xl mx-auto px-4 pt-6 shrink-0">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-slate-700">
            Response {idx + 1} of {items.length}
          </span>
          <span className="badge-neutral">{item.model}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="w-full max-w-xl mx-auto">
          <div className="card p-6">
            <p className="label mb-2">Question</p>
            <p className="text-slate-800 font-medium mb-6">{item.question}</p>

            <p className="label mb-2">AI response</p>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4">
              {item.content}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-4">
        <div className="w-full max-w-xl mx-auto">
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setRating("good")}
              className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-colors ${
                rating === "good"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              👍 Good
            </button>
            <button
              onClick={() => setRating("poor")}
              className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-colors ${
                rating === "poor"
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              👎 Poor
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
            className="input min-h-[60px] mb-3 resize-none"
          />
          <div className="flex items-center justify-between">
            <button onClick={() => submit(true)} disabled={busy} className="btn-ghost">
              Skip
            </button>
            <button onClick={() => submit(false)} disabled={busy || !rating} className="btn-primary px-6">
              {busy ? "Saving…" : "Submit & next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
