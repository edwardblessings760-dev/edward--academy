import type { Subject } from "@/db/schema";

export default function FilterBar({
  action,
  subjects,
  years,
  current,
  searchPlaceholder = "Search by title or topic…",
}: {
  action: string;
  subjects: Subject[];
  years?: number[];
  current: { q?: string; level?: string; subject?: string; year?: string };
  searchPlaceholder?: string;
}) {
  const visibleSubjects = current.level
    ? subjects.filter((subject) => subject.level === current.level)
    : subjects;

  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]"
    >
      <input
        type="search"
        name="q"
        defaultValue={current.q ?? ""}
        placeholder={searchPlaceholder}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-navy-400 focus:bg-white"
      />

      <select
        name="level"
        defaultValue={current.level ?? ""}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-navy-400 focus:bg-white"
      >
        <option value="">All levels</option>
        <option value="JCE">Junior (JCE)</option>
        <option value="MSCE">Secondary (MSCE)</option>
      </select>

      <select
        name="subject"
        defaultValue={current.subject ?? ""}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-navy-400 focus:bg-white"
      >
        <option value="">All subjects</option>
        {visibleSubjects.map((subject) => (
          <option key={subject.id} value={subject.slug}>
            {subject.name} ({subject.level})
          </option>
        ))}
      </select>

      {years ? (
        <select
          name="year"
          defaultValue={current.year ?? ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-navy-400 focus:bg-white"
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>
      ) : null}

      <button
        type="submit"
        className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900"
      >
        Apply
      </button>
    </form>
  );
}
