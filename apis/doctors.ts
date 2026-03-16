import api from "./api";
import { Doctor, ClinicAnalytics } from "../types/models";

export const doctorApi = {
  // Public facing doctor search/view
  getBySpecialization: (specialization: string) =>
    api.get<Doctor[]>(`/doctors/specialization/${specialization}`),

  getById: (id: string) => api.get<Doctor>(`/doctors/${id}`),

  // Note: /doctors/profile and /doctors/upcoming-appointments are for the Doctor App
  getProfile: () =>
    api.get<{ success: boolean; data: { loggedInData: Doctor } }>(
      "/auth/getLoggedInData/doctor",
    ),

  updateProfile: (data: Partial<Doctor>) =>
    api.put<{ success: boolean; data: Doctor }>("/auth/doctor/profile", data),

  getClinicAnalytics: (clinicId: string, timeframe: string = "month") =>
    api.get<{ success: boolean; message: string; data: ClinicAnalytics }>(
      `/doctors/clinic/${clinicId}/analytics?timeframe=${timeframe}`,
    ),

  // Doctor Patient Management
  getMyPatients: () =>
    api.get<{ success: boolean; message: string; data: any[] }>(
      "/doctors/my/patients",
    ),
  getPatientDetails: (patientId: string) =>
    api.get<{ success: boolean; message: string; data: any }>(
      `/doctors/my/patients/${patientId}`,
    ),
};
