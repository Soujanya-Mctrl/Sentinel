"use client";

interface MarqueeProps {
  text: string;
  className?: string;
  /** Speed in seconds for one full cycle */
  speed?: number;
  /** Text opacity */
  opacity?: number;
  separator?: string;
}

export function Marquee({
  text,
  className = "",
  speed = 30,
  opacity = 0.06,
  separator = " · ",
}: MarqueeProps) {
  // Repeat text enough to fill viewport + overflow
  const repeated = Array.from({ length: 12 }).map(() => text).join(separator) + separator;

  return (
    <div
      className={`overflow-hidden whitespace-nowrap pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <div
        className="inline-flex"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        <span className="text-sm font-medium tracking-[0.2em] text-[#8B8FE8] uppercase">
          {repeated}
        </span>
        <span className="text-sm font-medium tracking-[0.2em] text-[#8B8FE8] uppercase">
          {repeated}
        </span>
      </div>
    </div>
  );
}
