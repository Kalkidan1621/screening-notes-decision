import { Hono } from "hono";

import { createApplicationSchema } from "../schemas/applications.js";

import {
  createApplication,
  getAllApplications,
  getApplicationsByJobId,
  getApplicationById,
  getApplicationStats,
  updateApplicationStatus,
} from "../services/applications.js";


const applicationsRouter = new Hono();


// Admin gets all applications
applicationsRouter.get(
  "/",
  async (c) => {
    const applications =
      await getAllApplications();

    return c.json({
      data: applications,
    });
  },
);


// Candidate submits application
applicationsRouter.post(
  "/",
  async (c) => {
    const body = await c.req.json();

    const result =
      createApplicationSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          message: "Validation failed.",
          errors: result.error.flatten(),
        },
        400,
      );
    }


    const application =
      await createApplication(
        result.data,
      );


    return c.json(
      {
        message:
          "Application submitted successfully.",
        data: application,
      },
      201,
    );
  },
);


// Get application statistics
// IMPORTANT: keep before /:id
applicationsRouter.get(
  "/stats",
  async (c) => {
    const stats =
      await getApplicationStats();

    return c.json({
      data: stats,
    });
  },
);


// Get application by ID
applicationsRouter.get(
  "/:id",
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
          message:
            "Application not found.",
        },
        404,
      );
    }


    return c.json({
      data: application,
    });
  },
);


// Get applications by job ID
applicationsRouter.get(
  "/job/:jobId",
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
      data: applications,
    });
  },
);


// Admin approves or rejects application
applicationsRouter.patch(
  "/:id/status",
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
          message:
            "Invalid application ID.",
        },
        400,
      );
    }


    const body =
      await c.req.json();


    if (
      body.status !== "approved" &&
      body.status !== "rejected"
    ) {
      return c.json(
        {
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
          message:
            "Application not found.",
        },
        404,
      );
    }


    return c.json({
      message:
        `Application ${body.status} successfully.`,
      data: updatedApplication,
    });
  },
);


export default applicationsRouter;