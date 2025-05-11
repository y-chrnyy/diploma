import { SignupForm } from "@/components/templates/signup-form.tsx";
import { useSignup } from "./hooks/useSignup.ts";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { Navigate, useLocation } from "react-router-dom";

export default function RegisterPage() {
  const { signup, isFetching } = useSignup();
  const { userId } = useUser();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (userId) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignupForm onSubmit={signup} isDisabled={isFetching} />
    </div>
  );
} 