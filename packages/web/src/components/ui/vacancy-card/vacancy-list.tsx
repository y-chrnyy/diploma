import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { VacancyCard } from "./vacancy-card.tsx";
import type { Vacancy } from "./types.ts";

interface VacancyListProps {
  isLoading: boolean;
  isError: boolean;
  vacancies?: Vacancy[];
  emptyMessage: string;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
}

export const VacancyList = ({
  isLoading,
  isError,
  vacancies = [],
  emptyMessage,
  showFavoriteButton,
  isFavorite,
  onFavoriteClick
}: VacancyListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        Произошла ошибка при загрузке вакансий
      </div>
    );
  }

  if (!vacancies.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vacancies.map((vacancy) => (
        <VacancyCard
          key={vacancy.id}
          vacancy={vacancy}
          showFavoriteButton={showFavoriteButton}
          isFavorite={isFavorite}
          onFavoriteClick={onFavoriteClick}
        />
      ))}
    </div>
  );
}; 