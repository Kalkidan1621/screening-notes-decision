import type { CreateEmployerInput, UpdateEmployerInput } from "./employer.schema.js";
export declare function getAllEmployers(): Promise<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function getEmployerById(id: number): Promise<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function createEmployer(input: CreateEmployerInput): Promise<{
    address: string | null;
    createdAt: Date;
    description: string | null;
    email: string;
    id: number;
    isActive: boolean;
    logoUrl: string | null;
    name: string;
    phone: string | null;
    updatedAt: Date;
} | undefined>;
export declare function updateEmployer(id: number, input: UpdateEmployerInput): Promise<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function deleteEmployer(id: number): Promise<{
    id: number;
} | null>;
//# sourceMappingURL=employer.service.d.ts.map