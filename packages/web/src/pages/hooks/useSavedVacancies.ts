import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";
import type { HhVacancyFull } from "@/lib/api/types.ts";

interface SavedVacanciesData {
  items: HhVacancyFull[];
  found: number;
}

async function getFavoriteVacancies(): Promise<SavedVacanciesData> {
  const response = await api.getFavorites();
  const vacancies = await Promise.all(
    response.favorites.map((id: string) => api.getVacancy(id).catch(() => null))
  );
  return {
    items: vacancies.filter((v: HhVacancyFull | null): v is HhVacancyFull => v !== null),
    found: response.favorites.length
  };
}

async function getViewedVacancies(): Promise<SavedVacanciesData> {
  const response = await api.getViewed();
  const vacancies = await Promise.all(
    response.viewed.map((id: string) => api.getVacancy(id).catch(() => null))
  );
  return {
    items: vacancies.filter((v: HhVacancyFull | null): v is HhVacancyFull => v !== null),
    found: response.viewed.length
  };
}

export const useSavedVacancies = (type: 'favorites' | 'viewed') => {
  return useQuery<SavedVacanciesData>({
    queryKey: [type],
    queryFn: async () => {
      try {
        return type === 'favorites' 
          ? await getFavoriteVacancies()
          : await getViewedVacancies();
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