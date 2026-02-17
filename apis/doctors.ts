import api from "./api";
import { Doctor } from "../types/models";

export const doctorApi = {
  // Public facing doctor search/view
  getBySpecialization: (specialization: string) =>
    api.get<Doctor[]>(`/doctors/specialization/${specialization}`),

  getById: (id: string) => api.get<Doctor>(`/doctors/${id}`),

  // Note: /doctors/profile and /doctors/upcoming-appointments are for the Doctor App
};
