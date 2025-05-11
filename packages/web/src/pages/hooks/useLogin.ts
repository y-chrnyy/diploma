import { useMutation } from '@tanstack/react-query'
import { LoginScheme } from "@/components/templates/login-form.tsx";
import { useState } from "react";
import { api } from "@/lib/api/ServerApi.ts";
import { toast } from "sonner";
import { ApiLoginResponse } from '@/lib/api/types.ts';
import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { AxiosError } from "npm:axios@^1.9.0";



export const useLogin = () => {
    const [isFetching, setFetching] = useState(false)
    const navigate = useNavigate()
    const { setUserData } = useUser()

    const onSuccess = ({login, id, role}: ApiLoginResponse) => {
        setUserData(login, id.toString(), role)
        navigate('/')
    }

    const { mutateAsync } = useMutation({
        mutationKey: ['login'],
        mutationFn: async ({ login, password }: LoginScheme) => {
            setFetching(true)
            return await api.login({ login, password })
        },
        onSettled: () => setFetching(false),
        onError: (error) => {
            const message = (error as AxiosError<ApiLoginResponse>).response?.data.message

            
            if(message === 'Invalid password') {
                toast.error('Неверный пароль')
                return
            }

            if(message?.startsWith('Cannot find user with login:')) {
                toast.error('Такого пользователя не существует!')
                return
            }

            toast.error('Не получилось войти :(')
        },
        onSuccess
    })

    const login = (auth: LoginScheme) => {
        toast.promise(mutateAsync(auth), {
            loading: 'Вход в систему...',
        })
    }

    return {
        login,
        isFetching
    }
} 