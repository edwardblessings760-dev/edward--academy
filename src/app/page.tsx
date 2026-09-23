import Link from "next/link";
import {
  getCounts,
  getSettings,
  getSubjectStats,
  listNotes,
  listPapers,
  listTips,
} from "@/lib/data";
import {
  EmptyState,
  NoteCard,
  PaperCard,
  SectionHeading,
  SubjectCard,
  TipCard,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, subjectStats, notes, papers, tips, counts] = await Promise.all([
    getSettings(),
    getSubjectStats(),
    listNotes({ limit: 6 }),
    listPapers({ limit: 4 }),
    listTips(),
    getCounts(),
  ]);

  const junior = subjectStats.filter((subject) => subject.level === "JCE");
  const senior = subjectStats.filter((subject) => subject.level === "MSCE");
  const popular = [...subjectStats]
    .sort(
      (a, b) =>
        b.noteCount + b.paperCount - (a.noteCount + a.paperCount) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-leaf-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-navy-500/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide uppercase">
            <span className="h-2 w-2 rounded-full bg-leaf-400" />
            JCE &amp; MSCE · Malawi
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-black tracking-tight sm:text-6xl">
            {settings.hero_title}
          </h1>
          <p className="mt-4 text-xl font-semibold text-leaf-300 sm:text-2xl">
            {settings.hero_subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100">
            {settings.hero_blurb}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/notes"
              className="rounded-xl bg-leaf-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-leaf-900/20 transition hover:bg-leaf-600"
            >
              {settings.hero_cta_primary}
            </Link>
            <Link
              href="/past-papers"
              className="rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-navy-900"
            >
              {settings.hero_cta_secondary}
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Subjects", counts.subjects],
              ["Notes", counts.notes],
              ["Past papers", counts.papers],
              ["Downloads", counts.downloads],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <dt className="text-xs font-semibold tracking-wide text-navy-200 uppercase">
                  {label}
                </dt>
                <dd className="text-2xl font-black text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Junior level */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title={settings.junior_title}
          subtitle={settings.junior_text}
          action={
            <Link
              href="/subjects?level=JCE"
              className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-800 hover:bg-navy-50"
            >
              All JCE subjects
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {junior.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* Secondary level */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title={settings.senior_title}
            subtitle={settings.senior_text}
            action={
              <Link
                href="/subjects?level=MSCE"
                className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-bold text-navy-800 hover:bg-navy-50"
              >
                All MSCE subjects
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {senior.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular subjects */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title={settings.popular_title}
          subtitle="The subjects students open most on EDWARD ACADEMY right now."
        />
        <div className="flex flex-wrap gap-2.5">
          {popular.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.slug}`}
              className="card-hover rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy-800"
            >
              {subject.emoji} {subject.name}
              <span className="ml-2 text-xs font-semibold text-leaf-600">
                {subject.level}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest uploads */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <SectionHeading
          title={settings.latest_title}
          subtitle="Fresh notes and past papers added by the academy."
          action={
            <Link
              href="/notes"
              className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-800 hover:bg-navy-50"
            >
              See all notes
            </Link>
          }
        />
        {notes.length === 0 ? (
          <EmptyState
            title="No notes published yet"
            message="Sign in to the admin panel and publish your first note — it will appear here instantly."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

        {papers.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : null}
      </section>

      {/* Study tips */}
      <section className="bg-navy-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title={settings.tips_title}
            subtitle={settings.tips_text}
            action={
              <Link
                href="/study-tips"
                className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-bold text-navy-800 hover:bg-navy-50"
              >
                All study tips
              </Link>
            }
          />
          {tips.length === 0 ? (
            <EmptyState
              title="No study tips yet"
              message="Add your first article from the admin panel."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tips.slice(0, 3).map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
