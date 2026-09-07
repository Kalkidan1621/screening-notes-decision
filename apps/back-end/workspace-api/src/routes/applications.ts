import { Hono } from "hono";

import {
  createApplicationSchema,
} from "../schemas/applications.js";

import {
  createApplication,
  getAllApplications,
   getApplicationsByCandidateId,
  getApplicationsByJobId,
  getApplicationById,
  getApplicationStats,
  updateApplicationStatus,
} from "../services/applications.js";

import {
  requireAuth,
  requirePermission,
  requireRole,
} from "../modules/auth/auth.middleware.js";

const applicationsRouter = new Hono();

// ================================
// GET ALL APPLICATIONS
// Recruiter / Hiring Manager / Admin
// ================================

applicationsRouter.get(
  "/",
  requireAuth,
  requirePermission(
    "applications.read",
  ),
  async (c) => {
    const applications =
      await getAllApplications();

    return c.json({
      success: true,
      data: applications,
    });
  },
);

// ================================
// GET MY APPLICATIONS
// Candidate only
// ================================

applicationsRouter.get(
  "/candidate/me",
  requireAuth,
  requireRole("CANDIDATE"),
  async (c) => {
    const user = c.get("user");

    const applications =
      await getApplicationsByCandidateId(
        user.id,
      );

    return c.json({
      success: true,
      data: applications,
    });
  },
);
// ================================
// CREATE APPLICATION
// Candidate
// Public
// ================================

applicationsRouter.post(
  "/",
   requireAuth,
  requireRole("CANDIDATE"),
  async (c) => {
    const user = c.get("user");
    
    const body =
      await c.req.parseBody();

    const resume =
      body.resume;

    const data = {
      jobId: Number(
        body.jobId,
      ),

      fullName: String(
        body.fullName ?? "",
      ),

      email: String(
        body.email ?? "",
      ),

      phone: String(
        body.phone ?? "",
      ),

      resume,
    };

    const result =
      createApplicationSchema.safeParse(
        data,
      );

    if (!result.success) {
      console.error(
        "application validation error:",
        result.error.flatten()
      )
      return c.json(
        {
          success: false,
          message:
            "Validation failed.",
          errors:
            result.error.flatten(),
        },
        400,
      );
    }

    const application =
      await createApplication(
        result.data,
        user.id,
      );

    return c.json(
      {
        success: true,
        message:
          "Application submitted successfully.",
        data: application,
      },
      201,
    );
  },
);

// ================================
// APPLICATION STATISTICS
// Admin / Recruiter
// ================================

applicationsRouter.get(
  "/stats",
  requireAuth,
  requirePermission(
    "applications.stats.read",
  ),
  async (c) => {
    const stats =
      await getApplicationStats();

    return c.json({
      success: true,
      data: stats,
    });
  },
);

// ================================
// GET APPLICATIONS BY JOB
// ================================

applicationsRouter.get(
  "/job/:jobId",
  requireAuth,
  requirePermission(
    "applications.read",
  ),
  async (c) => {
    const jobId = Number(
      c.req.param("jobId"),
    );

    if (
      !Number.isInteger(jobId) ||
      jobId <= 0
    ) {
      return c.json(
        {
          success: false,
          message:
            "Invalid job ID.",
        },
        400,
      );
    }

    const applications =
      await getApplicationsByJobId(
        jobId,
      );

    return c.json({
      success: true,
      data: applications,
    });
  },
);

// ================================
// GET APPLICATION BY ID
// ================================

applicationsRouter.get(
  "/:id",
  requireAuth,
  requirePermission(
    "applications.read",
  ),
  async (c) => {
    const id = Number(
      c.req.param("id"),
    );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return c.json(
        {
          success: false,
          message:
            "Invalid application ID.",
        },
        400,
      );
    }

    const application =
      await getApplicationById(id);

    if (!application) {
      return c.json(
        {
          success: false,
          message:
            "Application not found.",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: application,
    });
  },
);



// ================================
// UPDATE APPLICATION STATUS
// Admin / Recruiter
// ================================

applicationsRouter.patch(
  "/:id/status",
  requireAuth,
  requirePermission(
    "applications.status.update",
  ),
  async (c) => {
    const id = Number(
      c.req.param("id"),
    );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return c.json(
        {
          success: false,
          message:
            "Invalid application ID.",
        },
        400,
      );
    }

    const body =
      await c.req.json();

    if (
      body.status !==
        "approved" &&
      body.status !==
        "rejected"
    ) {
      return c.json(
        {
          success: false,
          message:
            "Status must be either approved or rejected.",
        },
        400,
      );
    }

    const updatedApplication =
      await updateApplicationStatus(
        id,
        body.status,
      );

    if (!updatedApplication) {
      return c.json(
        {
          success: false,
          message:
            "Application not found.",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message:
        `Application ${body.status} successfully.`,
      data: updatedApplication,
    });
  },
);

export default applicationsRouter;