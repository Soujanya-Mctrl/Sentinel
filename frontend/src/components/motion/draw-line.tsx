"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface DrawLineProps {
  className?: string;
  /** SVG path d attribute */
  path?: string;
  /** Stroke color */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** SVG viewBox width */
  width?: number;
  /** SVG viewBox height */
  height?: number;
}

export function DrawLine({
  className = "",
  path = "M 0 25 L 400 25",
  color = "#8B8FE8",
  strokeWidth = 2,
  width = 400,
  height = 50,
}: DrawLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Background track */}
        <path
          d={path}
          stroke="rgba(139, 143, 232, 0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        {/* Animated foreground */}
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          style={{
            pathLength,
            opacity,
          }}
        />
        {/* Glow layer */}
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          fill="none"
          style={{
            pathLength,
            opacity: useTransform(opacity, (v) => v * 0.3),
            filter: "blur(6px)",
          }}
        />
      </svg>
    </div>
  );
}

/** Simple horizontal connector between cards */
export function HorizontalConnector({
  className = "",
  segments = 2,
}: {
  className?: string;
  segments?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {Array.from({ length: segments }).map((_, i) => {
        const start = i / segments;
        const end = (i + 1) / segments;
        const segmentLength = useTransform(scrollYProgress, [start, end], [0, 1]);
        const segmentOpacity = useTransform(scrollYProgress, [start, start + 0.05], [0, 1]);

        return (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${(i / segments) * 100}%`,
              width: `${(1 / segments) * 100}%`,
            }}
          >
            <svg viewBox="0 0 200 4" className="w-full h-1" preserveAspectRatio="none">
              <line
                x1="0" y1="2" x2="200" y2="2"
                stroke="rgba(139, 143, 232, 0.1)"
                strokeWidth="2"
              />
              <motion.line
                x1="0" y1="2" x2="200" y2="2"
                stroke="#8B8FE8"
                strokeWidth="2"
                style={{
                  pathLength: segmentLength,
                  opacity: segmentOpacity,
                }}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
