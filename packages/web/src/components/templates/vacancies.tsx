import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useVacancies } from "@/pages/hooks/useVacancies.ts";
import VacancyCard from "@/components/ui/vacancy-card/index.tsx";
import { Loader2 } from "lucide-react";
import FiltersForm, { FiltersSchema } from "./filters-form.tsx";
import type { HhVacancySearchParams, HhVacancy } from "@/lib/api/types.ts";

const MOSCOW_REGION_ID = "2019";

export const Vacancies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const initialParams = useMemo<HhVacancySearchParams>(() => {
    if (!searchQuery) return {};

    return {
      text: searchQuery,
      per_page: 20,
      area: searchParams.get("area") || MOSCOW_REGION_ID,
      salary: searchParams.get("salary") ? parseInt(searchParams.get("salary") || "") : undefined,
      experience: searchParams.get("experience") || undefined,
      employment: searchParams.get("employment")?.split(","),
      schedule: searchParams.get("schedule")?.split(","),
      only_with_salary: searchParams.get("only_with_salary") === "true",
    };
  }, [searchParams, searchQuery]);
  
  const { 
    isLoading, 
    isError, 
    data,
    error,
    attachObserver,
  } = useVacancies(initialParams);

  const vacancies = useMemo<HhVacancy[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.items);
  }, [data?.pages]);

  const totalFound = data?.pages[0]?.found ?? 0;
  
  const handleFiltersSubmit = (data: FiltersSchema) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (data.salary) {
      newParams.set("salary", data.salary);
    } else {
      newParams.delete("salary");
    }
    
    if (data.experience) {
      newParams.set("experience", data.experience);
    } else {
      newParams.delete("experience");
    }
    
    if (data.employment?.length) {
      newParams.set("employment", data.employment.join(","));
    } else {
      newParams.delete("employment");
    }
    
    if (data.schedule?.length) {
      newParams.set("schedule", data.schedule.join(","));
    } else {
      newParams.delete("schedule");
    }
    
    if (data.only_with_salary) {
      newParams.set("only_with_salary", "true");
    } else {
      newParams.delete("only_with_salary");
    }

    if (data.area) {
      newParams.set("area", data.area);
    } else {
      newParams.delete("area");
    }
    
    setSearchParams(newParams);
  };
  
  const handleLastVacancyRef = (node: HTMLDivElement | null, index: number) => {
    if (index !== vacancies.length - 1) return;
    attachObserver(node);
  };

  if (!searchQuery) {
    return null;
  }

  const currentFilters: FiltersSchema = {
    salary: searchParams.get("salary") || "",
    experience: searchParams.get("experience") || undefined,
    employment: searchParams.get("employment")?.split(",") || [],
    schedule: searchParams.get("schedule")?.split(",") || [],
    only_with_salary: searchParams.get("only_with_salary") === "true",
    area: searchParams.get("area") || undefined,
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {isLoading && !vacancies.length ? (
            "Ищем вакансии..."
          ) : (
            `Найдено ${totalFound} вакансий по запросу «${searchQuery}»`
          )}
        </h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-80">
          <FiltersForm onSubmit={handleFiltersSubmit} defaultValues={currentFilters} />
        </aside>
        
        <main className="flex-1">
          {isError && error && (
            <div className="p-4 mb-6 bg-destructive/10 text-destructive rounded-md">
              <p>Произошла ошибка при загрузке вакансий.</p>
              <p>Сообщение: {error.message}</p>
            </div>
          )}
          
          {isLoading && !vacancies.length ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {vacancies.map((vacancy, index) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    ref={(node) => handleLastVacancyRef(node, index)}
                  />
                ))}
              </div>
              
              {!vacancies.length && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Нет вакансий, соответствующих вашему запросу.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Vacancies; 