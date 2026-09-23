import { db } from "@/db";
import { files, notes, pastPapers, settings, studyTips, subjects } from "@/db/schema";
import { buildSimplePdf } from "@/lib/pdf";
import { slugify } from "@/lib/slug";
import { sql } from "drizzle-orm";

export const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "EDWARD ACADEMY",
  hero_title: "EDWARD ACADEMY",
  hero_subtitle: "Smart Notes. Past Papers. Better Results.",
  hero_blurb:
    "Organised JCE and MSCE study material for Malawian learners. Clear notes, real past papers and exam tips you can use tonight.",
  hero_cta_primary: "Browse Notes",
  hero_cta_secondary: "View Past Papers",
  junior_title: "Junior Level (JCE)",
  junior_text:
    "Forms 1 and 2 material written in simple language, with worked examples for every topic.",
  senior_title: "Secondary Level (MSCE)",
  senior_text:
    "Forms 3 and 4 exam-focused notes and past papers, mapped to the MANEB syllabus.",
  popular_title: "Popular Subjects",
  latest_title: "Latest Uploads",
  tips_title: "Study Tips",
  tips_text: "Short, practical articles that help you revise smarter, not longer.",
  footer_text:
    "EDWARD ACADEMY — free study material for JCE and MSCE learners across Malawi.",
  contact_whatsapp: "+265 000 000 000",
  contact_email: "hello@edwardacademy.mw",
};

const JCE_SUBJECTS: Array<[string, string, string]> = [
  ["English", "🔤", "Grammar, comprehension, summary writing and composition skills."],
  ["Mathematics", "➗", "Numbers, algebra, geometry and statistics with worked examples."],
  ["Science", "🔬", "Matter, energy, living things and simple practical investigations."],
  ["Social Studies", "🌍", "Citizenship, governance, economics and Malawian society."],
  ["Agriculture", "🌱", "Crop and livestock production, soils and farm management."],
  ["Bible Knowledge", "📖", "Old and New Testament study with application questions."],
];

const MSCE_SUBJECTS: Array<[string, string, string]> = [
  ["English", "🔤", "Language structures, literature, summary and essay technique."],
  ["Mathematics", "➗", "Functions, trigonometry, calculus basics, statistics and probability."],
  ["Geography", "🗺️", "Physical, human and practical geography plus map work."],
  ["Biology", "🧬", "Cells, systems, genetics, ecology and practical biology."],
  ["Physical Science", "⚗️", "Chemistry and physics concepts with experiments and calculations."],
  ["Social Studies", "🏛️", "Governance, human rights, development and global issues."],
  ["History", "📜", "Malawi, Africa and world history with source analysis."],
  ["Agriculture", "🌱", "Soil science, crop husbandry, livestock and agribusiness."],
  ["Chichewa", "🗣️", "Kalembedwe, galamala, nthano ndi ndakatulo."],
  ["Bible Knowledge", "📖", "Gospels, Acts, prophets and Christian living."],
];

type SeedNote = {
  title: string;
  topic: string;
  subject: string;
  level: string;
  explanation: string;
  example: string;
  examTip: string;
};

const SEED_NOTES: SeedNote[] = [
  {
    title: "Map Work: Scale, Bearing and Grid References",
    topic: "Practical Geography",
    subject: "Geography",
    level: "MSCE",
    explanation: `Map work tests whether you can read a topographical map correctly. Three skills carry most of the marks.

1. SCALE tells you how a distance on the map compares with the real distance on the ground. A scale of 1:50 000 means 1 cm on the map is 50 000 cm (0.5 km) on the ground.

2. GRID REFERENCES locate a place. Always read EASTINGS (the numbers along the top) before NORTHINGS (the numbers along the side) — "along the corridor, then up the stairs". Four figures give a square, six figures give a point inside that square.

3. BEARING is the angle measured clockwise from north, always written with three digits (for example 045 degrees). Join the two points with a straight line, place the protractor centre on the starting point with 0 facing north, then read clockwise.`,
    example: `Question: The distance between Mzuzu market and the bus depot measures 6.4 cm on a 1:50 000 map. What is the real distance?

Working:
6.4 cm x 50 000 = 320 000 cm
320 000 cm ÷ 100 = 3 200 m
3 200 m ÷ 1 000 = 3.2 km

Answer: 3.2 km.`,
    examTip:
      "Always state the units and show every step of the conversion — examiners award method marks even when the final answer is wrong. Carry a ruler, protractor and a piece of string for measuring curved features such as rivers and roads.",
  },
  {
    title: "Solving Quadratic Equations by Factorisation",
    topic: "Algebra",
    subject: "Mathematics",
    level: "MSCE",
    explanation: `A quadratic equation has the form ax² + bx + c = 0. To factorise, find two numbers that MULTIPLY to give a × c and ADD to give b. Split the middle term using those two numbers, group in pairs, then take out the common bracket. Finally use the zero product rule: if P × Q = 0 then P = 0 or Q = 0.`,
    example: `Solve x² + 7x + 12 = 0

Two numbers that multiply to 12 and add to 7 are 3 and 4.
x² + 3x + 4x + 12 = 0
x(x + 3) + 4(x + 3) = 0
(x + 3)(x + 4) = 0
x = -3 or x = -4`,
    examTip:
      "Always check your answer by substituting it back into the original equation. If factorisation fails, use the quadratic formula — but write the formula down first, because it carries a mark on its own.",
  },
  {
    title: "Cell Structure and Function",
    topic: "Cell Biology",
    subject: "Biology",
    level: "MSCE",
    explanation: `The cell is the basic unit of life. Plant and animal cells share the cell membrane, cytoplasm, nucleus, mitochondria and ribosomes. Plant cells additionally have a cellulose cell wall, chloroplasts and a large permanent vacuole.

Key functions to memorise:
• Cell membrane — controls what enters and leaves the cell (selectively permeable).
• Nucleus — contains DNA and controls all cell activities.
• Mitochondrion — site of aerobic respiration, releases energy (ATP).
• Chloroplast — contains chlorophyll and traps light for photosynthesis.
• Vacuole — stores cell sap and keeps the plant cell turgid.`,
    example: `Question: Give two structural differences between a palisade cell and a red blood cell.

Answer:
1. The palisade cell has a cellulose cell wall while the red blood cell has only a cell membrane.
2. The palisade cell contains chloroplasts and a nucleus; the mature red blood cell has neither and is biconcave to carry more oxygen.`,
    examTip:
      "Structure questions usually ask you to LINK structure to function. Never just name a part — say what it does and why its shape helps.",
  },
  {
    title: "Summary Writing: Scoring Full Marks",
    topic: "Comprehension and Summary",
    subject: "English",
    level: "MSCE",
    explanation: `A summary tests selection, not creativity. Follow a fixed routine:
1. Read the question first so you know exactly what to look for.
2. Read the passage twice and underline only the points that answer the question.
3. Number your points — one idea per point.
4. Rewrite them in YOUR OWN words, in continuous prose, in the person and tense asked for.
5. Count the words and stay within the limit.`,
    example: `Instruction: "In not more than 90 words, summarise the causes of soil erosion mentioned in the passage."

Weak opening: "The passage says that soil erosion is caused by..."
Strong opening: "Soil erosion results mainly from deforestation, overgrazing, cultivation on steep slopes..."

The strong version wastes no words and starts scoring content marks immediately.`,
    examTip:
      "Never copy full sentences from the passage — you lose language marks. Write the final copy in one paragraph and put the word count in brackets at the end.",
  },
  {
    title: "Soil Formation and Conservation",
    topic: "Soil Science",
    subject: "Agriculture",
    level: "JCE",
    explanation: `Soil is formed when parent rock is broken down by weathering (physical, chemical and biological) and mixed with decayed organic matter called humus.

A good agricultural soil contains: mineral particles (45%), water (25%), air (25%) and organic matter (5%).

Conservation methods you must know:
• Contour ridging — ridges follow the contour to slow runoff.
• Crop rotation — different crops use different nutrients and break pest cycles.
• Mulching — covers soil, reduces evaporation and adds humus.
• Agroforestry — trees bind soil and add nitrogen (for example Faidherbia albida).`,
    example: `Question: A farmer in Ntcheu cultivates maize on a steep slope every year and burns crop residues. State two problems and one solution.

Answer: Problems — sheet erosion removes the fertile topsoil; burning residues destroys organic matter and reduces water holding capacity. Solution — make contour ridges and practise mulching with the crop residues instead of burning them.`,
    examTip:
      "Agriculture answers must be practical. Where possible, name a real Malawian example (Shire Highlands, Kasungu, Faidherbia albida) — examiners reward local application.",
  },
  {
    title: "Fractions, Decimals and Percentages",
    topic: "Number Operations",
    subject: "Mathematics",
    level: "JCE",
    explanation: `The three forms describe the same value, so you must be able to move between them quickly.

• Fraction to decimal: divide the numerator by the denominator.
• Decimal to percentage: multiply by 100.
• Percentage to fraction: put the number over 100 and simplify.

When adding or subtracting fractions, find the Lowest Common Denominator first. When multiplying, multiply straight across and simplify. When dividing, invert the second fraction and multiply.`,
    example: `Express 3/8 as a decimal and a percentage.

3 ÷ 8 = 0.375
0.375 × 100 = 37.5%

Find 15% of MK 4 800.
15/100 × 4 800 = MK 720`,
    examTip:
      "In money questions always write the currency and round to two decimal places. Show the fraction line — marks are given for the setting out, not only the answer.",
  },
];

const SEED_TIPS = [
  {
    title: "How to Build a Revision Timetable That You Actually Follow",
    category: "Study Planning",
    excerpt:
      "A realistic timetable beats a beautiful one. Here is a simple 5-step method that works with school, chores and load shedding.",
    content: `Most learners fail not because they are lazy, but because their timetable was never realistic.

1. COUNT YOUR REAL HOURS
Write down the hours you are genuinely free each day — after school, chores and church. If that is only two hours, plan for two hours.

2. RANK YOUR SUBJECTS
Put your weakest subjects in your sharpest hours. Most learners are sharpest early in the morning.

3. USE 40/10 BLOCKS
Study for 40 minutes, rest for 10. Three blocks of focused work beat five hours of distracted reading.

4. END EVERY BLOCK WITH A QUESTION
Close the notes and answer one past paper question from memory. If you cannot, you have not learnt it yet.

5. REVIEW EVERY SUNDAY
Tick what you covered, move what you missed. A timetable you adjust is a timetable you keep.`,
  },
  {
    title: "Past Papers: The Right Way to Use Them",
    category: "Exam Strategy",
    excerpt:
      "Reading past papers is not practising them. Use this three-round method to turn old papers into marks.",
    content: `ROUND 1 — OPEN BOOK
Work through the paper with your notes beside you. The aim is to understand the style of questions, not to score.

ROUND 2 — TIMED, CLOSED BOOK
Sit the same paper under exam conditions. Use the real time limit. No phone, no notes.

ROUND 3 — MARK YOURSELF HARD
Use the marking scheme and be strict. For every lost mark, write one line in a "mistakes book" explaining why you lost it.

After three papers your mistakes book becomes the most valuable revision document you own — revise it the night before the exam instead of rereading whole topics.`,
  },
  {
    title: "Ten Exam Room Habits That Save Marks",
    category: "Exam Technique",
    excerpt:
      "Simple habits — reading instructions, allocating time, labelling diagrams — are worth dozens of marks every year.",
    content: `1. Read the instructions on the front page. Some papers ask for only three of five questions.
2. Spend two minutes planning long answers.
3. Allocate time by marks: roughly one minute per mark.
4. Answer the questions you know first to build confidence.
5. Number your answers exactly as they appear on the paper.
6. Label every diagram and give it a title.
7. Show all working in calculations — method marks are free marks.
8. Use the command words: "state" wants one line, "explain" wants a reason, "discuss" wants both sides.
9. Never leave a multiple choice blank; eliminate two options and choose.
10. Keep the last five minutes to check units, spellings and unanswered parts.`,
  },
];

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  // Settings are upserted every time so new keys appear after an update.
  await db
    .insert(settings)
    .values(
      Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),
    )
    .onConflictDoNothing();

  const [{ count: subjectCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subjects);

  if (subjectCount === 0) {
    const rows = [
      ...JCE_SUBJECTS.map(([name, emoji, description], index) => ({
        name,
        slug: slugify(`jce-${name}`),
        level: "JCE",
        emoji,
        description,
        sortOrder: index,
      })),
      ...MSCE_SUBJECTS.map(([name, emoji, description], index) => ({
        name,
        slug: slugify(`msce-${name}`),
        level: "MSCE",
        emoji,
        description,
        sortOrder: index,
      })),
    ];
    await db.insert(subjects).values(rows);
  }

  const allSubjects = await db.select().from(subjects);
  const findSubject = (name: string, level: string) =>
    allSubjects.find((s) => s.name === name && s.level === level);

  const [{ count: noteCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notes);

  if (noteCount === 0) {
    const rows = SEED_NOTES.flatMap((note) => {
      const subject = findSubject(note.subject, note.level);
      if (!subject) return [];
      return [
        {
          title: note.title,
          slug: slugify(`${note.level}-${note.subject}-${note.title}`),
          topic: note.topic,
          subjectId: subject.id,
          explanation: note.explanation,
          example: note.example,
          examTip: note.examTip,
          published: true,
        },
      ];
    });
    if (rows.length > 0) await db.insert(notes).values(rows);
  }

  const [{ count: paperCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pastPapers);

  if (paperCount === 0) {
    const geography = findSubject("Geography", "MSCE");
    if (geography) {
      const pdf = buildSimplePdf([
        "EDWARD ACADEMY - SAMPLE PAST PAPER",
        "MSCE GEOGRAPHY 2022 - PAPER 1 (WITH ANSWERS)",
        "",
        "Time: 2 hours          Total marks: 100",
        "Answer ALL questions in Section A and TWO in Section B.",
        "",
        "SECTION A (40 marks)",
        "1. Define the following terms:",
        "   (a) Weathering                                   (2 marks)",
        "   (b) Longitude                                    (2 marks)",
        "2. A map has a scale of 1:50 000. Two schools are 7.2 cm apart.",
        "   Calculate the real distance in kilometres.       (3 marks)",
        "3. State three causes of rural-urban migration in Malawi. (3 marks)",
        "4. Explain how a river forms a waterfall.           (5 marks)",
        "",
        "SECTION B (60 marks)",
        "5. With examples from Malawi, discuss four effects of",
        "   deforestation on the environment.                (20 marks)",
        "6. Describe the formation of relief rainfall and state two",
        "   areas in Malawi where it is common.              (20 marks)",
        "",
        "MARKING GUIDE (SUMMARY)",
        "1(a) Breakdown of rocks in situ by physical, chemical or",
        "     biological agents.",
        "1(b) Angular distance east or west of the Greenwich Meridian.",
        "2.   7.2 x 50 000 = 360 000 cm = 3.6 km.",
        "3.   Employment, education, better services, land shortage.",
        "4.   Hard rock over soft rock; soft rock eroded faster; plunge",
        "     pool forms; overhang collapses; waterfall retreats upstream.",
        "",
        "Replace this placeholder from the Admin panel: Past Papers > Upload.",
      ]);
      const [file] = await db
        .insert(files)
        .values({
          name: "msce-geography-2022-sample.pdf",
          mimeType: "application/pdf",
          size: pdf.byteLength,
          data: pdf.toString("base64"),
        })
        .returning();

      await db.insert(pastPapers).values({
        title: "MSCE Geography 2022",
        subjectId: geography.id,
        year: 2022,
        tag: "With Answers",
        notesText:
          "Sample paper generated by EDWARD ACADEMY. Replace it with the real MANEB paper from the admin panel.",
        fileId: file.id,
        published: true,
      });
    }
  }

  const [{ count: tipCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(studyTips);

  if (tipCount === 0) {
    await db.insert(studyTips).values(
      SEED_TIPS.map((tip) => ({
        title: tip.title,
        slug: slugify(tip.title),
        category: tip.category,
        excerpt: tip.excerpt,
        content: tip.content,
        published: true,
      })),
    );
  }
}

/** Idempotent, runs at most once per server process. */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error("Seed failed", error);
    });
  }
  return seedPromise;
}
