import { EmptyState, SectionHeading, TipCard } from "@/components/ui";
import { getSettings, listTips } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study Tips — EDWARD ACADEMY",
  description: "Practical revision and exam technique articles for JCE and MSCE students.",
};

export default async function StudyTipsPage() {
  const [tips, settings] = await Promise.all([listTips(), getSettings()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading title={settings.tips_title} subtitle={settings.tips_text} />
      {tips.length === 0 ? (
        <EmptyState
          title="No articles published yet"
          message="Study tips added from the admin panel will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
}
