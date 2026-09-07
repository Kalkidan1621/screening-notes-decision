import { Hono } from "hono";

import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  changeUserRoleSchema,
} from "./user.schema.js";

import {
  getAllUsers,
  getUserById,
  getAllRoles,
  createUser,
  updateUser,
  updateUserStatus,
  changeUserRole,
  deleteUser,
} from "./user.service.js";

import {
  requireAuth,
  requireRole,
} from "../auth/auth.middleware.js";

const userRoutes = new Hono();

/**
 * GET /users
 */
userRoutes.get(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN", "ADMIN"),
  async (c) => {
    try {
      const search = c.req.query("search");

      const data = await getAllUsers(search);

      return c.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("GET /users error:", error);

      return c.json(
        {
          success: false,
          message: "Failed to load users.",
        },
        500,
      );
    }
  },
);

/**
 * GET /users/roles
 */
userRoutes.get(
  "/roles",
  requireAuth,
  requireRole("SUPER_ADMIN", "ADMIN"),
  async (c) => {
    try {
      const data = await getAllRoles();

      return c.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("GET /users/roles error:", error);

      return c.json(
        {
          success: false,
          message: "Failed to load roles.",
        },
        500,
      );
    }
  },
);

/**
 * GET /users/:id
 */
userRoutes.get(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "ADMIN"),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return c.json(
          {
            success: false,
            message: "Invalid user ID.",
          },
          400,
        );
      }

      const data = await getUserById(id);

      if (!data) {
        return c.json(
          {
            success: false,
            message: "User not found.",
          },
          404,
        );
      }

      return c.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("GET /users/:id error:", error);

      return c.json(
        {
          success: false,
          message: "Failed to load user.",
        },
        500,
      );
    }
  },
);

/**
 * POST /users
 */
userRoutes.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (c) => {
    try {
      const body = await c.req.json();

      const parsed = createUserSchema.safeParse(body);

      if (!parsed.success) {
        return c.json(
          {
            success: false,
            message: parsed.error.issues[0]?.message ??
              "Invalid user data.",
            errors: parsed.error.flatten(),
          },
          400,
        );
      }

      const data = await createUser(parsed.data);

      return c.json(
        {
          success: true,
          message: "User created successfully.",
          data,
        },
        201,
      );
    } catch (error) {
      console.error("POST /users error:", error);

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to create user.",
        },
        400,
      );
    }
  },
);

/**
 * PATCH /users/:id
 */
userRoutes.patch(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return c.json(
          {
            success: false,
            message: "Invalid user ID.",
          },
          400,
        );
      }

      const body = await c.req.json();

      const parsed = updateUserSchema.safeParse(body);

      if (!parsed.success) {
        return c.json(
          {
            success: false,
            message: parsed.error.issues[0]?.message ??
              "Invalid user data.",
          },
          400,
        );
      }

      const data = await updateUser(id, parsed.data);

      return c.json({
        success: true,
        message: "User updated successfully.",
        data,
      });
    } catch (error) {
      console.error("PATCH /users/:id error:", error);

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update user.",
        },
        400,
      );
    }
  },
);

/**
 * PATCH /users/:id/status
 */
userRoutes.patch(
  "/:id/status",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return c.json(
          {
            success: false,
            message: "Invalid user ID.",
          },
          400,
        );
      }

      const body = await c.req.json();

      const parsed =
        updateUserStatusSchema.safeParse(body);

      if (!parsed.success) {
        return c.json(
          {
            success: false,
            message: "Invalid status.",
          },
          400,
        );
      }

      const data = await updateUserStatus(
        id,
        parsed.data.isActive,
      );

      return c.json({
        success: true,
        message: parsed.data.isActive
          ? "User activated successfully."
          : "User deactivated successfully.",
        data,
      });
    } catch (error) {
      console.error(
        "PATCH /users/:id/status error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update status.",
        },
        400,
      );
    }
  },
);

/**
 * PATCH /users/:id/role
 */
userRoutes.patch(
  "/:id/role",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return c.json(
          {
            success: false,
            message: "Invalid user ID.",
          },
          400,
        );
      }

      const body = await c.req.json();

      const parsed =
        changeUserRoleSchema.safeParse(body);

      if (!parsed.success) {
        return c.json(
          {
            success: false,
            message: "Invalid role.",
          },
          400,
        );
      }

      const data = await changeUserRole(
        id,
        parsed.data.roleId,
      );

      return c.json({
        success: true,
        message: "User role updated successfully.",
        data,
      });
    } catch (error) {
      console.error(
        "PATCH /users/:id/role error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update role.",
        },
        400,
      );
    }
  },
);

/**
 * DELETE /users/:id
 */
userRoutes.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return c.json(
          {
            success: false,
            message: "Invalid user ID.",
          },
          400,
        );
      }

      const data = await deleteUser(id);

      return c.json(data);
    } catch (error) {
      console.error(
        "DELETE /users/:id error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete user.",
        },
        400,
      );
    }
  },
);

export default userRoutes;