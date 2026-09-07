import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";

import { db } from "../../db/index.js";

import {
  roles,
  users,
  sessions,
  permissions,
  rolePermissions,
} from "../../db/schema.js";

import type {
  RegisterInput,
  LoginInput,
  CandidateRegisterInput,
   AdminCreateUserInput,
} from "./auth.schema.js";

import cloudinary from "../../config/cloudinary.js";


// ================================
// REGISTER
// ================================

export async function registerUser(
  data: RegisterInput,
) {
  const email =
    data.email.toLowerCase();

  // Check existing user
  const existingUser =
    await db
      .select()
      .from(users)
      .where(
        eq(users.email, email),
      )
      .limit(1);

  if (existingUser.length > 0) {
    throw new Error(
      "An account with this email already exists.",
    );
  }

  // Get default role
  const recruiterRole =
    await db
      .select()
      .from(roles)
      .where(
        eq(
          roles.name,
          "RECRUITER",
        ),
      )
      .limit(1);

  if (!recruiterRole[0]) {
    throw new Error(
      "Default user role was not found.",
    );
  }

  // Hash password
  const passwordHash =
    await bcrypt.hash(
      data.password,
      12,
    );

  // Create user
  const result =
    await db
      .insert(users)
      .values({
        firstName:
          data.firstName,

        lastName:
          data.lastName,

        email,

        passwordHash,

        roleId:
          recruiterRole[0].id,
      })
      .returning({
        id: users.id,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        email:
          users.email,

        roleId:
          users.roleId,

        profileImageUrl:
          users.profileImageUrl,

        isActive:
          users.isActive,

        createdAt:
          users.createdAt,
      });

  return result[0];
}
export async function registerCandidate(
  data: CandidateRegisterInput,
) {
  const email =
    data.email.toLowerCase();

  // Check existing user
  const existingUser =
    await db
      .select()
      .from(users)
      .where(
        eq(users.email, email),
      )
      .limit(1);

  if (existingUser.length > 0) {
    throw new Error(
      "An account with this email already exists.",
    );
  }

  // Get CANDIDATE role
  const candidateRole =
    await db
      .select()
      .from(roles)
      .where(
        eq(
          roles.name,
          "CANDIDATE",
        ),
      )
      .limit(1);

  if (!candidateRole[0]) {
    throw new Error(
      "Candidate role was not found.",
    );
  }

  // Hash password
  const passwordHash =
    await bcrypt.hash(
      data.password,
      12,
    );

  // Create candidate
  const result =
    await db
      .insert(users)
      .values({
        firstName:
          data.firstName,

        lastName:
          data.lastName,

        email,

        passwordHash,

        roleId:
          candidateRole[0].id,
      })
      .returning({
        id: users.id,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        email:
          users.email,

        roleId:
          users.roleId,

        profileImageUrl:
          users.profileImageUrl,

        isActive:
          users.isActive,

        createdAt:
          users.createdAt,
      });

  return result[0];
}

// ================================
// ADMIN CREATE USER
// ================================

export async function adminCreateUser(
  data: AdminCreateUserInput,
) {
  const email =
    data.email.toLowerCase();

  // ================================
  // CHECK EXISTING USER
  // ================================

  const existingUser =
    await db
      .select()
      .from(users)
      .where(
        eq(
          users.email,
          email,
        ),
      )
      .limit(1);

  if (existingUser.length > 0) {
    throw new Error(
      "An account with this email already exists.",
    );
  }

  // ================================
  // FIND ROLE
  // ================================

  const role =
    await db
      .select()
      .from(roles)
      .where(
        eq(
          roles.name,
          data.role,
        ),
      )
      .limit(1);

  if (!role[0]) {
    throw new Error(
      `Role "${data.role}" was not found.`,
    );
  }

  // ================================
  // HASH PASSWORD
  // ================================

  const passwordHash =
    await bcrypt.hash(
      data.password,
      12,
    );

  // ================================
  // CREATE USER
  // ================================

  const result =
    await db
      .insert(users)
      .values({
        firstName:
          data.firstName,

        lastName:
          data.lastName,

        email,

        passwordHash,

        roleId:
          role[0].id,

        isActive: true,
      })
      .returning({
        id: users.id,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        email:
          users.email,

        roleId:
          users.roleId,

        profileImageUrl:
          users.profileImageUrl,

        isActive:
          users.isActive,

        createdAt:
          users.createdAt,
      });

  const createdUser =
    result[0];

  if (!createdUser) {
    throw new Error(
      "User could not be created.",
    );
  }

  return {
    ...createdUser,

    role: role[0].name,
  };
}

// ================================
// LOGIN
// ================================

export async function loginUser(
  data: LoginInput,
) {
  const email =
    data.email.toLowerCase();

  // Find user + role
  const result =
    await db
      .select({
        user: users,
        role: roles,
      })
      .from(users)
      .innerJoin(
        roles,
        eq(
          users.roleId,
          roles.id,
        ),
      )
      .where(
        eq(users.email, email),
      )
      .limit(1);

  const record = result[0];

  if (!record) {
    throw new Error(
      "Invalid email or password.",
    );
  }

  // Check account status
  if (!record.user.isActive) {
    throw new Error(
      "Your account is inactive.",
    );
  }

  // Compare password
  const passwordValid =
    await bcrypt.compare(
      data.password,
      record.user.passwordHash,
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid email or password.",
    );
  }

  // Generate secure session token
  const token =
    randomBytes(32).toString(
      "hex",
    );

  // Session expires in 7 days
  const expiresAt =
    new Date(
      Date.now() +
        7 *
          24 *
          60 *
          60 *
          1000,
    );

  // Save session
  await db
    .insert(sessions)
    .values({
      userId:
        record.user.id,

      token,

      expiresAt,
    });

  // Never return passwordHash
  return {
    user: {
      id: record.user.id,

      firstName:
        record.user.firstName,

      lastName:
        record.user.lastName,

      email:
        record.user.email,

      roleId:
        record.user.roleId,

      role:
        record.role.name,

      profileImageUrl:
        record.user.profileImageUrl,

      isActive:
        record.user.isActive,
    },

    token,

    expiresAt,
  };
}


// ================================
// GET CURRENT USER
// ================================

export async function getCurrentUser(
  token: string,
) {
  const result =
    await db
      .select({
        session: sessions,

        user: users,

        role: roles,
      })
      .from(sessions)
      .innerJoin(
        users,
        eq(
          sessions.userId,
          users.id,
        ),
      )
      .innerJoin(
        roles,
        eq(
          users.roleId,
          roles.id,
        ),
      )
      .where(
        eq(
          sessions.token,
          token,
        ),
      )
      .limit(1);

  const record = result[0];

  if (!record) {
    throw new Error(
      "Invalid or expired session.",
    );
  }

  // Check session expiration
  if (
    record.session.expiresAt <
    new Date()
  ) {
    await db
      .delete(sessions)
      .where(
        eq(
          sessions.id,
          record.session.id,
        ),
      );

    throw new Error(
      "Session has expired.",
    );
  }

  // Check account status
  if (!record.user.isActive) {
    throw new Error(
      "Your account is inactive.",
    );
  }

  return {
    id: record.user.id,

    firstName:
      record.user.firstName,

    lastName:
      record.user.lastName,

    email:
      record.user.email,

    roleId:
      record.user.roleId,

    role:
      record.role.name,

    profileImageUrl:
      record.user.profileImageUrl,

    isActive:
      record.user.isActive,
  };
}


// ================================
// LOGOUT
// ================================

export async function logoutUser(
  token: string,
) {
  const deleted =
    await db
      .delete(sessions)
      .where(
        eq(
          sessions.token,
          token,
        ),
      )
      .returning({
        id: sessions.id,
      });

  return deleted.length > 0;
}
// ================================
// GET USER PERMISSIONS
// ================================

export async function getUserPermissions(
  roleId: number,
) {
  const result =
    await db
      .select({
        permission:
          permissions.name,
      })
      .from(rolePermissions)
      .innerJoin(
        permissions,
        eq(
          rolePermissions.permissionId,
          permissions.id,
        ),
      )
      .where(
        eq(
          rolePermissions.roleId,
          roleId,
        ),
      );

  return result.map(
    (item) =>
      item.permission,
  );
}
// ================================
// UPDATE PROFILE PHOTO
// ================================

export async function updateProfilePhoto(
  userId: number,
  file: File,
) {
  // Convert File to Buffer
  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(arrayBuffer);

  // Upload to Cloudinary
  const result =
    await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
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
          },

          (error, result) => {
            if (error || !result) {
              reject(
                error ??
                  new Error(
                    "Cloudinary upload failed.",
                  ),
              );

              return;
            }

            resolve({
              secure_url:
                result.secure_url,
            });
          },
        );

      uploadStream.end(buffer);
    });

  // Save Cloudinary URL to database
  const updated =
    await db
      .update(users)
      .set({
        profileImageUrl:
          result.secure_url,
      })
      .where(
        eq(
          users.id,
          userId,
        ),
      )
      .returning({
        id: users.id,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        email:
          users.email,

        roleId:
          users.roleId,

        profileImageUrl:
          users.profileImageUrl,

        isActive:
          users.isActive,
      });

  if (!updated[0]) {
    throw new Error(
      "User profile could not be updated.",
    );
  }

  return updated[0];
}