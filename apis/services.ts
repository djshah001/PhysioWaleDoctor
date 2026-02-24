import api from "./api";
import { Service, ServiceFormData, ServiceListResponse } from "../types/models";

export interface GetMyServicesParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  isHomeVisit?: boolean;
  clinicId?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export const serviceApi = {
  /**
   * Get all services within the doctor's clinics.
   * Maps to: GET /api/v/services/my-services
   */
  getMyServices: (params: GetMyServicesParams = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.category && params.category !== "all")
      q.set("category", params.category);
    if (typeof params.isActive !== "undefined")
      q.set("isActive", String(params.isActive));
    if (typeof params.isHomeVisit !== "undefined")
      q.set("isHomeVisit", String(params.isHomeVisit));
    if (params.clinicId) q.set("clinicId", params.clinicId);
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return api.get<ApiResponse<Service[]>>(
      `/services/my-services${qs ? `?${qs}` : ""}`,
    );
  },

  /**
   * Create a new service.
   * Maps to: POST /api/v/services
   */
  createService: (data: ServiceFormData) =>
    api.post<ApiResponse<Service>>("/services", data),

  /**
   * Update an existing service.
   * Maps to: PUT /api/v/services/:id
   */
  updateService: (id: string, data: Partial<ServiceFormData>) =>
    api.put<ApiResponse<Service>>(`/services/${id}`, data),

  /**
   * Toggle the isActive flag on a service.
   */
  toggleActive: (id: string, isActive: boolean) =>
    api.put<ApiResponse<Service>>(`/services/${id}`, { isActive }),

  /**
   * Delete a service permanently.
   * Maps to: DELETE /api/v/services/:id
   */
  deleteService: (id: string) =>
    api.delete<ApiResponse<null>>(`/services/${id}`),

  /**
   * Get a single service by ID (public).
   * Maps to: GET /api/v/services/:id
   */
  getServiceById: (id: string) =>
    api.get<ApiResponse<Service>>(`/services/${id}`),

  /**
   * Get all services for a clinic (public, patient app).
   * Maps to: GET /api/v/services/clinic/:clinicId
   */
  getClinicServices: (clinicId: string, params?: { category?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    const qs = q.toString();
    return api.get<ApiResponse<Service[]>>(
      `/services/clinic/${clinicId}${qs ? `?${qs}` : ""}`,
    );
  },
};
