import { ReactNode } from "react";
import { UserProvider } from "@/lib/contexts/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.tsx";
import { FavoritesProvider } from "./favorites.tsx";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <FavoritesProvider>
            {children}
            <Toaster closeButton richColors theme="light" />
          </FavoritesProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
} 