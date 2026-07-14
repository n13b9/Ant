"use client";
import { useState } from "react";

type Item = { id: string; content: string; model: string; question: string };

export default function ReviewClient({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const [rating, setRating] = useState<"good" | "poor" | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const item = items[idx];

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
    <main className="max-w-xl mx-auto p-6">
      <p className="text-sm text-gray-500 mb-2">
        Response {idx + 1} of {items.length} · {item.model}
      </p>
      <h2 className="font-medium mb-1">Question</h2>
      <p className="mb-4">{item.question}</p>
      <h2 className="font-medium mb-1">AI response</h2>
      <p className="mb-6 whitespace-pre-wrap border rounded-lg p-4 bg-gray-50">
        {item.content}
      </p>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRating("good")}
          className={`flex-1 border rounded-lg py-2 ${rating === "good" ? "border-green-600 bg-green-50" : ""}`}
        >
          👍 Good
        </button>
        <button
          onClick={() => setRating("poor")}
          className={`flex-1 border rounded-lg py-2 ${rating === "poor" ? "border-red-600 bg-red-50" : ""}`}
        >
          👎 Poor
        </button>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
        className="w-full border rounded-lg p-3 mb-4 min-h-[80px]"
      />
      <div className="flex justify-between">
        <button onClick={() => submit(true)} disabled={busy} className="text-gray-500">
          Skip
        </button>
        <button
          onClick={() => submit(false)}
          disabled={busy || !rating}
          className="bg-black text-white rounded-lg px-5 py-2 disabled:opacity-40"
        >
          Submit & next
        </button>
      </div>
    </main>
  );
}
