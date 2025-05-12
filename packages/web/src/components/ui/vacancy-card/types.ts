import { HhVacancy, HhVacancyFull } from "@/lib/api/types.ts";

export interface VacancyCardProps {
  vacancy: HhVacancy | HhVacancyFull;
}

export interface Employer {
  name: string;
  id: string;
}

export interface Salary {
  from?: number;
  to?: number;
  currency: string;
}

export interface Vacancy {
  id: string;
  name: string;
  employer: Employer;
  salary?: Salary;
} 