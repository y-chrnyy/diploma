import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Star, Loader2, Eye, Ban } from 'lucide-react';
import { useFavoriteVacancy } from '@/lib/hooks/useFavoriteVacancy.ts';
import { useFavorites } from '@/lib/providers/favorites.tsx';
import { useViewed } from '@/lib/contexts/ViewedContext.tsx';
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { useBlockedVacancies } from "@/lib/contexts/BlockedVacanciesContext.tsx";
import { cn } from '@/lib/utils.ts';
import { formatSalary, formatDate } from '@/lib/utils/formatters.ts';
import type { VacancyCardProps } from './types.ts';
import { Card } from "@/components/ui/card.tsx";
import { Truncate } from "@/components/ui/truncate.tsx";
import { api } from "@/lib/api/ServerApi.ts";

interface ExtendedVacancyCardProps extends VacancyCardProps, React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export const VacancyCard = ({ vacancy, className, ...props }: ExtendedVacancyCardProps) => {
  const { isViewed } = useViewed();
  const isVacancyViewed = isViewed(vacancy.id);
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFavorite, isPending } = useFavoriteVacancy();
  const { isFavorite, isLoading: isFavoritesLoading } = useFavorites();
  const { login, isAdmin } = useUser();
  const { isBlocked, refreshBlockedVacancies } = useBlockedVacancies();
  const [blockLoading, setBlockLoading] = React.useState(false);
  const vacancyIsBlocked = isBlocked(vacancy.id);

  if (!vacancy || !vacancy.name || !vacancy.employer) {
    return (
      <Card className={cn("p-6", className)} {...props}>
        <div className="text-center text-muted-foreground">
          Ошибка загрузки данных вакансии
        </div>
      </Card>
    );
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!login) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    toggleFavorite(vacancy.id);
  };

  const handleToggleBlock = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setBlockLoading(true);
      if (vacancyIsBlocked) {
        await api.unblockVacancy(vacancy.id);
      } else {
        await api.blockVacancy(vacancy.id);
      }
      await refreshBlockedVacancies();
    } catch (error) {
      console.error('Failed to toggle vacancy block status:', error);
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        isVacancyViewed && "opacity-25",
        vacancyIsBlocked && "bg-red-50",
        "hover:opacity-100",
        className
      )} 
      {...props}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isVacancyViewed && <Eye className="h-4 w-4 text-muted-foreground" />}
              {vacancyIsBlocked && <Ban className="h-4 w-4 text-red-500" />}
              <h3 className="font-semibold leading-none tracking-tight">
                {vacancy.name}
              </h3>
            </div>
            <div className="mt-2 text-lg font-semibold text-primary">
              {formatSalary(vacancy.salary)}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>{vacancy.employer.name}</div>
              {vacancy.address?.city && (
                <div className="mt-1">
                  {vacancy.address.city}
                  {vacancy.address.metro && `, м. ${vacancy.address.metro.station_name}`}
                </div>
              )}
              <div className="mt-1">Опубликовано: {formatDate(vacancy.published_at)}</div>
            </div>
            {(vacancy.snippet?.requirement || vacancy.snippet?.responsibility) && (
              <div className="mt-4 space-y-3">
                {vacancy.snippet.requirement && (
                  <Truncate limit={5}>
                    <div className="font-medium">Требования:</div>
                    <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: vacancy.snippet.requirement }} />
                  </Truncate>
                )}
                {vacancy.snippet.responsibility && (
                  <Truncate limit={3}>
                    <div className="font-medium">Обязанности:</div>
                    <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: vacancy.snippet.responsibility }} />
                  </Truncate>
                )}
              </div>
            )}
          </div>
          {vacancy.employer.logo_urls?.original && (
            <div className="flex-shrink-0">
              <img 
                src={vacancy.employer.logo_urls.original} 
                alt={vacancy.employer.name} 
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between gap-2">
          <div className="flex items-center gap-2 ml-auto">
            <Button onClick={() => navigate(`/vacancy/${vacancy.id}`)}>
              Подробнее
            </Button>
            {login && (
              <>
                <Button
                  variant={isFavorite(vacancy.id) ? "default" : "secondary"}
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={isPending || isFavoritesLoading}
                  className="h-10 w-10 flex-shrink-0"
                >
                  {isPending || isFavoritesLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Star className={cn("h-5 w-5", isFavorite(vacancy.id) && "fill-current")} />
                  )}
                </Button>
                {isAdmin && (
                  <Button
                    variant={vacancyIsBlocked ? "destructive" : "outline"}
                    size="icon"
                    onClick={handleToggleBlock}
                    disabled={blockLoading}
                    className="h-10 w-10 flex-shrink-0"
                    title={vacancyIsBlocked ? "Разблокировать вакансию" : "Заблокировать вакансию"}
                  >
                    {blockLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Ban className={cn("h-5 w-5", {
                        "text-white": vacancyIsBlocked,
                        "text-muted-foreground": !vacancyIsBlocked
                      })} />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VacancyCard; 