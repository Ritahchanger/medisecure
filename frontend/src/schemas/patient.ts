import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  encryptedData: z.string().min(1, "Encrypted medical data is required"),
  conditions: z.array(z.string()).optional().default([]),
  symptoms: z.array(z.string()).optional().default([]),
  treatments: z.array(z.string()).optional().default([]),
});

export type PatientFormData = z.infer<typeof patientSchema>;
