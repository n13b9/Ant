"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/questions", label: "Questions" },
  { href: "/admin/invites", label: "Invites" },
  { href: "/admin/results", label: "Results" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 flex items-center gap-1 border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur">
      <span className="mr-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs text-white">
          ✦
        </span>
        Interview Portal
      </span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            pathname?.startsWith(l.href)
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          {l.label}
        </Link>
      ))}
      <a href="/api/export" className="ml-auto btn-secondary text-xs px-3 py-1.5">
        Export CSV
      </a>
    </nav>
  );
}
