import React, { useState } from "react";
import VacancyCard from "./index.tsx";
import { HhVacancy } from "@/lib/api/types.ts";

const exampleVacancy: HhVacancy = {
  id: "12345",
  name: "Web-разработчик",
  premium: false,
  employer: {
    id: "123",
    name: "ООО НПП МетаСофт Про",
    url: "https://example.com",
    alternate_url: "https://example.com",
    trusted: true,
    logo_urls: {
      original: "https://placekitten.com/100/100"
    }
  },
  salary: {
    from: 80000,
    to: 150000,
    currency: "RUB",
    gross: false
  },
  address: {
    city: "Москва",
    street: "ул. Примерная",
    building: "1",
    metro: {
      station_name: "Нагорная",
      line_name: "Серпуховско-Тимирязевская"
    }
  },
  published_at: "2023-06-15T12:00:00+0300",
  created_at: "2023-06-15T12:00:00+0300",
  archived: false,
  apply_alternate_url: "https://example.com/apply",
  url: "https://example.com",
  alternate_url: "https://example.com",
  snippet: {
    requirement: "Уверенные знания TypeScript и JavaScript. Опыт работы с фреймворками React и <b>Svelte</b>.",
    responsibility: "Разработка и поддержка веб-приложений на основе технологий Node.js и React/<b>Svelte</b>. Создание интерактивных пользовательских интерфейсов с использованием WebGL."
  }
};

export const VacancyCardExample: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleToggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Пример карточки вакансии</h1>
      <VacancyCard 
        vacancy={exampleVacancy} 
        onClick={() => alert("Подробнее о вакансии")}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default VacancyCardExample; 