import { Hono } from "hono";

import {
  screeningDecisionSchema,
} from "../schemas/screening.js";

import {
  getScreeningDecision,
  saveScreeningDecision,
} from "../services/screening.js";

import {
  requireAuth,
  requirePermission,
} from "../modules/auth/auth.middleware.js";

const screening = new Hono();

// ================================
// GET SAVED SCREENING DECISION
// ================================

screening.get(
  "/hiring/application/screening/:applicationId/decision",
  requireAuth,
  requirePermission("screening.read"),
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
          message:
            "Invalid application ID.",
        },
        400,
      );
    }

    const decision =
      await getScreeningDecision(
        applicationId,
      );

    return c.json({
      success: true,
      data: decision,
    });
  },
);

// ================================
// CREATE / UPDATE SCREENING DECISION
// ================================

screening.post(
  "/hiring/application/screening/:applicationId/decision",
  requireAuth,
  requirePermission(
    "screening.decision.write",
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
          message:
            "Invalid application ID.",
        },
        400,
      );
    }

    const body =
      await c.req.json();

    const result =
      screeningDecisionSchema.safeParse(
        body,
      );

    if (!result.success) {
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

    const saved =
      await saveScreeningDecision(
        applicationId,
        result.data.decision,
        result.data.note,
      );

    return c.json({
      success: true,
      message:
        "Screening decision saved successfully.",
      data: saved,
    });
  },
);

export default screening;