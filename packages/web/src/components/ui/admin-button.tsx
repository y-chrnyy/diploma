import { Button } from "./button.tsx";
import { useNavigate } from "react-router-dom";

export const AdminButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="ml-2"
        >
            Админ панель
        </Button>
    );
}; 