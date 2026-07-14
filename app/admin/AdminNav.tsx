import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="flex gap-4 border-b p-4 text-sm">
      <Link href="/admin/questions">Questions</Link>
      <Link href="/admin/invites">Invites</Link>
      <Link href="/admin/results">Results</Link>
      <a href="/api/export" className="ml-auto">
        Export CSV
      </a>
    </nav>
  );
}
