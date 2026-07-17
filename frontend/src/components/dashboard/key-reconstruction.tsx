"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyHolder {
  id: string;
  label: string;
  submitted: boolean;
}

export function KeyReconstruction() {
  const [holders, setHolders] = useState<KeyHolder[]>([
    { id: "1", label: "Key holder 1", submitted: false },
    { id: "2", label: "Key holder 2", submitted: false },
    { id: "3", label: "Key holder 3", submitted: false },
  ]);

  const submittedCount = holders.filter((h) => h.submitted).length;
  const isReconstructed = submittedCount >= 2;

  const toggleHolder = (id: string) => {
    setHolders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, submitted: !h.submitted } : h))
    );
  };

  return (
    <div className="space-y-8">
      {/* Key holders */}
      <div className="flex items-center justify-center gap-8">
        {holders.map((holder, i) => (
          <div key={holder.id} className="flex flex-col items-center gap-3">
            {/* Node */}
            <motion.button
              onClick={() => toggleHolder(holder.id)}
              className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                holder.submitted
                  ? "border-[#8B8FE8] bg-[#8B8FE8]/10"
                  : "border-[rgba(245,245,247,0.12)] bg-[#111113] hover:border-[rgba(245,245,247,0.2)]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {holder.submitted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-[#8B8FE8]"
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="user"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-[#71717A]"
                  >
                    <User className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow ring when submitted */}
              {holder.submitted && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#8B8FE8]/30"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
            </motion.button>

            <span className="text-xs text-[#71717A]">{holder.label}</span>
          </div>
        ))}
      </div>

      {/* Connection lines + merged key */}
      <div className="flex flex-col items-center gap-6">
        {/* SVG lines converging */}
        <svg
          width="240"
          height="60"
          viewBox="0 0 240 60"
          fill="none"
          className="overflow-visible"
        >
          {holders.map((holder, i) => {
            const startX = 40 + i * 80;
            return (
              <motion.line
                key={holder.id}
                x1={startX}
                y1="0"
                x2="120"
                y2="50"
                stroke={holder.submitted ? "#8B8FE8" : "rgba(245,245,247,0.08)"}
                strokeWidth="1.5"
                strokeDasharray={holder.submitted ? "0" : "4 4"}
                initial={false}
                animate={{
                  stroke: holder.submitted
                    ? "#8B8FE8"
                    : "rgba(245,245,247,0.08)",
                }}
                transition={{ duration: 0.4 }}
              />
            );
          })}
        </svg>

        {/* Merged key icon */}
        <motion.div
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            isReconstructed
              ? "border-2 border-[#8B8FE8] bg-[#8B8FE8]/15"
              : "border border-[rgba(245,245,247,0.08)] bg-[#111113]"
          }`}
          animate={
            isReconstructed
              ? {
                  boxShadow: [
                    "0 0 0px rgba(139,143,232,0)",
                    "0 0 40px rgba(139,143,232,0.3)",
                    "0 0 20px rgba(139,143,232,0.15)",
                  ],
                }
              : { boxShadow: "0 0 0px rgba(139,143,232,0)" }
          }
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            animate={
              isReconstructed
                ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <KeyRound
              className={`w-8 h-8 transition-colors duration-500 ${
                isReconstructed ? "text-[#8B8FE8]" : "text-[#71717A]"
              }`}
            />
          </motion.div>
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-medium">
            {isReconstructed
              ? "Audit key reconstructed"
              : `${submittedCount} of 2 required`}
          </p>
          <p className="text-xs text-[#71717A] mt-1">
            {isReconstructed
              ? "Encrypted treasury data is now accessible for audit"
              : "Click key holders above to simulate submission"}
          </p>
        </div>
      </div>
    </div>
  );
}
