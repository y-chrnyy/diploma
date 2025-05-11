import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useVacancy } from "@/pages/hooks/useVacancy.ts";
import { Loader2, MapPin, Briefcase, Clock, User, Building2, Star, Mail, Phone, Ban, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import ErrorBlock from "@/components/ui/vacancy-card/ErrorBlock.tsx";
import { useFavoriteVacancy } from '@/lib/hooks/useFavoriteVacancy.ts';
import { useViewedVacancy } from '@/lib/hooks/useViewedVacancy.ts';
import { useFavorites } from '@/lib/providers/favorites.tsx';
import { cn } from '@/lib/utils.ts';
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { useViewed } from '@/lib/contexts/ViewedContext.tsx';
import { useBlockedVacancies } from "@/lib/contexts/BlockedVacanciesContext.tsx";
import { api } from "@/lib/api/ServerApi.ts";

const formatSalary = (salary?: { from?: number; to?: number; currency?: string }): string => {
  if (!salary) return "Зарплата не указана";
  const { from, to, currency = "RUB" } = salary;
  const currencyMap: Record<string, string> = {
    RUB: "₽",
    RUR: "₽",
    USD: "$",
    EUR: "€",
    BYN: "₽",
    KZT: "₸",
    UAH: "₴",
    AZN: "₼",
    GEL: "₾",
    KGS: "₽",
  };
  const currencySymbol = currencyMap[currency] || currency;
  if (from && to) {
    return `${from.toLocaleString()} - ${to.toLocaleString()} ${currencySymbol}`;
  } else if (from) {
    return `от ${from.toLocaleString()} ${currencySymbol}`;
  } else if (to) {
    return `до ${to.toLocaleString()} ${currencySymbol}`;
  }
  return "Зарплата не указана";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
};

const VacancyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vacancy, isLoading, isError, error } = useVacancy(id);
  const { addToFavorites, isPending } = useFavoriteVacancy();
  const { markAsViewed } = useViewedVacancy();
  const { isFavorite } = useFavorites();
  const { login, isAdmin } = useUser();
  const { isViewed } = useViewed();
  const { isBlocked, refreshBlockedVacancies } = useBlockedVacancies();
  const navigate = useNavigate();
  const location = useLocation();
  const [blockLoading, setBlockLoading] = React.useState(false);
  const vacancyIsBlocked = id ? isBlocked(id) : false;

  useEffect(() => {
    if (id && login && !isViewed(id)) {
      markAsViewed(id);
    }
  }, [id, login, isViewed]);

  const handleFavoriteClick = () => {
    if (!login) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    addToFavorites({ vacancyId: id! });
  };

  const handleToggleBlock = async () => {
    if (!id) return;
    try {
      setBlockLoading(true);
      if (vacancyIsBlocked) {
        await api.unblockVacancy(id);
      } else {
        await api.blockVacancy(id);
      }
      await refreshBlockedVacancies();
    } catch (error) {
      console.error('Failed to toggle vacancy block status:', error);
    } finally {
      setBlockLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    let message = "Попробуйте перезагрузить страницу, возможно это была разовая техническая ошибка";
    let title = "Не удалось загрузить вакансию";
    
    if (error?.message?.includes("404")) {
      title = "Вакансия не найдена";
      message = "Вакансия не существует или была удалена.";
    } else if (error?.message === "Vacancy is blocked") {
      title = "Вакансия заблокирована";
      message = "У вас нет доступа к просмотру этой вакансии.";
    }
    
    return <ErrorBlock title={title} message={message} />;
  }

  if (!vacancy) return null;

  const {
    name,
    employer,
    salary,
    experience,
    schedule,
    employment,
    address,
    key_skills,
    contacts,
    published_at,
    description,
  } = vacancy;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>
      
      {/* Шапка */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-8">
        {employer.logo_urls?.original && (
          <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-lg border w-24 h-24 p-2">
            <img src={employer.logo_urls.original} alt={employer.name} className="object-contain h-full w-full" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold leading-tight">{name}</h1>
              {vacancyIsBlocked && (
                <div className="flex items-center gap-1 text-red-500">
                  <Ban className="h-5 w-5" />
                  <span className="text-sm font-medium">Заблокировано</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {login && (
                <>
                  <Button
                    variant={isFavorite(id!) ? "default" : "ghost"}
                    size="icon"
                    onClick={handleFavoriteClick}
                    disabled={isPending}
                    className="h-10 w-10"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Star className={cn("h-5 w-5", isFavorite(id!) && "fill-current")} />
                    )}
                  </Button>
                  {isAdmin && (
                    <Button
                      variant={vacancyIsBlocked ? "destructive" : "outline"}
                      size="icon"
                      onClick={handleToggleBlock}
                      disabled={blockLoading}
                      className="h-10 w-10"
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
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-base mb-2">
            <a href={employer.alternate_url} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {employer.name}
            </a>
            {address?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {address.city}
                {address.metro && `, м. ${address.metro.station_name}`}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-2">
            <span className="text-lg font-semibold text-primary">{formatSalary(salary)}</span>
            {experience?.name && (
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{experience.name}</span>
            )}
            {schedule?.name && (
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{schedule.name}</span>
            )}
            {employment?.name && (
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{employment.name}</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">Опубликовано: {formatDate(published_at)}</div>
        </div>
      </div>

      {/* Описание */}
      <div className="prose max-w-none mb-8 vacancy-description" dangerouslySetInnerHTML={{ __html: description }} />
      <style>{`
        .vacancy-description ul,
        .vacancy-description ol {
          margin-left: 1.5em;
          margin-bottom: 1.2em;
          list-style-position: outside;
        }
        .vacancy-description ul {
          list-style-type: disc;
        }
        .vacancy-description ol {
          list-style-type: decimal;
        }
        .vacancy-description li {
          margin-bottom: 0.5em;
          font-weight: 500;
          color: #222;
        }
        .vacancy-description li p {
          display: inline;
          margin: 0;
        }
        .vacancy-description ul > li::marker,
        .vacancy-description ol > li::marker {
          color: #6366f1;
          font-weight: bold;
        }
        .vacancy-description br {
          margin: 0;
          line-height: 1.1;
          display: block;
        }
        .vacancy-description p {
          margin-bottom: 0.75em;
        }
      `}</style>

      {/* Навыки */}
      {Array.isArray(key_skills) && key_skills.length > 0 && (
        <div className="mb-8">
          <div className="font-medium mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" />Ключевые навыки:</div>
          <ul className="flex flex-wrap gap-2">
            {key_skills.filter(skill => typeof skill.name === 'string').map(skill => (
              <li key={skill.name as string} className="bg-secondary/40 rounded px-2 py-1 text-sm">{skill.name as string}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Адрес */}
      {address?.raw && (
        <div className="mb-8 flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{address.raw}</span>
        </div>
      )}

      {/* Контакты */}
      {contacts && (typeof contacts.email === 'string' || typeof contacts.name === 'string' || typeof contacts.phone === 'string') && (
        <div className="mb-8">
          <div className="font-medium mb-2 flex items-center gap-2"><Mail className="w-4 h-4" />Контакты:</div>
          <div className="flex flex-col gap-1 text-sm">
            {typeof contacts.name === 'string' && <span className="flex items-center gap-1"><User className="w-4 h-4" />{contacts.name}</span>}
            {typeof contacts.email === 'string' && <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{contacts.email}</span>}
            {typeof contacts.phone === 'string' && <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{contacts.phone}</span>}
          </div>
        </div>
      )}

      
    </div>
  );
};

export default VacancyPage; 