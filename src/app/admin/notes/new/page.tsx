import AdminShell from "@/components/admin/AdminShell";
import { NoteForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { getSubjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "New note — EDWARD ACADEMY", robots: "noindex" };

export default async function NewNotePage() {
  await requireAdmin();
  const subjects = await getSubjects();

  return (
    <AdminShell
      title="New note"
      description="Fill in the boxes and press publish. You can edit or unpublish it later."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <NoteForm subjects={subjects} />
      </div>
    </AdminShell>
  );
}
