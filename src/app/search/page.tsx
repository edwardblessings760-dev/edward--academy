import Link from "next/link";
import { EmptyState, NoteCard, PaperCard, SectionHeading, TipCard } from "@/components/ui";
import { listNotes, listPapers, listTips } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search — EDWARD ACADEMY" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  const [notes, papers, tips] = term
    ? await Promise.all([
        listNotes({ q: term, limit: 30 }),
        listPapers({ q: term, limit: 30 }),
        listTips(),
      ])
    : [[], [], []];

  const matchedTips = term
    ? tips.filter((tip) =>
        `${tip.title} ${tip.excerpt} ${tip.content} ${tip.category}`
          .toLowerCase()
          .includes(term.toLowerCase()),
      )
    : [];

  const total = notes.length + papers.length + matchedTips.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading
        title="Search"
        subtitle="Find notes, past papers and study tips across the whole academy."
      />

      <form action="/search" className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={term}
          autoFocus
          placeholder="e.g. photosynthesis, map work, MSCE geography 2022"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-navy-400 focus:bg-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-navy-800 px-6 py-3 text-sm font-bold text-white hover:bg-navy-900"
        >
          Search
        </button>
      </form>

      {term ? (
        <p className="mt-6 text-sm font-semibold text-slate-500">
          {total} {total === 1 ? "result" : "results"} for “{term}”
        </p>
      ) : null}

      {term && total === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing found"
            message="Try a shorter keyword, or browse by subject instead."
            action={
              <Link
                href="/subjects"
                className="inline-block rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white"
              >
                Browse subjects
              </Link>
            }
          />
        </div>
      ) : null}

      {notes.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-extrabold text-navy-900">Notes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      ) : null}

      {papers.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-navy-900">Past papers</h2>
          <div className="grid gap-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </section>
      ) : null}

      {matchedTips.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-navy-900">Study tips</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
