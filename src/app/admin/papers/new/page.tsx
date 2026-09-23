import AdminShell from "@/components/admin/AdminShell";
import { PaperForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { getSubjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Upload past paper — EDWARD ACADEMY", robots: "noindex" };

export default async function NewPaperPage() {
  await requireAdmin();
  const subjects = await getSubjects();

  return (
    <AdminShell
      title="Upload past paper"
      description="Attach a PDF (up to 20 MB) or paste a link, then choose the subject, year and tag."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PaperForm subjects={subjects} />
      </div>
    </AdminShell>
  );
}
