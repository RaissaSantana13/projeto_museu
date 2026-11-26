'use client';

import {
  Carousel,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from 'react';

const reduceMotionQuery = '(prefers-reduced-motion: reduce)';
const getServerSnap = () => -1;

const DepthContext = createContext<{
  active: number | null;
  scrollable: boolean;
  reduceMotion: boolean;
  setHovered: (index: number | null) => void;
} | null>(null);

export function DepthDeck({
  opts,
  ...props
}: Omit<ComponentProps<typeof Carousel>, 'setApi'>) {
  const [api, setApi] = useState<CarouselApi>();
  const [hovered, setHovered] = useState<number | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return () => {};
      api.on('select', notify).on('reInit', notify);
      return () => {
        api.off('select', notify).off('reInit', notify);
      };
    },
    [api],
  );
  const getSnap = useCallback(
    () =>
      api && (api.canScrollPrev() || api.canScrollNext())
        ? api.selectedScrollSnap()
        : -1,
    [api],
  );
  const snap = useSyncExternalStore(subscribe, getSnap, getServerSnap);
  const scrollable = snap >= 0;

  return (
    <DepthContext.Provider
      value={{
        active: scrollable ? snap : hovered,
        scrollable,
        reduceMotion,
        setHovered,
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <Carousel
          {...props}
          opts={{
            ...opts,
            breakpoints: {
              ...opts?.breakpoints,
              [reduceMotionQuery]: {
                ...opts?.breakpoints?.[reduceMotionQuery],
                duration: 0,
              },
            },
          }}
          setApi={setApi}
        />
      </LazyMotion>
    </DepthContext.Provider>
  );
}

export function DepthDeckItem({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index: number;
}) {
  const deck = useContext(DepthContext);
  const canAnimate = deck && !deck.reduceMotion;
  const active = canAnimate ? deck.active : null;
  const recessed = active !== null && active !== index;
  const lifted = active === index && !deck?.scrollable;

  return (
    <CarouselItem className={className}>
      <m.div
        data-depth-card={active === index ? 'front' : recessed ? 'back' : 'rest'}
        className="h-full"
        initial={false}
        animate={{
          scale: recessed ? 0.95 : 1,
          y: recessed ? 6 : lifted ? -4 : 0,
          rotateY: recessed ? (index < active ? 4 : -4) : 0,
          transformPerspective: 900,
        }}
        transition={
          canAnimate
            ? { type: 'spring', stiffness: 380, damping: 34 }
            : { duration: 0 }
        }
        onHoverStart={() => {
          if (canAnimate && !deck.scrollable) deck.setHovered(index);
        }}
        onHoverEnd={() => {
          if (canAnimate) deck.setHovered(null);
        }}
      >
        {children}
      </m.div>
    </CarouselItem>
  );
}
