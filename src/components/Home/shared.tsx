import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

export const SectionHead: React.FC<{ eyebrow: string; title: React.ReactNode; sub?: string; align?: 'center' | 'left'; inverse?: boolean }> = ({
  eyebrow,
  title,
  sub,
  align = 'center',
  inverse = false,
}) => (
  <motion.div
    {...fadeUp}
    className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} mb-12`}
  >
    <p className={`text-sm font-bold uppercase tracking-widest ${inverse ? 'text-white/80' : 'text-primary-600 dark:text-primary-400'}`}>{eyebrow}</p>
    <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${inverse ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{title}</h2>
    {sub && <p className={`mt-3 ${inverse ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>{sub}</p>}
  </motion.div>
);

// Counts 0 -> target with ease-out cubic once `started` is true.
// Respects reduced motion by jumping straight to target.
export function useCountUp(target: number, started: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return value;
}

export function useSectionInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = React.useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}
