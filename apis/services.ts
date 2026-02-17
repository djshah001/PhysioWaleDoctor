import api from "./api";
import { Service } from "../types/models";

export const serviceApi = {
  getClinicServices: (clinicId: string) =>
    api.get<Service[]>(`/services/clinic/${clinicId}`),
};
