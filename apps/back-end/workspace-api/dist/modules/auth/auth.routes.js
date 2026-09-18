import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie, } from "hono/cookie";
import { registerSchema, loginSchema, candidateRegisterSchema, adminCreateUserSchema, updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, } from "./auth.schema.js";
import { registerUser, registerCandidate, adminCreateUser, loginUser, getCurrentUser, logoutUser, updateProfilePhoto, updateProfile, changePassword, requestPasswordReset, resetPassword, } from "./auth.service.js";
import { requireAuth, requireRole, requirePermission, } from "./auth.middleware.js";
import { sendPasswordResetEmail, } from "../../services/email.js";
const authRoutes = new Hono();
// ================================
// REGISTER
// ================================
authRoutes.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid registration data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        const user = await registerUser(parsed.data);
        return c.json({
            success: true,
            message: "Account created successfully.",
            data: user,
        }, 201);
    }
    catch (error) {
        console.error("Registration error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Registration failed.",
        }, 500);
    }
});
// ================================
// CANDIDATE REGISTER
// ================================
authRoutes.post("/candidate/register", async (c) => {
    try {
        const body = await c.req.json();
        const parsed = candidateRegisterSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid registration data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        const user = await registerCandidate(parsed.data);
        return c.json({
            success: true,
            message: "Candidate account created successfully.",
            data: user,
        }, 201);
    }
    catch (error) {
        console.error("Candidate registration error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Candidate registration failed.",
        }, 500);
    }
});
// ================================
// ADMIN CREATE USER
// ================================
authRoutes.post("/admin/users", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), async (c) => {
    try {
        // ============================
        // READ REQUEST BODY
        // ============================
        const body = await c.req.json();
        // ============================
        // VALIDATE REQUEST
        // ============================
        const parsed = adminCreateUserSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid user data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        // ============================
        // CREATE USER
        // ============================
        const user = await adminCreateUser(parsed.data);
        // ============================
        // RESPONSE
        // ============================
        return c.json({
            success: true,
            message: "User created successfully.",
            data: user,
        }, 201);
    }
    catch (error) {
        console.error("Admin create user error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create user.",
        }, 500);
    }
});
// ================================
// LOGIN
// ================================
authRoutes.post("/login", async (c) => {
    try {
        const body = await c.req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid login data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        const result = await loginUser(parsed.data);
        // ============================
        // HTTP-ONLY SESSION COOKIE
        // ============================
        setCookie(c, "session_token", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });
        return c.json({
            success: true,
            message: "Login successful.",
            data: {
                user: result.user,
                expiresAt: result.expiresAt,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Login failed.",
        }, 401);
    }
});
authRoutes.post("/forgot-password", async (c) => {
    try {
        const body = await c.req.json();
        const validation = forgotPasswordSchema.safeParse(body);
        if (!validation.success) {
            return c.json({
                success: false,
                message: validation.error.issues[0]?.message ??
                    "Invalid email address.",
            }, 400);
        }
        const result = await requestPasswordReset(validation.data.email);
        if (result) {
            await sendPasswordResetEmail(result.email, result.firstName, result.token);
        }
        /*
         * Always return the same response.
         * This prevents account enumeration.
         */
        return c.json({
            success: true,
            message: "If an account exists with that email, a password reset link has been sent.",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return c.json({
            success: false,
            message: "Unable to process your password reset request.",
        }, 500);
    }
});
authRoutes.post("/reset-password", async (c) => {
    try {
        const body = await c.req.json();
        const validation = resetPasswordSchema.safeParse(body);
        if (!validation.success) {
            return c.json({
                success: false,
                message: validation.error.issues[0]?.message ??
                    "Invalid password reset data.",
            }, 400);
        }
        await resetPassword(validation.data.token, validation.data.newPassword);
        return c.json({
            success: true,
            message: "Password reset successfully. You can now log in with your new password.",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to reset password.",
        }, 400);
    }
});
// ================================
// CURRENT USER
// ================================
authRoutes.get("/me", requireAuth, async (c) => {
    const user = c.get("user");
    return c.json({
        success: true,
        data: user,
    });
});
// ================================
// UPDATE PROFILE
// ================================
authRoutes.patch("/profile", requireAuth, async (c) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid profile data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        const updatedUser = await updateProfile(user.id, parsed.data);
        return c.json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Profile update error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update profile.",
        }, 500);
    }
});
// ================================
// CHANGE PASSWORD
// ================================
authRoutes.patch("/profile/password", requireAuth, async (c) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const parsed = changePasswordSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid password data.",
                errors: parsed.error.flatten()
                    .fieldErrors,
            }, 400);
        }
        await changePassword(user.id, parsed.data);
        return c.json({
            success: true,
            message: "Password changed successfully.",
        });
    }
    catch (error) {
        console.error("Password change error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to change password.",
        }, 400);
    }
});
// ================================
// UPDATE PROFILE PHOTO
// ================================
authRoutes.post("/profile/photo", requireAuth, async (c) => {
    try {
        const user = c.get("user");
        const body = await c.req.parseBody();
        const file = body.file;
        if (!(file instanceof File)) {
            return c.json({
                success: false,
                message: "Profile image is required.",
            }, 400);
        }
        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            return c.json({
                success: false,
                message: "Only JPG, PNG and WEBP images are allowed.",
            }, 400);
        }
        // Validate file size
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return c.json({
                success: false,
                message: "Profile image must be less than 5MB.",
            }, 400);
        }
        const updatedUser = await updateProfilePhoto(user.id, file);
        return c.json({
            success: true,
            message: "Profile photo updated successfully.",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Profile photo upload error:", error);
        return c.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update profile photo.",
        }, 500);
    }
});
// ================================
// LOGOUT
// ================================
authRoutes.post("/logout", async (c) => {
    try {
        const token = getCookie(c, "session_token");
        if (token) {
            await logoutUser(token);
        }
        deleteCookie(c, "session_token", {
            path: "/",
        });
        return c.json({
            success: true,
            message: "Logout successful.",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        return c.json({
            success: false,
            message: "Logout failed.",
        }, 500);
    }
});
// ================================
// PROTECTED ROUTE
// ================================
authRoutes.get("/protected", requireAuth, async (c) => {
    const user = c.get("user");
    return c.json({
        success: true,
        message: "You can access this protected route.",
        data: user,
    });
});
// ================================
// RECRUITER ONLY
// ================================
authRoutes.get("/recruiter-only", requireAuth, requireRole("RECRUITER"), async (c) => {
    const user = c.get("user");
    return c.json({
        success: true,
        message: "Recruiter access granted.",
        data: user,
    });
});
// ================================
// SCREENING PERMISSION
// ================================
authRoutes.get("/screening-access", requireAuth, requirePermission("screening.read"), async (c) => {
    const user = c.get("user");
    return c.json({
        success: true,
        message: "Screening access granted.",
        data: {
            user,
        },
    });
});
export default authRoutes;
//# sourceMappingURL=auth.routes.js.map