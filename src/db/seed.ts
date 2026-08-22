/**
 * npm run db:seed
 *
 * Idempotent: safe to re-run. Users and ventures are upserted on their
 * natural keys (email / slug). The tables this script fully owns for these
 * six ventures — gate templates, gate items, the initial stage event and
 * tasks — are cleared and rewritten each run rather than diffed, so re-running
 * always lands on the same end state instead of accumulating duplicates.
 */
import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import {
  gateItems,
  stageTemplates,
  tasks,
  users,
  ventureStageEvents,
  ventures,
  type ventureStage,
} from "./schema";

type Stage = (typeof ventureStage.enumValues)[number];

const DAY_MS = 86_400_000;
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * DAY_MS);
const hoursAgo = (n: number) => new Date(now.getTime() - n * 60 * 60 * 1000);

/* ---------------------------------------------------------------------------
   USERS — the four partners. RM matches CURRENT_USER_EMAIL in
   src/lib/current-user.ts.
--------------------------------------------------------------------------- */

const USER_SEED = [
  { email: "risad@aponvlab.io", name: "Risad Mahmud", initials: "RM" },
  { email: "rashedun@aponvlab.io", name: "Rashedun Nabi", initials: "RN" },
  { email: "saif@aponvlab.io", name: "Saif Rashid", initials: "SR" },
  { email: "mufassal@aponvlab.io", name: "Mufassal Saif", initials: "MS" },
] as const;

/* ---------------------------------------------------------------------------
   GATE CHECKLISTS — from the gate rail in design-system/ui_kits/bench,
   one set of six per stage. This is the "gate" half of stage_templates.
--------------------------------------------------------------------------- */

const GATE_CHECKLISTS: Record<Stage, string[]> = {
  meet: [
    "Founder call logged",
    "Thesis fit written up",
    "Reference check",
    "Founding team mapped",
    "Cap table reviewed",
    "Studio fit agreed",
  ],
  validate: [
    "Market memo drafted",
    "Competitor scan",
    "Buyer interviews",
    "Pricing validated",
    "Willingness to pay tested",
    "Design partner signed",
  ],
  build: [
    "Scope locked",
    "MVP shipped internally",
    "First pilot live",
    "Instrumentation in place",
    "Support loop defined",
    "Pilot feedback reviewed",
  ],
  form: [
    "Entity registered",
    "Cap table executed",
    "IP assigned",
    "Bank account open",
    "Founder agreements signed",
    "Board cadence set",
  ],
  grow: [
    "Paid acquisition tested",
    "Retention cohort positive",
    "Unit economics modelled",
    "Hiring plan agreed",
    "Next round narrative",
    "Ops handover done",
  ],
};

/* ---------------------------------------------------------------------------
   VENTURES — the six real ventures from design-system/ui_kits/bench/data.jsx,
   with real stages, owners, equity and one-liners. `gatesCleared` is how many
   of the current stage's six gates are done, matching the board card.
--------------------------------------------------------------------------- */

const VENTURE_SEED: {
  slug: string;
  name: string;
  oneLiner: string;
  market: string;
  stage: Stage;
  color: string;
  ownerInitials: string;
  equityPct: number | null;
  founderName: string;
  founderEmail: string;
  gatesCleared: number;
  stageEnteredDaysAgo: number;
  lastActivityHoursAgo: number;
  boardPosition: number;
}[] = [
  {
    slug: "immiclaw",
    name: "ImmiClaw",
    oneLiner: "Study abroad automation for agents across West Africa",
    market: "West Africa, Nigeria first",
    stage: "validate",
    color: "var(--magenta)",
    ownerInitials: "RN",
    equityPct: 0.45,
    founderName: "Tunde Adeyemi",
    founderEmail: "tunde@immiclaw.co",
    gatesCleared: 4,
    stageEnteredDaysAgo: 6,
    lastActivityHoursAgo: 2,
    boardPosition: 1000,
  },
  {
    slug: "dikkha-ai",
    name: "Dikkha AI",
    oneLiner: "SSC study companion for Bangladeshi students",
    market: "Bangladesh, SSC cohort",
    stage: "build",
    color: "var(--violet)",
    ownerInitials: "MS",
    equityPct: 0.3,
    founderName: "Nusrat Jahan",
    founderEmail: "nusrat@dikkha.ai",
    gatesCleared: 3,
    stageEnteredDaysAgo: 9,
    lastActivityHoursAgo: 5 * 24,
    boardPosition: 1000,
  },
  {
    slug: "chhar",
    name: "Chhar",
    oneLiner: "Deals and coupons app, live on Play",
    market: "Bangladesh, urban deals",
    stage: "grow",
    color: "var(--teal)",
    ownerInitials: "MS",
    equityPct: 0.25,
    founderName: "Arif Hossain",
    founderEmail: "arif@chhar.app",
    gatesCleared: 5,
    stageEnteredDaysAgo: 11,
    lastActivityHoursAgo: 1 * 24,
    boardPosition: 1000,
  },
  {
    slug: "eloy-lab",
    name: "Eloy Lab",
    oneLiner: "Bank reporting agent for Bangladeshi banks",
    market: "Bangladesh, tier-1 banks",
    stage: "meet",
    color: "var(--amber)",
    ownerInitials: "RM",
    equityPct: null,
    founderName: "Shahriar Kabir",
    founderEmail: "shahriar@eloylab.co",
    gatesCleared: 2,
    stageEnteredDaysAgo: 21,
    lastActivityHoursAgo: 3 * 24,
    boardPosition: 1000,
  },
  {
    slug: "medical-bot",
    name: "Medical BOT",
    oneLiner: "FCPS admission prep companion",
    market: "Bangladesh, FCPS candidates",
    stage: "meet",
    color: "var(--venture-clay)",
    ownerInitials: "SR",
    equityPct: null,
    founderName: "Dr. Farhana Islam",
    founderEmail: "farhana@medicalbot.co",
    gatesCleared: 1,
    stageEnteredDaysAgo: 6,
    lastActivityHoursAgo: 6 * 24,
    boardPosition: 2000,
  },
  {
    slug: "berai",
    name: "Berai",
    oneLiner: "Private beta, invite only",
    market: "Bangladesh, invite only",
    stage: "build",
    color: "var(--venture-steel)",
    ownerInitials: "RM",
    equityPct: 0.15,
    founderName: "Imran Chowdhury",
    founderEmail: "imran@berai.co",
    gatesCleared: 2,
    stageEnteredDaysAgo: 12,
    lastActivityHoursAgo: 8 * 24,
    boardPosition: 2000,
  },
];

/* ---------------------------------------------------------------------------
   TASKS — a handful across lanes and statuses, from the kanban mock.
--------------------------------------------------------------------------- */

const COL_TO_STATUS = {
  "To do": "todo",
  Doing: "doing",
  Blocked: "blocked",
  Done: "done",
} as const;

const LANE_MAP = {
  Thesis: "thesis",
  Tech: "tech",
  GTM: "gtm",
  Capital: "capital",
} as const;

const TASK_SEED: {
  ventureSlug: string;
  lane: keyof typeof LANE_MAP;
  col: keyof typeof COL_TO_STATUS;
  title: string;
  who: string;
  dueDate?: string; // YYYY-MM-DD
  completedDaysAgo?: number;
  priority?: "low" | "normal" | "high";
}[] = [
  { ventureSlug: "immiclaw", lane: "Thesis", col: "To do", title: "Write the Lagos market memo", who: "RN", dueDate: dateThisYear(26, 8) },
  { ventureSlug: "immiclaw", lane: "Thesis", col: "Done", title: "Check against our AI thesis", who: "RN", completedDaysAgo: 7 },
  { ventureSlug: "immiclaw", lane: "Tech", col: "To do", title: "Scope MVP auth and agent roles", who: "RM", dueDate: dateThisYear(24, 8) },
  { ventureSlug: "immiclaw", lane: "Tech", col: "To do", title: "Doc parser benchmark, 3 options", who: "RM" },
  { ventureSlug: "immiclaw", lane: "Tech", col: "Doing", title: "Data model for applicant files", who: "RM" },
  { ventureSlug: "immiclaw", lane: "Tech", col: "Blocked", title: "Sandbox access from agency", who: "RM", dueDate: isoDaysAgo(2), priority: "high" },
  { ventureSlug: "immiclaw", lane: "GTM", col: "To do", title: "Shortlist 10 Nigerian agents", who: "MS" },
  { ventureSlug: "immiclaw", lane: "GTM", col: "Doing", title: "Buyer interview 3 of 6", who: "MS", dueDate: isoDaysAgo(0) },
  { ventureSlug: "immiclaw", lane: "GTM", col: "Done", title: "Send the AVL one pager", who: "MS", completedDaysAgo: 9 },
  { ventureSlug: "immiclaw", lane: "Capital", col: "To do", title: "Draft term sheet, no exclusivity", who: "SR" },
  { ventureSlug: "immiclaw", lane: "Capital", col: "Done", title: "Agree 45% split in principle", who: "SR", completedDaysAgo: 11 },
  { ventureSlug: "dikkha-ai", lane: "Tech", col: "To do", title: "Cut the Play Store release for 2.4", who: "RM", dueDate: dateThisYear(25, 8) },
  { ventureSlug: "dikkha-ai", lane: "Tech", col: "Doing", title: "Offline pack behind a flag", who: "RM" },
  { ventureSlug: "dikkha-ai", lane: "GTM", col: "To do", title: "Tutor outreach, Khulna", who: "MS" },
  { ventureSlug: "dikkha-ai", lane: "Thesis", col: "Done", title: "SSC syllabus coverage check", who: "MS", completedDaysAgo: 12 },
  { ventureSlug: "chhar", lane: "Tech", col: "Doing", title: "Deals feed reliability fix", who: "RM", dueDate: dateThisYear(28, 8) },
  { ventureSlug: "chhar", lane: "GTM", col: "To do", title: "Merchant pricing tiers", who: "MS" },
  { ventureSlug: "chhar", lane: "Capital", col: "To do", title: "Model unit economics at 5K", who: "SR" },
  { ventureSlug: "eloy-lab", lane: "Thesis", col: "To do", title: "Review Eloy Lab's regulatory timeline", who: "RM" },
  { ventureSlug: "eloy-lab", lane: "GTM", col: "Blocked", title: "Waiting on bank intro", who: "MS", priority: "high" },
  { ventureSlug: "berai", lane: "Tech", col: "To do", title: "Decide Supabase or Neon for scale up", who: "RM", dueDate: dateThisYear(27, 8) },
  { ventureSlug: "berai", lane: "Tech", col: "Doing", title: "Invite flow for the private beta", who: "RM" },
  { ventureSlug: "medical-bot", lane: "Thesis", col: "To do", title: "FCPS question bank licensing", who: "SR" },
];

function isoDaysAgo(n: number): string {
  return daysAgo(n).toISOString().slice(0, 10);
}

function dateThisYear(day: number, month: number): string {
  const d = new Date(now.getFullYear(), month - 1, day);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log("Seeding users...");
  const userRows = await Promise.all(
    USER_SEED.map((u) =>
      db
        .insert(users)
        .values({ email: u.email, name: u.name, initials: u.initials, role: "partner" })
        .onConflictDoUpdate({
          target: users.email,
          set: { name: u.name, initials: u.initials, role: "partner" },
        })
        .returning(),
    ),
  );
  const userByInitials = new Map(userRows.map(([row]) => [row.initials, row]));
  for (const u of USER_SEED) {
    if (!userByInitials.has(u.initials)) throw new Error(`Missing seeded user ${u.initials}`);
  }

  console.log("Seeding stage templates (gates)...");
  await db.delete(stageTemplates).where(eq(stageTemplates.kind, "gate"));
  const stageTemplateRows = (Object.entries(GATE_CHECKLISTS) as [Stage, string[]][]).flatMap(
    ([stage, labels]) =>
      labels.map((label, i) => ({
        stage,
        kind: "gate",
        label,
        sortOrder: i,
        isActive: true,
      })),
  );
  await db.insert(stageTemplates).values(stageTemplateRows);

  console.log("Seeding ventures...");
  const ventureRows = await Promise.all(
    VENTURE_SEED.map((v) => {
      const owner = userByInitials.get(v.ownerInitials)!;
      return db
        .insert(ventures)
        .values({
          slug: v.slug,
          name: v.name,
          oneLiner: v.oneLiner,
          market: v.market,
          stage: v.stage,
          color: v.color,
          status: "active",
          ownerId: owner.id,
          equityPct: v.equityPct,
          founderName: v.founderName,
          founderEmail: v.founderEmail,
          stageEnteredAt: daysAgo(v.stageEnteredDaysAgo),
          lastActivityAt: hoursAgo(v.lastActivityHoursAgo),
          boardPosition: v.boardPosition,
          createdBy: owner.id,
        })
        .onConflictDoUpdate({
          target: ventures.slug,
          set: {
            name: v.name,
            oneLiner: v.oneLiner,
            market: v.market,
            stage: v.stage,
            color: v.color,
            status: "active",
            ownerId: owner.id,
            equityPct: v.equityPct,
            founderName: v.founderName,
            founderEmail: v.founderEmail,
            stageEnteredAt: daysAgo(v.stageEnteredDaysAgo),
            lastActivityAt: hoursAgo(v.lastActivityHoursAgo),
            boardPosition: v.boardPosition,
            createdBy: owner.id,
          },
        })
        .returning();
    }),
  );
  const ventureBySlug = new Map(ventureRows.map(([row]) => [row.slug, row]));
  const ventureIds = ventureRows.map(([row]) => row.id);

  console.log("Seeding gate items...");
  await db.delete(gateItems).where(inArray(gateItems.ventureId, ventureIds));
  const gateItemRows = VENTURE_SEED.flatMap((v) => {
    const venture = ventureBySlug.get(v.slug)!;
    const owner = userByInitials.get(v.ownerInitials)!;
    const labels = GATE_CHECKLISTS[v.stage];
    return labels.map((label, i) => ({
      ventureId: venture.id,
      stage: v.stage,
      label,
      sortOrder: i,
      doneAt: i < v.gatesCleared ? daysAgo(v.stageEnteredDaysAgo - i) : null,
      doneBy: i < v.gatesCleared ? owner.id : null,
    }));
  });
  await db.insert(gateItems).values(gateItemRows);

  console.log("Seeding stage entry events...");
  await db.delete(ventureStageEvents).where(inArray(ventureStageEvents.ventureId, ventureIds));
  const stageEventRows = VENTURE_SEED.map((v) => {
    const venture = ventureBySlug.get(v.slug)!;
    const owner = userByInitials.get(v.ownerInitials)!;
    return {
      ventureId: venture.id,
      fromStage: null,
      toStage: v.stage,
      actorId: owner.id,
      createdAt: daysAgo(v.stageEnteredDaysAgo),
    };
  });
  await db.insert(ventureStageEvents).values(stageEventRows);

  console.log("Seeding tasks...");
  await db.delete(tasks).where(inArray(tasks.ventureId, ventureIds));
  const positionByGroup = new Map<string, number>();
  const nextPosition = (key: string) => {
    const n = (positionByGroup.get(key) ?? 0) + 1000;
    positionByGroup.set(key, n);
    return n;
  };
  const taskRows = TASK_SEED.map((t) => {
    const venture = ventureBySlug.get(t.ventureSlug)!;
    const assignee = userByInitials.get(t.who)!;
    const status = COL_TO_STATUS[t.col];
    const groupKey = `${venture.id}:${status}`;
    return {
      ventureId: venture.id,
      title: t.title,
      lane: LANE_MAP[t.lane],
      status,
      priority: t.priority ?? "normal",
      assigneeId: assignee.id,
      dueDate: t.dueDate ?? null,
      position: nextPosition(groupKey),
      createdBy: assignee.id,
      completedAt: t.completedDaysAgo != null ? daysAgo(t.completedDaysAgo) : null,
    };
  });
  await db.insert(tasks).values(taskRows);

  console.log(
    `Done: ${userRows.length} users, ${ventureRows.length} ventures, ${stageTemplateRows.length} gate templates, ${gateItemRows.length} gate items, ${stageEventRows.length} stage events, ${taskRows.length} tasks.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
