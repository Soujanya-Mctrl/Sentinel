"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface ScrambleTextProps {
  text: string;
  /** ms before each character resolves */
  speed?: number;
  /** whether to trigger the animation */
  trigger?: boolean;
  /** show scrambled state initially (for "reverse" decrypt effect) */
  scrambled?: boolean;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

export function ScrambleText({
  text,
  speed = 30,
  trigger = true,
  scrambled = false,
  className = "",
  as: Tag = "span",
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(scrambled ? scramble(text) : text);
  const frameRef = useRef<number | null>(null);
  const resolvedCount = useRef(0);

  const animate = useCallback(() => {
    if (!trigger) return;

    resolvedCount.current = 0;
    const chars = text.split("");
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const newResolved = Math.min(
        chars.length,
        Math.floor(elapsed / speed)
      );

      if (newResolved > resolvedCount.current) {
        resolvedCount.current = newResolved;
      }

      const result = chars
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolvedCount.current) return char;
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join("");

      setDisplay(result);

      if (resolvedCount.current < chars.length) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, trigger]);

  useEffect(() => {
    if (trigger) {
      const cleanup = animate();
      return cleanup;
    } else if (scrambled) {
      // Keep scrambled
      const interval = setInterval(() => {
        setDisplay(scramble(text));
      }, 80);
      return () => clearInterval(interval);
    }
  }, [trigger, animate, scrambled, text]);

  return (
    <motion.span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </motion.span>
  );
}

function scramble(text: string): string {
  return text
    .split("")
    .map((c) => (c === " " ? " " : CHARSET[Math.floor(Math.random() * CHARSET.length)]))
    .join("");
}

/** Hook version for more control */
export function useScrambleText(
  text: string,
  options: { speed?: number; trigger?: boolean; scrambled?: boolean } = {}
) {
  const { speed = 30, trigger = true, scrambled = false } = options;
  const [display, setDisplay] = useState(scrambled ? scramble(text) : text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      if (scrambled) {
        const interval = setInterval(() => {
          setDisplay(scramble(text));
        }, 80);
        return () => clearInterval(interval);
      }
      return;
    }

    let resolvedCount = 0;
    const chars = text.split("");
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const newResolved = Math.min(chars.length, Math.floor(elapsed / speed));
      if (newResolved > resolvedCount) resolvedCount = newResolved;

      const result = chars
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolvedCount) return char;
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join("");

      setDisplay(result);

      if (resolvedCount < chars.length) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, trigger, scrambled]);

  return display;
}
