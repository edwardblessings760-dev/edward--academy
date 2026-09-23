"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/notes", label: "Notes", icon: "📝" },
  { href: "/admin/papers", label: "Past Papers", icon: "📄" },
  { href: "/admin/subjects", label: "Subjects", icon: "📚" },
  { href: "/admin/tips", label: "Study Tips", icon: "💡" },
  { href: "/admin/homepage", label: "Website Text", icon: "🎨" },
];

export default function AdminShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[230px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="px-2 pt-1 pb-2 text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Admin panel
          </p>
          <nav className="grid gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  isActive(link.href)
                    ? "bg-navy-800 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-navy-800"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              <span>🌍</span> View website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <span>🚪</span> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-navy-900 sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
        {children}
      </section>
    </div>
  );
}
