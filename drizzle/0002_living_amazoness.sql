CREATE TYPE "public"."application_status" AS ENUM('new', 'reviewing', 'approved', 'passed');--> statement-breakpoint
CREATE TYPE "public"."venture_member_role" AS ENUM('founder', 'collaborator');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('studio', 'shared');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'founder';--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "application_status" DEFAULT 'new' NOT NULL,
	"venture_id" uuid,
	"company_name" text NOT NULL,
	"founder_name" text NOT NULL,
	"founder_email" text NOT NULL,
	"linkedin" text,
	"location" text,
	"applicant_role" text,
	"domain" text,
	"domain_experience" text,
	"domain_insight" text,
	"problem" text,
	"customer" text,
	"current_solution" text,
	"evidence" text,
	"customer_intros" text,
	"market_size" text,
	"competition" text,
	"why_now" text,
	"why_ai" text,
	"commitment" text,
	"prior_progress" text,
	"studio_need" text,
	"notes" text,
	"deck_storage_key" text,
	"deck_name" text,
	"deck_mime_type" text,
	"deck_size_bytes" integer,
	"source" text,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venture_members" (
	"venture_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "venture_member_role" DEFAULT 'founder' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "venture_members_venture_id_user_id_pk" PRIMARY KEY("venture_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "decisions" ADD COLUMN "visibility" "visibility" DEFAULT 'studio' NOT NULL;--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "visibility" "visibility" DEFAULT 'studio' NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "visibility" "visibility" DEFAULT 'studio' NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_venture_id_ventures_id_fk" FOREIGN KEY ("venture_id") REFERENCES "public"."ventures"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venture_members" ADD CONSTRAINT "venture_members_venture_id_ventures_id_fk" FOREIGN KEY ("venture_id") REFERENCES "public"."ventures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venture_members" ADD CONSTRAINT "venture_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "venture_members_user_idx" ON "venture_members" USING btree ("user_id");