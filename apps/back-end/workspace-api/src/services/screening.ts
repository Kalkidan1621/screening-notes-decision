import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { screeningDecisions } from "../db/schema.js";

export async function getScreeningDecision(stageId: string) {
  const result = await db
    .select({
      decision: screeningDecisions.decision,
      note: screeningDecisions.note,
      updatedAt: screeningDecisions.updatedAt,
    })
    .from(screeningDecisions)
    .where(eq(screeningDecisions.stageId, stageId))
    .limit(1);

  return result[0] ?? null;
}

export async function saveScreeningDecision(
  stageId: string,
  decision: "pass" | "hold" | "reject",
  note?: string,
) {
  const existing = await getScreeningDecision(stageId);

  if (existing) {
    const result = await db
      .update(screeningDecisions)
      .set({
        decision,
        note,
        updatedAt: new Date(),
      })
      .where(eq(screeningDecisions.stageId, stageId))
      .returning({
        decision: screeningDecisions.decision,
        note: screeningDecisions.note,
        updatedAt: screeningDecisions.updatedAt,
      });

    return result[0];
  }

  const result = await db
    .insert(screeningDecisions)
    .values({
      stageId,
      decision,
      note,
    })
    .returning({
      decision: screeningDecisions.decision,
      note: screeningDecisions.note,
      updatedAt: screeningDecisions.updatedAt,
    });

  return result[0];
}