import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/ServerApi.ts';
import { toast } from 'sonner';
import { useFavorites } from '@/lib/providers/favorites.tsx';

interface FavoriteVacancyPayload {
  vacancyId: string;
}

export const useFavoriteVacancy = () => {
  const { setFavorites, isFavorite } = useFavorites();

  const { mutate: addToFavorites, isPending: isAddPending } = useMutation({
    mutationFn: async (payload: FavoriteVacancyPayload) => {
      const response = await api.addToFavorites(payload.vacancyId);
      return response;
    },
    onSuccess: (response) => {
      toast('Вакансия добавлена в избранное');
      if (response.favorites) {
        setFavorites(response.favorites);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось добавить вакансию в избранное');
    },
  });

  const { mutate: removeFromFavorites, isPending: isRemovePending } = useMutation({
    mutationFn: async (payload: FavoriteVacancyPayload) => {
      const response = await api.removeFromFavorites(payload.vacancyId);
      return response;
    },
    onSuccess: (response) => {
      toast('Вакансия удалена из избранного');
      if (response.favorites) {
        setFavorites(response.favorites);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось удалить вакансию из избранного');
    },
  });

  const toggleFavorite = (vacancyId: string) => {
    if (isFavorite(vacancyId)) {
      removeFromFavorites({ vacancyId });
    } else {
      addToFavorites({ vacancyId });
    }
  };

  return {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isPending: isAddPending || isRemovePending
  };
}; 