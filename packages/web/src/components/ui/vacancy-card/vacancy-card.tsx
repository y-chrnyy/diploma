import { Card } from "@/components/ui/card.tsx";
import { HeartButton } from "@/components/ui/heart-button.tsx";
import type { Vacancy } from "./types.ts";

interface VacancyCardProps {
  vacancy: Vacancy;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
}

export const VacancyCard = ({ 
  vacancy, 
  showFavoriteButton = false,
  isFavorite = false,
  onFavoriteClick 
}: VacancyCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{vacancy.name}</h3>
          <p className="text-sm text-muted-foreground">{vacancy.employer.name}</p>
          {vacancy.salary && (
            <p className="text-sm">
              {vacancy.salary.from && `от ${vacancy.salary.from}`}
              {vacancy.salary.to && ` до ${vacancy.salary.to}`}
              {vacancy.salary.currency}
            </p>
          )}
        </div>
        {showFavoriteButton && onFavoriteClick && (
          <HeartButton
            isFavorite={isFavorite}
            onClick={() => onFavoriteClick(vacancy.id)}
          />
        )}
      </div>
    </Card>
  );
}; 