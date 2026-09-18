import type { RegisterInput, LoginInput, CandidateRegisterInput, AdminCreateUserInput, UpdateProfileInput, ChangePasswordInput } from "./auth.schema.js";
export declare function registerUser(data: RegisterInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
} | undefined>;
export declare function registerCandidate(data: CandidateRegisterInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
} | undefined>;
export declare function adminCreateUser(data: AdminCreateUserInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    role: string;
}>;
export declare function loginUser(data: LoginInput): Promise<{
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        roleId: number;
        role: string;
        profileImageUrl: string | null;
        isActive: true;
    };
    token: string;
    expiresAt: Date;
}>;
export declare function getCurrentUser(token: string): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    role: string;
    profileImageUrl: string | null;
    isActive: true;
}>;
export declare function logoutUser(token: string): Promise<boolean>;
export declare function getUserPermissions(roleId: number): Promise<string[]>;
export declare function updateProfilePhoto(userId: number, file: File): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
}>;
export declare function updateProfile(userId: number, data: UpdateProfileInput): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    profileImageUrl: string | null;
    isActive: boolean;
}>;
export declare function changePassword(userId: number, data: ChangePasswordInput): Promise<boolean>;
export declare function requestPasswordReset(email: string): Promise<{
    email: string;
    firstName: string;
    token: string;
} | undefined>;
export declare function resetPassword(token: string, newPassword: string): Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map