import { useUser } from "../../lib/contexts/UserContext.tsx";
import { Button } from "../ui/button.tsx";
import { AdminButton } from "../ui/admin-button.tsx";

export const Header = () => {
    const { login, isAdmin, logout } = useUser();

    return (
        <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Job Search</h1>
            </div>
            
            <div className="flex items-center gap-2">
                {login && (
                    <>
                        <span className="text-sm text-gray-600">
                            {login}
                        </span>
                        {isAdmin && <AdminButton />}
                        <Button 
                            variant="ghost" 
                            onClick={logout}
                        >
                            Выйти
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}; 