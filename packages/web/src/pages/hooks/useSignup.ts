import { useMutation } from '@tanstack/react-query'
import { SignupScheme } from "@/components/templates/signup-form.tsx";
import { useState } from "react";
import { api } from "@/lib/api/ServerApi.ts";
import { toast } from "sonner";
import { AxiosError } from 'axios';
import { ApiError, ApiSignupResponse } from '@/lib/api/types.ts';
import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/contexts/UserContext.tsx";

const getErrorMessage = (error: AxiosError<ApiError>) => {
    const msg = error.response?.data.message

    if (msg === 'Bad Request. Check if login and password have been provided') {
        return "Необходимо ввести логин и пароль"
    }

    if(msg === "Login is already taken") {
        return 'Логин уже занят'
    }
    return "Ошибка при регистрации"
}

export const useSignup = () => {
    const [isFetching, setFetching] = useState(false)
    const navigate = useNavigate()

    const { setUserData } = useUser()

    const onSuccess = ({login, id, role}: ApiSignupResponse) => {
        setUserData(login, id.toString(), role)
        navigate('/')
    }
    
    const { mutateAsync } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async ({ login, password, }: SignupScheme) => {
            setFetching(true)

            return await api.signUp({ login, password })
        },
        onSettled: () => setFetching(false),
        onSuccess
    })

    const signup = (auth: SignupScheme) => {
        if (auth.password !== auth.repeatPassword) {
            toast.error("Пароли не совпадают")
            return
        }

        const promise = mutateAsync(auth)
        
        toast.promise(promise, {
            loading: 'Регистрация...',
            error: (error) => getErrorMessage(error as AxiosError<ApiError>)
        })
    }

    return {
        signup,
        isFetching
    }
}