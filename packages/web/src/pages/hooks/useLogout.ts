import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.logout()
  });
}; 