import { Hono } from "hono";

import {
  requireAuth,
  requireRole,
} from "../../modules/auth/auth.middleware.js";

import {
  hiringDecisionSchema,
} from "./hiring-decision.schema.js";

import {
  getHiringDecision,
  saveHiringDecision,
  moveApplicationToHiringDecision,
  markApplicationAsHired,
} from "./hiring-decision.service.js";

const hiringDecisionRoutes = new Hono();

/* =========================================================
   GET HIRING DECISION
========================================================= */

hiringDecisionRoutes.get(
  "/application/:applicationId",
  requireAuth,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "RECRUITER",
    "HIRING_MANAGER",
  ),
  async (c) => {
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
      const decision =
        await getHiringDecision(applicationId);

      return c.json({
        success: true,
        data: decision,
      });
    } catch (error) {
      console.error(
        "Get hiring decision error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to load hiring decision.",
        },
        500,
      );
    }
  },
);

/* =========================================================
   SAVE HIRING DECISION

   hiring_decision
        |
        | approve
        ↓
   ready_for_hire

   hiring_decision
        |
        | hold
        ↓
      on_hold

   hiring_decision
        |
        | reject
        ↓
      rejected
========================================================= */

hiringDecisionRoutes.post(
  "/application/:applicationId",
  requireAuth,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "RECRUITER",
    "HIRING_MANAGER",
  ),
  async (c) => {
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
      const body = await c.req.json();

      const parsed =
        hiringDecisionSchema.safeParse(body);

      if (!parsed.success) {
        return c.json(
          {
            success: false,
            message: parsed.error.issues
              .map(
                (issue) => issue.message,
              )
              .join(", "),
          },
          400,
        );
      }

      const decision =
        await saveHiringDecision(
          applicationId,
          parsed.data,
        );

      return c.json(
        {
          success: true,
          message:
            "Hiring decision saved successfully.",
          data: decision,
        },
        201,
      );
    } catch (error) {
      console.error(
        "Save hiring decision error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to save hiring decision.",
        },
        400,
      );
    }
  },
);

/* =========================================================
   REVIEW AGAIN

   on_hold
      ↓
   Review Again
      ↓
   hiring_decision
========================================================= */

hiringDecisionRoutes.post(
  "/application/:applicationId/review",
  requireAuth,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "RECRUITER",
    "HIRING_MANAGER",
  ),
  async (c) => {
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
      const result =
        await moveApplicationToHiringDecision(
          applicationId,
        );

      return c.json({
        success: true,
        message:
          "Application moved back to hiring decision.",
        data: result,
      });
    } catch (error) {
      console.error(
        "Review hiring decision error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to move application to hiring decision.",
        },
        400,
      );
    }
  },
);

/* =========================================================
   MARK AS HIRED

   ready_for_hire
        ↓
   Mark as Hired
        ↓
      hired
========================================================= */

hiringDecisionRoutes.post(
  "/application/:applicationId/hire",
  requireAuth,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "HIRING_MANAGER",
  ),
  async (c) => {
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
      const result =
        await markApplicationAsHired(
          applicationId,
        );

      return c.json({
        success: true,
        message:
          "Application marked as hired successfully.",
        data: result,
      });
    } catch (error) {
      console.error(
        "Mark application hired error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to mark application as hired.",
        },
        400,
      );
    }
  },
);

export default hiringDecisionRoutes;