import api from "./api";
import { TestResult, ClinicalPrescriptionPayload } from "../types/models";

export const clinicalApi = {
  getPatientTestResults: (patientId: string) =>
    api.get<{ success: boolean; data: TestResult[] }>(`/self-test/results/user/${patientId}`),

  getPendingTests: (params?: { page?: number; limit?: number; severity?: string; categoryId?: string }) =>
    api.get<{ success: boolean; data: TestResult[] }>("/doctor/pending-tests", { params }),

  updateTestStatus: (resultId: string, status: string) =>
    api.put<{ success: boolean; data: TestResult }>(`/doctor/test-results/${resultId}/status`, { status }),

  getTestResultById: (resultId: string) =>
    api.get<{ success: boolean; data: TestResult }>(`/self-test/results/${resultId}`),

  prescribeFromTest: (data: ClinicalPrescriptionPayload) =>
    api.post<{ success: boolean; data: any }>("/doctor/prescribe", data),
};
