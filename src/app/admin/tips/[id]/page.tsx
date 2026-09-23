import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete, TipForm } from "@/components/admin/forms";
import { deleteTipAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getTipById } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit study tip — EDWARD ACADEMY", robots: "noindex" };

export default async function EditTipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const tipId = Number(id);
  if (!Number.isInteger(tipId)) notFound();

  const tip = await getTipById(tipId);
  if (!tip) notFound();

  return (
    <AdminShell
      title="Edit study tip"
      description={`Last updated ${new Date(tip.updatedAt).toLocaleString("en-GB")}`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/study-tips/${tip.slug}`}
            target="_blank"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            View live
          </Link>
          <ConfirmDelete action={deleteTipAction} id={tip.id} label={tip.title} />
        </div>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <TipForm tip={tip} />
      </div>
    </AdminShell>
  );
}
