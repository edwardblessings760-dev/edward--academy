import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete, NoteForm } from "@/components/admin/forms";
import { deleteNoteAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getNoteById, getSubjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit note — EDWARD ACADEMY", robots: "noindex" };

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const noteId = Number(id);
  if (!Number.isInteger(noteId)) notFound();

  const [note, subjects] = await Promise.all([getNoteById(noteId), getSubjects()]);
  if (!note) notFound();

  return (
    <AdminShell
      title="Edit note"
      description={`Last updated ${new Date(note.updatedAt).toLocaleString("en-GB")}`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/notes/${note.slug}`}
            target="_blank"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            View live
          </Link>
          <ConfirmDelete action={deleteNoteAction} id={note.id} label={note.title} />
        </div>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <NoteForm subjects={subjects} note={note} />
      </div>
    </AdminShell>
  );
}
