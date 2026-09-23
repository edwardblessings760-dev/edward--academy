import Link from "next/link";
import { notFound } from "next/navigation";
import { getTipBySlug, listTips } from "@/lib/data";
import { TipCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);
  return {
    title: tip ? `${tip.title} — EDWARD ACADEMY` : "Article not found",
    description: tip?.excerpt,
  };
}

export default async function StudyTipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);
  if (!tip || !tip.published) notFound();

  const others = (await listTips()).filter((item) => item.id !== tip.id).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/study-tips" className="font-semibold text-navy-700 hover:underline">
          Study Tips
        </Link>
      </nav>

      <span className="mt-4 inline-block rounded-full bg-leaf-100 px-3 py-1 text-[11px] font-bold tracking-wide text-leaf-700 uppercase">
        {tip.category}
      </span>
      <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-navy-900 sm:text-4xl">
        {tip.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">{tip.excerpt}</p>
      <p className="mt-2 text-xs font-medium text-slate-400">
        Published{" "}
        {new Date(tip.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="rich-text mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-[15px] text-slate-700">
        {tip.content}
      </div>

      {others.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold text-navy-900">Read next</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((item) => (
              <TipCard key={item.id} tip={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
