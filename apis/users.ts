import api from "./api";
import { Patient } from "../types/models";

export const userApi = {
  getProfile: () => api.get<Patient>("/users/profile"),
  updateProfile: (data: Partial<Patient>) =>
    api.put<Patient>("/users/profile", data),
  getBMI: () => api.get<{ bmi: number; status: string }>("/users/bmi"),
};
