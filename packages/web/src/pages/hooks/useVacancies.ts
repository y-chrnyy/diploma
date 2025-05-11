import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";
import type { HhVacancySearchParams } from "@/lib/api/types.ts";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver.ts";
import { toast } from "sonner";

export type VacanciesState = {
  isLoading: boolean;
  isError: boolean;
  vacancies: HhVacancySearchParams[];
  total: number;
  page: number;
  totalPages: number;
  error?: {
    message: string;
    status: number;
  };
};

export const useVacancies = (params: Omit<HhVacancySearchParams, 'page'>) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["vacancies", params],
    queryFn: async ({ pageParam = 0 }) => {
      return api.searchVacancies({
        ...params,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.items.length) return undefined;
      if (pages.length >= lastPage.pages) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
  });

  const {intersectionRef, attachObserver} = useIntersectionObserver(() => {
    if(!hasNextPage || isLoading) return;

    toast.promise(fetchNextPage(), {
      'loading': 'Загружаем новые вакансии...',
      'error': 'Не получилось загрузить вакансии'
    });
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    intersectionRef,
    attachObserver
  };
};

