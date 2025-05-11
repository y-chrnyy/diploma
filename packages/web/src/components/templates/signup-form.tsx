import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SubmitHandler } from "react-hook-form";

const passwordScheme = z.string().min(6, {
  message: "Пароль не может быть меньше 6 символов",
}).max(50, {
  message: "Пароль не может быть больше 50 символов",
});

const signupScheme = z.object({
  login: z.string().min(3, {
    message: "Логин не может быть меньше 2 символов",
  }).max(25, {
    message: "Логин не может быть больше 25 символов",
  }),
  password: passwordScheme,
  repeatPassword: passwordScheme,
});

export type SignupScheme = z.infer<typeof signupScheme>;

export interface SignupProps {
  onSubmit: SubmitHandler<SignupScheme>;
  isDisabled?: boolean;
}

export const SignupForm = ({ onSubmit, isDisabled = false }: SignupProps) => {
  const form = useForm<SignupScheme>({
    resolver: zodResolver(signupScheme),
    defaultValues: {
      login: "",
      password: "",
      repeatPassword: "",
    },
  });
  const location = useLocation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 max-w-md"
      >
        <h2 className="text-xl self-center">Регистрация</h2>
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

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input {...field} type="password" disabled={isDisabled} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Link to="/login" state={location.state}>
            <Button variant="link" type="button" disabled={isDisabled}>
              Уже есть аккаунт? Войдите!
            </Button>
          </Link>
          <Button type="submit" disabled={isDisabled}>
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </Form>
  );
};
