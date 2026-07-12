CREATE TYPE "public"."wheel_game_status" AS ENUM('live', 'won', 'closed');--> statement-breakpoint
CREATE TYPE "public"."wheel_spin_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TABLE "wheel_games" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"image_url" text,
	"price_per_spin" integer NOT NULL,
	"profit_target" integer NOT NULL,
	"prize_name" varchar(255) NOT NULL,
	"prize_value" integer NOT NULL,
	"revenue_pence" integer DEFAULT 0 NOT NULL,
	"status" "wheel_game_status" DEFAULT 'live' NOT NULL,
	"winning_spin_id" text,
	"winner_user_id" text,
	"won_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wheel_games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "wheel_spins" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"user_id" text NOT NULL,
	"price_pence" integer NOT NULL,
	"status" "wheel_spin_status" DEFAULT 'pending' NOT NULL,
	"is_winner" boolean DEFAULT false NOT NULL,
	"stripe_session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wheel_games" ADD CONSTRAINT "wheel_games_winner_user_id_users_id_fk" FOREIGN KEY ("winner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wheel_spins" ADD CONSTRAINT "wheel_spins_game_id_wheel_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."wheel_games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wheel_spins" ADD CONSTRAINT "wheel_spins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;