import { useUser } from "@/lib/contexts/UserContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "@/lib/api/ServerApi.ts";
import { toast } from "sonner";
import { useLogout } from "./hooks/useLogout.ts";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { login, userId, clearUserData } = useUser();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    const promise = logoutMutation.mutateAsync();
    
    toast.promise(promise, {
      loading: "Выход из аккаунта...",
      error: "Ошибка при выходе из аккаунта"
    });

    await promise;
    clearUserData();
  };

  const handleDeleteAccount = async () => {
    if (globalThis.confirm("Вы уверены, что хотите удалить аккаунт? Это действие невозможно отменить.")) {
      try {
        setIsDeleting(true);
        await api.deleteUser();
        clearUserData();
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
        toast.error("Ошибка при удалении аккаунта. Попробуйте позже.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const onSubmit = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Новые пароли не совпадают");
      return;
    }

    setIsFormSubmitting(true);
    try {
      await api.changePassword(data.currentPassword, data.newPassword);
      toast.success("Пароль успешно изменен");
      form.reset();
    } catch {
      toast.error("Ошибка при смене пароля");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Профиль пользователя</h1>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Выход..." : "Выйти"}
          </Button>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-lg font-medium">Пользователь: {login}</p>
            <p className="text-sm text-muted-foreground">ID: {userId}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Сменить пароль</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текущий пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={isFormSubmitting}
              >
                {isFormSubmitting ? "Сохранение..." : "Сохранить новый пароль"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-destructive">Опасная зона</h2>
          <div className="border border-destructive/30 rounded-md p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-muted-foreground mb-2">
                Удаление аккаунта приведет к безвозвратной потере всех ваших данных.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full"
              >
                {isDeleting ? "Удаление..." : "Удалить аккаунт"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 