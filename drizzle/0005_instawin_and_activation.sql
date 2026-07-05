CREATE TYPE "public"."insta_win_display_mode" AS ENUM('countdown', 'prize_count', 'jackpot');--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "insta_win" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "insta_win_display_mode" "insta_win_display_mode" DEFAULT 'countdown' NOT NULL;--> statement-breakpoint
ALTER TABLE "instant_wins" ADD COLUMN "matched_at" timestamp;