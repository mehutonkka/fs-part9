import { z } from "zod";

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export const Gender = {
    Male: 'male',
    Female: 'female',
    Other: 'other'
} as const;


export type Gender = typeof Gender[keyof typeof Gender];

export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.iso.date(),
    ssn: z.string(),
    gender: z.enum(Gender),
    occupation: z.string()
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
    id: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;
