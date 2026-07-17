"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Y offset in pixels */
  y?: number;
  /** Only trigger once */
  once?: boolean;
  /** Viewport amount threshold */
  amount?: number;
  /** Custom variants override */
  variants?: Variants;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
}

export function FadeInView({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  y = 24,
  once = true,
  amount = 0.3,
  variants,
  as = "div",
}: FadeInViewProps) {
  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const Component = motion.create(as);

  return (
    <Component
      className={className}
      variants={variants || defaultVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </Component>
  );
}

/** Fade in from left */
export function FadeInLeft({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Fade in from right */
export function FadeInRight({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Scale in from center */
export function ScaleIn({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
