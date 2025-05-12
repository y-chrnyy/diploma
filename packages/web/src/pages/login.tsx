import { Login } from "@/components/templates/login-form.tsx";
import { useLogin } from "./hooks/useLogin.ts";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { Navigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const { login, isFetching } = useLogin();
  const { userId } = useUser();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (userId) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Login onSubmit={login} isDisabled={isFetching} />
      </div>
    </div>
  );
} 