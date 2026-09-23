import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/forms";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin sign in — EDWARD ACADEMY", robots: "noindex" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const usingDefaultPassword = !process.env.ADMIN_PASSWORD?.trim();

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-lg font-black text-white">
            EA
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-navy-900">
            Admin sign in
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Private area for the EDWARD ACADEMY content manager.
          </p>
        </div>

        <LoginForm />

        {usingDefaultPassword ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
            <strong>First time here?</strong> The starter password is{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-bold">edward2026</code>.
            Set an <code>ADMIN_PASSWORD</code> environment variable to change it.
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-bold text-navy-700 hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
