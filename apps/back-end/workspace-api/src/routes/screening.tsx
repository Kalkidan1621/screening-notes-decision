import { Hono } from "hono";

import { screeningDecisionSchema } from "../schemas/screening";
import {
  getScreeningDecision,
  saveScreeningDecision,
} from "../services/screening";

const screening = new Hono();

// GET saved decision
screening.get(
  "/hiring/application/screening/:stageId/decision",
  async (c) => {
    const stageId = c.req.param("stageId");

    const decision = await getScreeningDecision(stageId);//db data

    return c.json({
      data: decision,
    });
  }
);


// POST create/update decision
screening.post(
  "/hiring/application/screening/:stageId/decision",
  async (c) => {
    const stageId = c.req.param("stageId");//url wust yalewun stageid found

    const body = await c.req.json();

    const result = screeningDecisionSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: result.error.flatten(),
        },
        400
      );
    }

    const saved = await saveScreeningDecision(
      stageId,
      result.data.decision,
      result.data.note
    );

    return c.json({
      data: saved,
    });
  }
);

export default screening;