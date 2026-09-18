import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomBytes, createHash, } from "node:crypto";
import { db } from "../../db/index.js";
import { roles, users, sessions, permissions, rolePermissions, passwordResetTokens, } from "../../db/schema.js";
import cloudinary from "../../config/cloudinary.js";
// ================================
// REGISTER
// ================================
export async function registerUser(data) {
    const email = data.email.toLowerCase();
    // Check existing user
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if (existingUser.length > 0) {
        throw new Error("An account with this email already exists.");
    }
    // Get default role
    const recruiterRole = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "RECRUITER"))
        .limit(1);
    if (!recruiterRole[0]) {
        throw new Error("Default user role was not found.");
    }
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);
    // Create user
    const result = await db
        .insert(users)
        .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        passwordHash,
        roleId: recruiterRole[0].id,
    })
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
    });
    return result[0];
}
export async function registerCandidate(data) {
    const email = data.email.toLowerCase();
    // Check existing user
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if (existingUser.length > 0) {
        throw new Error("An account with this email already exists.");
    }
    // Get CANDIDATE role
    const candidateRole = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "CANDIDATE"))
        .limit(1);
    if (!candidateRole[0]) {
        throw new Error("Candidate role was not found.");
    }
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);
    // Create candidate
    const result = await db
        .insert(users)
        .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        passwordHash,
        roleId: candidateRole[0].id,
    })
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
    });
    return result[0];
}
// ================================
// ADMIN CREATE USER
// ================================
export async function adminCreateUser(data) {
    const email = data.email.toLowerCase();
    // ================================
    // CHECK EXISTING USER
    // ================================
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if (existingUser.length > 0) {
        throw new Error("An account with this email already exists.");
    }
    // ================================
    // FIND ROLE
    // ================================
    const role = await db
        .select()
        .from(roles)
        .where(eq(roles.name, data.role))
        .limit(1);
    if (!role[0]) {
        throw new Error(`Role "${data.role}" was not found.`);
    }
    // ================================
    // HASH PASSWORD
    // ================================
    const passwordHash = await bcrypt.hash(data.password, 12);
    // ================================
    // CREATE USER
    // ================================
    const result = await db
        .insert(users)
        .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        passwordHash,
        roleId: role[0].id,
        isActive: true,
    })
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
    });
    const createdUser = result[0];
    if (!createdUser) {
        throw new Error("User could not be created.");
    }
    return {
        ...createdUser,
        role: role[0].name,
    };
}
// ================================
// LOGIN
// ================================
export async function loginUser(data) {
    const email = data.email.toLowerCase();
    // Find user + role
    const result = await db
        .select({
        user: users,
        role: roles,
    })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.email, email))
        .limit(1);
    const record = result[0];
    if (!record) {
        throw new Error("Invalid email or password.");
    }
    // Check account status
    if (!record.user.isActive) {
        throw new Error("Your account is inactive.");
    }
    // Compare password
    const passwordValid = await bcrypt.compare(data.password, record.user.passwordHash);
    if (!passwordValid) {
        throw new Error("Invalid email or password.");
    }
    // Generate secure session token
    const token = randomBytes(32).toString("hex");
    // Session expires in 7 days
    const expiresAt = new Date(Date.now() +
        7 *
            24 *
            60 *
            60 *
            1000);
    // Save session
    await db
        .insert(sessions)
        .values({
        userId: record.user.id,
        token,
        expiresAt,
    });
    // Never return passwordHash
    return {
        user: {
            id: record.user.id,
            firstName: record.user.firstName,
            lastName: record.user.lastName,
            email: record.user.email,
            roleId: record.user.roleId,
            role: record.role.name,
            profileImageUrl: record.user.profileImageUrl,
            isActive: record.user.isActive,
        },
        token,
        expiresAt,
    };
}
// ================================
// GET CURRENT USER
// ================================
export async function getCurrentUser(token) {
    const result = await db
        .select({
        session: sessions,
        user: users,
        role: roles,
    })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(sessions.token, token))
        .limit(1);
    const record = result[0];
    if (!record) {
        throw new Error("Invalid or expired session.");
    }
    // Check session expiration
    if (record.session.expiresAt <
        new Date()) {
        await db
            .delete(sessions)
            .where(eq(sessions.id, record.session.id));
        throw new Error("Session has expired.");
    }
    // Check account status
    if (!record.user.isActive) {
        throw new Error("Your account is inactive.");
    }
    return {
        id: record.user.id,
        firstName: record.user.firstName,
        lastName: record.user.lastName,
        email: record.user.email,
        roleId: record.user.roleId,
        role: record.role.name,
        profileImageUrl: record.user.profileImageUrl,
        isActive: record.user.isActive,
    };
}
// ================================
// LOGOUT
// ================================
export async function logoutUser(token) {
    const deleted = await db
        .delete(sessions)
        .where(eq(sessions.token, token))
        .returning({
        id: sessions.id,
    });
    return deleted.length > 0;
}
// ================================
// GET USER PERMISSIONS
// ================================
export async function getUserPermissions(roleId) {
    const result = await db
        .select({
        permission: permissions.name,
    })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, roleId));
    return result.map((item) => item.permission);
}
// ================================
// UPDATE PROFILE PHOTO
// ================================
export async function updateProfilePhoto(userId, file) {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "myalagy/profile-images",
            resource_type: "image",
            transformation: [
                {
                    width: 500,
                    height: 500,
                    crop: "fill",
                    gravity: "face",
                },
            ],
        }, (error, result) => {
            if (error || !result) {
                reject(error ??
                    new Error("Cloudinary upload failed."));
                return;
            }
            resolve({
                secure_url: result.secure_url,
            });
        });
        uploadStream.end(buffer);
    });
    // Save Cloudinary URL to database
    const updated = await db
        .update(users)
        .set({
        profileImageUrl: result.secure_url,
    })
        .where(eq(users.id, userId))
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
    });
    if (!updated[0]) {
        throw new Error("User profile could not be updated.");
    }
    return updated[0];
}
// ================================
// UPDATE PROFILE
// ================================
export async function updateProfile(userId, data) {
    const email = data.email.toLowerCase();
    // Check whether another user already uses this email
    const existingUser = await db
        .select({
        id: users.id,
    })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if (existingUser[0] &&
        existingUser[0].id !== userId) {
        throw new Error("An account with this email already exists.");
    }
    const updated = await db
        .update(users)
        .set({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        updatedAt: new Date(),
    })
        .where(eq(users.id, userId))
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
    });
    if (!updated[0]) {
        throw new Error("User profile could not be updated.");
    }
    return updated[0];
}
// ================================
// CHANGE PASSWORD
// ================================
export async function changePassword(userId, data) {
    const result = await db
        .select({
        passwordHash: users.passwordHash,
    })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
    const user = result[0];
    if (!user) {
        throw new Error("User not found.");
    }
    const currentPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!currentPasswordValid) {
        throw new Error("Current password is incorrect.");
    }
    const newPasswordHash = await bcrypt.hash(data.newPassword, 12);
    await db
        .update(users)
        .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
    })
        .where(eq(users.id, userId));
    return true;
}
export async function requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db
        .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
    })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);
    /*
     * Do not reveal whether an email exists.
     */
    if (!user) {
        return;
    }
    /*
     * Remove previous reset tokens for this user.
     */
    await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.id));
    /*
     * Generate a secure random token.
     */
    const rawToken = randomBytes(32).toString("hex");
    /*
     * Store only the hash in the database.
     */
    const tokenHash = createHash("sha256")
        .update(rawToken)
        .digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
    });
    /*
     * Email sending will be connected in the next step.
     */
    return {
        email: user.email,
        firstName: user.firstName,
        token: rawToken,
    };
}
export async function resetPassword(token, newPassword) {
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");
    const [resetToken] = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.tokenHash, tokenHash))
        .limit(1);
    if (!resetToken) {
        throw new Error("Invalid or expired password reset link.");
    }
    if (resetToken.usedAt) {
        throw new Error("This password reset link has already been used.");
    }
    if (resetToken.expiresAt.getTime() <=
        Date.now()) {
        throw new Error("This password reset link has expired.");
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db
        .update(users)
        .set({
        passwordHash,
        updatedAt: new Date(),
    })
        .where(eq(users.id, resetToken.userId));
    /*
     * Mark the reset token as used.
     */
    await db
        .update(passwordResetTokens)
        .set({
        usedAt: new Date(),
    })
        .where(eq(passwordResetTokens.id, resetToken.id));
    /*
     * Invalidate all existing login sessions.
     */
    await db
        .delete(sessions)
        .where(eq(sessions.userId, resetToken.userId));
}
//# sourceMappingURL=auth.service.js.map