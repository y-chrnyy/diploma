import { api } from "@/lib/api/ServerApi.ts";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { ApiLoginResponse } from "@/lib/api/types.ts";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

export const useJwtLogin = () => {
    const {setUserData} = useUser()
    const [isInitialized, setInitialized] = useState(false)

    const onSuccess = ({login: userLogin, id, role}: ApiLoginResponse) => {
        setUserData(userLogin, id.toString(), role)
        setInitialized(true)
    }

    const onError = async (error: AxiosError<ApiLoginResponse>) => {
        if(error.status !== 401) return

        try {
            const r = await api.updateTokens()
            setUserData(r.login, r.id.toString(), r.role)
        } catch (error) {
            console.error(`Не удалось обновить токены: ${error}`)
        } 
    }
    
    const {mutateAsync: login, isPending} = useMutation({
        mutationFn: async () => {
           return await api.loginWithJWT()
        },
        onSuccess,
        onError,
        onSettled: () => setInitialized(true),
        retry: false
    })

    useEffect(() => {
        login()

        const refreshInterval = setInterval(() => {
            login()
        }, 5 * 60 * 1000)

        return () => clearInterval(refreshInterval)
    }, [])

    return {login, isPending, isInitialized}
}   