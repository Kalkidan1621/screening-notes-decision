import { desc, eq, count } from "drizzle-orm";

import { db } from "../db/index.js";
import { applications, jobs } from "../db/schema.js";

import type {
  CreateApplicationInput,
} from "../schemas/applications.js";

import cloudinary from "../config/cloudinary.js";

export async function createApplication(
  data: CreateApplicationInput,
) {
  // Convert File to Buffer
  const arrayBuffer = await data.resume.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload CV to Cloudinary
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "application/cv",

        // IMPORTANT:
        // CV is a PDF/raw file, not an image
        resource_type: "image",

        public_id: `${Date.now()}-${data.resume.name.replace(
          /\.[^/.]+$/,
          "",
        )}`,
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(
            new Error("Cloudinary upload failed."),
          );
        }
      },
    );

    uploadStream.end(buffer);
  });

  // Save application + Cloudinary URL
  const result = await db
    .insert(applications)
    .values({
      jobId: data.jobId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,

      resumeName: data.resume.name,

      resumeUrl: uploadResult.secure_url,

      resumePath: uploadResult.public_id,
    })
    .returning();

  return result[0];
}

export async function getApplicationsByJobId(
  jobId: number,
) {
  return db
    .select()
    .from(applications)
    .where(
      eq(
        applications.jobId,
        jobId,
      ),
    )
    .orderBy(
      desc(applications.createdAt),
    );
}

export async function getApplicationById(
  applicationId: number,
) {
  const result = await db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,

      fullName: applications.fullName,
      email: applications.email,
      phone: applications.phone,

      resumeName:
        applications.resumeName,

      resumeUrl:
        applications.resumeUrl,

      status: applications.status,

      createdAt:
        applications.createdAt,

      updatedAt:
        applications.updatedAt,
    })
    .from(applications)
    .leftJoin(
      jobs,
      eq(
        applications.jobId,
        jobs.id,
      ),
    )
    .where(
      eq(
        applications.id,
        applicationId,
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getAllApplications() {
  return db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,

      fullName: applications.fullName,
      email: applications.email,
      phone: applications.phone,

      resumeName:
        applications.resumeName,

      // IMPORTANT: return URL for CV viewing
      resumeUrl:
        applications.resumeUrl,

      status: applications.status,

      createdAt:
        applications.createdAt,

      updatedAt:
        applications.updatedAt,
    })
    .from(applications)
    .leftJoin(
      jobs,
      eq(
        applications.jobId,
        jobs.id,
      ),
    );
}

export async function updateApplicationStatus(
  applicationId: number,
  status:
    | "approved"
    | "rejected",
) {
  const result = await db
    .update(applications)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(
      eq(
        applications.id,
        applicationId,
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function getApplicationStats() {
  const totalResult = await db
    .select({
      count: count(),
    })
    .from(applications);

  const pendingResult = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(
      eq(
        applications.status,
        "pending",
      ),
    );

  const approvedResult = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(
      eq(
        applications.status,
        "approved",
      ),
    );

  const rejectedResult = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(
      eq(
        applications.status,
        "rejected",
      ),
    );

  return {
    total:
      totalResult[0]?.count ?? 0,

    pending:
      pendingResult[0]?.count ?? 0,

    approved:
      approvedResult[0]?.count ?? 0,

    rejected:
      rejectedResult[0]?.count ?? 0,
  };
}