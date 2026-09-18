import { Hono } from "hono";
import { createJobSchema } from "../schemas/jobs.js";
import { createJob, getActiveJobs, getJobById, } from "../services/jobs.js";
import { requireAuth, requirePermission, } from "../modules/auth/auth.middleware.js";
const jobsRouter = new Hono();
// ================================
// GET ALL ACTIVE JOBS
// Public
// ================================
jobsRouter.get("/", async (c) => {
    const activeJobs = await getActiveJobs();
    return c.json({
        success: true,
        data: activeJobs,
    });
});
// ================================
// GET ONE JOB
// Public
// ================================
jobsRouter.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) ||
        id <= 0) {
        return c.json({
            success: false,
            message: "Invalid job ID.",
        }, 400);
    }
    const job = await getJobById(id);
    if (!job) {
        return c.json({
            success: false,
            message: "Job not found.",
        }, 404);
    }
    return c.json({
        success: true,
        data: job,
    });
});
// ================================
// CREATE JOB
// Recruiter / authorized user
// ================================
jobsRouter.post("/", requireAuth, requirePermission("jobs.create"), async (c) => {
    const body = await c.req.json();
    const result = createJobSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            success: false,
            message: "Validation failed.",
            errors: result.error.flatten(),
        }, 400);
    }
    const createdJob = await createJob(result.data);
    return c.json({
        success: true,
        message: "Job created successfully.",
        data: createdJob,
    }, 201);
});
export default jobsRouter;
//# sourceMappingURL=jobs.js.map