ALTER TABLE "applications" ALTER COLUMN "founder_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "founder_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "color" text;