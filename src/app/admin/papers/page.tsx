import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete } from "@/components/admin/forms";
import { deletePaperAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getPaperYears, getSubjects, listPapers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage past papers — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminPapersPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    subject?: string;
    year?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const [subjects, years] = await Promise.all([getSubjects(), getPaperYears()]);
  const selected = subjects.find((subject) => subject.slug === params.subject);
  const year = params.year ? Number(params.year) : undefined;

  const papers = await listPapers({
    includeDrafts: true,
    subjectId: selected?.id,
    year: Number.isFinite(year) ? year : undefined,
  });

  return (
    <AdminShell
      title="Past papers"
      description="Upload PDFs, tag them and organise by subject and year."
      action={
        <Link
          href="/admin/papers/new"
          className="rounded-xl bg-leaf-500 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-600"
        >
          ⬆ Upload paper
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
          Past paper deleted.
        </p>
      ) : null}

      <form
        action="/admin/papers"
        className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_160px_auto]"
      >
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
        <select
          name="year"
          defaultValue={params.year ?? ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-navy-400 focus:bg-white"
        >
          <option value="">All years</option>
          {years.map((value) => (
            <option key={value} value={String(value)}>
              {value}
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
        {papers.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No past papers yet. Click <strong>Upload paper</strong> to add the first PDF.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {papers.map((paper) => (
              <li
                key={paper.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                      {paper.subject.level} · {paper.subject.name} · {paper.year}
                    </span>
                    {paper.tag ? (
                      <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
                        {paper.tag}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        paper.published
                          ? "bg-leaf-100 text-leaf-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {paper.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-navy-900">
                    {paper.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {paper.fileName ?? (paper.externalUrl || "No file")} ·{" "}
                    {paper.downloads} downloads
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={`/api/papers/${paper.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Open PDF
                  </a>
                  <Link
                    href={`/admin/papers/${paper.id}`}
                    className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Edit
                  </Link>
                  <ConfirmDelete
                    action={deletePaperAction}
                    id={paper.id}
                    label={paper.title}
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
