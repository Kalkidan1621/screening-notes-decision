CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"location" varchar(100) NOT NULL,
	"employment_type" varchar(50) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
