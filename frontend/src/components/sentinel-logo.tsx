"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SentinelLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
  /** Opacity for watermark usage */
  opacity?: number;
  /** Render only the S-shard vector icon instead of the full image lockup */
  iconOnly?: boolean;
}

/** The high-fidelity interlocking S-shards logo mark matching the user's design */
export function SentinelLogo({
  className = "",
  size = 48,
  animate = false,
  opacity = 1,
  iconOnly = false,
}: SentinelLogoProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
      }
    : {};

  return (
    <Wrapper
      className={cn("inline-flex items-center justify-center", className)}
      style={{ opacity }}
      {...wrapperProps}
    >
      {iconOnly ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size, height: size }}
        >
          <defs>
            <linearGradient id="sentinel-purple-grad" x1="150" y1="42" x2="350" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A5A8F3" />
              <stop offset="50%" stopColor="#8B8FE8" />
              <stop offset="100%" stopColor="#6C6FE0" />
            </linearGradient>
            <linearGradient id="sentinel-white-grad" x1="150" y1="180" x2="350" y2="318" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E2E9" />
            </linearGradient>
            <filter id="sentinel-glow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g filter="url(#sentinel-glow)">
            <path
              d="M 150,156 L 150,100 L 250,42 L 350,100 L 350,180 L 290,145 L 210,191 Z M 175,156 L 210,176 L 290,130 L 325,150 L 325,115 L 250,72 L 175,115 Z"
              fill="url(#sentinel-purple-grad)"
              fillRule="evenodd"
            />
            <path
              d="M 350,204 L 350,260 L 250,318 L 150,260 L 150,180 L 210,215 L 290,169 Z M 325,204 L 290,184 L 210,230 L 175,210 L 175,245 L 250,288 L 325,245 Z"
              fill="url(#sentinel-white-grad)"
              fillRule="evenodd"
            />
          </g>
        </svg>
      ) : (
        <img
          src="/logo/logo.png"
          alt="Sentinel Logo"
          width={size}
          height={size}
          className="object-contain"
          style={{ width: size, height: size }}
        />
      )}
    </Wrapper>
  );
}

/** Spinning loader variant using the S-shard motif */
export function SentinelSpinner({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <motion.div
      className={cn("inline-flex", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <SentinelLogo size={size} iconOnly />
    </motion.div>
  );
}

/** Text wordmark including the slogan as styled in the uploaded logo */
export function SentinelWordmark({
  className = "",
  stagger = false,
  showSlogan = true,
}: {
  className?: string;
  stagger?: boolean;
  showSlogan?: boolean;
}) {
  const letters = "SENTINEL".split("");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {stagger ? (
        <motion.span
          className="inline-flex text-[#F5F5F7] font-semibold tracking-[0.3em] text-2xl md:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.5,
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
                },
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      ) : (
        <span
          className="text-[#F5F5F7] font-semibold tracking-[0.3em] text-2xl md:text-3xl inline-flex"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {letters.map((letter, i) => (
            <span key={i} className="inline-block">
              {letter}
            </span>
          ))}
        </span>
      )}

      {showSlogan && (
        <div className="flex items-center gap-4 mt-4 w-full max-w-md px-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8B8FE8]/40" />
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-[#71717A] font-medium uppercase whitespace-nowrap">
            Privacy & Compliance for On-Chain Treasuries
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8B8FE8]/40" />
        </div>
      )}
    </div>
  );
}
