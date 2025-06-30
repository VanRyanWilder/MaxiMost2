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
        const targetId = entry.target.id || entry.target.className.split(" ")[0] || "UnknownElement";
        console.log(`[IO Hook] Intersection event for ${targetId}. Is Intersecting: ${entry.isIntersecting}. Entry:`, entry);
        if (entry.isIntersecting) {
          console.log(`[IO Hook] ${targetId} IS intersecting. Setting state to true.`);
          setIsIntersecting(true);
          if (triggerOnce) {
            console.log(`[IO Hook] ${targetId} triggerOnce is true. Unobserving.`);
            observer.unobserve(element);
          }
        } else {
          // Only set to false if not triggerOnce, otherwise it stays true once triggered
          if (!triggerOnce) {
            setIsIntersecting(false);
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce]);

  return isIntersecting;
}

export default useIntersectionObserver;
