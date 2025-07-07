import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  }: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (triggerOnce) {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            // Important: unobserve the element *after* setting state,
            // to ensure the state update based on this intersection is processed.
            observer.unobserve(element);
          }
          // If triggerOnce is true, isIntersecting is set once and then never changed by this observer.
        } else {
          // If not triggerOnce, continuously update based on intersection state.
          // This ensures that if it scrolls out of view, isIntersecting becomes false.
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { threshold, root, rootMargin }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce]);

  return isIntersecting;
}

export { useIntersectionObserver };
