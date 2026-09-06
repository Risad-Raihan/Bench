DROP INDEX "tasks_board_idx";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "lane" DROP DEFAULT;--> statement-breakpoint
CREATE INDEX "tasks_board_idx" ON "tasks" USING btree ("venture_id","lane","status","position");