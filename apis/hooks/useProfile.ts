import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorApi } from "../doctors";

export const DOCTOR_PROFILE_KEY = "doctorProfile";

export function useDoctorProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [DOCTOR_PROFILE_KEY],
    queryFn: async () => {
      const res = await doctorApi.getProfile();
      return res.data?.data.loggedInData;
    },
    enabled: options?.enabled,
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await doctorApi.updateProfile(data);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTOR_PROFILE_KEY] });
    },
  });
}
