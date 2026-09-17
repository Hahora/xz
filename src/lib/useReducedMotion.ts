import { useEffect, useState } from 'react';

function query(mq: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(mq).matches;
}

function useMediaQuery(mq: string): boolean {
  const [matches, setMatches] = useState(() => query(mq));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const list = window.matchMedia(mq);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [mq]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
