import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const TEMPLATES_QUERY_KEY = "templates";

// In apis/api.ts we use generic calls, so let's mock the wrapped types for React Query directly here.
export function useTemplates() {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: any }>("/templates");
      const data = res.data?.data;
      return Array.isArray(data) ? data : data?.templates || data?.items || [];
    },
  });
}

export function useTemplateDetails(
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: any }>(
        `/templates/${id}`,
      );
      return res.data?.data;
    },
    enabled: options?.enabled ?? !!id,
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/templates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/templates", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/templates/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
}
