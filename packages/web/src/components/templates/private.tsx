import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { PropsWithChildren } from "react";
import ForbiddenPage from "@/pages/forbidden.tsx";

export interface PrivateRouteProps {
  redirectToForbidden?: boolean;
}

export const notNil = <T,>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const Private = ({ redirectToForbidden, children }: PropsWithChildren<PrivateRouteProps>) => {
  const { userId } = useUser();
  const location = useLocation();

  if (!notNil(userId)) {
    if (redirectToForbidden) {
      return <ForbiddenPage />;
    }
    
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
