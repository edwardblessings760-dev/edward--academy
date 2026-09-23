import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { notes as notesTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getNoteBySlug, listNotes, listPapers } from "@/lib/data";
import { LevelBadge, NoteCard, PaperCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  return {
    title: note ? `${note.title} — EDWARD ACADEMY` : "Note not found",
    description: note?.explanation.slice(0, 150),
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note || !note.published) notFound();

  await db
    .update(notesTable)
    .set({ views: sql`${notesTable.views} + 1` })
    .where(eq(notesTable.id, note.id));

  const [related, papers] = await Promise.all([
    listNotes({ subjectId: note.subjectId, limit: 4 }),
    listPapers({ subjectId: note.subjectId, limit: 3 }),
  ]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/notes" className="font-semibold text-navy-700 hover:underline">
          Notes
        </Link>
        <span>/</span>
        <Link
          href={`/subjects/${note.subject.slug}`}
          className="font-semibold text-navy-700 hover:underline"
        >
          {note.subject.name}
        </Link>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={note.subject.level} />
          <span className="text-sm font-semibold text-slate-500">
            {note.subject.emoji} {note.subject.name}
          </span>
          {note.topic ? (
            <span className="rounded-full bg-leaf-50 px-2.5 py-0.5 text-xs font-bold text-leaf-700">
              {note.topic}
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-navy-900 sm:text-4xl">
          {note.title}
        </h1>
        <p className="mt-2 text-xs font-medium text-slate-400">
          Updated {new Date(note.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {note.views + 1} views
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xs font-black tracking-widest text-navy-500 uppercase">
          Explanation
        </h2>
        <div className="rich-text mt-3 text-[15px] text-slate-700">
          {note.explanation}
        </div>
      </section>

      {note.example ? (
        <section className="mt-5 rounded-2xl border border-navy-100 bg-navy-50 p-6">
          <h2 className="text-xs font-black tracking-widest text-navy-600 uppercase">
            Worked Example
          </h2>
          <div className="rich-text mt-3 font-mono text-[14px] text-navy-900">
            {note.example}
          </div>
        </section>
      ) : null}

      {note.examTip ? (
        <section className="mt-5 rounded-2xl border border-leaf-200 bg-leaf-50 p-6">
          <h2 className="flex items-center gap-2 text-xs font-black tracking-widest text-leaf-700 uppercase">
            <span>💡</span> Exam Tip
          </h2>
          <div className="rich-text mt-3 text-[15px] text-leaf-900">
            {note.examTip}
          </div>
        </section>
      ) : null}

      {papers.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold text-navy-900">
            Past papers for {note.subject.name}
          </h2>
          <div className="grid gap-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </section>
      ) : null}

      {related.filter((item) => item.id !== note.id).length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold text-navy-900">
            More {note.subject.name} notes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related
              .filter((item) => item.id !== note.id)
              .slice(0, 2)
              .map((item) => (
                <NoteCard key={item.id} note={item} />
              ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
