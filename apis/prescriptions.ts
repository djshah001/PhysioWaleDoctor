import api from "./api";
import { Template, PrescriptionPayload } from "../types/models";

export const prescriptionsApi = {
  getTemplates: () =>
    api.get<{ success: boolean; data: Template[] }>("/templates"),

  getTemplateById: (templateId: string) =>
    api.get<{ success: boolean; data: Template }>(`/templates/${templateId}`),

  assignPrescription: (data: PrescriptionPayload) =>
    api.post<{ success: boolean; data: any }>("/prescriptions", data),

  getExercises: (params?: { search?: string; limit?: number }) =>
    api.get<{ success: boolean; data: any[] }>("/exercises", { params }),
};
