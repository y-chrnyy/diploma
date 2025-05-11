import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SearchForm } from "@/components/templates/search-form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import userAvatar from "@/assets/images/user-avatar.svg";
import { useUser } from "@/lib/contexts/UserContext.tsx";
import { AdminButton } from "../ui/admin-button.tsx";
import { useIsAdmin } from "@/lib/hooks/useIsAdmin.ts";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const isAdmin = useIsAdmin();

  const handleSearch = async (query: string) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="font-bold text-xl py-2"
              onClick={() => navigate("/")}
            >
              JobSearch
            </Button>
          </div>
          
          <div className="w-full max-w-md hidden md:flex">
            <SearchForm 
              onSearch={handleSearch}
              placeholder="Введите профессию, должность или компанию"
              buttonText="Найти"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {login ? (
              <>
                {isAdmin && <AdminButton />}
                <Avatar 
                  className="cursor-pointer" 
                  onClick={handleProfileClick}
                >
                  <AvatarImage src={userAvatar} alt="Аватар пользователя" />
                  <AvatarFallback>ПР</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/login", { state: { from: location.pathname } })}
                >
                  Войти
                </Button>
                <Button 
                  onClick={() => navigate("/register", { state: { from: location.pathname } })}
                >
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="md:hidden container mx-auto px-4 pb-4">
          <SearchForm 
            onSearch={handleSearch}
            placeholder="Поиск вакансий..."
            buttonText="Найти"
          />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-background/95 border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} JobSearch. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 