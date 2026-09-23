import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, LevelBadge, NoteCard, PaperCard } from "@/components/ui";
import { getSubjectBySlug, listNotes, listPapers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  return {
    title: subject
      ? `${subject.name} (${subject.level}) — EDWARD ACADEMY`
      : "Subject not found",
    description: subject?.description,
  };
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const [notes, papers] = await Promise.all([
    listNotes({ subjectId: subject.id }),
    listPapers({ subjectId: subject.id }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/subjects" className="font-semibold text-navy-700 hover:underline">
          Subjects
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-600">{subject.name}</span>
      </nav>

      <header className="mt-4 rounded-3xl bg-navy-900 p-7 text-white sm:p-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{subject.emoji}</span>
          <LevelBadge level={subject.level} />
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          {subject.name}
        </h1>
        <p className="mt-2 max-w-2xl text-navy-100">{subject.description}</p>
        <p className="mt-5 text-sm font-semibold text-leaf-300">
          {notes.length} notes · {papers.length} past papers
        </p>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-navy-900">Notes</h2>
          <Link
            href={`/notes?subject=${subject.slug}`}
            className="text-sm font-bold text-navy-700 hover:underline"
          >
            Open in notes library →
          </Link>
        </div>
        {notes.length === 0 ? (
          <EmptyState
            title="No notes yet for this subject"
            message="The academy is still preparing this material. Check another subject in the meantime."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-navy-900">Past papers</h2>
          <Link
            href={`/past-papers?subject=${subject.slug}`}
            className="text-sm font-bold text-navy-700 hover:underline"
          >
            Filter all papers →
          </Link>
        </div>
        {papers.length === 0 ? (
          <EmptyState
            title="No past papers uploaded yet"
            message="Past papers for this subject will appear here as soon as they are uploaded."
          />
        ) : (
          <div className="grid gap-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
