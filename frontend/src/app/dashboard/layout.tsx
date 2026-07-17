"use client";

import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <main className="ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
