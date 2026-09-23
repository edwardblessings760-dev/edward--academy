import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl font-black text-navy-200">404</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-900">
        We could not find that page
      </h1>
      <p className="mt-2 text-slate-600">
        The note, paper or page you are looking for may have been moved or renamed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/notes"
          className="rounded-xl bg-navy-800 px-6 py-3 text-sm font-bold text-white hover:bg-navy-900"
        >
          Browse Notes
        </Link>
        <Link
          href="/past-papers"
          className="rounded-xl bg-leaf-500 px-6 py-3 text-sm font-bold text-white hover:bg-leaf-600"
        >
          View Past Papers
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
