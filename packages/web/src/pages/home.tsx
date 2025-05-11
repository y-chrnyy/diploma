import React from "react";
import { WelcomePage } from "@/components/templates/welcome-page.tsx";
import { Vacancies } from "@/components/templates/vacancies.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  
  const handleSearch = (query: string) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
  };
  
  return (
    <div>
      {!searchQuery && (
        <div className="container mx-auto px-4 py-8">
          <WelcomePage 
            onSearch={handleSearch}
          />
        </div>
      )}
      
      <Vacancies />
    </div>
  );
};

export default HomePage; 