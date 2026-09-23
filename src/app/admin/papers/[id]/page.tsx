import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete, PaperForm } from "@/components/admin/forms";
import { deletePaperAction } from "@/app/admin/actions";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getPaperById, getSubjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit past paper — EDWARD ACADEMY", robots: "noindex" };

export default async function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const paperId = Number(id);
  if (!Number.isInteger(paperId)) notFound();

  const [paper, subjects] = await Promise.all([getPaperById(paperId), getSubjects()]);
  if (!paper) notFound();

  let fileName: string | null = null;
  if (paper.fileId) {
    const [file] = await db
      .select({ name: files.name })
      .from(files)
      .where(eq(files.id, paper.fileId));
    fileName = file?.name ?? null;
  }

  return (
    <AdminShell
      title="Edit past paper"
      description={`${paper.downloads} downloads so far`}
      action={
        <div className="flex items-center gap-2">
          <a
            href={`/api/papers/${paper.id}/download`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Open PDF
          </a>
          <ConfirmDelete action={deletePaperAction} id={paper.id} label={paper.title} />
        </div>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PaperForm subjects={subjects} paper={paper} currentFileName={fileName} />
      </div>
    </AdminShell>
  );
}
