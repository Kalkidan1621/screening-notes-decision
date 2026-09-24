import { desc, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";
import type { CreateJobInput } from "../schemas/jobs.js";

export async function createJob(
  data: CreateJobInput,
) {
  const result = await db
    .insert(jobs)
    .values({
      title: data.title,
      employer: data.employer,
      department: data.department,
      description: data.description,
      location: data.location,
      experience: data.experience,
      educationalQualification:
        data.educationalQualification,
      workingTime: data.workingTime,
      openingDate: data.openingDate,
      closingDate: data.closingDate,
      salary: data.salary,
      employmentType:
        data.employmentType,
      priority: data.priority,
      status: data.status,
    })
    .returning();
    if (!result[0]) {
  throw new Error(
    "Job was not created successfully.",
  );
}

  return result[0];
}

export async function getActiveJobs() {
  return db
    .select()
    .from(jobs)
    .where(
      eq(
        jobs.status,
        "active",
      ),
    )
    .orderBy(
      desc(
        jobs.createdAt,
      ),
    );
}

export async function getJobById(
  id: number,
) {
  const result = await db
    .select()
    .from(jobs)
    .where(
      eq(
        jobs.id,
        id,
      ),
    )
    .limit(1);

  return result[0] ?? null;
}