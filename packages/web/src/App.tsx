import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login.tsx";
import RegisterPage from "@/pages/register.tsx";
import ProfilePage from "@/pages/profile.tsx";
import HomePage from "@/pages/home.tsx";
import Layout from "@/components/templates/layout.tsx";
import { Private } from "@/components/templates/private.tsx";
import NotFoundPage from "@/pages/not-found.tsx";
import ForbiddenPage from "@/pages/forbidden.tsx";
import { useJwtLogin } from "@/pages/hooks/useJwtLogin.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import VacancyPage from "@/components/templates/vacancy-page.tsx";
import { ViewedProvider } from "@/lib/contexts/ViewedContext.tsx";
import { BlockedVacanciesProvider } from "@/lib/contexts/BlockedVacanciesContext.tsx";
import { AdminPage } from "@/pages/admin/index.tsx";
import { UserDetailsPage } from "@/pages/admin/user-details.tsx";
import { BlockedVacanciesPage } from "@/pages/admin/blocked-vacancies.tsx";
import { ProtectedAdminRoute } from "@/components/templates/protected-admin-route.tsx";

function App() {
  const {isPending, isInitialized} = useJwtLogin()

  if (isPending || !isInitialized) {
    return <div className="flex justify-center items-center h-screen">
      <LoadingSpinner className="size-14 animate-loader" />
    </div>
  }
  
  return (
    <ViewedProvider>
      <BlockedVacanciesProvider>
        <Routes>
          {/* Маршруты без Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Маршруты с Layout */}
          <Route element={<Layout />}>
            {/* Публичные маршруты */}
          <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/vacancy/:id" element={<VacancyPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            
            {/* Приватные маршруты */}
            <Route path="/profile" element={<Private><ProfilePage /></Private>} />
            
            {/* Админ маршруты */}
            <Route path="/admin" element={
              <Private>
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              </Private>
            } />
            <Route path="/admin/users/:userId" element={
              <Private>
                <ProtectedAdminRoute>
                  <UserDetailsPage />
                </ProtectedAdminRoute>
              </Private>
            } />
            <Route path="/admin/blocked-vacancies" element={
              <Private>
                <ProtectedAdminRoute>
                  <BlockedVacanciesPage />
                </ProtectedAdminRoute>
              </Private>
            } />
          </Route>
        </Routes>
      </BlockedVacanciesProvider>
    </ViewedProvider>
  );
}

export default App;
