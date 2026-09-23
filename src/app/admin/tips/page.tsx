import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDelete } from "@/components/admin/forms";
import { deleteTipAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listTips } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage study tips — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminTipsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const tips = await listTips(true);

  return (
    <AdminShell
      title="Study tips"
      description="Blog-style articles for the Study Tips page."
      action={
        <Link
          href="/admin/tips/new"
          className="rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white hover:bg-navy-900"
        >
          ＋ New article
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
          Article deleted.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {tips.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No articles yet. Click <strong>New article</strong> to write your first tip.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tips.map((tip) => (
              <li key={tip.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
                      {tip.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        tip.published
                          ? "bg-leaf-100 text-leaf-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {tip.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-navy-900">
                    {tip.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{tip.excerpt}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/study-tips/${tip.slug}`}
                    target="_blank"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/tips/${tip.id}`}
                    className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Edit
                  </Link>
                  <ConfirmDelete action={deleteTipAction} id={tip.id} label={tip.title} small />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
