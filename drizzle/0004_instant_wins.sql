CREATE TABLE "instant_wins" (
	"id" text PRIMARY KEY NOT NULL,
	"competition_id" text NOT NULL,
	"ticket_number" integer NOT NULL,
	"prize_name" varchar(255) NOT NULL,
	"prize_value" integer NOT NULL,
	"ticket_id" text,
	"user_id" text,
	"claimed_at" timestamp,
	"revealed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "instant_wins" ADD CONSTRAINT "instant_wins_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instant_wins" ADD CONSTRAINT "instant_wins_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instant_wins" ADD CONSTRAINT "instant_wins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;