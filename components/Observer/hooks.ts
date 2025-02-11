import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  callback: () => unknown | Promise<unknown>,
) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const element = loaderRef.current;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && !isUpdatingRef.current) {
        isUpdatingRef.current = true;
        try {
          await callback();
        } finally {
          isUpdatingRef.current = false;
        }
      }
    });
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [callback]);
  return loaderRef;
};
