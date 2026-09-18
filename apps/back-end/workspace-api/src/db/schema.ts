import {
  integer,
  boolean,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const roles = pgTable(
  "roles",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 50,
    }).notNull().unique(),

    description: varchar("description", {
      length: 255,
    }),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
);

export const permissions = pgTable(
  "permissions",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull().unique(),

    description: varchar("description", {
      length: 255,
    }),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: serial("id").primaryKey(),

    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
      }),

    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueRolePermission: unique(
      "unique_role_permission",
    ).on(
      table.roleId,
      table.permissionId,
    ),
  }),
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),

    firstName: varchar("first_name", {
      length: 100,
    }).notNull(),

    lastName: varchar("last_name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull().unique(),

    passwordHash: text(
      "password_hash",
    ).notNull(),

    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "restrict",
      }),

    profileImageUrl: text(
      "profile_image_url",
    ),

    isActive: boolean("is_active")
       .notNull()
        .default(true),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow(),
  },
);
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    tokenHash: text("token_hash")
      .notNull()
      .unique(),

    expiresAt: timestamp("expires_at")
      .notNull(),

    usedAt: timestamp("used_at"),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
);

export const employers = pgTable(
  "employers",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull().unique(),

    phone: varchar("phone", {
      length: 50,
    }),

    address: varchar("address", {
      length: 255,
    }),

    description: text("description"),

    logoUrl: text("logo_url"),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow(),
  },
);
export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    token: text("token")
      .notNull()
      .unique(),

    expiresAt: timestamp(
      "expires_at",
    ).notNull(),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
);

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),

    // Basic information

    title: varchar("title", {
      length: 255,
    }).notNull(),

    employer: varchar("employer", {
      length: 255,
    }).notNull(),

    department: varchar("department", {
      length: 100,
    }).notNull(),

    location: varchar("location", {
      length: 100,
    }).notNull(),


    // Job information

    employmentType: varchar(
      "employment_type",
      {
        length: 50,
      },
    ).notNull(),

    workingTime: varchar(
      "working_time",
      {
        length: 100,
      },
    ).notNull(),

    experience: varchar(
      "experience",
      {
        length: 100,
      },
    ).notNull(),

    educationalQualification:
      varchar(
        "educational_qualification",
        {
          length: 255,
        },
      ).notNull(),


    // Dates and salary

    openingDate: varchar(
      "opening_date",
      {
        length: 50,
      },
    ).notNull(),

    closingDate: varchar(
      "closing_date",
      {
        length: 50,
      },
    ).notNull(),

    salary: varchar("salary", {
      length: 100,
    }).notNull(),


    // Existing fields

    priority: varchar("priority", {
      length: 20,
    }).notNull(),

    description:
      text("description")
        .notNull(),

    status: varchar("status", {
      length: 20,
    })
      .notNull()
      .default("active"),

    createdAt:
      timestamp("created_at")
        .notNull()
        .defaultNow(),

    updatedAt:
      timestamp("updated_at")
        .notNull()
        .defaultNow(),
  },
);

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),

    candidateId: integer("candidate_id")
      .references(() => users.id, {
        onDelete: "cascade",
      }),

      jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, {
        onDelete: "cascade",
      }),

    fullName: varchar("full_name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    phone: varchar("phone", {
      length: 50,
    }).notNull(),

    resumeName: varchar(
      "resume_name",
      {
        length: 255,
      },
    ).notNull(),

    resumeUrl: text("resume_url"),

    resumePath: varchar("resume_path", {
  length: 500,
}),

    status: varchar("status", {
      length: 20,
    })
      .notNull()
      .default("pending"),

    createdAt:
      timestamp("created_at")
        .notNull()
        .defaultNow(),

    updatedAt:
      timestamp("updated_at")
        .notNull()
        .defaultNow(),
  },
   (table) => ({
    uniqueCandidateJob: unique(
      "unique_candidate_job",
    ).on(
      table.candidateId,
      table.jobId,
    ),
  }),
);

export const interviews = pgTable(
  "interviews",
  {
    id: serial("id").primaryKey(),

    applicationId: integer(
      "application_id",
    )
      .notNull()
      .references(
        () => applications.id,
        {
          onDelete: "cascade",
        },
      ),

    interviewerId: integer(
      "interviewer_id",
    )
      .references(
        () => users.id,
        {
          onDelete: "set null",
        },
      ),

    interviewType: varchar(
      "interview_type",
      {
        length: 50,
      },
    ).notNull(),

    scheduledAt: timestamp(
      "scheduled_at",
    ).notNull(),

    location: varchar(
      "location",
      {
        length: 255,
      },
    ),

    notes: text("notes"),

    status: varchar(
      "status",
      {
        length: 30,
      },
    )
      .notNull()
      .default("scheduled"),

    createdAt: timestamp(
      "created_at",
    )
      .notNull()
      .defaultNow(),

    updatedAt: timestamp(
      "updated_at",
    )
      .notNull()
      .defaultNow(),
  },
);
export const screeningDecisions = pgTable(
  "screening_decisions",
  {
    id: serial("id").primaryKey(),

    applicationId: integer(
      "application_id",
    )
      .notNull()
      .references(() => applications.id, {
        onDelete: "cascade",
      })
      .unique(),

    decision: varchar("decision", {
      length: 20,
    }).notNull(),

    note: text("note"),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow(),
  },
);
export const hiringDecisions = pgTable(
  "hiring_decisions",
  {
    id: serial("id").primaryKey(),

    applicationId: integer(
      "application_id",
    )
      .notNull()
      .references(() => applications.id, {
        onDelete: "cascade",
      })
      .unique(),

    decision: varchar("decision", {
      length: 20,
    }).notNull(),

    note: text("note"),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow(),
  },
);










