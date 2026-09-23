"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  files,
  notes,
  pastPapers,
  settings,
  studyTips,
  subjects,
} from "@/db/schema";
import {
  endAdminSession,
  requireAdmin,
  startAdminSession,
  verifyPassword,
} from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export type ActionState = { error?: string; message?: string };

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function refresh() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ auth */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = text(formData, "password");
  if (!password) return { error: "Enter your admin password." };
  if (!verifyPassword(password)) return { error: "Incorrect password. Try again." };
  await startAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/");
}

/* -------------------------------------------------------------- subjects */

export async function saveSubjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  const name = text(formData, "name");
  const level = text(formData, "level") === "MSCE" ? "MSCE" : "JCE";
  const emoji = text(formData, "emoji") || "📘";
  const description = text(formData, "description");
  const sortOrder = Number(text(formData, "sortOrder")) || 0;

  if (!name) return { error: "Subject name is required." };

  const existing = await db.select({ slug: subjects.slug, id: subjects.id }).from(subjects);

  if (id) {
    const taken = existing.filter((row) => row.id !== id).map((row) => row.slug);
    await db
      .update(subjects)
      .set({
        name,
        level,
        emoji,
        description,
        sortOrder,
        slug: uniqueSlug(`${level}-${name}`, taken, "subject"),
      })
      .where(eq(subjects.id, id));
    refresh();
    return { message: `Updated ${name}.` };
  }

  await db.insert(subjects).values({
    name,
    level,
    emoji,
    description,
    sortOrder,
    slug: uniqueSlug(`${level}-${name}`, existing.map((row) => row.slug), "subject"),
  });
  refresh();
  return { message: `Added ${name} (${level}).` };
}

export async function deleteSubjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  if (id) await db.delete(subjects).where(eq(subjects.id, id));
  refresh();
  redirect("/admin/subjects");
}

/* ----------------------------------------------------------------- notes */

export async function saveNoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  const title = text(formData, "title");
  const subjectId = Number(text(formData, "subjectId")) || 0;
  const topic = text(formData, "topic");
  const explanation = text(formData, "explanation");
  const example = text(formData, "example");
  const examTip = text(formData, "examTip");
  const published = formData.get("published") === "on";

  if (!title) return { error: "Note title is required." };
  if (!subjectId) return { error: "Choose a subject for this note." };
  if (!explanation) return { error: "The explanation cannot be empty." };

  const existing = await db.select({ id: notes.id, slug: notes.slug }).from(notes);
  const taken = existing.filter((row) => row.id !== id).map((row) => row.slug);
  const slug = uniqueSlug(title, taken, "note");

  if (id) {
    await db
      .update(notes)
      .set({
        title,
        slug,
        topic,
        subjectId,
        explanation,
        example,
        examTip,
        published,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id));
  } else {
    await db.insert(notes).values({
      title,
      slug,
      topic,
      subjectId,
      explanation,
      example,
      examTip,
      published,
    });
  }

  refresh();
  redirect(`/admin/notes?saved=${encodeURIComponent(title)}`);
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  if (id) await db.delete(notes).where(eq(notes.id, id));
  refresh();
  redirect("/admin/notes?deleted=1");
}

/* ----------------------------------------------------------- past papers */

export async function savePaperAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  const title = text(formData, "title");
  const subjectId = Number(text(formData, "subjectId")) || 0;
  const year = Number(text(formData, "year")) || 0;
  const tag = text(formData, "tag");
  const notesText = text(formData, "notesText");
  const externalUrl = text(formData, "externalUrl");
  const published = formData.get("published") === "on";

  if (!title) return { error: "Paper title is required (e.g. MSCE Geography 2022)." };
  if (!subjectId) return { error: "Choose the subject for this paper." };
  if (year < 1960 || year > 2100) return { error: "Enter a valid year, e.g. 2022." };

  const upload = formData.get("file");
  let newFileId: number | null = null;

  if (upload instanceof File && upload.size > 0) {
    const isPdf =
      upload.type === "application/pdf" || upload.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return { error: "Only PDF files can be uploaded." };
    if (upload.size > MAX_UPLOAD_BYTES) {
      return { error: "That PDF is larger than 20 MB. Please compress it first." };
    }
    const buffer = Buffer.from(await upload.arrayBuffer());
    const [created] = await db
      .insert(files)
      .values({
        name: upload.name || `${title}.pdf`,
        mimeType: "application/pdf",
        size: buffer.byteLength,
        data: buffer.toString("base64"),
      })
      .returning({ id: files.id });
    newFileId = created.id;
  }

  if (id) {
    const [current] = await db.select().from(pastPapers).where(eq(pastPapers.id, id));
    if (!current) return { error: "That paper no longer exists." };

    await db
      .update(pastPapers)
      .set({
        title,
        subjectId,
        year,
        tag,
        notesText,
        externalUrl,
        published,
        fileId: newFileId ?? current.fileId,
        updatedAt: new Date(),
      })
      .where(eq(pastPapers.id, id));

    if (newFileId && current.fileId) {
      await db.delete(files).where(eq(files.id, current.fileId));
    }
  } else {
    if (!newFileId && !externalUrl) {
      return { error: "Attach a PDF file or paste a download link." };
    }
    await db.insert(pastPapers).values({
      title,
      subjectId,
      year,
      tag,
      notesText,
      externalUrl,
      published,
      fileId: newFileId,
    });
  }

  refresh();
  redirect(`/admin/papers?saved=${encodeURIComponent(title)}`);
}

export async function deletePaperAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  if (id) {
    const [current] = await db.select().from(pastPapers).where(eq(pastPapers.id, id));
    await db.delete(pastPapers).where(eq(pastPapers.id, id));
    if (current?.fileId) await db.delete(files).where(eq(files.id, current.fileId));
  }
  refresh();
  redirect("/admin/papers?deleted=1");
}

/* ----------------------------------------------------------- study tips */

export async function saveTipAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  const title = text(formData, "title");
  const category = text(formData, "category") || "Exam Strategy";
  const excerpt = text(formData, "excerpt");
  const content = text(formData, "content");
  const published = formData.get("published") === "on";

  if (!title) return { error: "Article title is required." };
  if (!content) return { error: "The article body cannot be empty." };

  const existing = await db
    .select({ id: studyTips.id, slug: studyTips.slug })
    .from(studyTips);
  const taken = existing.filter((row) => row.id !== id).map((row) => row.slug);
  const slug = uniqueSlug(title, taken, "article");

  if (id) {
    await db
      .update(studyTips)
      .set({ title, slug, category, excerpt, content, published, updatedAt: new Date() })
      .where(eq(studyTips.id, id));
  } else {
    await db
      .insert(studyTips)
      .values({ title, slug, category, excerpt, content, published });
  }

  refresh();
  redirect(`/admin/tips?saved=${encodeURIComponent(title)}`);
}

export async function deleteTipAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(text(formData, "id")) || 0;
  if (id) await db.delete(studyTips).where(eq(studyTips.id, id));
  refresh();
  redirect("/admin/tips?deleted=1");
}

/* -------------------------------------------------------------- settings */

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const entries: Array<{ key: string; value: string }> = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (!/^[a-z0-9_]+$/.test(key)) continue;
    entries.push({ key, value: value.trim() });
  }
  if (entries.length === 0) return { error: "Nothing to save." };

  for (const entry of entries) {
    await db
      .insert(settings)
      .values({ key: entry.key, value: entry.value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: entry.value, updatedAt: new Date() },
      });
  }

  refresh();
  return { message: "Website text updated. Refresh the homepage to see it live." };
}

/* --------------------------------------------------------- bulk helpers */

export async function togglePublishAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const kind = text(formData, "kind");
  const id = Number(text(formData, "id")) || 0;
  const next = text(formData, "next") === "true";
  if (!id) return;

  if (kind === "note") {
    await db.update(notes).set({ published: next }).where(eq(notes.id, id));
  } else if (kind === "paper") {
    await db.update(pastPapers).set({ published: next }).where(eq(pastPapers.id, id));
  } else if (kind === "tip") {
    await db.update(studyTips).set({ published: next }).where(eq(studyTips.id, id));
  }
  refresh();
}


