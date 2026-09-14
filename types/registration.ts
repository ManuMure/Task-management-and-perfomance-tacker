export const REGISTRATION_STATUSES = ["Active", "Pending", "Suspended"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export interface Registration {
  id: string; // e.g. "EMP-1042"
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: RegistrationStatus;
  registeredAt: string; // ISO timestamp
}