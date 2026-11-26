'use client';

import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

export function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        data-motion-section
        className={className}
        initial={false}
        whileInView={reduceMotion ? undefined : { y: [10, 0] }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
