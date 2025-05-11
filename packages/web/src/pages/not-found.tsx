import { Button } from "@/components/ui/button.tsx"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-8xl font-bold text-gray-700">404</h1>
      <h2 className="text-2xl font-medium mt-2 mb-6">Страница не найдена</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Запрашиваемая страница не существует или была перемещена.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
        <Button variant="outline" onClick={() => navigate("/")}>На главную</Button>
      </div>
    </div>
  )
} 