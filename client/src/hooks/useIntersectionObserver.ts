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
    console.log('[IO] Hook useEffect run. Element:', element ? (element.id || element.tagName) : 'No element');
    if (!element) {
      return;
    }

    console.log('[IO] Creating observer for:', element.id || element.tagName);
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('[IO] Intersection changed for:', element.id || element.tagName, 'isIntersecting:', entry.isIntersecting, entry);
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            console.log('[IO] TriggerOnce: Unobserving element:', element.id || element.tagName);
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
