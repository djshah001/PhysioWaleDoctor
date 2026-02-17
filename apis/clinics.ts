import api from "./api";
import { Clinic } from "../types/models";

export const clinicApi = {
  getAll: () => api.get<Clinic[]>("/clinics"),
  getById: (id: string) => api.get<Clinic>(`/clinics/${id}`),
  searchPlaces: (input: string) =>
    api.post<Clinic[]>("/clinics/autocomplete", { input }),
};
