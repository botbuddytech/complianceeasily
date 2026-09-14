import { ReactNode, Children } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

export function Reveal({ children, delay = 0, className = '', y = 24 }: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  maxStagger?: number;
}

export function RevealGroup({
  children,
  className = '',
  stagger = 0.06,
  maxStagger = 6,
}: RevealGroupProps) {
  const prefersReduced = useReducedMotion();
  const items = Children.toArray(children);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          // `min-w-0` overrides the browser's "automatic minimum size" for
          // grid/flex items, which otherwise defaults to the min-content
          // width of descendants. Any `truncate`/`whitespace-nowrap` text
          // inside a card has an intrinsically huge min-content width, which
          // would otherwise force this grid cell (and the whole row/page)
          // wider instead of letting the text ellipsize.
          className="h-full min-w-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{
            duration: 0.45,
            delay: Math.min(index, maxStagger - 1) * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
