import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/ServerApi.ts';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Loader2, Search, Ban } from 'lucide-react';

interface AdminUser {
  id: number;
  login: string;
  role: string;
}

export const AdminPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', searchQuery],
    queryFn: () => api.getAllUsers(searchQuery),
  });

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-red-500">Ошибка</h2>
        <p className="text-gray-600">Не удалось загрузить список пользователей</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <Link to="/admin/blocked-vacancies">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Ban className="size-4" />
            Заблокированные вакансии
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {data?.users.map((user: AdminUser) => (
          <Link
            key={user.id}
            to={`/admin/users/${user.id}`}
            className="block p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{user.login}</h3>
                <p className="text-sm text-gray-500">ID: {user.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 