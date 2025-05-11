import { useUser } from "../contexts/UserContext.tsx";
import { UserRole } from "../api/types.ts";

export const useIsAdmin = () => {
    const { role } = useUser();
    return role === UserRole.ADMIN;
}; 