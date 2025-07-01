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
        console.log(`[IO Hook] Intersection event for ${targetId}. Is Intersecting: ${entry.isIntersecting}`);

        setIsIntersecting(entry.isIntersecting); // Continuously update state

        // Temporarily ignore triggerOnce to allow continuous state changes for debugging
        // if (entry.isIntersecting) {
        //   setIsIntersecting(true);
        //   if (triggerOnce) {
        //     observer.unobserve(element);
        //   }
        // } else {
        //   // Always set to false if not intersecting, for this debug phase
        //   setIsIntersecting(false);
        // }
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
  }, [elementRef, threshold, root, rootMargin]); // Temporarily remove triggerOnce from deps

  return isIntersecting;
}

export default useIntersectionObserver;
