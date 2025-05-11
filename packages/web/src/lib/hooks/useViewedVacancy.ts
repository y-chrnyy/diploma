import { useState } from 'react';
import { useViewed } from '@/lib/contexts/ViewedContext.tsx';

export const useViewedVacancy = () => {
  const [isPending, setIsPending] = useState(false);
  const { addToViewed, isViewed } = useViewed();

  const markAsViewed = async (vacancyId: string) => {
    try {
      setIsPending(true);
      await addToViewed(vacancyId);
    } catch (error) {
      console.error('Failed to mark vacancy as viewed:', error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    markAsViewed,
    isPending,
    isViewed
  };
}; 