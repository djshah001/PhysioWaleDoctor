import api from "./api";
import { Clinic, ClinicSummary } from "../types";

export const clinicApi = {
  // Create a new clinic
  createClinic: (data: Partial<Clinic>) =>
    api.post<{ success: boolean; data: Clinic }>("/clinics", data),

  // Update clinic
  updateClinic: (id: string, data: Partial<Clinic>) =>
    api.put<{ success: boolean; data: Clinic }>(`/clinics/${id}`, data),

  // Get clinics by doctor
  // Get clinics by doctor
  getMyClinics: (doctorId: string) =>
    api.get<{ success: boolean; data: Clinic[] }>(
      `/clinics/doctor/${doctorId}`,
    ),

  // Get clinic summary for dashboard/list purposes
  getClinicSummary: () =>
    api.get<{ success: boolean; data: ClinicSummary[] }>(
      "/doctors/clinic-summary",
    ),

  // Get clinic by ID
  getClinicById: (id: string) =>
    api.get<{ success: boolean; data: Clinic }>(`/clinics/${id}`),

  // Get nearby clinics (public)
  getNearby: (lat: number, lng: number, page?: number, limit?: number) =>
    api.get<{
      success: boolean;
      data: {
        clinics: Clinic[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalClinics: number;
          hasMore: boolean;
          nextPage: number | null;
        };
      };
    }>(
      `/clinics/nearby?latitude=${lat}&longitude=${lng}&page=${page || 1}&limit=${limit || 5}`,
    ),

  // Upload clinic images
  uploadClinicImages: (formData: FormData) =>
    api.post<{ success: boolean; data: { filePaths: string[] } }>(
      "/clinics/upload-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ),

  // Delete clinic
  deleteClinic: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/clinics/${id}`),
};
