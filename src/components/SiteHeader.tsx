"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/past-papers", label: "Past Papers" },
  { href: "/subjects", label: "Subjects" },
  { href: "/study-tips", label: "Study Tips" },
];

export default function SiteHeader({
  siteName,
  adminSignedIn,
}: {
  siteName: string;
  adminSignedIn: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-sm font-black text-white">
            EA
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base leading-tight font-extrabold tracking-tight text-navy-900">
              {siteName}
            </span>
            <span className="block text-[11px] leading-tight font-medium text-leaf-600">
              Notes • Past Papers • Tips
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-navy-50 text-navy-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/search" className="ml-auto hidden lg:ml-2 lg:block">
          <label className="sr-only" htmlFor="site-search">
            Search
          </label>
          <input
            id="site-search"
            name="q"
            placeholder="Search notes…"
            className="w-44 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-navy-400 focus:bg-white"
          />
        </form>

        <Link
          href={adminSignedIn ? "/admin" : "/admin/login"}
          title="Admin"
          aria-label="Admin"
          className="ml-auto hidden rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-navy-300 hover:text-navy-700 lg:ml-1 lg:block"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="ml-auto rounded-lg border border-slate-200 p-2 text-navy-800 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-navy-100 bg-white px-4 pb-4 lg:hidden">
          <form action="/search" className="py-3">
            <input
              name="q"
              placeholder="Search notes & past papers…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:bg-white"
            />
          </form>
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-800"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={adminSignedIn ? "/admin" : "/admin/login"}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400"
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
