import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { applications, screeningDecisions, } from "../../db/schema.js";
// ================================
// GET SCREENING DECISION
// ================================
export async function getScreeningDecision(applicationId) {
    const result = await db
        .select({
        id: screeningDecisions.id,
        applicationId: screeningDecisions.applicationId,
        decision: screeningDecisions.decision,
        note: screeningDecisions.note,
        updatedAt: screeningDecisions.updatedAt,
        applicationStatus: applications.status,
    })
        .from(screeningDecisions)
        .innerJoin(applications, eq(screeningDecisions.applicationId, applications.id))
        .where(eq(screeningDecisions.applicationId, applicationId))
        .limit(1);
    return result[0] ?? null;
}
// ================================
// SAVE SCREENING DECISION
// ================================
export async function saveScreeningDecision(applicationId, decision, note) {
    // ================================
    // CHECK APPLICATION
    // ================================
    const application = await db
        .select({
        id: applications.id,
        status: applications.status,
    })
        .from(applications)
        .where(eq(applications.id, applicationId))
        .limit(1);
    if (!application[0]) {
        throw new Error("Application not found.");
    }
    // ================================
    // MAP DECISION → STATUS
    // ================================
    const statusMap = {
        pass: "shortlisted",
        hold: "on_hold",
        reject: "rejected",
    };
    const applicationStatus = statusMap[decision];
    // ================================
    // SAVE SCREENING
    // + UPDATE APPLICATION
    // ATOMIC TRANSACTION
    // ================================
    const result = await db.transaction(async (tx) => {
        const now = new Date();
        // ----------------------------
        // CREATE / UPDATE SCREENING
        // ----------------------------
        const screening = await tx
            .insert(screeningDecisions)
            .values({
            applicationId,
            decision,
            note: note?.trim() ||
                null,
            updatedAt: now,
        })
            .onConflictDoUpdate({
            target: screeningDecisions.applicationId,
            set: {
                decision,
                note: note?.trim() ||
                    null,
                updatedAt: now,
            },
        })
            .returning({
            id: screeningDecisions.id,
            applicationId: screeningDecisions.applicationId,
            decision: screeningDecisions.decision,
            note: screeningDecisions.note,
            updatedAt: screeningDecisions.updatedAt,
        });
        // ----------------------------
        // UPDATE APPLICATION STATUS
        // ----------------------------
        await tx
            .update(applications)
            .set({
            status: applicationStatus,
            updatedAt: now,
        })
            .where(eq(applications.id, applicationId));
        return screening[0];
    });
    if (!result) {
        throw new Error("Screening decision could not be saved.");
    }
    // ================================
    // RETURN
    // ================================
    return {
        ...result,
        applicationStatus,
    };
}
//# sourceMappingURL=screening.service.js.map