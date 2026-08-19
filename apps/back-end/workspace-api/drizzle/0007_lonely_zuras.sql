ALTER TABLE "applications" ALTER COLUMN "resume_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "resume_path" SET DATA TYPE varchar(500);