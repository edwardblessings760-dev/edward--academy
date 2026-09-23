import AdminShell from "@/components/admin/AdminShell";
import { TipForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "New study tip — EDWARD ACADEMY", robots: "noindex" };

export default async function NewTipPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="New study tip"
      description="Write a short, practical article. Press Enter twice to start a new paragraph."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TipForm />
      </div>
    </AdminShell>
  );
}
