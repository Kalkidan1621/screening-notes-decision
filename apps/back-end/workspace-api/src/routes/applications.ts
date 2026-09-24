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
  getApplicationInterview,
} from "./interview/interview.service.js";

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
// GET MY APPLICATION INTERVIEW
// Candidate only
// ================================

applicationsRouter.get(
  "/candidate/me/:applicationId/interview",
  requireAuth,
  requireRole("CANDIDATE"),
  async (c) => {
    const user = c.get("user");

    const applicationId = Number(
      c.req.param("applicationId"),
    );

    if (
      !Number.isInteger(applicationId) ||
      applicationId <= 0
    ) {
      return c.json(
        {
          success: false,
          message: "Invalid application ID.",
        },
        400,
      );
    }

    try {
      /*
       * First verify that this application
       * belongs to the authenticated candidate.
       */
      const applications =
        await getApplicationsByCandidateId(
          user.id,
        );

      const application =
        applications.find(
          (item) =>
            item.id === applicationId,
        );

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

      /*
       * The interview service already knows
       * how to retrieve an interview by
       * application ID.
       */
      const interview =
        await getApplicationInterview(
          applicationId,
        );

      return c.json({
        success: true,
        data: interview,
      });
    } catch (error) {
      console.error(
        "Get candidate interview error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to get interview details.",
        },
        500,
      );
    }
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
// VIEW APPLICATION CV
// Authenticated users with applications.read
// ================================

applicationsRouter.get(
  "/:id/cv",
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

    if (!application.resumeUrl) {
      return c.json(
        {
          success: false,
          message:
            "CV not found for this application.",
        },
        404,
      );
    }

    const cvResponse =
      await fetch(
        application.resumeUrl,
      );

    if (!cvResponse.ok) {
      return c.json(
        {
          success: false,
          message:
            "Unable to retrieve CV.",
        },
        502,
      );
    }

    const contentType =
      cvResponse.headers.get(
        "content-type",
      ) ||
      "application/octet-stream";

    c.header(
      "Content-Type",
      contentType,
    );

    c.header(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(
        application.resumeName ||
          "resume",
      )}"`,
    );

    return new Response(
      cvResponse.body,
      {
        status: 200,
        headers: c.res.headers,
      },
    );
  },
);


// ================================
// DOWNLOAD APPLICATION CV
// Authenticated users with applications.read
// ================================

applicationsRouter.get(
  "/:id/cv/download",
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

    if (!application.resumeUrl) {
      return c.json(
        {
          success: false,
          message:
            "CV not found for this application.",
        },
        404,
      );
    }

    const cvResponse =
      await fetch(
        application.resumeUrl,
      );

    if (!cvResponse.ok) {
      return c.json(
        {
          success: false,
          message:
            "Unable to retrieve CV.",
        },
        502,
      );
    }

    const contentType =
      cvResponse.headers.get(
        "content-type",
      ) ||
      "application/octet-stream";

    c.header(
      "Content-Type",
      contentType,
    );

    c.header(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(
        application.resumeName ||
          "resume",
      )}"`,
    );

    return new Response(
      cvResponse.body,
      {
        status: 200,
        headers: c.res.headers,
      },
    );
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