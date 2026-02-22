import api from "./api";
import { DashboardData } from "../types/models";

export const homeApi = {
  /**
   * Fetch all dashboard data from the consolidated /doctors/dashboard endpoint.
   * Timeframe: "week" | "month" | "year"
   */
  getDashboardData: async (
    timeframe: "week" | "month" | "year" = "month",
  ): Promise<DashboardData> => {
    const response = await api.get<{ success: boolean; data: DashboardData }>(
      `/doctors/dashboard?timeframe=${timeframe}`,
    );
    return response.data.data;
  },
};
