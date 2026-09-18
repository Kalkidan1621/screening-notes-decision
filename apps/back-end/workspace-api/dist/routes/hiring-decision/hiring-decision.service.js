import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { applications, hiringDecisions, } from "../../db/schema.js";
/* =========================================================
   GET HIRING DECISION
========================================================= */
export async function getHiringDecision(applicationId) {
    const result = await db
        .select()
        .from(hiringDecisions)
        .where(eq(hiringDecisions.applicationId, applicationId))
        .limit(1);
    return result[0] ?? null;
}
/* =========================================================
   SAVE HIRING DECISION

   APPROVE
      hiring_decision
            ↓
      ready_for_hire

   HOLD
      hiring_decision
            ↓
         on_hold

   REJECT
      hiring_decision
            ↓
         rejected
========================================================= */
export async function saveHiringDecision(applicationId, data) {
    return await db.transaction(async (tx) => {
        /* -----------------------------------------------------
           1. FIND APPLICATION
        ----------------------------------------------------- */
        const applicationResult = await tx
            .select()
            .from(applications)
            .where(eq(applications.id, applicationId))
            .limit(1);
        const application = applicationResult[0];
        if (!application) {
            throw new Error("Application not found.");
        }
        /* -----------------------------------------------------
           2. APPLICATION MUST BE IN HIRING DECISION
        ----------------------------------------------------- */
        if (application.status !==
            "hiring_decision") {
            throw new Error("This application is not ready for a hiring decision.");
        }
        /* -----------------------------------------------------
           3. CALCULATE NEXT STATUS
        ----------------------------------------------------- */
        let nextStatus;
        switch (data.decision) {
            case "approve":
                nextStatus =
                    "ready_for_hire";
                break;
            case "hold":
                nextStatus = "on_hold";
                break;
            case "reject":
                nextStatus = "rejected";
                break;
            default:
                throw new Error("Invalid hiring decision.");
        }
        const now = new Date();
        /* -----------------------------------------------------
           4. FIND EXISTING DECISION
        ----------------------------------------------------- */
        const existingResult = await tx
            .select()
            .from(hiringDecisions)
            .where(eq(hiringDecisions.applicationId, applicationId))
            .limit(1);
        const existing = existingResult[0];
        let decision;
        /* -----------------------------------------------------
           5. UPDATE EXISTING DECISION
        ----------------------------------------------------- */
        if (existing) {
            const updated = await tx
                .update(hiringDecisions)
                .set({
                decision: data.decision,
                note: data.note ?? null,
                updatedAt: now,
            })
                .where(eq(hiringDecisions.id, existing.id))
                .returning();
            decision = updated[0];
        }
        /* -----------------------------------------------------
           6. CREATE NEW DECISION
        ----------------------------------------------------- */
        else {
            const inserted = await tx
                .insert(hiringDecisions)
                .values({
                applicationId,
                decision: data.decision,
                note: data.note ?? null,
                updatedAt: now,
            })
                .returning();
            decision = inserted[0];
        }
        /* -----------------------------------------------------
           7. UPDATE APPLICATION STATUS
        ----------------------------------------------------- */
        await tx
            .update(applications)
            .set({
            status: nextStatus,
            updatedAt: now,
        })
            .where(eq(applications.id, applicationId));
        return decision;
    });
}
/* =========================================================
   REVIEW AGAIN

   ONLY:

      on_hold
         ↓
      hiring_decision
========================================================= */
export async function moveApplicationToHiringDecision(applicationId) {
    /* -------------------------------------------------------
       1. FIND APPLICATION
    ------------------------------------------------------- */
    const applicationResult = await db
        .select()
        .from(applications)
        .where(eq(applications.id, applicationId))
        .limit(1);
    const application = applicationResult[0];
    if (!application) {
        throw new Error("Application not found.");
    }
    /* -------------------------------------------------------
       2. ONLY ON HOLD CAN BE REVIEWED AGAIN
    ------------------------------------------------------- */
    if (application.status !==
        "on_hold") {
        throw new Error("Only applications on hold can be reviewed again.");
    }
    /* -------------------------------------------------------
       3. MOVE TO HIRING DECISION
    ------------------------------------------------------- */
    const now = new Date();
    const result = await db
        .update(applications)
        .set({
        status: "hiring_decision",
        updatedAt: now,
    })
        .where(eq(applications.id, applicationId))
        .returning();
    return result[0];
}
/* =========================================================
   MARK APPLICATION AS HIRED

   ONLY:

      ready_for_hire
            ↓
          hired
========================================================= */
export async function markApplicationAsHired(applicationId) {
    /* -------------------------------------------------------
       1. FIND APPLICATION
    ------------------------------------------------------- */
    const applicationResult = await db
        .select()
        .from(applications)
        .where(eq(applications.id, applicationId))
        .limit(1);
    const application = applicationResult[0];
    if (!application) {
        throw new Error("Application not found.");
    }
    /* -------------------------------------------------------
       2. ONLY READY FOR HIRE CAN BECOME HIRED
    ------------------------------------------------------- */
    if (application.status !==
        "ready_for_hire") {
        throw new Error("Only applications ready for hire can be marked as hired.");
    }
    /* -------------------------------------------------------
       3. UPDATE STATUS TO HIRED
    ------------------------------------------------------- */
    const now = new Date();
    const result = await db
        .update(applications)
        .set({
        status: "hired",
        updatedAt: now,
    })
        .where(eq(applications.id, applicationId))
        .returning();
    return result[0];
}
//# sourceMappingURL=hiring-decision.service.js.map