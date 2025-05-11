import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";
import type { HhVacancyFull } from "@/lib/api/types.ts";

export const useVacancy = (id: string | undefined) => {
  const { data: vacancy, isLoading, isError, error } = useQuery<HhVacancyFull, Error>({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Vacancy ID is required');
      }
      try {
        return await api.getVacancy(id);
      } catch (error) {
        // Проверяем тип ошибки и пробрасываем нужный текст
        if (error instanceof Error) {
          if (error.message.includes('403')) {
            throw new Error('Vacancy is blocked');
          }
          if (error.message.includes('404')) {
            throw new Error('404 Not Found');
          }
        }
        throw error;
      }
    },
    enabled: !!id,
    // Не ретраим ошибки 403 и 404
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message === 'Vacancy is blocked' || error.message.includes('404'))) {
        return false;
      }
      return failureCount < 3;
    }
  });

  return { vacancy, isLoading, isError, error };
}; 