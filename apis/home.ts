import api from "./api";
import {
  Clinic,
  PopulatedAppointment,
  AppointmentStats,
  DashboardData,
} from "../types/models";

export const homeApi = {
  // Get all dashboard data in parallel
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const [clinicsRes, appointmentsRes, statsRes] = await Promise.all([
        api.get<{ success: boolean; data: Clinic[] }>("/clinics/my/clinics"),
        api.get<{ success: boolean; data: PopulatedAppointment[] }>(
          "/appointments/doctor/appointments?status=upcoming&limit=5",
        ),
        homeApi.getTodayStats(),
      ]);

      return {
        clinics: clinicsRes.data.data || [],
        upcomingAppointments: appointmentsRes.data.data || [],
        todayStats: statsRes,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Get today's statistics
  getTodayStats: async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const response = await api.get<{
        success: boolean;
        data: AppointmentStats;
      }>(
        `/appointments/doctor/stats?startDate=${startOfDay}&endDate=${endOfDay}`,
      );

      const stats = response.data.data;

      return {
        totalAppointments: stats.total || 0,
        completedAppointments: stats.byStatus?.completed?.count || 0,
        pendingAppointments:
          (stats.byStatus?.pending?.count || 0) +
          (stats.byStatus?.confirmed?.count || 0),
        totalEarnings: stats.totalRevenue || 0,
      };
    } catch (error) {
      console.error("Error fetching today stats:", error);
      return {
        totalAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        totalEarnings: 0,
      };
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: (limit: number = 5) =>
    api.get<{ success: boolean; data: PopulatedAppointment[] }>(
      `/appointments/doctor/appointments?status=upcoming&limit=${limit}`,
    ),
};
