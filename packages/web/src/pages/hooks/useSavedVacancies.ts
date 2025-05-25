import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";
import type { HhVacancyFull } from "@/lib/api/types.ts";

interface SavedVacanciesData {
  items: HhVacancyFull[];
  found: number;
}

async function getFavoriteVacanciesData(ids: string[]): Promise<SavedVacanciesData> {
  const vacancies = await Promise.all(
    ids.map((id) => api.getVacancy(id).catch(() => null))
  );
  return {
    items: vacancies.filter((v: HhVacancyFull | null): v is HhVacancyFull => v !== null),
    found: ids.length
  };
}

async function getViewedVacanciesData(ids: string[]): Promise<SavedVacanciesData> {
  const vacancies = await Promise.all(
    ids.map((id) => api.getVacancy(id).catch(() => null))
  );
  return {
    items: vacancies.filter((v: HhVacancyFull | null): v is HhVacancyFull => v !== null),
    found: ids.length
  };
}

export const useSavedVacancies = (type: 'favorites' | 'viewed') => {
  const { data: ids = [] } = useQuery<string[], Error>({
    queryKey: [type, 'ids'],
    queryFn: async () => {
      try {
        if (type === 'favorites') {
          const response = await api.getFavorites();
          return response.favorites;
        } else {
          const response = await api.getViewed();
          return response.viewed;
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} ids:`, error);
        return [];
      }
    }
  });

  return useQuery<SavedVacanciesData, Error>({
    queryKey: [type, 'data', ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      try {
        return type === 'favorites'
          ? await getFavoriteVacanciesData(ids)
          : await getViewedVacanciesData(ids);
      } catch (error) {
        console.error(`Failed to fetch ${type} vacancies:`, error);
        return {
          items: [],
          found: 0
        };
      }
    }
  });
}; 