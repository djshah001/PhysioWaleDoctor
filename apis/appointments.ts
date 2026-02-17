import api from "./api";
import {
  Appointment,
  PopulatedAppointment,
  AppointmentStats,
} from "../types/models";

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

  getDoctorAppointments: (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    clinicId?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.clinicId) queryParams.append("clinicId", params.clinicId);
    queryParams.append("page", String(params?.page || 1));
    queryParams.append("limit", String(params?.limit || 10));

    return api.get<{ success: boolean; data: PopulatedAppointment[] }>(
      `/appointments/doctor/appointments?${queryParams.toString()}`,
    );
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
