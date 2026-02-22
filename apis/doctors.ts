import api from "./api";
import { Doctor, ClinicAnalytics } from "../types/models";

export const doctorApi = {
  // Public facing doctor search/view
  getBySpecialization: (specialization: string) =>
    api.get<Doctor[]>(`/doctors/specialization/${specialization}`),

  getById: (id: string) => api.get<Doctor>(`/doctors/${id}`),

  // Note: /doctors/profile and /doctors/upcoming-appointments are for the Doctor App

  getClinicAnalytics: (clinicId: string, timeframe: string = "month") =>
    api.get<{ success: boolean; message: string; data: ClinicAnalytics }>(
      `/doctors/clinic/${clinicId}/analytics?timeframe=${timeframe}`,
    ),
};
