import { HhVacancySalary } from "@/lib/api/types.ts";

export const formatSalary = (salary?: HhVacancySalary): string => {
  if (!salary) return "Зарплата не указана";
  
  const { from, to, currency = "RUB" } = salary;
  const currencyMap: Record<string, string> = {
    RUR: "₽",
    USD: "$",
    EUR: "€",
    BYN: "₽",
    KZT: "₸",
    UAH: "₴",
    AZN: "₼",
    GEL: "₾",
    KGS: "₽",
  };
  
  const currencySymbol = currencyMap[currency] || currency;
  
  if (from && to) {
    return `${from.toLocaleString()} - ${to.toLocaleString()} ${currencySymbol}`;
  } else if (from) {
    return `от ${from.toLocaleString()} ${currencySymbol}`;
  } else if (to) {
    return `до ${to.toLocaleString()} ${currencySymbol}`;
  }
  
  return "Зарплата не указана";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}; 