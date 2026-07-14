"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Incorrect password");
      return;
    }
    router.push("/admin/questions");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="card w-full max-w-sm p-8">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
          ✦
        </div>
        <h1 className="text-lg font-semibold text-center mb-1">Admin login</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in to manage questions and invites.</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
            autoFocus
          />
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button type="submit" disabled={busy || !password} className="btn-primary w-full">
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
