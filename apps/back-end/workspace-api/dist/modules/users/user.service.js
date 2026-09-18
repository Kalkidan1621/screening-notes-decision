import bcrypt from "bcryptjs";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { roles, users, } from "../../db/schema.js";
function sanitizeUser(user) {
    return user;
}
/**
 * Get all users with their role.
 */
export async function getAllUsers(search) {
    const normalizedSearch = search?.trim();
    const conditions = normalizedSearch
        ? or(ilike(users.firstName, `%${normalizedSearch}%`), ilike(users.lastName, `%${normalizedSearch}%`), ilike(users.email, `%${normalizedSearch}%`), ilike(roles.name, `%${normalizedSearch}%`))
        : undefined;
    const rows = await db
        .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        roleName: roles.name,
        roleDescription: roles.description,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(conditions)
        .orderBy(desc(users.createdAt));
    return rows;
}
/**
 * Get one user.
 */
export async function getUserById(userId) {
    const [user] = await db
        .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        roleName: roles.name,
        roleDescription: roles.description,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, userId))
        .limit(1);
    return user ?? null;
}
/**
 * Get all roles.
 */
export async function getAllRoles() {
    return db
        .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
    })
        .from(roles)
        .orderBy(asc(roles.name));
}
/**
 * Create a user.
 */
export async function createUser(input) {
    const normalizedEmail = input.email.toLowerCase().trim();
    const [existingUser] = await db
        .select({
        id: users.id,
    })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }
    const [role] = await db
        .select({
        id: roles.id,
        name: roles.name,
    })
        .from(roles)
        .where(eq(roles.id, input.roleId))
        .limit(1);
    if (!role) {
        throw new Error("Selected role does not exist.");
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const [createdUser] = await db
        .insert(users)
        .values({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: normalizedEmail,
        passwordHash,
        roleId: input.roleId,
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
        updatedAt: users.updatedAt,
    });
    if (!createdUser) {
        throw new Error("Failed to create user.");
    }
    return {
        ...sanitizeUser(createdUser),
        roleName: role.name,
    };
}
/**
 * Update user information.
 */
export async function updateUser(userId, input) {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
        throw new Error("User not found.");
    }
    if (input.email) {
        const normalizedEmail = input.email.toLowerCase().trim();
        const [emailOwner] = await db
            .select({
            id: users.id,
        })
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);
        if (emailOwner && emailOwner.id !== userId) {
            throw new Error("Another user already uses this email address.");
        }
    }
    if (input.roleId !== undefined) {
        const [role] = await db
            .select({
            id: roles.id,
        })
            .from(roles)
            .where(eq(roles.id, input.roleId))
            .limit(1);
        if (!role) {
            throw new Error("Selected role does not exist.");
        }
    }
    const updateData = {
        updatedAt: new Date(),
    };
    if (input.firstName !== undefined) {
        updateData.firstName = input.firstName.trim();
    }
    if (input.lastName !== undefined) {
        updateData.lastName = input.lastName.trim();
    }
    if (input.email !== undefined) {
        updateData.email = input.email.toLowerCase().trim();
    }
    if (input.roleId !== undefined) {
        updateData.roleId = input.roleId;
    }
    const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    });
    if (!updatedUser) {
        throw new Error("Failed to update user.");
    }
    return getUserById(updatedUser.id);
}
/**
 * Activate / deactivate user.
 */
export async function updateUserStatus(userId, isActive) {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
        throw new Error("User not found.");
    }
    const [updatedUser] = await db
        .update(users)
        .set({
        isActive,
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
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    });
    if (!updatedUser) {
        throw new Error("Failed to update user status.");
    }
    return getUserById(updatedUser.id);
}
/**
 * Change role.
 */
export async function changeUserRole(userId, roleId) {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
        throw new Error("User not found.");
    }
    const [role] = await db
        .select({
        id: roles.id,
        name: roles.name,
    })
        .from(roles)
        .where(eq(roles.id, roleId))
        .limit(1);
    if (!role) {
        throw new Error("Role not found.");
    }
    await db
        .update(users)
        .set({
        roleId,
        updatedAt: new Date(),
    })
        .where(eq(users.id, userId));
    return getUserById(userId);
}
/**
 * Delete user.
 */
export async function deleteUser(userId) {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
        throw new Error("User not found.");
    }
    await db
        .delete(users)
        .where(eq(users.id, userId));
    return {
        success: true,
        message: "User deleted successfully.",
    };
}
//# sourceMappingURL=user.service.js.map