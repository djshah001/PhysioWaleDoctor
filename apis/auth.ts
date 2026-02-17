import api from "./api";
import {
  LoginPayload,
  VerifyOtpPayload,
  CheckEligibilityPayload,
  AuthResponse,
} from "../types/auth";

export const authApi = {
  // Check if user can register (Backend check)
  checkEligibility: (data: CheckEligibilityPayload) =>
    api.post<AuthResponse>("/auth/sendotp", { ...data, context: "doctor" }),

  // Verify Firebase Token and Create User
  verifyRegistration: (data: VerifyOtpPayload) =>
    api.post<AuthResponse>("/auth/verifyotp", { ...data, context: "doctor" }),

  // Direct Registration (Skip OTP)
  registerDirect: (data: any) =>
    api.post<AuthResponse>("/auth/register-direct", {
      ...data,
      context: "doctor",
    }),

  // Sign Up - Create new doctor with complete profile
  signUp: (data: any) =>
    api.post<AuthResponse>("/auth/signup", { ...data, context: "doctor" }),

  // Upload Profile Pic
  uploadProfilePic: (formData: FormData) =>
    api.post<{ success: boolean; filePath: string }>("/auth/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Login with Phone/Password
  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/signin/doctor", data),

  // Get Current User Data
  getCurrentUser: () =>
    api.get<{ loggedInData: any }>("/auth/getLoggedInData/doctor"),

  logout: () => api.post("/auth/logout"),

  refresh: (refreshToken: string) =>
    api.post("/auth/refresh-token", { refreshToken }),
};
