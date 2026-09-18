import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { screeningDecisions, } from "../db/schema.js";
export async function getScreeningDecision(applicationId) {
    const result = await db
        .select({
        id: screeningDecisions.id,
        applicationId: screeningDecisions.applicationId,
        decision: screeningDecisions.decision,
        note: screeningDecisions.note,
        updatedAt: screeningDecisions.updatedAt,
    })
        .from(screeningDecisions)
        .where(eq(screeningDecisions.applicationId, applicationId))
        .limit(1);
    return result[0] ?? null;
}
export async function saveScreeningDecision(applicationId, decision, note) {
    const existing = await getScreeningDecision(applicationId);
    if (existing) {
        const result = await db
            .update(screeningDecisions)
            .set({
            decision,
            note,
            updatedAt: new Date(),
        })
            .where(eq(screeningDecisions.applicationId, applicationId))
            .returning({
            id: screeningDecisions.id,
            applicationId: screeningDecisions.applicationId,
            decision: screeningDecisions.decision,
            note: screeningDecisions.note,
            updatedAt: screeningDecisions.updatedAt,
        });
        return result[0];
    }
    const result = await db
        .insert(screeningDecisions)
        .values({
        applicationId,
        decision,
        note,
    })
        .returning({
        id: screeningDecisions.id,
        applicationId: screeningDecisions.applicationId,
        decision: screeningDecisions.decision,
        note: screeningDecisions.note,
        updatedAt: screeningDecisions.updatedAt,
    });
    return result[0];
}
//# sourceMappingURL=screening.js.map