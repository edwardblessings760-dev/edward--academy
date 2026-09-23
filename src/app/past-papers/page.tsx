import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import { EmptyState, PaperCard, SectionHeading } from "@/components/ui";
import { getPaperYears, getSubjects, listPapers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Past Papers — EDWARD ACADEMY",
  description: "Download JCE and MSCE past papers by subject and year.",
};

export default async function PastPapersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    level?: string;
    subject?: string;
    year?: string;
  }>;
}) {
  const params = await searchParams;
  const [subjects, years] = await Promise.all([getSubjects(), getPaperYears()]);
  const selected = subjects.find((subject) => subject.slug === params.subject);
  const year = params.year ? Number(params.year) : undefined;

  const papers = await listPapers({
    q: params.q,
    level: params.level === "JCE" || params.level === "MSCE" ? params.level : undefined,
    subjectId: selected?.id,
    year: Number.isFinite(year) ? year : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading
        title="Past Papers"
        subtitle="Filter by subject and year, then download the PDF. Papers marked “With Answers” include a marking guide."
      />

      <FilterBar
        action="/past-papers"
        subjects={subjects}
        years={years}
        current={{
          q: params.q,
          level: params.level,
          subject: params.subject,
          year: params.year,
        }}
        searchPlaceholder="Search past papers…"
      />

      <p className="mt-6 mb-4 text-sm font-semibold text-slate-500">
        {papers.length} {papers.length === 1 ? "paper" : "papers"} available
      </p>

      {papers.length === 0 ? (
        <EmptyState
          title="No past papers match your filters"
          message="Clear the filters or check back soon — new papers are uploaded regularly."
          action={
            <Link
              href="/past-papers"
              className="inline-block rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white"
            >
              Clear filters
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}
