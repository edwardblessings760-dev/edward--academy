import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete, SubjectForm } from "@/components/admin/forms";
import { deleteSubjectAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getSubjectStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage subjects — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminSubjectsPage() {
  await requireAdmin();
  const subjects = await getSubjectStats();
  const groups = [
    { level: "JCE", label: "Junior Level (JCE)" },
    { level: "MSCE", label: "Secondary Level (MSCE)" },
  ];

  return (
    <AdminShell
      title="Subjects"
      description="Add a new subject, rename one, change its icon or reorder it. Each subject gets its own page automatically."
    >
      <div className="rounded-2xl border border-navy-200 bg-navy-50 p-6">
        <h2 className="mb-4 text-base font-extrabold text-navy-900">Add a new subject</h2>
        <SubjectForm />
      </div>

      {groups.map((group) => {
        const rows = subjects.filter((subject) => subject.level === group.level);
        return (
          <section key={group.level} className="mt-8">
            <h2 className="mb-3 text-lg font-extrabold text-navy-900">
              {group.label}{" "}
              <span className="text-sm font-semibold text-slate-500">
                ({rows.length})
              </span>
            </h2>
            <div className="grid gap-3">
              {rows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No subjects in this level yet.
                </p>
              ) : (
                rows.map((subject) => (
                  <details
                    key={subject.id}
                    className="group rounded-2xl border border-slate-200 bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                      <span className="text-2xl">{subject.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-navy-900">
                          {subject.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {subject.noteCount} notes · {subject.paperCount} papers ·
                          order {subject.sortOrder}
                        </span>
                      </span>
                      <Link
                        href={`/subjects/${subject.slug}`}
                        target="_blank"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        View
                      </Link>
                      <span className="rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-700 group-open:bg-navy-800 group-open:text-white">
                        Edit
                      </span>
                    </summary>
                    <div className="border-t border-slate-100 p-4">
                      <SubjectForm subject={subject} />
                      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 p-3">
                        <p className="text-xs font-semibold text-red-700">
                          Deleting a subject also deletes its {subject.noteCount} notes
                          and {subject.paperCount} papers.
                        </p>
                        <ConfirmDelete
                          action={deleteSubjectAction}
                          id={subject.id}
                          label={subject.name}
                          small
                        />
                      </div>
                    </div>
                  </details>
                ))
              )}
            </div>
          </section>
        );
      })}
    </AdminShell>
  );
}
