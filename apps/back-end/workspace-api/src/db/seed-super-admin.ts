import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "./index.js";
import { roles, users } from "./schema.js";

async function seedSuperAdmin() {
  const email = "superadmin@example.com";
  const password = "SuperAdmin123!";

  // ================================
  // FIND SUPER_ADMIN ROLE
  // ================================

  const superAdminRole = await db
    .select()
    .from(roles)
    .where(
      eq(
        roles.name,
        "SUPER_ADMIN",
      ),
    )
    .limit(1);

  if (!superAdminRole[0]) {
    throw new Error(
      "SUPER_ADMIN role was not found in the database.",
    );
  }

  // ================================
  // CHECK EXISTING USER
  // ================================

  const existingUser = await db
    .select()
    .from(users)
    .where(
      eq(
        users.email,
        email,
      ),
    )
    .limit(1);

  if (existingUser[0]) {
    console.log(
      "SUPER_ADMIN already exists:",
      email,
    );

    return;
  }

  // ================================
  // HASH PASSWORD
  // ================================

  const passwordHash =
    await bcrypt.hash(
      password,
      12,
    );

  // ================================
  // CREATE SUPER ADMIN
  // ================================

  const result = await db
    .insert(users)
    .values({
      firstName: "Super",
      lastName: "Admin",
      email,
      passwordHash,
      roleId:
        superAdminRole[0].id,
      isActive: true,
    })
    .returning({
      id: users.id,
      firstName:
        users.firstName,
      lastName:
        users.lastName,
      email: users.email,
      roleId: users.roleId,
      isActive:
        users.isActive,
    });

  console.log(
    "SUPER_ADMIN created successfully:",
  );

  console.log(result[0]);

  console.log(
    "Email:",
    email,
  );

  console.log(
    "Password:",
    password,
  );
}

seedSuperAdmin()
  .catch((error) => {
    console.error(
      "Failed to create SUPER_ADMIN:",
      error,
    );

    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });