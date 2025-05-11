import { Button } from "@/components/ui/button.tsx"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "@/lib/contexts/UserContext.tsx"

export default function ForbiddenPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useUser()

  const handleBack = () => {
    // Если пользователь не авторизован или нет предыдущей страницы, 
    // перенаправляем на главную
    if (!userId || !location.state?.from) {
      navigate("/")
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-8xl font-bold text-gray-700">403</h1>
      <h2 className="text-2xl font-medium mt-2 mb-6">Доступ запрещен</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        У вас нет прав для доступа к запрашиваемой странице.
      </p>
      <div className="flex gap-4">
        <Button onClick={handleBack}>Вернуться назад</Button>
        <Button variant="outline" onClick={() => navigate("/")}>На главную</Button>
      </div>
    </div>
  )
} 