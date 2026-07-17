"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  status: "approved" | "blocked" | "pending";
  timestamp: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    hash: "0x7a3f…c2d1",
    from: "Treasury A",
    to: "0x9d…b1e4",
    amount: "25,000 USDC",
    status: "approved",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    hash: "0x2c8e…f4a7",
    from: "Treasury A",
    to: "0x4b…8c3f",
    amount: "1,250,000 USDC",
    status: "blocked",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    hash: "0x5d1b…a9e2",
    from: "Treasury B",
    to: "0x7f…2d6a",
    amount: "8,500 AVAX",
    status: "approved",
    timestamp: "12 min ago",
  },
  {
    id: "4",
    hash: "0x8f4c…b3d5",
    from: "Treasury A",
    to: "0x1e…9f7b",
    amount: "450,000 USDC",
    status: "pending",
    timestamp: "18 min ago",
  },
  {
    id: "5",
    hash: "0x3a7d…e1c8",
    from: "Treasury C",
    to: "0x6c…4a2e",
    amount: "92,000 USDC",
    status: "approved",
    timestamp: "25 min ago",
  },
  {
    id: "6",
    hash: "0xb2e5…d7f3",
    from: "Treasury B",
    to: "0x8a…5b1c",
    amount: "3,100,000 USDC",
    status: "blocked",
    timestamp: "31 min ago",
  },
];

const statusStyles = {
  approved: {
    text: "text-[#00E676]",
    bg: "bg-[#00E676]/10",
    border: "",
    label: "Approved",
  },
  blocked: {
    text: "text-[#FF3B30]",
    bg: "bg-[#FF3B30]/10",
    border: "border-l-2 border-l-[#FF3B30]",
    label: "Blocked",
  },
  pending: {
    text: "text-[#FFB800]",
    bg: "bg-[#FFB800]/10",
    border: "",
    label: "Pending",
  },
};

export function TransactionTable() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [newTxIds, setNewTxIds] = useState<Set<string>>(new Set());

  // Simulate a new transaction arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      const newTx: Transaction = {
        id: "new-1",
        hash: "0xf1a2…c3b4",
        from: "Treasury A",
        to: "0x3d…7e9f",
        amount: "67,800 USDC",
        status: "approved",
        timestamp: "Just now",
      };
      setTransactions((prev) => [newTx, ...prev]);
      setNewTxIds((prev) => new Set(prev).add(newTx.id));

      // Clear "new" state after animation
      setTimeout(() => {
        setNewTxIds((prev) => {
          const next = new Set(prev);
          next.delete(newTx.id);
          return next;
        });
      }, 2000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-lg border border-[rgba(245,245,247,0.08)] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-[#111113] border-b border-[rgba(245,245,247,0.06)] text-xs tracking-widest uppercase text-[#71717A]">
        <span>Hash</span>
        <span>Route</span>
        <span className="text-right">Amount</span>
        <span className="w-20 text-center">Status</span>
        <span className="w-20 text-right">Time</span>
      </div>

      {/* Rows */}
      <div className="bg-[#0E0E10]">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => {
            const style = statusStyles[tx.status];
            const isNew = newTxIds.has(tx.id);

            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className={`grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-[rgba(245,245,247,0.04)] text-sm ${style.border} ${
                  isNew ? "bg-[#8B8FE8]/5" : ""
                }`}
              >
                <span className="text-[#F5F5F7] font-mono text-xs">
                  {tx.hash}
                </span>
                <span className="text-[#71717A] text-xs">
                  {tx.from} → {tx.to}
                </span>
                <span
                  className="text-[#F5F5F7] text-right tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tx.amount}
                </span>
                <span
                  className={`w-20 text-center text-xs px-2 py-0.5 rounded ${style.text} ${style.bg}`}
                >
                  {style.label}
                </span>
                <span className="w-20 text-right text-xs text-[#71717A]">
                  {tx.timestamp}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
