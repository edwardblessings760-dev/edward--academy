import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import { EmptyState, NoteCard, SectionHeading } from "@/components/ui";
import { getSubjects, listNotes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notes — EDWARD ACADEMY",
  description: "JCE and MSCE study notes organised by subject and topic.",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; level?: string; subject?: string }>;
}) {
  const params = await searchParams;
  const subjects = await getSubjects();
  const selected = subjects.find((subject) => subject.slug === params.subject);

  const notes = await listNotes({
    q: params.q,
    level: params.level === "JCE" || params.level === "MSCE" ? params.level : undefined,
    subjectId: selected?.id,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading
        title="Study Notes"
        subtitle="Simple explanations, worked examples and an exam tip on every note."
      />

      <FilterBar
        action="/notes"
        subjects={subjects}
        current={{ q: params.q, level: params.level, subject: params.subject }}
      />

      <p className="mt-6 mb-4 text-sm font-semibold text-slate-500">
        {notes.length} {notes.length === 1 ? "note" : "notes"} found
        {selected ? ` in ${selected.name} (${selected.level})` : ""}
      </p>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes match your search"
          message="Try a different subject or clear the filters to see everything available."
          action={
            <Link
              href="/notes"
              className="inline-block rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white"
            >
              Clear filters
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
