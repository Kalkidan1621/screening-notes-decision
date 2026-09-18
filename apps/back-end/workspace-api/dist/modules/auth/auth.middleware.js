import { getCookie } from "hono/cookie";
import { getCurrentUser, getUserPermissions, } from "./auth.service.js";
// ================================
// AUTHENTICATION
// ================================
export async function requireAuth(c, next) {
    const token = getCookie(c, "session_token");
    if (!token) {
        return c.json({
            success: false,
            message: "Authentication required.",
        }, 401);
    }
    try {
        const user = await getCurrentUser(token);
        c.set("user", user);
        await next();
    }
    catch (error) {
        console.error("Authentication middleware error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Authentication failed.",
        }, 401);
    }
}
// ================================
// ROLE AUTHORIZATION
// ================================
export function requireRole(...allowedRoles) {
    return async (c, next) => {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Authentication required.",
            }, 401);
        }
        if (!allowedRoles.includes(user.role)) {
            return c.json({
                success: false,
                message: "You do not have permission to access this resource.",
            }, 403);
        }
        await next();
    };
}
// ================================
// PERMISSION AUTHORIZATION
// ================================
export function requirePermission(...requiredPermissions) {
    return async (c, next) => {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Authentication required.",
            }, 401);
        }
        const userPermissions = await getUserPermissions(user.roleId);
        const hasPermission = requiredPermissions.every((permission) => userPermissions.includes(permission));
        if (!hasPermission) {
            return c.json({
                success: false,
                message: "You do not have permission to access this resource.",
            }, 403);
        }
        await next();
    };
}
//# sourceMappingURL=auth.middleware.js.map