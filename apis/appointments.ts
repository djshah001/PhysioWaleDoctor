import api from "./api";
import {
  Appointment,
  PopulatedAppointment,
  AppointmentStats,
} from "../types/models";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AvailableSlotsResponse {
  success: boolean;
  data: { startTime: string; endTime: string }[];
}

interface BookAppointmentPayload {
  doctorId: string;
  clinicId: string;
  serviceId: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  appointmentType: "In-Clinic" | "Home-Visit" | "Video-Call";
  symptoms?: string;
}

export type BookingStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export interface AppointmentListResponse {
  appointments: PopulatedAppointment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface GetDoctorAppointmentsParams {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  clinicId?: string;
  appointmentType?: "In-Clinic" | "Home-Visit" | "Video-Call";
  search?: string;
  page?: number;
  limit?: number;
}

// ─── API ────────────────────────────────────────────────────────────────────────

export const appointmentApi = {
  getAvailableSlots: (date: string, doctorId: string, clinicId: string) =>
    api.get<AvailableSlotsResponse>("/appointments/available-slots", {
      params: { date, doctorId, clinicId },
    }),

  book: (data: BookAppointmentPayload) =>
    api.post<{ success: boolean; data: Appointment }>(
      "/appointments/book",
      data,
    ),

  getMyAppointments: (status?: string, page?: number, limit?: number) =>
    api.get<{ success: boolean; data: PopulatedAppointment[] }>(
      `/appointments/my-appointments?${status ? `status=${status}&` : ""}page=${page || 1}&limit=${limit || 10}`,
    ),

  /**
   * GET /appointments/doctor/appointments
   * Paginated, filterable appointment list for the logged-in doctor.
   */
  getDoctorAppointments: async (
    params: GetDoctorAppointmentsParams = {},
  ): Promise<AppointmentListResponse> => {
    const q = new URLSearchParams();
    if (params.status && params.status !== "all")
      q.set("status", params.status);
    if (params.startDate) q.set("startDate", params.startDate);
    if (params.endDate) q.set("endDate", params.endDate);
    if (params.clinicId) q.set("clinicId", params.clinicId);
    if (params.appointmentType)
      q.set("appointmentType", params.appointmentType);
    if (params.search) q.set("search", params.search);
    q.set("page", String(params.page ?? 1));
    q.set("limit", String(params.limit ?? 15));

    const res = await api.get<{
      success: boolean;
      data: AppointmentListResponse;
    }>(`/appointments/doctor/appointments?${q.toString()}`);
    return res.data.data;
  },

  /**
   * GET /appointments/:id
   * Full appointment detail (includes verificationCode for doctor).
   */
  getAppointmentById: async (id: string): Promise<PopulatedAppointment> => {
    const res = await api.get<{ success: boolean; data: PopulatedAppointment }>(
      `/appointments/${id}`,
    );
    return res.data.data;
  },

  /**
   * PATCH /appointments/:id/status
   * Accept (confirmed), reject, complete, or cancel.
   */
  updateStatus: async (
    id: string,
    status: "confirmed" | "rejected" | "completed" | "cancelled",
  ): Promise<PopulatedAppointment> => {
    const res = await api.patch<{
      success: boolean;
      data: PopulatedAppointment;
    }>(`/appointments/${id}/status`, { status });
    return res.data.data;
  },

  getAppointmentStats: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return api.get<{ success: boolean; data: AppointmentStats }>(
      `/appointments/doctor/stats?${params.toString()}`,
    );
  },
};
