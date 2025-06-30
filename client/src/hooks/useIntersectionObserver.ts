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
        console.log(`[IO Hook] Intersection event for ${targetId}. Is Intersecting: ${entry.isIntersecting}. Full Entry:`, entry);

        // Continuously update isIntersecting state for debugging
        setIsIntersecting(entry.isIntersecting);

        // Temporarily removed triggerOnce logic for continuous observation during debug
        // if (entry.isIntersecting) {
        //   console.log(`[IO Hook] ${targetId} IS intersecting. Setting state to true.`);
        //   setIsIntersecting(true);
        //   if (triggerOnce) {
        //     console.log(`[IO Hook] ${targetId} triggerOnce is true. Unobserving.`);
        //     observer.unobserve(element);
        //   }
        // } else {
        //   if (!triggerOnce) { // Only set to false if not triggerOnce
        //     console.log(`[IO Hook] ${targetId} is NOT intersecting. Setting state to false.`);
        //     setIsIntersecting(false);
        //   }
        // }
      },
      { threshold, root, rootMargin }
    );

    if (element) {
      observer.observe(element);
      console.log(`[IO Hook] Started observing ${element.id || element.className.split(" ")[0] || "UnknownElement"}`);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
        console.log(`[IO Hook] Cleaned up observer for ${element.id || element.className.split(" ")[0] || "UnknownElement"}`);
      }
    };
  }, [elementRef, threshold, root, rootMargin]); // Removed triggerOnce from deps for this debug version

  return isIntersecting;
}

export default useIntersectionObserver;
