import type { Context, Next } from "hono";
import { getCurrentUser } from "./auth.service.js";
export declare function requireAuth(c: Context<{
    Variables: {
        user: Awaited<ReturnType<typeof getCurrentUser>>;
    };
}>, next: Next): Promise<(Response & import("hono").TypedResponse<{
    success: false;
    message: string;
}, 401, "json">) | undefined>;
export declare function requireRole(...allowedRoles: string[]): (c: Context<{
    Variables: {
        user: Awaited<ReturnType<typeof getCurrentUser>>;
    };
}>, next: Next) => Promise<(Response & import("hono").TypedResponse<{
    success: false;
    message: string;
}, 401, "json">) | (Response & import("hono").TypedResponse<{
    success: false;
    message: string;
}, 403, "json">) | undefined>;
export declare function requirePermission(...requiredPermissions: string[]): (c: Context<{
    Variables: {
        user: Awaited<ReturnType<typeof getCurrentUser>>;
    };
}>, next: Next) => Promise<(Response & import("hono").TypedResponse<{
    success: false;
    message: string;
}, 401, "json">) | (Response & import("hono").TypedResponse<{
    success: false;
    message: string;
}, 403, "json">) | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map