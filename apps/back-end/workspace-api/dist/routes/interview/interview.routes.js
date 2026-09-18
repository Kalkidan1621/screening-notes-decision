import { Hono } from "hono";
import { requireAuth, requireRole, } from "../../modules/auth/auth.middleware.js";
import { createInterviewSchema, updateInterviewStatusSchema, } from "./interview.schema.js";
import { createInterview, getApplicationInterview, updateInterviewStatus, } from "./interview.service.js";
const interviewRoutes = new Hono();
// ================================
// GET INTERVIEW
// ================================
interviewRoutes.get("/application/:applicationId", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "RECRUITER", "HIRING_MANAGER"), async (c) => {
    try {
        const applicationId = Number(c.req.param("applicationId"));
        if (!Number.isInteger(applicationId) ||
            applicationId <= 0) {
            return c.json({
                success: false,
                message: "Invalid application ID.",
            }, 400);
        }
        const interview = await getApplicationInterview(applicationId);
        return c.json({
            success: true,
            data: interview,
        });
    }
    catch (error) {
        console.error("Get interview error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to get interview.",
        }, 500);
    }
});
// ================================
// CREATE INTERVIEW
// ================================
interviewRoutes.post("/application/:applicationId", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "RECRUITER", "HIRING_MANAGER"), async (c) => {
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
        const parsed = createInterviewSchema.safeParse(body);
        if (!parsed.success) {
            console.error("Interview validation errors:", parsed.error.flatten().fieldErrors);
            return c.json({
                success: false,
                message: "Invalid interview data.",
                errors: parsed.error.flatten().fieldErrors,
            }, 400);
        }
        const result = await createInterview(applicationId, parsed.data);
        return c.json({
            success: true,
            message: "Interview scheduled successfully.",
            data: result,
        }, 201);
    }
    catch (error) {
        console.error("Create interview error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to schedule interview.",
        }, 500);
    }
});
interviewRoutes.patch("/:interviewId/status", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "RECRUITER", "HIRING_MANAGER"), async (c) => {
    const interviewId = Number(c.req.param("interviewId"));
    if (!Number.isInteger(interviewId) || interviewId <= 0) {
        return c.json({
            success: false,
            message: "Invalid interview ID.",
        }, 400);
    }
    const body = await c.req.json();
    const parsed = updateInterviewStatusSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({
            success: false,
            message: parsed.error.issues[0]?.message ??
                "Invalid interview status.",
        }, 400);
    }
    try {
        const result = await updateInterviewStatus(interviewId, parsed.data.status);
        return c.json({
            success: true,
            message: parsed.data.status === "completed"
                ? "Interview completed. Application moved to Hiring Decision."
                : `Interview marked as ${parsed.data.status}.`,
            data: result,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to update interview status.";
        return c.json({
            success: false,
            message,
        }, 400);
    }
});
export default interviewRoutes;
//# sourceMappingURL=interview.routes.js.map