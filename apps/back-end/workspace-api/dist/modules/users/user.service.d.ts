import type { CreateUserInput, UpdateUserInput } from "./user.schema.js";
/**
 * Get all users with their role.
 */
export declare function getAllUsers(search?: string): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string | null;
    roleDescription: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}[]>;
/**
 * Get one user.
 */
export declare function getUserById(userId: number): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string | null;
    roleDescription: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
/**
 * Get all roles.
 */
export declare function getAllRoles(): Promise<{
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
}[]>;
/**
 * Create a user.
 */
export declare function createUser(input: CreateUserInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    roleName: string;
}>;
/**
 * Update user information.
 */
export declare function updateUser(userId: number, input: UpdateUserInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string | null;
    roleDescription: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
/**
 * Activate / deactivate user.
 */
export declare function updateUserStatus(userId: number, isActive: boolean): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string | null;
    roleDescription: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
/**
 * Change role.
 */
export declare function changeUserRole(userId: number, roleId: number): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string | null;
    roleDescription: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
/**
 * Delete user.
 */
export declare function deleteUser(userId: number): Promise<{
    success: boolean;
    message: string;
}>;
//# sourceMappingURL=user.service.d.ts.map