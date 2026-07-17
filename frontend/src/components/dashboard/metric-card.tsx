"use client";

import { motion } from "framer-motion";
import { useScrambleText } from "@/components/motion/scramble-text";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  index?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  index = 0,
}: MetricCardProps) {
  const displayValue = useScrambleText(value, { speed: 25, trigger: true });

  return (
    <motion.div
      className="rounded-lg border border-[rgba(245,245,247,0.08)] bg-[#111113] p-6 transition-all duration-300 hover:border-[rgba(139,143,232,0.15)] hover:shadow-[0_0_30px_rgba(139,143,232,0.06)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <p className="text-xs tracking-widest uppercase text-[#71717A] mb-3">
        {title}
      </p>
      <p
        className="text-2xl font-semibold text-[#F5F5F7] tabular-nums font-display"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {displayValue}
      </p>
      {change && (
        <p
          className={cn(
            "text-xs mt-2",
            changeType === "positive" && "text-[#00E676]",
            changeType === "negative" && "text-[#FF3B30]",
            changeType === "neutral" && "text-[#71717A]"
          )}
        >
          {change}
        </p>
      )}
    </motion.div>
  );
}
