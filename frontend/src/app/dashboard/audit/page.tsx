"use client";

import { KeyReconstruction } from "@/components/dashboard/key-reconstruction";

export default function AuditPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Audit Access
      </h1>
      <p className="text-sm text-[#71717A] mb-12">
        Reconstruct the audit key to access encrypted treasury data. Requires 2 of 3 key holders to submit their fragments.
      </p>

      {/* Key reconstruction UI */}
      <div className="rounded-lg border border-[rgba(245,245,247,0.08)] bg-[#111113] p-10">
        <KeyReconstruction />
      </div>

      {/* Audit log placeholder */}
      <div className="mt-12">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Audit Log
        </h2>
        <div className="rounded-lg border border-[rgba(245,245,247,0.08)] bg-[#0E0E10] p-6">
          <p className="text-sm text-[#71717A] text-center">
            No audit sessions recorded yet. Reconstruct the key above to begin an audit.
          </p>
        </div>
      </div>
    </div>
  );
}
