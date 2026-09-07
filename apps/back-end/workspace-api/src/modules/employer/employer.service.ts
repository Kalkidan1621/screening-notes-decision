import { eq, desc } from "drizzle-orm";

import { db } from "../../db/index.js";
import { employers } from "../../db/schema.js";

import type {
  CreateEmployerInput,
  UpdateEmployerInput,
} from "./employer.schema.js";

export async function getAllEmployers() {
  return db
    .select()
    .from(employers)
    .orderBy(desc(employers.createdAt));
}

export async function getEmployerById(id: number) {
  const result = await db
    .select()
    .from(employers)
    .where(eq(employers.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createEmployer(
  input: CreateEmployerInput,
) {
  const result = await db
    .insert(employers)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      address: input.address || null,
      description: input.description || null,
      logoUrl: input.logoUrl || null,
      isActive: input.isActive ?? true,
    })
    .returning();

  return result[0];
}

export async function updateEmployer(
  id: number,
  input: UpdateEmployerInput,
) {
  const result = await db
    .update(employers)
    .set({
      ...input,
      phone: input.phone === "" ? null : input.phone,
      address: input.address === "" ? null : input.address,
      description:
        input.description === ""
          ? null
          : input.description,
      logoUrl:
        input.logoUrl === ""
          ? null
          : input.logoUrl,
      updatedAt: new Date(),
    })
    .where(eq(employers.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteEmployer(id: number) {
  const result = await db
    .delete(employers)
    .where(eq(employers.id, id))
    .returning({
      id: employers.id,
    });

  return result[0] ?? null;
}