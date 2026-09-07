CREATE TABLE "hiring_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"decision" varchar(20) NOT NULL,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hiring_decisions_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
ALTER TABLE "hiring_decisions" ADD CONSTRAINT "hiring_decisions_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;