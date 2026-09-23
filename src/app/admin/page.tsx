import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getCounts, listNotes, listPapers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin dashboard — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminDashboard() {
  await requireAdmin();
  const [counts, notes, papers] = await Promise.all([
    getCounts(),
    listNotes({ includeDrafts: true, limit: 5 }),
    listPapers({ includeDrafts: true, limit: 5 }),
  ]);

  const stats = [
    { label: "Notes", value: counts.notes, href: "/admin/notes" },
    { label: "Past papers", value: counts.papers, href: "/admin/papers" },
    { label: "Subjects", value: counts.subjects, href: "/admin/subjects" },
    { label: "Study tips", value: counts.tips, href: "/admin/tips" },
    { label: "Downloads", value: counts.downloads, href: "/admin/papers" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Everything on the website is managed from here — no coding required."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-hover rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-black text-navy-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/notes/new"
          className="rounded-2xl bg-navy-800 p-5 text-white transition hover:bg-navy-900"
        >
          <p className="text-lg font-black">＋ Add a note</p>
          <p className="mt-1 text-sm text-navy-100">
            Title, topic, explanation, example and exam tip.
          </p>
        </Link>
        <Link
          href="/admin/papers/new"
          className="rounded-2xl bg-leaf-500 p-5 text-white transition hover:bg-leaf-600"
        >
          <p className="text-lg font-black">⬆ Upload a past paper</p>
          <p className="mt-1 text-sm text-leaf-50">
            Attach a PDF, pick the subject and year.
          </p>
        </Link>
        <Link
          href="/admin/tips/new"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-navy-300"
        >
          <p className="text-lg font-black text-navy-900">✎ Write a study tip</p>
          <p className="mt-1 text-sm text-slate-600">
            Blog-style article for the Study Tips page.
          </p>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-navy-900">Recent notes</h2>
            <Link href="/admin/notes" className="text-sm font-bold text-navy-700">
              Manage →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {notes.length === 0 ? (
              <li className="py-3 text-sm text-slate-500">No notes yet.</li>
            ) : (
              notes.map((note) => (
                <li key={note.id} className="flex items-center gap-3 py-3">
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/admin/notes/${note.id}`}
                      className="block truncate text-sm font-bold text-navy-900 hover:underline"
                    >
                      {note.title}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {note.subject.level} · {note.subject.name}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      note.published
                        ? "bg-leaf-100 text-leaf-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {note.published ? "Live" : "Draft"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-navy-900">Recent papers</h2>
            <Link href="/admin/papers" className="text-sm font-bold text-navy-700">
              Manage →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {papers.length === 0 ? (
              <li className="py-3 text-sm text-slate-500">No past papers yet.</li>
            ) : (
              papers.map((paper) => (
                <li key={paper.id} className="flex items-center gap-3 py-3">
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/admin/papers/${paper.id}`}
                      className="block truncate text-sm font-bold text-navy-900 hover:underline"
                    >
                      {paper.title}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {paper.subject.name} · {paper.year} · {paper.downloads} downloads
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      paper.published
                        ? "bg-leaf-100 text-leaf-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {paper.published ? "Live" : "Draft"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50 p-6">
        <h2 className="text-base font-extrabold text-navy-900">
          How to run the website (3 steps)
        </h2>
        <ol className="mt-3 grid gap-2 text-sm text-navy-900/80">
          <li>
            <strong>1.</strong> Add or edit subjects under <em>Subjects</em> — every
            subject automatically gets its own page.
          </li>
          <li>
            <strong>2.</strong> Publish notes and upload past paper PDFs. They appear on
            the website immediately.
          </li>
          <li>
            <strong>3.</strong> Change any homepage wording under <em>Website Text</em>.
            Nothing here needs coding.
          </li>
        </ol>
      </div>
    </AdminShell>
  );
}
