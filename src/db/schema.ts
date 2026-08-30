import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  doublePrecision,
  boolean,
  jsonb,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ---------------------------------------------------------------------------
   ENUMS
   Stages mirror the public process on aponvlab.io exactly. Do not invent
   internal-only vocabulary here, the site and the tool must agree.
--------------------------------------------------------------------------- */

export const ventureStage = pgEnum("venture_stage", [
  "meet",
  "validate",
  "build",
  "form",
  "grow",
]);

export const ventureStatus = pgEnum("venture_status", [
  "active",
  "passed",
  "paused",
  "archived",
]);

export const potential = pgEnum("potential", ["low", "medium", "high"]);

// Lanes map to the four partners' functions. Adding a lane later is a
// migration, so put anything you might plausibly need in now.
export const lane = pgEnum("lane", [
  "thesis",
  "tech",
  "gtm",
  "capital",
  "ops",
]);

export const taskStatus = pgEnum("task_status", [
  "todo",
  "doing",
  "blocked",
  "done",
]);

export const priority = pgEnum("priority", ["low", "normal", "high"]);

// "founder" is an external account: a founder signs in and sees exactly one
// venture (their own), linked via ventureMembers. partner/admin/viewer are
// all internal studio roles. Append only — order is not significant but
// existing values must not move.
export const userRole = pgEnum("user_role", [
  "partner",
  "admin",
  "viewer",
  "founder",
]);

// Role of a user within a single venture's membership. A founder is the
// external owner of the venture page; a collaborator is someone they invite
// (co-founder, advisor) — same access scope, different label.
export const ventureMemberRole = pgEnum("venture_member_role", [
  "founder",
  "collaborator",
]);

// Row-level visibility for founder-facing content. Everything is "studio"
// (internal only) by default; "shared" is an explicit opt-in that makes a
// row visible to the venture's founder users.
export const visibility = pgEnum("visibility", ["studio", "shared"]);

// Lifecycle of an inbound website application. "new" lands from POST
// /api/intake, flips to "reviewing" once a venture is created from it.
export const applicationStatus = pgEnum("application_status", [
  "new",
  "reviewing",
  "approved",
  "passed",
]);

export const entityType = pgEnum("entity_type", [
  "venture",
  "note",
  "task",
  "doc",
  "decision",
]);

/* ---------------------------------------------------------------------------
   USERS
--------------------------------------------------------------------------- */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  initials: text("initials").notNull(), // shown on cards, keep it denormalised
  avatarUrl: text("avatar_url"),
  role: userRole("role").notNull().default("partner"),
  googleRefreshToken: text("google_refresh_token"), // encrypt at rest
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ---------------------------------------------------------------------------
   VENTURES
   The top-level object. Everything else hangs off this, but note that
   ventureId is NULLABLE on notes and tasks so unparented capture works.
--------------------------------------------------------------------------- */

export const ventures = pgTable(
  "ventures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    oneLiner: text("one_liner"),
    market: text("market"),

    stage: ventureStage("stage").notNull().default("meet"),
    status: ventureStatus("status").notNull().default("active"),
    potential: potential("potential"),

    // Identity colour, chosen once at onboarding (see design-system/readme.md).
    // One of the twelve tokens in design-system/tokens/colors.css, e.g.
    // "var(--magenta)". Two ventures sharing one is allowed.
    color: text("color"),

    ownerId: uuid("owner_id").references(() => users.id),
    equityPct: doublePrecision("equity_pct"), // 0.45 = 45%

    founderName: text("founder_name"),
    founderEmail: text("founder_email"),
    founderPhone: text("founder_phone"),

    // Repo, Figma, Play Store, Granola, drive folder. Free-form on purpose,
    // a links table is overkill for four people.
    links: jsonb("links").$type<{ label: string; url: string }[]>().default([]),

    // Set on every stage transition. This is what powers the "stale 14d"
    // badge, and it is worth denormalising rather than joining every render.
    stageEnteredAt: timestamp("stage_entered_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    boardPosition: doublePrecision("board_position").notNull().default(1000),

    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => ({
    stageIdx: index("ventures_stage_idx").on(t.stage, t.status),
  })
);

/* Immutable trail of stage moves. Never update, only insert. Gives you
   history, time-in-stage analytics, and an honest answer to "when did we
   decide to build this". */
export const ventureStageEvents = pgTable(
  "venture_stage_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id")
      .notNull()
      .references(() => ventures.id, { onDelete: "cascade" }),
    fromStage: ventureStage("from_stage"),
    toStage: ventureStage("to_stage").notNull(),
    actorId: uuid("actor_id").references(() => users.id),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    ventureIdx: index("stage_events_venture_idx").on(t.ventureId, t.createdAt),
  })
);

/* Gate checklist. Seeded from a template when a venture enters a stage.
   This is the "4/6 gate" pill on the board card. */
export const gateItems = pgTable(
  "gate_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id")
      .notNull()
      .references(() => ventures.id, { onDelete: "cascade" }),
    stage: ventureStage("stage").notNull(),
    label: text("label").notNull(), // "Problem brief", "Buyer interviews"
    sortOrder: integer("sort_order").notNull().default(0),
    doneAt: timestamp("done_at", { withTimezone: true }),
    doneBy: uuid("done_by").references(() => users.id),
    // Optional proof: a doc or note that satisfies the gate.
    evidenceType: entityType("evidence_type"),
    evidenceId: uuid("evidence_id"),
  },
  (t) => ({
    ventureIdx: index("gate_items_venture_idx").on(t.ventureId, t.stage),
  })
);

/* ---------------------------------------------------------------------------
   DOCS
--------------------------------------------------------------------------- */

export const docs = pgTable(
  "docs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    storageKey: text("storage_key").notNull(), // GCS or Vercel Blob object key
    folder: text("folder"), // simple string path, do not build a folder table
    // "studio" (default) is internal-only; "shared" is visible to founder users.
    visibility: visibility("visibility").notNull().default("studio"),
    // Version chain: a new upload points at the doc it supersedes.
    supersedesId: uuid("supersedes_id"),
    uploadedBy: uuid("uploaded_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => ({
    ventureIdx: index("docs_venture_idx").on(t.ventureId),
  })
);

/* ---------------------------------------------------------------------------
   NOTES
   content is the editor's block JSON (BlockNote / TipTap doc).
   plainText is a flattened copy written on every save, purely so Postgres
   full-text search works without parsing JSON. Keep both in sync in one
   transaction.
--------------------------------------------------------------------------- */

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "set null",
    }), // NULL = loose note, this is deliberate
    parentNoteId: uuid("parent_note_id"), // nested pages, Notion style
    title: text("title").notNull().default("Untitled"),
    icon: text("icon"),
    content: jsonb("content").$type<unknown>().notNull().default({}),
    plainText: text("plain_text").notNull().default(""),
    isFavorite: boolean("is_favorite").notNull().default(false),
    // "studio" (default) is internal-only; "shared" is visible to founder users.
    visibility: visibility("visibility").notNull().default("studio"),
    createdBy: uuid("created_by").references(() => users.id),
    lastEditedBy: uuid("last_edited_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => ({
    ventureIdx: index("notes_venture_idx").on(t.ventureId, t.updatedAt),
    // Add the GIN index by hand in a migration:
    // CREATE INDEX notes_fts_idx ON notes
    //   USING GIN (to_tsvector('english', title || ' ' || plain_text));
  })
);

/* @mentions of a venture inside any note. Lets a note surface on a venture
   page without being owned by it. Written by the editor on save: diff the
   mention marks, upsert this table. */
export const noteMentions = pgTable(
  "note_mentions",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    ventureId: uuid("venture_id")
      .notNull()
      .references(() => ventures.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.ventureId] }),
    ventureIdx: index("note_mentions_venture_idx").on(t.ventureId),
  })
);

/* Snapshot history. Write one every N minutes of active editing, or on blur.
   Cheap insurance, and the thing people ask for the day they lose work. */
export const noteVersions = pgTable("note_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  content: jsonb("content").$type<unknown>().notNull(),
  editedBy: uuid("edited_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ---------------------------------------------------------------------------
   TASKS
   The important bit: a task is ALWAYS a row here. A note never stores task
   text. The note's block JSON holds { type: "task", attrs: { taskId } } and
   the editor resolves it at render time. One record, two surfaces.
--------------------------------------------------------------------------- */

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "set null",
    }), // NULL = personal / unfiled task
    title: text("title").notNull(),
    description: text("description"),

    lane: lane("lane").notNull().default("ops"),
    status: taskStatus("status").notNull().default("todo"),
    priority: priority("priority").notNull().default("normal"),

    assigneeId: uuid("assignee_id").references(() => users.id),
    dueDate: date("due_date"),

    // Fractional index for drag ordering within a column. Insert between two
    // cards by averaging their positions. Rebalance the column when the gap
    // drops below 0.0001.
    position: doublePrecision("position").notNull().default(1000),

    // Set when the task was born inside a note. Lets you jump back to the
    // meeting it came from, which is the whole point.
    originNoteId: uuid("origin_note_id").references(() => notes.id, {
      onDelete: "set null",
    }),

    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => ({
    // Drives the venture board.
    boardIdx: index("tasks_board_idx").on(t.ventureId, t.status, t.position),
    // Drives My Work across every venture.
    assigneeIdx: index("tasks_assignee_idx").on(t.assigneeId, t.status, t.dueDate),
  })
);

export const taskComments = pgTable("task_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ---------------------------------------------------------------------------
   CALENDAR
   Google is the source of truth for the event body. This table is a local
   mirror plus the AVL-specific link to a venture.
--------------------------------------------------------------------------- */

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "set null",
    }),
    googleEventId: text("google_event_id"),
    googleCalendarId: text("google_calendar_id"),
    ownerId: uuid("owner_id").references(() => users.id),

    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    isAllDay: boolean("is_all_day").notNull().default(false),

    // Note created for this meeting. One click from the calendar.
    noteId: uuid("note_id").references(() => notes.id, { onDelete: "set null" }),

    etag: text("etag"),
    syncedAt: timestamp("synced_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    googleIdx: uniqueIndex("events_google_idx").on(t.googleCalendarId, t.googleEventId),
    rangeIdx: index("events_range_idx").on(t.startsAt),
  })
);

/* Per-user sync cursor for Google's incremental sync. */
export const calendarSyncState = pgTable("calendar_sync_state", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  calendarId: text("calendar_id").notNull(),
  syncToken: text("sync_token"),
  channelId: text("channel_id"), // push notification channel
  channelExpiresAt: timestamp("channel_expires_at", { withTimezone: true }),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
});

/* ---------------------------------------------------------------------------
   DECISIONS
   One line each. The cheapest table here and the one you will thank
   yourself for in a year.
--------------------------------------------------------------------------- */

export const decisions = pgTable("decisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  ventureId: uuid("venture_id").references(() => ventures.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  rationale: text("rationale"),
  // One-line addition for parity with notes/docs: "studio" (default) is
  // internal-only, "shared" is visible to founder users. Founder-facing
  // decision surfacing is not built yet — see docs/founder-access.md.
  visibility: visibility("visibility").notNull().default("studio"),
  decidedBy: uuid("decided_by").references(() => users.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }).defaultNow().notNull(),
  sourceNoteId: uuid("source_note_id").references(() => notes.id, {
    onDelete: "set null",
  }),
});

/* ---------------------------------------------------------------------------
   ACTIVITY AND NOTIFICATIONS
   Every mutation writes one activity row. Notifications are fan-out rows
   pointing at it. With four users, fan-out on write is fine.
--------------------------------------------------------------------------- */

export const activity = pgTable(
  "activity",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id),
    verb: text("verb").notNull(), // created, moved, assigned, mentioned, completed
    entity: entityType("entity").notNull(),
    entityId: uuid("entity_id").notNull(),
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "cascade",
    }),
    payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    ventureIdx: index("activity_venture_idx").on(t.ventureId, t.createdAt),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activity.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    unreadIdx: index("notifications_unread_idx").on(t.userId, t.readAt),
  })
);

/* ---------------------------------------------------------------------------
   TEMPLATES
   Seeds gate items and starter tasks when a venture is created or promoted.
   Keep it as data, not code, so you can edit process without a deploy.
--------------------------------------------------------------------------- */

export const stageTemplates = pgTable("stage_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  stage: ventureStage("stage").notNull(),
  kind: text("kind").notNull(), // "gate" | "task"
  label: text("label").notNull(),
  lane: lane("lane"), // only for kind = task
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

/* ---------------------------------------------------------------------------
   VENTURE MEMBERS
   How an external founder user is linked to the one venture they can see.
   This is deliberately separate from ventures.ownerId — ownerId stays the
   internal partner who runs the venture; membership is the founder side.
--------------------------------------------------------------------------- */

export const ventureMembers = pgTable(
  "venture_members",
  {
    ventureId: uuid("venture_id")
      .notNull()
      .references(() => ventures.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: ventureMemberRole("role").notNull().default("founder"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.ventureId, t.userId] }),
    // "which ventures can this user see"
    userIdx: index("venture_members_user_idx").on(t.userId),
  })
);

/* ---------------------------------------------------------------------------
   APPLICATIONS
   The intake inbox. Every submission to the marketing site's Apply form
   lands here as one row via POST /api/intake, then is promoted to a venture
   in the Meet stage. Approved-or-not, we keep the row.
--------------------------------------------------------------------------- */

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    status: applicationStatus("status").notNull().default("new"),
    // Set once a venture is created from this application (see promote.ts).
    ventureId: uuid("venture_id").references(() => ventures.id, {
      onDelete: "set null",
    }),

    // Applicant identity. NB: column is applicant_role, NOT current_role —
    // current_role is a Postgres reserved word. The inbound multipart field
    // from the site is still "currentRole"; it's mapped on the way in.
    companyName: text("company_name").notNull(),
    founderName: text("founder_name").notNull(),
    founderEmail: text("founder_email").notNull(),
    linkedin: text("linkedin"),
    location: text("location"),
    applicantRole: text("applicant_role"),

    // Questionnaire answers — one column per question, all free text.
    domain: text("domain"),
    domainExperience: text("domain_experience"),
    domainInsight: text("domain_insight"),
    problem: text("problem"),
    customer: text("customer"),
    currentSolution: text("current_solution"),
    evidence: text("evidence"),
    customerIntros: text("customer_intros"),
    marketSize: text("market_size"),
    competition: text("competition"),
    whyNow: text("why_now"),
    whyAi: text("why_ai"),
    commitment: text("commitment"),
    priorProgress: text("prior_progress"),
    studioNeed: text("studio_need"),
    notes: text("notes"),

    // Pitch deck upload. All nullable — a deck is expected but we still store
    // the row if the upload failed.
    deckStorageKey: text("deck_storage_key"),
    deckName: text("deck_name"),
    deckMimeType: text("deck_mime_type"),
    deckSizeBytes: integer("deck_size_bytes"),

    source: text("source"), // utm / referrer string from the site
    rawPayload: jsonb("raw_payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),

    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    inboxIdx: index("applications_status_idx").on(t.status, t.createdAt),
  })
);
