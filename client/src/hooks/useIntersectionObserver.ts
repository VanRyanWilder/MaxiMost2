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
        // Update state only when it changes
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Only set to false if not triggerOnce, to prevent premature hiding
          // and allow elements to stay visible if they scroll out and back in
          // without triggerOnce.
          // For triggerOnce, it should remain true once triggered.
          setIsIntersecting(false);
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
