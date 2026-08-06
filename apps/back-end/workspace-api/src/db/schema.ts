import {
  integer,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";


export const screeningDecisions = pgTable(
  "screening_decisions",
  {
    id: serial("id").primaryKey(),

    stageId: varchar("stage_id", {
      length: 255,
    }).notNull(),

    decision: varchar("decision", {
      length: 20,
    }).notNull(),

    note: text("note"),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
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

    jobId: integer("job_id")
      .notNull(),

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
);