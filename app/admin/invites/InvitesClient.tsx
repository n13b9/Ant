"use client";
import { useState } from "react";

type Invite = {
  id: string;
  token: string;
  label: string | null;
  expires_at: string | null;
  used_at: string | null;
  created_at: string;
  feedback_count: string;
};

export default function InvitesClient({ initialInvites }: { initialInvites: Invite[] }) {
  const [invites, setInvites] = useState(initialInvites);
  const [label, setLabel] = useState("");
  const [lastLink, setLastLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim() || null }),
    });
    setBusy(false);
    if (!res.ok) return;
    const { link } = await res.json();
    setLastLink(link);
    setCopied(false);
    setLabel("");

    const listRes = await fetch("/api/invites");
    if (listRes.ok) setInvites(await listRes.json());
  }

  function copyLink() {
    navigator.clipboard.writeText(lastLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function copyRowLink(invite: Invite) {
    const link = `${window.location.origin}/api/session?t=${invite.token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId((id) => (id === invite.id ? null : id)), 1500);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Invites</h1>
      <p className="text-sm text-slate-500 mb-6">Create a review link for each reviewer and share it with them.</p>

      <form onSubmit={createInvite} className="flex gap-2 mb-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Reviewer name (defaults to Reviewer N)"
          className="input flex-1"
        />
        <button disabled={busy} className="btn-primary shrink-0">
          Create invite
        </button>
      </form>

      {lastLink && (
        <div className="mb-6 card p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="label mb-1">New link</p>
            <a href={lastLink} className="text-indigo-600 text-sm break-all hover:underline">
              {lastLink}
            </a>
          </div>
          <button onClick={copyLink} className="btn-secondary text-xs px-3 py-1.5 shrink-0">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 text-slate-400">
              <th className="py-3 px-4 font-medium">Label</th>
              <th className="py-3 px-4 font-medium">Used</th>
              <th className="py-3 px-4 font-medium">Feedback given</th>
              <th className="py-3 px-4 font-medium">Expires</th>
              <th className="py-3 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {invites.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No invites yet
                </td>
              </tr>
            ) : (
              invites.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-slate-700">{i.label || "—"}</td>
                  <td className="py-3 px-4">
                    {i.used_at ? (
                      <span className="badge-good">Yes</span>
                    ) : (
                      <span className="badge-neutral">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{i.feedback_count}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {i.expires_at ? new Date(i.expires_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => copyRowLink(i)} className="btn-ghost text-xs px-2 py-1">
                      {copiedId === i.id ? "Copied ✓" : "Copy link"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
