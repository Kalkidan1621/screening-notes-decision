import { db } from "./index.js";
import { roles, permissions, rolePermissions, } from "./schema.js";
// ============================
// ROLES
// ============================
const roleData = [
    {
        name: "SUPER_ADMIN",
        description: "Full access to the entire recruitment system",
    },
    {
        name: "ADMIN",
        description: "Manages users, jobs and recruitment operations",
    },
    {
        name: "RECRUITER",
        description: "Manages jobs, applications and candidate screening",
    },
    {
        name: "HIRING_MANAGER",
        description: "Reviews candidates and participates in hiring decisions",
    },
];
// ============================
// PERMISSIONS
// ============================
const permissionData = [
    {
        name: "jobs.read",
        description: "View job positions",
    },
    {
        name: "jobs.create",
        description: "Create job positions",
    },
    {
        name: "jobs.update",
        description: "Update job positions",
    },
    {
        name: "jobs.delete",
        description: "Delete job positions",
    },
    {
        name: "applications.read",
        description: "View applications",
    },
    {
        name: "applications.update",
        description: "Update applications",
    },
    {
        name: "applications.delete",
        description: "Delete applications",
    },
    {
        name: "applications.stats.read",
        description: "View application statistics",
    },
    {
        name: "applications.status.update",
        description: "Approve or reject applications",
    },
    {
        name: "screening.read",
        description: "View screening information",
    },
    {
        name: "screening.decision.write",
        description: "Create or update screening decisions",
    },
    {
        name: "screening.delete",
        description: "Delete screening information",
    },
    {
        name: "hiring_decisions.read",
        description: "View hiring decisions",
    },
    {
        name: "hiring_decisions.create",
        description: "Create hiring decisions",
    },
    {
        name: "hiring_decisions.update",
        description: "Update hiring decisions",
    },
    {
        name: "users.read",
        description: "View users",
    },
    {
        name: "users.create",
        description: "Create users",
    },
    {
        name: "users.update",
        description: "Update users",
    },
    {
        name: "users.delete",
        description: "Delete users",
    },
    {
        name: "roles.read",
        description: "View roles",
    },
    {
        name: "roles.create",
        description: "Create roles",
    },
    {
        name: "roles.update",
        description: "Update roles",
    },
    {
        name: "permissions.read",
        description: "View permissions",
    },
    {
        name: "permissions.manage",
        description: "Manage permissions",
    },
];
// ============================
// SEED
// ============================
async function seed() {
    console.log("🌱 Starting database seed...");
    // ============================
    // INSERT ROLES
    // ============================
    for (const role of roleData) {
        await db
            .insert(roles)
            .values(role)
            .onConflictDoNothing();
    }
    console.log("✅ Roles seeded");
    // ============================
    // INSERT PERMISSIONS
    // ============================
    for (const permission of permissionData) {
        await db
            .insert(permissions)
            .values(permission)
            .onConflictDoNothing();
    }
    console.log("✅ Permissions seeded");
    // ============================
    // GET SAVED DATA
    // ============================
    const savedRoles = await db
        .select()
        .from(roles);
    const savedPermissions = await db
        .select()
        .from(permissions);
    const roleMap = new Map(savedRoles.map((role) => [
        role.name,
        role.id,
    ]));
    const permissionMap = new Map(savedPermissions.map((permission) => [
        permission.name,
        permission.id,
    ]));
    // ============================
    // PERMISSIONS BY ROLE
    // ============================
    const recruiterPermissions = [
        "jobs.read",
        "jobs.create",
        "jobs.update",
        "applications.read",
        "applications.update",
        "applications.stats.read",
        "applications.status.update",
        "screening.read",
        "screening.decision.write",
    ];
    const hiringManagerPermissions = [
        "jobs.read",
        "applications.read",
        "applications.stats.read",
        "screening.read",
        "screening.decision.write",
        "hiring_decisions.read",
        "hiring_decisions.create",
        "hiring_decisions.update",
    ];
    const adminPermissions = [
        "jobs.read",
        "jobs.create",
        "jobs.update",
        "jobs.delete",
        "applications.read",
        "applications.update",
        "applications.delete",
        "applications.stats.read",
        "applications.status.update",
        "screening.read",
        "screening.decision.write",
        "screening.delete",
        "hiring_decisions.read",
        "hiring_decisions.create",
        "hiring_decisions.update",
        "users.read",
        "users.create",
        "users.update",
        "users.delete",
        "roles.read",
        "roles.create",
        "roles.update",
        "permissions.read",
        "permissions.manage",
    ];
    // ============================
    // HELPER FUNCTION
    // ============================
    async function assignPermissions(roleName, permissionNames) {
        const roleId = roleMap.get(roleName);
        if (!roleId) {
            throw new Error(`Role ${roleName} not found`);
        }
        for (const permissionName of permissionNames) {
            const permissionId = permissionMap.get(permissionName);
            if (!permissionId) {
                throw new Error(`Permission ${permissionName} not found`);
            }
            await db
                .insert(rolePermissions)
                .values({
                roleId,
                permissionId,
            })
                .onConflictDoNothing();
        }
    }
    // ============================
    // ASSIGN SUPER ADMIN
    // ============================
    await assignPermissions("SUPER_ADMIN", permissionData.map((permission) => permission.name));
    // ============================
    // ASSIGN ADMIN
    // ============================
    await assignPermissions("ADMIN", adminPermissions);
    // ============================
    // ASSIGN RECRUITER
    // ============================
    await assignPermissions("RECRUITER", recruiterPermissions);
    // ============================
    // ASSIGN HIRING MANAGER
    // ============================
    await assignPermissions("HIRING_MANAGER", hiringManagerPermissions);
    console.log("✅ Role permissions seeded");
    console.log("🎉 Database seed completed successfully!");
}
seed()
    .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map