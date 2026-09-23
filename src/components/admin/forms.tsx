"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { Note, PastPaper, StudyTip, Subject } from "@/db/schema";
import {
  loginAction,
  saveNoteAction,
  savePaperAction,
  saveSettingsAction,
  saveSubjectAction,
  saveTipAction,
  type ActionState,
} from "@/app/admin/actions";

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-navy-400 focus:bg-white";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy-900">{label}</span>
      {hint ? <span className="mb-1.5 block text-xs text-slate-500">{hint}</span> : null}
      {children}
    </label>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-navy-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function Alert({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p className="rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-700">
        {state.message}
      </p>
    );
  }
  return null;
}

export function ConfirmDelete({
  action,
  id,
  label,
  small,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: number;
  label: string;
  small?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete “${label}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={
          small
            ? "rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
            : "rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
        }
      >
        Delete
      </button>
    </form>
  );
}

function PublishToggle({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        name="published"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#1faf65]"
      />
      <span className="text-sm font-bold text-navy-900">
        Published (visible to students)
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ note */

export function NoteForm({
  subjects,
  note,
}: {
  subjects: Subject[];
  note?: Note | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveNoteAction, {});

  return (
    <form action={formAction} className="grid gap-5">
      <Alert state={state} />
      {note ? <input type="hidden" name="id" value={note.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Note title">
          <input
            name="title"
            required
            defaultValue={note?.title ?? ""}
            placeholder="e.g. Photosynthesis"
            className={INPUT}
          />
        </Field>
        <Field label="Topic" hint="Short label shown under the title.">
          <input
            name="topic"
            defaultValue={note?.topic ?? ""}
            placeholder="e.g. Plant Nutrition"
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Subject">
        <select
          name="subjectId"
          required
          defaultValue={note?.subjectId ? String(note.subjectId) : ""}
          className={INPUT}
        >
          <option value="">— choose a subject —</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.level} · {subject.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Explanation" hint="Write in simple language. Press Enter for new lines.">
        <textarea
          name="explanation"
          required
          rows={12}
          defaultValue={note?.explanation ?? ""}
          placeholder="Explain the topic step by step…"
          className={`${INPUT} font-normal`}
        />
      </Field>

      <Field label="Example" hint="A worked example or sample question with the answer.">
        <textarea
          name="example"
          rows={8}
          defaultValue={note?.example ?? ""}
          className={INPUT}
        />
      </Field>

      <Field label="Exam tip" hint="One or two sentences students should remember.">
        <textarea
          name="examTip"
          rows={4}
          defaultValue={note?.examTip ?? ""}
          className={INPUT}
        />
      </Field>

      <PublishToggle defaultChecked={note ? note.published : true} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{note ? "Save changes" : "Publish note"}</SubmitButton>
        <Link
          href="/admin/notes"
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

/* ----------------------------------------------------------------- paper */

export function PaperForm({
  subjects,
  paper,
  currentFileName,
}: {
  subjects: Subject[];
  paper?: PastPaper | null;
  currentFileName?: string | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(savePaperAction, {});
  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} className="grid gap-5">
      <Alert state={state} />
      {paper ? <input type="hidden" name="id" value={paper.id} /> : null}

      <Field label="Paper title" hint="Students see this exactly as typed.">
        <input
          name="title"
          required
          defaultValue={paper?.title ?? ""}
          placeholder="e.g. MSCE Geography 2022"
          className={INPUT}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Subject">
          <select
            name="subjectId"
            required
            defaultValue={paper?.subjectId ? String(paper.subjectId) : ""}
            className={INPUT}
          >
            <option value="">— choose —</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.level} · {subject.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Year">
          <input
            name="year"
            type="number"
            min={1960}
            max={2100}
            required
            defaultValue={paper?.year ?? currentYear}
            className={INPUT}
          />
        </Field>
        <Field label="Tag">
          <input
            name="tag"
            list="paper-tags"
            defaultValue={paper?.tag ?? ""}
            placeholder="e.g. With Answers"
            className={INPUT}
          />
          <datalist id="paper-tags">
            <option value="With Answers" />
            <option value="Paper 1" />
            <option value="Paper 2" />
            <option value="Practical" />
            <option value="Mock" />
          </datalist>
        </Field>
      </div>

      <Field
        label="PDF file"
        hint={
          currentFileName
            ? `Currently attached: ${currentFileName}. Choose a new file only if you want to replace it.`
            : "Upload the paper as a PDF (maximum 20 MB)."
        }
      >
        <input
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          className="w-full rounded-xl border border-dashed border-navy-300 bg-navy-50 px-3.5 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-navy-800 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
        />
      </Field>

      <Field label="Or paste a download link" hint="Optional — used when no PDF is uploaded.">
        <input
          name="externalUrl"
          type="url"
          defaultValue={paper?.externalUrl ?? ""}
          placeholder="https://…"
          className={INPUT}
        />
      </Field>

      <Field label="Internal note" hint="Only you can see this.">
        <textarea
          name="notesText"
          rows={3}
          defaultValue={paper?.notesText ?? ""}
          className={INPUT}
        />
      </Field>

      <PublishToggle defaultChecked={paper ? paper.published : true} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{paper ? "Save changes" : "Upload paper"}</SubmitButton>
        <Link
          href="/admin/papers"
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------- tip */

export function TipForm({ tip }: { tip?: StudyTip | null }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveTipAction, {});

  return (
    <form action={formAction} className="grid gap-5">
      <Alert state={state} />
      {tip ? <input type="hidden" name="id" value={tip.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Article title">
          <input name="title" required defaultValue={tip?.title ?? ""} className={INPUT} />
        </Field>
        <Field label="Category">
          <input
            name="category"
            list="tip-categories"
            defaultValue={tip?.category ?? "Exam Strategy"}
            className={INPUT}
          />
          <datalist id="tip-categories">
            <option value="Exam Strategy" />
            <option value="Study Planning" />
            <option value="Exam Technique" />
            <option value="Motivation" />
            <option value="Subject Focus" />
          </datalist>
        </Field>
      </div>

      <Field label="Short summary" hint="One or two lines shown on the cards.">
        <textarea name="excerpt" rows={3} defaultValue={tip?.excerpt ?? ""} className={INPUT} />
      </Field>

      <Field label="Article body">
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={tip?.content ?? ""}
          className={INPUT}
        />
      </Field>

      <PublishToggle defaultChecked={tip ? tip.published : true} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{tip ? "Save changes" : "Publish article"}</SubmitButton>
        <Link
          href="/admin/tips"
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

/* --------------------------------------------------------------- subject */

export function SubjectForm({ subject }: { subject?: Subject | null }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSubjectAction, {});

  return (
    <form action={formAction} className="grid gap-4">
      <Alert state={state} />
      {subject ? <input type="hidden" name="id" value={subject.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_140px_100px_110px]">
        <Field label="Subject name">
          <input
            name="name"
            required
            defaultValue={subject?.name ?? ""}
            placeholder="e.g. Computer Studies"
            className={INPUT}
          />
        </Field>
        <Field label="Level">
          <select name="level" defaultValue={subject?.level ?? "MSCE"} className={INPUT}>
            <option value="JCE">JCE</option>
            <option value="MSCE">MSCE</option>
          </select>
        </Field>
        <Field label="Icon">
          <input
            name="emoji"
            maxLength={4}
            defaultValue={subject?.emoji ?? "📘"}
            className={INPUT}
          />
        </Field>
        <Field label="Order">
          <input
            name="sortOrder"
            type="number"
            defaultValue={subject?.sortOrder ?? 0}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Short description">
        <textarea
          name="description"
          rows={2}
          defaultValue={subject?.description ?? ""}
          className={INPUT}
        />
      </Field>

      <div>
        <SubmitButton>{subject ? "Save subject" : "Add subject"}</SubmitButton>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------- settings */

const SETTING_FIELDS: Array<{
  key: string;
  label: string;
  type: "text" | "area";
  hint?: string;
}> = [
  { key: "site_name", label: "Website name", type: "text" },
  { key: "hero_title", label: "Homepage big title", type: "text" },
  { key: "hero_subtitle", label: "Homepage subtitle", type: "text" },
  { key: "hero_blurb", label: "Homepage intro paragraph", type: "area" },
  { key: "hero_cta_primary", label: "First button text", type: "text" },
  { key: "hero_cta_secondary", label: "Second button text", type: "text" },
  { key: "junior_title", label: "Junior section title", type: "text" },
  { key: "junior_text", label: "Junior section text", type: "area" },
  { key: "senior_title", label: "Secondary section title", type: "text" },
  { key: "senior_text", label: "Secondary section text", type: "area" },
  { key: "popular_title", label: "Popular subjects title", type: "text" },
  { key: "latest_title", label: "Latest uploads title", type: "text" },
  { key: "tips_title", label: "Study tips title", type: "text" },
  { key: "tips_text", label: "Study tips text", type: "area" },
  { key: "footer_text", label: "Footer paragraph", type: "area" },
  { key: "contact_whatsapp", label: "WhatsApp number", type: "text" },
  { key: "contact_email", label: "Contact email", type: "text" },
];

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveSettingsAction,
    {},
  );

  return (
    <form action={formAction} className="grid gap-5">
      <Alert state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        {SETTING_FIELDS.map((field) => (
          <div key={field.key} className={field.type === "area" ? "sm:col-span-2" : ""}>
            <Field label={field.label} hint={field.hint}>
              {field.type === "area" ? (
                <textarea
                  name={field.key}
                  rows={3}
                  defaultValue={values[field.key] ?? ""}
                  className={INPUT}
                />
              ) : (
                <input
                  name={field.key}
                  defaultValue={values[field.key] ?? ""}
                  className={INPUT}
                />
              )}
            </Field>
          </div>
        ))}
      </div>
      <div>
        <SubmitButton>Save website text</SubmitButton>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ auth */

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="grid gap-4">
      <Alert state={state} />
      <Field label="Admin password">
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="••••••••"
          className={INPUT}
        />
      </Field>
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
