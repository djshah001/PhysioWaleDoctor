import { Patient, Doctor, Admin } from "./models";

// Unified User type based on models
export type User = Patient | Doctor | Admin;

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User; // Using generic User type
    id?: string;
  };
}

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface CheckEligibilityPayload {
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  context?: "patient" | "doctor";
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  token: string; // Firebase ID Token
  name: string;
  password?: string;
  countryCode?: string;
  context?: "patient" | "doctor";
}

export interface RegisterPayload {
  name: string;
  email?: string; // Optional now
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
}
