import React, { useEffect, useState, useMemo } from 'react';
import { useBlockedVacancies } from '@/lib/contexts/BlockedVacanciesContext.tsx';
import { api } from '@/lib/api/ServerApi.ts';
import { VacancyCard } from '@/components/ui/vacancy-card/index.tsx';
import { Loader2, ArrowLeft, Search } from 'lucide-react';
import type { HhVacancyFull } from '@/lib/api/types.ts';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';

export const BlockedVacanciesPage: React.FC = () => {
  const { blockedVacancies, refreshBlockedVacancies } = useBlockedVacancies();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Создаем отдельный запрос для каждой вакансии
  const vacancyQueries = useQueries({
    queries: blockedVacancies.map(id => ({
      queryKey: ['admin', 'vacancy', id],
      queryFn: () => api.getVacancyDetails(id),
      retry: false,
    })),
  });

  // Обновляем список заблокированных вакансий при монтировании
  useEffect(() => {
    refreshBlockedVacancies();
  }, []);

  // Проверяем состояние загрузки
  const isLoading = vacancyQueries.some(query => query.isLoading);
  
  // Собираем все успешно загруженные вакансии
  const allVacancies = useMemo(() => {
    return vacancyQueries
      .filter(query => { return query.isSuccess && query.data})
      .map(query => query.data as HhVacancyFull);
  }, [vacancyQueries]);

  // Фильтруем вакансии по поисковому запросу
  const filteredVacancies = useMemo(() => {
    if (!searchQuery) return allVacancies;
    const query = searchQuery.toLowerCase();
    return allVacancies.filter(vacancy => 
      vacancy.name.toLowerCase().includes(query) || 
      vacancy.employer.name.toLowerCase().includes(query)
    );
  }, [allVacancies, searchQuery]);

  // Проверяем наличие ошибок
  const hasErrors = vacancyQueries.some(query => query.isError);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-red-500">Ошибка</h2>
        <p className="text-gray-600">Не удалось загрузить некоторые заблокированные вакансии</p>
      </div>
    );
  }

  if (!allVacancies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Нет заблокированных вакансий</h2>
        <p className="text-gray-600">На данный момент нет заблокированных вакансий</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Заблокированные вакансии</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          type="text"
          placeholder="Поиск по названию вакансии или компании..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {filteredVacancies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          По вашему запросу ничего не найдено
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVacancies.map(vacancy => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedVacanciesPage; 