import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete } from "@/components/admin/forms";
import { deleteNoteAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getSubjects, listNotes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage notes — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; subject?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const subjects = await getSubjects();
  const selected = subjects.find((subject) => subject.slug === params.subject);
  const notes = await listNotes({
    includeDrafts: true,
    subjectId: selected?.id,
    q: params.q,
  });

  return (
    <AdminShell
      title="Notes"
      description="Add, edit, publish or delete study notes. Students see published notes instantly."
      action={
        <Link
          href="/admin/notes/new"
          className="rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white hover:bg-navy-900"
        >
          ＋ New note
        </Link>
      }
    >
      {params.saved ? (
        <p className="mb-4 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-700">
          Saved “{params.saved}”.
        </p>
      ) : null}
      {params.deleted ? (
        <p className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          Note deleted.
        </p>
      ) : null}

      <form
        action="/admin/notes"
        className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px_auto]"
      >
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search your notes…"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400 focus:bg-white"
        />
        <select
          name="subject"
          defaultValue={params.subject ?? ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-navy-400 focus:bg-white"
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.slug}>
              {subject.level} · {subject.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {notes.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No notes yet. Click <strong>New note</strong> to create your first one.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                      {note.subject.level} · {note.subject.name}
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
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-navy-900">
                    {note.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {note.topic || "No topic"} · {note.views} views
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/notes/${note.slug}`}
                    target="_blank"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/notes/${note.id}`}
                    className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Edit
                  </Link>
                  <ConfirmDelete
                    action={deleteNoteAction}
                    id={note.id}
                    label={note.title}
                    small
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
