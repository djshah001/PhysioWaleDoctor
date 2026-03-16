import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { appointmentApi, GetDoctorAppointmentsParams } from "../appointments";

export const APPOINTMENTS_QUERY_KEY = "doctorAppointments";

export function useDoctorAppointments(
  params: GetDoctorAppointmentsParams = {},
) {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await appointmentApi.getDoctorAppointments(params);
      console.log(res.appointments.length);
      return res; // Already unwrapped in api/appointments.ts
    },
  });
}

export function useInfiniteDoctorAppointments(
  params: Omit<GetDoctorAppointmentsParams, "page"> = {},
) {
  return useInfiniteQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, params, "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await appointmentApi.getDoctorAppointments({
        ...params,
        page: pageParam as number,
      });
      return res;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useAppointmentDetails(id: string) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const res = await appointmentApi.getAppointmentById(id);
      return res; // Already unwrapped in api/appointments.ts
    },
    enabled: !!id,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "confirmed" | "rejected" | "completed" | "cancelled";
    }) => appointmentApi.updateStatus(id, status),
    onSuccess: () => {
      // Invalidate the list so it refetches and reflects the new status instantly
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    },
  });
}
