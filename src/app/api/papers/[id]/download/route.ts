import { db } from "@/db";
import { files, pastPapers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paperId = Number(id);
  if (!Number.isInteger(paperId)) {
    return new Response("Invalid paper id", { status: 400 });
  }

  const [row] = await db
    .select({ paper: pastPapers, file: files })
    .from(pastPapers)
    .leftJoin(files, eq(pastPapers.fileId, files.id))
    .where(eq(pastPapers.id, paperId));

  if (!row) return new Response("Paper not found", { status: 404 });

  await db
    .update(pastPapers)
    .set({ downloads: sql`${pastPapers.downloads} + 1` })
    .where(eq(pastPapers.id, paperId));

  if (!row.file) {
    if (row.paper.externalUrl) {
      return Response.redirect(row.paper.externalUrl, 302);
    }
    return new Response("No file attached to this paper", { status: 404 });
  }

  const bytes = Buffer.from(row.file.data, "base64");
  const safeName = row.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": row.file.mimeType || "application/pdf",
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
}
