"use client";
import { useState } from "react";

type Summary = { id: string; question: string; model: string; good: string; poor: string; total: string };
type Comment = { response_id: string; rating: string; comment: string; reviewer: string | null };

export default function ResultsClient({ summary, comments }: { summary: Summary[]; comments: Comment[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedComments = comments.filter((c) => c.response_id === selected);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Results</h1>

      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Question</th>
            <th className="py-2">Model</th>
            <th className="py-2">👍</th>
            <th className="py-2">👎</th>
            <th className="py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((r) => (
            <tr
              key={r.id}
              onClick={() => setSelected(r.id === selected ? null : r.id)}
              className={`border-b cursor-pointer ${selected === r.id ? "bg-gray-50" : ""}`}
            >
              <td className="py-2 max-w-xs truncate">{r.question}</td>
              <td className="py-2">{r.model}</td>
              <td className="py-2">{r.good}</td>
              <td className="py-2">{r.poor}</td>
              <td className="py-2">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div>
          <h2 className="font-medium mb-2">Comments</h2>
          {selectedComments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments for this response.</p>
          ) : (
            <ul className="space-y-2">
              {selectedComments.map((c, i) => (
                <li key={i} className="text-sm border rounded-lg p-3">
                  <p className="text-gray-400 mb-1">
                    {c.reviewer || "Anonymous"} · {c.rating}
                  </p>
                  <p>{c.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
