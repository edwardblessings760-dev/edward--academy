import Link from "next/link";
import { SectionHeading, SubjectCard } from "@/components/ui";
import { getSettings, getSubjectStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subjects — EDWARD ACADEMY",
  description: "Every JCE and MSCE subject covered by EDWARD ACADEMY.",
};

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const params = await searchParams;
  const [subjects, settings] = await Promise.all([getSubjectStats(), getSettings()]);
  const level = params.level === "JCE" || params.level === "MSCE" ? params.level : null;

  const junior = subjects.filter((subject) => subject.level === "JCE");
  const senior = subjects.filter((subject) => subject.level === "MSCE");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading
        title="Subjects"
        subtitle="Tap any subject to see all of its notes and past papers in one place."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { href: "/subjects", label: "All levels", active: !level },
          { href: "/subjects?level=JCE", label: "Junior (JCE)", active: level === "JCE" },
          { href: "/subjects?level=MSCE", label: "Secondary (MSCE)", active: level === "MSCE" },
        ].map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              chip.active
                ? "bg-navy-800 text-white"
                : "border border-slate-200 bg-white text-navy-800 hover:bg-navy-50"
            }`}
          >
            {chip.label}
          </Link>
        ))}
      </div>

      {(!level || level === "JCE") && junior.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-navy-900">
            {settings.junior_title}
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-600">{settings.junior_text}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {junior.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      ) : null}

      {(!level || level === "MSCE") && senior.length > 0 ? (
        <section>
          <h2 className="text-xl font-extrabold text-navy-900">
            {settings.senior_title}
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-600">{settings.senior_text}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {senior.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
