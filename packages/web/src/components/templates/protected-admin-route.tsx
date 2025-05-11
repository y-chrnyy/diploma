import { Navigate, useLocation } from "react-router-dom";
import { useIsAdmin } from "@/lib/hooks/useIsAdmin.ts";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const isAdmin = useIsAdmin();
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}; 