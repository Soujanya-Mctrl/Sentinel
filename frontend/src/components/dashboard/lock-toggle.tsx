"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { useScrambleText } from "@/components/motion/scramble-text";

interface LockToggleProps {
  className?: string;
}

const MASKED_VALUES = [
  { label: "Balance", masked: "••••••••", clear: "142,500.00 USDC" },
  { label: "Pending", masked: "••••••••", clear: "12,300.00 USDC" },
  { label: "Blocked", masked: "••••••••", clear: "89,000.00 USDC" },
];

function DecryptValue({ value, locked }: { value: string; locked: boolean }) {
  const display = useScrambleText(value, {
    speed: 35,
    trigger: !locked,
    scrambled: locked,
  });

  return (
    <span
      className="font-medium tabular-nums font-display"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </span>
  );
}

export function LockToggle({ className = "" }: LockToggleProps) {
  const [locked, setLocked] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {/* Banner */}
      <motion.div
        className="relative rounded-lg border overflow-hidden transition-colors duration-500"
        animate={{
          borderColor: locked
            ? "rgba(245, 245, 247, 0.08)"
            : "rgba(139, 143, 232, 0.2)",
        }}
      >
        {/* Scan-line shimmer overlay when locked */}
        <AnimatePresence>
          {locked && (
            <motion.div
              className="scan-line-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Shimmer effect when locked */}
        <AnimatePresence>
          {locked && (
            <motion.div
              className="shimmer-mask absolute inset-0 z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-20 flex items-center justify-between p-5 bg-[#111113]">
          <div className="flex items-center gap-4">
            {/* Lock icon */}
            <button
              onClick={() => setLocked(!locked)}
              className="w-10 h-10 rounded-md border border-[rgba(245,245,247,0.1)] flex items-center justify-center text-[#8B8FE8] hover:bg-[#8B8FE8]/10 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {locked ? (
                  <motion.div
                    key="locked"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lock className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Unlock className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div>
              <p className="text-xs tracking-widest uppercase text-[#71717A] mb-0.5">
                Treasury Status
              </p>
              <p className="text-sm font-medium">
                {locked ? "Encrypted" : "Decrypted"}
              </p>
            </div>
          </div>

          {/* Status pill */}
          <motion.div
            className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase"
            animate={{
              backgroundColor: locked
                ? "rgba(255, 184, 0, 0.1)"
                : "rgba(0, 230, 118, 0.1)",
              color: locked ? "#FFB800" : "#00E676",
              borderColor: locked
                ? "rgba(255, 184, 0, 0.2)"
                : "rgba(0, 230, 118, 0.2)",
            }}
            style={{ border: "1px solid" }}
            transition={{ duration: 0.4 }}
          >
            {locked ? "Locked" : "Unlocked"}
          </motion.div>
        </div>

        {/* Value rows with decrypt effect */}
        <div className="border-t border-[rgba(245,245,247,0.06)] bg-[#0E0E10]">
          <div className="grid grid-cols-3 divide-x divide-[rgba(245,245,247,0.06)]">
            {MASKED_VALUES.map((item) => (
              <div key={item.label} className="p-4">
                <p className="text-xs text-[#71717A] mb-1">{item.label}</p>
                <p className="text-sm text-[#F5F5F7]">
                  <DecryptValue value={item.clear} locked={locked} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
