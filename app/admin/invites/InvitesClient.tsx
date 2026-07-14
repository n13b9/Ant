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
    setLabel("");

    const listRes = await fetch("/api/invites");
    if (listRes.ok) setInvites(await listRes.json());
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Invites</h1>

      <form onSubmit={createInvite} className="flex gap-2 mb-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. reviewer name)"
          className="flex-1 border rounded-lg p-2"
        />
        <button disabled={busy} className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-40">
          Create invite
        </button>
      </form>

      {lastLink && (
        <div className="mb-6 border rounded-lg p-3 bg-gray-50 text-sm break-all">
          <p className="text-gray-500 mb-1">New link:</p>
          <a href={lastLink} className="text-blue-600 underline">
            {lastLink}
          </a>
        </div>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Label</th>
            <th className="py-2">Used</th>
            <th className="py-2">Feedback given</th>
            <th className="py-2">Expires</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((i) => (
            <tr key={i.id} className="border-b">
              <td className="py-2">{i.label || "—"}</td>
              <td className="py-2">{i.used_at ? "Yes" : "No"}</td>
              <td className="py-2">{i.feedback_count}</td>
              <td className="py-2">{i.expires_at ? new Date(i.expires_at).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
