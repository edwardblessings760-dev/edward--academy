import { db } from "@/db";
import { DEFAULT_SETTINGS } from "@/db/seed";
import {
  files,
  notes,
  pastPapers,
  settings,
  studyTips,
  subjects,
  type Note,
  type PastPaper,
  type StudyTip,
  type Subject,
} from "@/db/schema";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

export type NoteWithSubject = Note & { subject: Subject };
export type PaperWithSubject = PastPaper & {
  subject: Subject;
  fileName: string | null;
  fileSize: number | null;
};

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.value.trim().length > 0) map[row.key] = row.value;
  }
  return map;
}

export async function getSubjects(level?: string): Promise<Subject[]> {
  const query = db
    .select()
    .from(subjects)
    .orderBy(asc(subjects.level), asc(subjects.sortOrder), asc(subjects.name));
  const rows = await query;
  return level ? rows.filter((row) => row.level === level) : rows;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const [row] = await db.select().from(subjects).where(eq(subjects.slug, slug));
  return row ?? null;
}

type NoteFilters = {
  level?: string;
  subjectId?: number;
  q?: string;
  limit?: number;
  includeDrafts?: boolean;
};

export async function listNotes(filters: NoteFilters = {}): Promise<NoteWithSubject[]> {
  const conditions = [];
  if (!filters.includeDrafts) conditions.push(eq(notes.published, true));
  if (filters.level) conditions.push(eq(subjects.level, filters.level));
  if (filters.subjectId) conditions.push(eq(notes.subjectId, filters.subjectId));
  if (filters.q && filters.q.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(notes.title, term),
        ilike(notes.topic, term),
        ilike(notes.explanation, term),
        ilike(subjects.name, term),
      ),
    );
  }

  const rows = await db
    .select({ note: notes, subject: subjects })
    .from(notes)
    .innerJoin(subjects, eq(notes.subjectId, subjects.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(notes.createdAt))
    .limit(filters.limit ?? 200);

  return rows.map((row) => ({ ...row.note, subject: row.subject }));
}

export async function getNoteBySlug(slug: string): Promise<NoteWithSubject | null> {
  const [row] = await db
    .select({ note: notes, subject: subjects })
    .from(notes)
    .innerJoin(subjects, eq(notes.subjectId, subjects.id))
    .where(eq(notes.slug, slug));
  if (!row) return null;
  return { ...row.note, subject: row.subject };
}

export async function getNoteById(id: number): Promise<Note | null> {
  const [row] = await db.select().from(notes).where(eq(notes.id, id));
  return row ?? null;
}

type PaperFilters = {
  level?: string;
  subjectId?: number;
  year?: number;
  q?: string;
  limit?: number;
  includeDrafts?: boolean;
};

export async function listPapers(filters: PaperFilters = {}): Promise<PaperWithSubject[]> {
  const conditions = [];
  if (!filters.includeDrafts) conditions.push(eq(pastPapers.published, true));
  if (filters.level) conditions.push(eq(subjects.level, filters.level));
  if (filters.subjectId) conditions.push(eq(pastPapers.subjectId, filters.subjectId));
  if (filters.year) conditions.push(eq(pastPapers.year, filters.year));
  if (filters.q && filters.q.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(pastPapers.title, term),
        ilike(pastPapers.tag, term),
        ilike(subjects.name, term),
      ),
    );
  }

  const rows = await db
    .select({
      paper: pastPapers,
      subject: subjects,
      fileName: files.name,
      fileSize: files.size,
    })
    .from(pastPapers)
    .innerJoin(subjects, eq(pastPapers.subjectId, subjects.id))
    .leftJoin(files, eq(pastPapers.fileId, files.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(pastPapers.year), desc(pastPapers.createdAt))
    .limit(filters.limit ?? 200);

  return rows.map((row) => ({
    ...row.paper,
    subject: row.subject,
    fileName: row.fileName,
    fileSize: row.fileSize,
  }));
}

export async function getPaperById(id: number): Promise<PastPaper | null> {
  const [row] = await db.select().from(pastPapers).where(eq(pastPapers.id, id));
  return row ?? null;
}

export async function getPaperYears(): Promise<number[]> {
  const rows = await db
    .selectDistinct({ year: pastPapers.year })
    .from(pastPapers)
    .orderBy(desc(pastPapers.year));
  return rows.map((row) => row.year);
}

export async function listTips(includeDrafts = false): Promise<StudyTip[]> {
  return db
    .select()
    .from(studyTips)
    .where(includeDrafts ? undefined : eq(studyTips.published, true))
    .orderBy(desc(studyTips.createdAt));
}

export async function getTipBySlug(slug: string): Promise<StudyTip | null> {
  const [row] = await db.select().from(studyTips).where(eq(studyTips.slug, slug));
  return row ?? null;
}

export async function getTipById(id: number): Promise<StudyTip | null> {
  const [row] = await db.select().from(studyTips).where(eq(studyTips.id, id));
  return row ?? null;
}

export type SubjectStat = Subject & { noteCount: number; paperCount: number };

export async function getSubjectStats(): Promise<SubjectStat[]> {
  const all = await getSubjects();
  if (all.length === 0) return [];
  const ids = all.map((subject) => subject.id);

  const noteRows = await db
    .select({ subjectId: notes.subjectId, count: sql<number>`count(*)::int` })
    .from(notes)
    .where(and(eq(notes.published, true), inArray(notes.subjectId, ids)))
    .groupBy(notes.subjectId);

  const paperRows = await db
    .select({ subjectId: pastPapers.subjectId, count: sql<number>`count(*)::int` })
    .from(pastPapers)
    .where(and(eq(pastPapers.published, true), inArray(pastPapers.subjectId, ids)))
    .groupBy(pastPapers.subjectId);

  const noteMap = new Map(noteRows.map((row) => [row.subjectId, row.count]));
  const paperMap = new Map(paperRows.map((row) => [row.subjectId, row.count]));

  return all.map((subject) => ({
    ...subject,
    noteCount: noteMap.get(subject.id) ?? 0,
    paperCount: paperMap.get(subject.id) ?? 0,
  }));
}

export async function getCounts() {
  const [[noteRow], [paperRow], [subjectRow], [tipRow], [downloadRow]] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(notes),
    db.select({ count: sql<number>`count(*)::int` }).from(pastPapers),
    db.select({ count: sql<number>`count(*)::int` }).from(subjects),
    db.select({ count: sql<number>`count(*)::int` }).from(studyTips),
    db
      .select({ count: sql<number>`coalesce(sum(downloads), 0)::int` })
      .from(pastPapers),
  ]);
  return {
    notes: noteRow?.count ?? 0,
    papers: paperRow?.count ?? 0,
    subjects: subjectRow?.count ?? 0,
    tips: tipRow?.count ?? 0,
    downloads: downloadRow?.count ?? 0,
  };
}
