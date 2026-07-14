"use client";
import { useState } from "react";

type Summary = { id: string; question: string; model: string; good: string; poor: string; total: string };
type Comment = { response_id: string; rating: string; comment: string; reviewer: string | null };

const MIN_SAMPLE = 3;

export default function ResultsClient({ summary, comments }: { summary: Summary[]; comments: Comment[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedComments = comments.filter((c) => c.response_id === selected);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Results</h1>
      <p className="text-sm text-slate-500 mb-6">Click a row to see reviewer comments for that response.</p>

      <div className="card overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 text-slate-400">
              <th className="py-3 px-4 font-medium">Question</th>
              <th className="py-3 px-4 font-medium">Model</th>
              <th className="py-3 px-4 font-medium">Rating</th>
              <th className="py-3 px-4 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No responses yet
                </td>
              </tr>
            ) : (
              summary.map((r) => {
                const total = Number(r.total);
                const good = Number(r.good);
                const pct = total > 0 ? Math.round((good / total) * 100) : 0;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r.id === selected ? null : r.id)}
                    className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                      selected === r.id ? "bg-indigo-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">{r.question}</td>
                    <td className="py-3 px-4">
                      <span className="badge-neutral">{r.model}</span>
                    </td>
                    <td className="py-3 px-4">
                      {total === 0 ? (
                        <span className="text-slate-400">No feedback</span>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-rose-100 overflow-hidden">
                              <div
                                className={`h-full ${total < MIN_SAMPLE ? "bg-slate-300" : "bg-emerald-500"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">
                              {r.good}👍 {r.poor}👎
                            </span>
                          </div>
                          {total < MIN_SAMPLE && (
                            <p className="text-[11px] text-slate-400 mt-0.5">needs more ratings</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{r.total}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div>
          <h2 className="font-medium text-slate-800 mb-3">Comments</h2>
          {selectedComments.length === 0 ? (
            <p className="text-sm text-slate-400">No comments for this response.</p>
          ) : (
            <ul className="space-y-2">
              {selectedComments.map((c, i) => (
                <li key={i} className="card p-4 text-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-slate-700">{c.reviewer || "Anonymous"}</span>
                    {c.rating === "good" ? (
                      <span className="badge-good">👍 Good</span>
                    ) : (
                      <span className="badge-poor">👎 Poor</span>
                    )}
                  </div>
                  <p className="text-slate-600">{c.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
