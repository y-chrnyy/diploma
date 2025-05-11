import { useCallback, useRef } from "react";

export const useIntersectionObserver = (onIntersect: () => void) => {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const cb: IntersectionObserverCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onIntersect();
      });
    },
    [onIntersect]
  );

  const attachObserver = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        const observerOptions: IntersectionObserverInit = {
          root: null,
          threshold: 0.1,
          rootMargin: "100px",
        };

        const observer = new IntersectionObserver(cb, observerOptions);

        observer.observe(node);
        observerRef.current = observer;
      } else {
        observerRef.current?.disconnect();
      }
    },
    [cb]
  );

  return { intersectionRef, attachObserver };
}; 