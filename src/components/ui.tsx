import Link from "next/link";
import type { ReactNode } from "react";
import type { NoteWithSubject, PaperWithSubject, SubjectStat } from "@/lib/data";
import type { StudyTip, Subject } from "@/db/schema";

export function LevelBadge({ level }: { level: string }) {
  const isJunior = level === "JCE";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
        isJunior
          ? "bg-leaf-100 text-leaf-700"
          : "bg-navy-100 text-navy-800"
      }`}
    >
      {isJunior ? "JCE" : "MSCE"}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function SubjectCard({ subject }: { subject: SubjectStat | Subject }) {
  const stats = "noteCount" in subject ? subject : null;
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="card-hover flex flex-col rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{subject.emoji}</span>
        <LevelBadge level={subject.level} />
      </div>
      <h3 className="mt-3 text-base font-bold text-navy-900">{subject.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
        {subject.description}
      </p>
      {stats ? (
        <p className="mt-3 text-xs font-semibold text-leaf-600">
          {stats.noteCount} notes · {stats.paperCount} papers
        </p>
      ) : null}
    </Link>
  );
}

export function NoteCard({ note }: { note: NoteWithSubject }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="card-hover flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <LevelBadge level={note.subject.level} />
        <span className="text-xs font-semibold text-slate-500">
          {note.subject.emoji} {note.subject.name}
        </span>
      </div>
      <h3 className="mt-3 text-base leading-snug font-bold text-navy-900">
        {note.title}
      </h3>
      {note.topic ? (
        <p className="mt-1 text-xs font-medium text-leaf-600">{note.topic}</p>
      ) : null}
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {note.explanation}
      </p>
      <span className="mt-4 text-sm font-bold text-navy-700">Read note →</span>
    </Link>
  );
}

export function PaperCard({ paper }: { paper: PaperWithSubject }) {
  const hasFile = Boolean(paper.fileId) || paper.externalUrl.length > 0;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={paper.subject.level} />
          <span className="text-xs font-semibold text-slate-500">
            {paper.subject.name} · {paper.year}
          </span>
          {paper.tag ? (
            <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
              {paper.tag}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 truncate text-base font-bold text-navy-900">
          {paper.title}
        </h3>
        <p className="text-xs text-slate-500">
          {paper.fileName ?? (paper.externalUrl ? "External link" : "No file attached")}
          {paper.fileSize ? ` · ${Math.max(1, Math.round(paper.fileSize / 1024))} KB` : ""}
          {` · ${paper.downloads} downloads`}
        </p>
      </div>
      {hasFile ? (
        <a
          href={`/api/papers/${paper.id}/download`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
          </svg>
          Download
        </a>
      ) : (
        <span className="shrink-0 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400">
          Coming soon
        </span>
      )}
    </div>
  );
}

export function TipCard({ tip }: { tip: StudyTip }) {
  return (
    <Link
      href={`/study-tips/${tip.slug}`}
      className="card-hover flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5"
    >
      <span className="w-fit rounded-full bg-leaf-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-leaf-700 uppercase">
        {tip.category}
      </span>
      <h3 className="mt-3 text-base leading-snug font-bold text-navy-900">
        {tip.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {tip.excerpt}
      </p>
      <span className="mt-4 text-sm font-bold text-navy-700">Read article →</span>
    </Link>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <p className="text-base font-bold text-navy-900">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
