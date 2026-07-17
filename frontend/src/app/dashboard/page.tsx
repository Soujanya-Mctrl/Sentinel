"use client";

import { Globe, Copy } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { LockToggle } from "@/components/dashboard/lock-toggle";
import { TransactionTable } from "@/components/dashboard/transaction-table";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Treasury Overview
          </h1>
          <div className="flex items-center gap-3 text-sm text-[#71717A]">
            <span
              className="font-mono text-xs"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              0x7a3f…c2d1e8b4
            </span>
            <button className="hover:text-[#F5F5F7] transition-colors">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(245,245,247,0.08)] bg-[#111113] text-xs">
            <Globe className="w-3 h-3 text-[#FF3B30]" />
            <span className="text-[#71717A]">Fuji Testnet</span>
          </div>
        </div>
      </div>

      {/* Lock/Unlock toggle */}
      <LockToggle className="mb-8" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Balance"
          value="142,500.00 USDC"
          change="+12,300 today"
          changeType="positive"
          index={0}
        />
        <MetricCard
          title="Approved today"
          value="23"
          change="18 transactions settled"
          changeType="neutral"
          index={1}
        />
        <MetricCard
          title="Blocked today"
          value="4"
          change="3 exceeded cap, 1 velocity"
          changeType="negative"
          index={2}
        />
      </div>

      {/* Transaction table */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recent Transactions
        </h2>
        <TransactionTable />
      </div>
    </div>
  );
}
