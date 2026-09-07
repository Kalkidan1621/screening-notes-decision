import { Hono } from "hono";

import {
  createEmployerSchema,
  employerIdSchema,
  updateEmployerSchema,
} from "./employer.schema.js";

import {
  createEmployer,
  deleteEmployer,
  getAllEmployers,
  getEmployerById,
  updateEmployer,
} from "./employer.service.js";

export const employerRoutes = new Hono();

employerRoutes.get("/", async (c) => {
  try {
    const employers = await getAllEmployers();

    return c.json({
      success: true,
      data: employers,
    });
  } catch (error) {
    console.error("Failed to get employers:", error);

    return c.json(
      {
        success: false,
        message: "Failed to load employers.",
      },
      500,
    );
  }
});

employerRoutes.get("/:id", async (c) => {
  try {
    const parsed = employerIdSchema.safeParse({
      id: c.req.param("id"),
    });

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid employer ID.",
        },
        400,
      );
    }

    const employer = await getEmployerById(parsed.data.id);

    if (!employer) {
      return c.json(
        {
          success: false,
          message: "Employer not found.",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: employer,
    });
  } catch (error) {
    console.error("Failed to get employer:", error);

    return c.json(
      {
        success: false,
        message: "Failed to load employer.",
      },
      500,
    );
  }
});

employerRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const parsed = createEmployerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ??
            "Invalid employer data.",
        },
        400,
      );
    }

    const employer = await createEmployer(parsed.data);

    return c.json(
      {
        success: true,
        message: "Employer created successfully.",
        data: employer,
      },
      201,
    );
  } catch (error) {
    console.error("Failed to create employer:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create employer.",
      },
      500,
    );
  }
});

employerRoutes.patch("/:id", async (c) => {
  try {
    const idParsed = employerIdSchema.safeParse({
      id: c.req.param("id"),
    });

    if (!idParsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid employer ID.",
        },
        400,
      );
    }

    const body = await c.req.json();

    const parsed = updateEmployerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ??
            "Invalid employer data.",
        },
        400,
      );
    }

    const employer = await updateEmployer(
      idParsed.data.id,
      parsed.data,
    );

    if (!employer) {
      return c.json(
        {
          success: false,
          message: "Employer not found.",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Employer updated successfully.",
      data: employer,
    });
  } catch (error) {
    console.error("Failed to update employer:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update employer.",
      },
      500,
    );
  }
});

employerRoutes.delete("/:id", async (c) => {
  try {
    const parsed = employerIdSchema.safeParse({
      id: c.req.param("id"),
    });

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid employer ID.",
        },
        400,
      );
    }

    const employer = await deleteEmployer(parsed.data.id);

    if (!employer) {
      return c.json(
        {
          success: false,
          message: "Employer not found.",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Employer deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete employer:", error);

    return c.json(
      {
        success: false,
        message: "Failed to delete employer.",
      },
      500,
    );
  }
});