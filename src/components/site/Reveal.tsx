import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  style?: CSSProperties;
};

/**
 * Subtle fade + rise on scroll. Respects prefers-reduced-motion.
 * SSR-safe: content renders visible by default; hidden state only applied
 * after mount when the element is still below the fold.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 16,
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      setArmed(true);
      return;
    }

    // Only hide if the element is below the initial viewport — avoids flashing
    // content that's already on screen during hydration.
    const rect = node.getBoundingClientRect();
    const belowFold = rect.top > window.innerHeight * 0.9;
    setArmed(true);
    if (!belowFold) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [once]);

  const hidden = armed && !visible;
  const composed: CSSProperties = {
    ...style,
    transition:
      "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translate3d(0, ${y}px, 0)` : "translate3d(0, 0, 0)",
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref as never} className={className} style={composed}>
      {children}
    </Tag>
  );
}

/** Convenience wrapper that staggers the reveal delay of each direct child. */
export function RevealGroup({
  children,
  className = "",
  stagger = 80,
  initialDelay = 0,
  y = 16,
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  initialDelay?: number;
  y?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} className={className} delay={initialDelay + i * stagger} y={y}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
