import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  variant?: "up" | "fade" | "scale";
};

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  variant = "up",
}: RevealProps) {
  const [ref, isInView] = useInView<HTMLElement>({ once: true });

  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${isInView ? "reveal-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
