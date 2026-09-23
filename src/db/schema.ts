import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Curriculum levels used across the whole platform. */
export const LEVELS = ["JCE", "MSCE"] as const;
export type Level = (typeof LEVELS)[number];

export const subjects = pgTable(
  "subjects",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    level: text("level").notNull().default("JCE"),
    emoji: text("emoji").notNull().default("📘"),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("subjects_slug_unique").on(table.slug)],
);

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    topic: text("topic").notNull().default(""),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    explanation: text("explanation").notNull().default(""),
    example: text("example").notNull().default(""),
    examTip: text("exam_tip").notNull().default(""),
    published: boolean("published").notNull().default(true),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("notes_slug_unique").on(table.slug)],
);

/** PDF bytes are stored base64 encoded so uploads survive redeploys. */
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mimeType: text("mime_type").notNull().default("application/pdf"),
  size: integer("size").notNull().default(0),
  data: text("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pastPapers = pgTable("past_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  tag: text("tag").notNull().default(""),
  notesText: text("notes_text").notNull().default(""),
  fileId: integer("file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  externalUrl: text("external_url").notNull().default(""),
  downloads: integer("downloads").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const studyTips = pgTable(
  "study_tips",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull().default("Exam Strategy"),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("study_tips_slug_unique").on(table.slug)],
);

/** Editable homepage / site copy (key-value so the admin never touches code). */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Subject = typeof subjects.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type PastPaper = typeof pastPapers.$inferSelect;
export type StudyTip = typeof studyTips.$inferSelect;
export type SettingRow = typeof settings.$inferSelect;
