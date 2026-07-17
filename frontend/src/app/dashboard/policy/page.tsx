"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyRule {
  id: string;
  label: string;
  type: "cap" | "velocity" | "whitelist" | "custom";
}

const INITIAL_RULES: PolicyRule[] = [
  { id: "1", label: "Transaction cap: 500,000 USDC", type: "cap" },
  { id: "2", label: "Velocity: max 10 per hour", type: "velocity" },
  { id: "3", label: "Whitelist: 0x9d…b1, 0x4b…8c, 0x7f…2d", type: "whitelist" },
];

const typeColors: Record<string, string> = {
  cap: "border-[#FFB800]/30 bg-[#FFB800]/5 text-[#FFB800]",
  velocity: "border-[#8B8FE8]/30 bg-[#8B8FE8]/5 text-[#8B8FE8]",
  whitelist: "border-[#00E676]/30 bg-[#00E676]/5 text-[#00E676]",
  custom: "border-[#F5F5F7]/20 bg-[#F5F5F7]/5 text-[#F5F5F7]",
};

export default function PolicyPage() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [input, setInput] = useState("");

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const addRule = () => {
    if (!input.trim()) return;
    const newRule: PolicyRule = {
      id: Date.now().toString(),
      label: input.trim(),
      type: "custom",
    };
    setRules((prev) => [...prev, newRule]);
    setInput("");
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Policy Engine
      </h1>
      <p className="text-sm text-[#71717A] mb-8">
        Define compliance rules that are checked before every transaction settles.
      </p>

      {/* Natural language input */}
      <div className="rounded-lg border border-[rgba(245,245,247,0.08)] bg-[#111113] p-5 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <MessageSquare className="w-4 h-4 text-[#8B8FE8] mt-0.5 shrink-0" />
          <p className="text-sm text-[#71717A]">
            Describe a policy rule in plain language and it will be parsed into an enforceable constraint.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRule()}
            placeholder="Block any transaction over 1M USDC to non-whitelisted addresses"
            className="flex-1 bg-[#0A0A0B] border border-[rgba(245,245,247,0.08)] rounded-md px-4 py-2.5 text-sm text-[#F5F5F7] placeholder:text-[#71717A]/50 focus:outline-none focus:border-[#8B8FE8]/40 transition-colors"
          />
          <Button onClick={addRule} size="default">
            <Plus className="w-4 h-4" />
            Add rule
          </Button>
        </div>
      </div>

      {/* Active rules */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Active Rules
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-md border ${typeColors[rule.type]}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-widest uppercase opacity-60">
                      {rule.type}
                    </span>
                    <span className="text-sm">{rule.label}</span>
                  </div>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
