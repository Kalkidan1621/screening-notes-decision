import { Hono } from "hono";
import { requireAuth, requireRole, } from "../auth/auth.middleware.js";
import { screeningDecisionSchema, } from "./screening.schema.js";
import { getScreeningDecision, saveScreeningDecision, } from "./screening.service.js";
const screeningRoutes = new Hono();
// ================================
// GET SCREENING DECISION
// ================================
screeningRoutes.get("/application/:applicationId", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "RECRUITER", "HIRING_MANAGER"), async (c) => {
    try {
        const applicationId = Number(c.req.param("applicationId"));
        if (!Number.isInteger(applicationId) ||
            applicationId <= 0) {
            return c.json({
                success: false,
                message: "Invalid application ID.",
            }, 400);
        }
        const screening = await getScreeningDecision(applicationId);
        return c.json({
            success: true,
            data: screening,
        });
    }
    catch (error) {
        console.error("Get screening error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to get screening decision.",
        }, 500);
    }
});
// ================================
// SAVE SCREENING DECISION
// ================================
screeningRoutes.post("/application/:applicationId", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "RECRUITER", "HIRING_MANAGER"), async (c) => {
    try {
        const applicationId = Number(c.req.param("applicationId"));
        if (!Number.isInteger(applicationId) ||
            applicationId <= 0) {
            return c.json({
                success: false,
                message: "Invalid application ID.",
            }, 400);
        }
        const body = await c.req.json();
        const parsed = screeningDecisionSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid screening data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        const result = await saveScreeningDecision(applicationId, parsed.data.decision, parsed.data.note);
        return c.json({
            success: true,
            message: "Screening decision saved successfully.",
            data: result,
        }, 200);
    }
    catch (error) {
        console.error("Save screening error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to save screening decision.",
        }, 500);
    }
});
export default screeningRoutes;
//# sourceMappingURL=screening.routes.js.map