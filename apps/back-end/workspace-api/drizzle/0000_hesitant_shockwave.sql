CREATE TABLE "screening_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"stage_id" varchar(255) NOT NULL,
	"decision" varchar(20) NOT NULL,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
