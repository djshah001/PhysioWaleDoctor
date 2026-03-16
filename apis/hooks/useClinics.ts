import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicApi } from "../clinic";

export const CLINICS_QUERY_KEY = "clinics";
export const CLINIC_SUMMARY_KEY = "clinicSummary";

export function useMyClinics(doctorId: string) {
  return useQuery({
    queryKey: [CLINICS_QUERY_KEY, doctorId],
    queryFn: async () => {
      const res = await clinicApi.getMyClinics(doctorId);
      return res.data?.data || [];
    },
    enabled: !!doctorId,
  });
}

export function useClinicSummary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [CLINIC_SUMMARY_KEY],
    queryFn: async () => {
      const res = await clinicApi.getClinicSummary();
      return res.data?.data || [];
    },
    enabled: options?.enabled,
  });
}

export function useClinicDetails(id: string) {
  return useQuery({
    queryKey: ["clinic", id],
    queryFn: async () => {
      const res = await clinicApi.getClinicById(id);
      return res.data?.data;
    },
    enabled: !!id,
  });
}

export function useUpdateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await clinicApi.updateClinic(id, data);
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLINICS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CLINIC_SUMMARY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["clinic", variables.id] });
    },
  });
}
