import AdminShell from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Website text — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminHomepagePage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <AdminShell
      title="Website text"
      description="Change any wording on the homepage, footer and contact details. No coding needed."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <SettingsForm values={settings} />
      </div>
    </AdminShell>
  );
}
