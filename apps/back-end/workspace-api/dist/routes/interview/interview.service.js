import { and, eq, } from "drizzle-orm";
import { db } from "../../db/index.js";
import { applications, interviews, roles, users, } from "../../db/schema.js";
export async function getApplicationInterview(applicationId) {
    const result = await db
        .select({
        id: interviews.id,
        applicationId: interviews.applicationId,
        interviewType: interviews.interviewType,
        scheduledAt: interviews.scheduledAt,
        location: interviews.location,
        notes: interviews.notes,
        status: interviews.status,
        interviewerId: interviews.interviewerId,
        interviewerFirstName: users.firstName,
        interviewerLastName: users.lastName,
        createdAt: interviews.createdAt,
        updatedAt: interviews.updatedAt,
    })
        .from(interviews)
        .leftJoin(users, eq(interviews.interviewerId, users.id))
        .where(eq(interviews.applicationId, applicationId))
        .limit(1);
    return result[0] ?? null;
}
export async function createInterview(applicationId, input) {
    // --------------------------------------------------
    // 1. Make sure application exists
    // --------------------------------------------------
    const application = await db
        .select({
        id: applications.id,
        status: applications.status,
    })
        .from(applications)
        .where(eq(applications.id, applicationId))
        .limit(1);
    if (application.length === 0) {
        throw new Error("Application not found.");
    }
    const currentApplication = application[0];
    if (!currentApplication) {
        throw new Error("Application not found.");
    }
    // Interview should normally start
    // from shortlisted applications.
    if (currentApplication.status !==
        "shortlisted") {
        throw new Error("Only shortlisted applications can have an interview scheduled.");
    }
    // --------------------------------------------------
    // 2. Validate interviewer
    // --------------------------------------------------
    if (input.interviewerId !== undefined) {
        const interviewer = await db
            .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            isActive: users.isActive,
            roleName: roles.name,
        })
            .from(users)
            .innerJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.id, input.interviewerId))
            .limit(1);
        const selectedInterviewer = interviewer[0];
        if (!selectedInterviewer) {
            throw new Error("Interviewer not found.");
        }
        if (!selectedInterviewer.isActive) {
            throw new Error("The selected interviewer is inactive.");
        }
        if (selectedInterviewer.roleName !==
            "RECRUITER" &&
            selectedInterviewer.roleName !==
                "HIRING_MANAGER") {
            throw new Error("The selected user cannot be assigned as an interviewer.");
        }
    }
    // --------------------------------------------------
    // 3. Prevent duplicate scheduled interview
    // --------------------------------------------------
    const existingInterview = await db
        .select({
        id: interviews.id,
        status: interviews.status,
    })
        .from(interviews)
        .where(and(eq(interviews.applicationId, applicationId), eq(interviews.status, "scheduled")))
        .limit(1);
    if (existingInterview.length > 0) {
        throw new Error("This application already has a scheduled interview.");
    }
    // --------------------------------------------------
    // 4. Insert interview
    // --------------------------------------------------
    const now = new Date();
    const inserted = await db
        .insert(interviews)
        .values({
        applicationId,
        interviewType: input.interviewType,
        scheduledAt: new Date(input.scheduledAt),
        interviewerId: input.interviewerId,
        location: input.location,
        notes: input.notes,
        status: "scheduled",
        createdAt: now,
        updatedAt: now,
    })
        .returning({
        id: interviews.id,
        applicationId: interviews.applicationId,
        interviewType: interviews.interviewType,
        scheduledAt: interviews.scheduledAt,
        location: interviews.location,
        notes: interviews.notes,
        status: interviews.status,
        interviewerId: interviews.interviewerId,
        createdAt: interviews.createdAt,
        updatedAt: interviews.updatedAt,
    });
    const interview = inserted[0];
    if (!interview) {
        throw new Error("Failed to create interview.");
    }
    // --------------------------------------------------
    // 5. Load interviewer information
    // --------------------------------------------------
    const interviewer = interview.interviewerId
        ? await db
            .select({
            firstName: users.firstName,
            lastName: users.lastName,
        })
            .from(users)
            .where(eq(users.id, interview.interviewerId))
            .limit(1)
        : [];
    return {
        ...interview,
        interviewerFirstName: interviewer[0]
            ?.firstName ?? null,
        interviewerLastName: interviewer[0]
            ?.lastName ?? null,
    };
}
export async function updateInterviewStatus(interviewId, status) {
    return await db.transaction(async (tx) => {
        // ========================================
        // 1. Find interview
        // ========================================
        const existingInterview = await tx
            .select({
            id: interviews.id,
            applicationId: interviews.applicationId,
            status: interviews.status,
        })
            .from(interviews)
            .where(eq(interviews.id, interviewId))
            .limit(1);
        const existing = existingInterview[0];
        if (!existing) {
            throw new Error("Interview not found.");
        }
        // ========================================
        // 2. Prevent finalized interview changes
        // ========================================
        if (existing.status === "completed" ||
            existing.status === "cancelled" ||
            existing.status === "no_show") {
            throw new Error(`Interview is already ${existing.status}.`);
        }
        // ========================================
        // 3. Update interview
        // ========================================
        const now = new Date();
        const updatedInterview = await tx
            .update(interviews)
            .set({
            status,
            updatedAt: now,
        })
            .where(eq(interviews.id, interviewId))
            .returning({
            id: interviews.id,
            applicationId: interviews.applicationId,
            interviewType: interviews.interviewType,
            scheduledAt: interviews.scheduledAt,
            location: interviews.location,
            notes: interviews.notes,
            status: interviews.status,
            interviewerId: interviews.interviewerId,
            createdAt: interviews.createdAt,
            updatedAt: interviews.updatedAt,
        });
        const interview = updatedInterview[0];
        if (!interview) {
            throw new Error("Failed to update interview status.");
        }
        // ========================================
        // 4. COMPLETED → HIRING DECISION
        // ========================================
        if (status === "completed") {
            const updatedApplication = await tx
                .update(applications)
                .set({
                status: "hiring_decision",
                updatedAt: now,
            })
                .where(eq(applications.id, interview.applicationId))
                .returning({
                id: applications.id,
                status: applications.status,
            });
            const application = updatedApplication[0];
            if (!application) {
                throw new Error("Application could not be moved to Hiring Decision.");
            }
            // IMPORTANT:
            // Verify that the database really contains
            // hiring_decision after the update.
            if (application.status !==
                "hiring_decision") {
                throw new Error(`Application status update failed. Current status: ${application.status}`);
            }
        }
        // ========================================
        // 5. Load interviewer
        // ========================================
        const interviewer = interview.interviewerId
            ? await tx
                .select({
                firstName: users.firstName,
                lastName: users.lastName,
            })
                .from(users)
                .where(eq(users.id, interview.interviewerId))
                .limit(1)
            : [];
        // ========================================
        // 6. Return result
        // ========================================
        return {
            ...interview,
            interviewerFirstName: interviewer[0]
                ?.firstName ?? null,
            interviewerLastName: interviewer[0]
                ?.lastName ?? null,
            applicationStatus: status === "completed"
                ? "hiring_decision"
                : undefined,
        };
    });
}
//# sourceMappingURL=interview.service.js.map