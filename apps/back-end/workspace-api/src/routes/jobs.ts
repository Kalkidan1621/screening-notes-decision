import { Hono } from "hono";

import { createJobSchema } from "../schemas/jobs.js";
import {
  createJob,
  getActiveJobs,
  getJobById,
} from "../services/jobs.js";

const jobsRouter = new Hono();

// GET all active jobs
jobsRouter.get("/", async (c) => {
  const activeJobs = await getActiveJobs();

  return c.json({
    data: activeJobs,
  });
});

// GET one job by ID
jobsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return c.json(
      {
        message: "Invalid job ID.",
      },
      400,
    );
  }

  const job = await getJobById(id);

  if (!job) {
    return c.json(
      {
        message: "Job not found.",
      },
      404,
    );
  }

  return c.json({
    data: job,
  });
});

// POST create a new job
jobsRouter.post("/", async (c) => {
  const body = await c.req.json();

  const result = createJobSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        message: "Validation failed.",
        errors: result.error.flatten(),
      },
      400,
    );
  }

  const createdJob = await createJob(result.data);

  return c.json(
    {
      message: "Job created successfully.",
      data: createdJob,
    },
    201,
  );
});

export default jobsRouter;