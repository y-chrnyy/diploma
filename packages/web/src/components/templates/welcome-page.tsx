import React from "react";
import { SearchForm } from "@/components/templates/search-form.tsx";
import { Button } from "@/components/ui/button.tsx";

export interface WelcomePageProps {
  onSearch: (query: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="max-w-3xl w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Найдите работу мечты</h1>
          <p className="text-lg text-muted-foreground">
            Тысячи вакансий в различных сферах ждут именно вас. 
            Начните поиск прямо сейчас!
          </p>
        </div>
        
        <div className="w-full max-w-xl">
          <SearchForm 
            onSearch={onSearch}
            placeholder="Введите профессию, должность или компанию"
            buttonText="Найти вакансии"
          />
          
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
          <div className="bg-secondary/20 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">1000+</div>
            <div className="text-muted-foreground">Компаний</div>
          </div>
          <div className="bg-secondary/20 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">10,000+</div>
            <div className="text-muted-foreground">Вакансий</div>
          </div>
          <div className="bg-secondary/20 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">5,000+</div>
            <div className="text-muted-foreground">Успешных трудоустройств</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Button variant="outline" size="sm" onClick={() => onSearch("IT и разработка")}>IT и разработка</Button>
          <Button variant="outline" size="sm" onClick={() => onSearch("Маркетинг")}>Маркетинг</Button>
          <Button variant="outline" size="sm" onClick={() => onSearch("Продажи")}>Продажи</Button>
          <Button variant="outline" size="sm" onClick={() => onSearch("Финансы")}>Финансы</Button>
          <Button variant="outline" size="sm" onClick={() => onSearch("Администрирование")}>Администрирование</Button>
          <Button variant="outline" size="sm" onClick={() => onSearch("HR")}>HR</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 