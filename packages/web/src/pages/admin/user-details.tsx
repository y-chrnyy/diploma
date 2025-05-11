import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/ServerApi.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { VacancyCard } from "@/components/ui/vacancy-card/index.tsx";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import type { HhVacancyFull, ApiUserDetailsResponse } from "@/lib/api/types.ts";
import { UserRole } from "@/lib/api/types.ts";
import { ArrowLeft } from "lucide-react";

interface ExtendedUserDetails {
  user: ApiUserDetailsResponse['user'];
  favorites: (HhVacancyFull | null)[];
  viewed: (HhVacancyFull | null)[];
}

export const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: userDetails, isLoading, refetch } = useQuery<ExtendedUserDetails>({
    queryKey: ['userDetails', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await api.getUserDetails(parseInt(userId));

      // Получаем детали вакансий, игнорируя ошибки
      const loadVacancy = async (id: string) => {
        try {
          return await api.getVacancy(id);
        } catch (error) {
          console.error(`Failed to load vacancy ${id}:`, error);
          return null;
        }
      };

      const [favorites, viewed] = await Promise.all([
        Promise.all(response.favorites.map(loadVacancy)),
        Promise.all(response.viewed.map(loadVacancy))
      ]);

      return {
        user: response.user,
        favorites,
        viewed
      };
    },
    enabled: !!userId
  });

  const handlePromoteToAdmin = async () => {
    if (!userId) return;
    try {
      await api.promoteToAdmin(parseInt(userId));
      await refetch();
      toast.success('Пользователь повышен до администратора');
    } catch {
      toast.error('Не удалось повысить пользователя до администратора');
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    try {
      await api.deleteUserAsAdmin(parseInt(userId));
      toast.success('Пользователь удален');
      navigate('/admin');
    } catch {
      toast.error('Не удалось удалить пользователя');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userDetails) return null;

  // Фильтруем null значения из списков
  const favorites = userDetails.favorites.filter((v): v is HhVacancyFull => v !== null);
  const viewed = userDetails.viewed.filter((v): v is HhVacancyFull => v !== null);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Пользователь: {userDetails.user.login}</h1>
            <div className="text-muted-foreground">Роль: {userDetails.user.role}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {userDetails.user.role === UserRole.REGULAR && (
              <Button 
                onClick={handlePromoteToAdmin}
                className="w-full sm:w-auto"
              >
                Повысить до администратора
              </Button>
            )}
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              className="w-full sm:w-auto"
            >
              Удалить пользователя
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList>
          <TabsTrigger value="favorites">
            Избранные вакансии ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="viewed">
            Просмотренные вакансии ({viewed.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid gap-4">
            {favorites.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
            {favorites.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Нет избранных вакансий
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="viewed" className="mt-6">
          <div className="grid gap-4">
            {viewed.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
            {viewed.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Нет просмотренных вакансий
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 