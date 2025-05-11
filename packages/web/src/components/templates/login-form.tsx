import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

const passwordScheme = z.string().min(6, {
  message: "Пароль не может быть меньше 6 символов",
}).max(50, {
  message: "Пароль не может быть больше 50 символов",
});

const loginScheme = z.object({
  login: z.string().min(3, {
    message: "Логин не может быть меньше 2 символов",
  }).max(25, {
    message: "Логин не может быть больше 25 символов",
  }),
  password: passwordScheme,
}) satisfies z.ZodType<{ login: string; password: string }>;

export type LoginScheme = z.infer<typeof loginScheme>;

export interface SignupProps {
  onSubmit: SubmitHandler<LoginScheme>;
  isDisabled?: boolean;
}

export const Login = ({ onSubmit, isDisabled = false }: SignupProps) => {
  const form = useForm<LoginScheme>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  const location = useLocation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 max-w-md"
      >
        <h2 className="text-xl self-center">Вход в аккаунт</h2>
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <Input {...field} disabled={isDisabled} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input {...field} type="password" disabled={isDisabled} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Link to="/register" state={location.state}>
            <Button variant="link" type="button" disabled={isDisabled}>
              Нету аккаунта? Создайте!
            </Button>
          </Link>
          <Button type="submit" disabled={isDisabled}>
            Войти
          </Button>
        </div>
      </form>
    </Form>
  );
};
