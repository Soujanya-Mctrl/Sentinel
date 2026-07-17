"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface StaggerTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  /** Delay before the whole animation starts */
  delay?: number;
  /** Duration per character */
  duration?: number;
  /** Stagger delay between characters */
  stagger?: number;
}

export function StaggerText({
  text,
  className = "",
  charClassName = "",
  delay = 0,
  duration = 0.4,
  stagger = 0.04,
}: StaggerTextProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  } as const;

  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex" style={{ whiteSpace: "pre" }}>
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              variants={child}
              className={`inline-block ${charClassName}`}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && (
            <motion.span variants={child} className="inline-block">
              &nbsp;
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  );
}

/** Stagger children wrapper — animates direct children with stagger */
interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function StaggerChildren({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  once = true,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerChildVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
} as const;
