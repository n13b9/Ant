"use client";
import { useState } from "react";
import { RATING_LABELS } from "@/lib/ratings";

type Summary = {
  id: string;
  question: string;
  model: string;
  poor: string;
  okay: string;
  good: string;
  excellent: string;
  avg_rating: string | null;
  total: string;
};
type Comment = { response_id: string; rating: number; comment: string; reviewer: string | null };

const MIN_SAMPLE = 3;

const SEGMENT_STYLES: Record<number, string> = {
  1: "bg-rose-400",
  2: "bg-amber-400",
  3: "bg-lime-400",
  4: "bg-emerald-500",
};

const BADGE_STYLES: Record<number, string> = {
  1: "border-rose-500 bg-rose-50 text-rose-700",
  2: "border-amber-500 bg-amber-50 text-amber-700",
  3: "border-lime-500 bg-lime-50 text-lime-700",
  4: "border-emerald-500 bg-emerald-50 text-emerald-700",
};

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
                const counts: Record<number, number> = {
                  1: Number(r.poor),
                  2: Number(r.okay),
                  3: Number(r.good),
                  4: Number(r.excellent),
                };
                const avg = r.avg_rating ? Number(r.avg_rating) : null;
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
                            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden flex">
                              {total < MIN_SAMPLE ? (
                                <div className="h-full w-full bg-slate-300" />
                              ) : (
                                [1, 2, 3, 4].map((v) => {
                                  const pct = (counts[v] / total) * 100;
                                  return pct > 0 ? (
                                    <div key={v} className={`h-full ${SEGMENT_STYLES[v]}`} style={{ width: `${pct}%` }} />
                                  ) : null;
                                })
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{avg !== null ? avg.toFixed(1) : "—"} / 4</span>
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
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[c.rating]}`}>
                      {RATING_LABELS[c.rating]}
                    </span>
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
