"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SentinelLogo } from "@/components/sentinel-logo";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "treasury", label: "Treasury Setup" },
  { id: "policy", label: "Policy Engine" },
  { id: "audit", label: "Audit System" },
  { id: "api", label: "API Reference" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -65% 0px", // triggers when section is in the top-middle half of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex">
      {/* Left sidebar nav */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] border-r border-[rgba(245,245,247,0.06)] bg-[#0E0E10] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[rgba(245,245,247,0.06)]">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo/logo - horizontal.png"
              alt="Sentinel Logo"
              className="h-8 object-contain"
            />
            <span
              className="text-xs font-semibold tracking-[0.25em] text-[#71717A] uppercase border-l border-[rgba(245,245,247,0.12)] pl-3 ml-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Docs
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-6 px-3">
          <div className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`relative block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  activeSection === section.id
                    ? "text-[#F5F5F7]"
                    : "text-[#71717A] hover:text-[#F5F5F7]"
                }`}
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="docs-active"
                    className="absolute inset-0 bg-[#8B8FE8]/8 border border-[rgba(139,143,232,0.12)] rounded-md"
                    transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                )}
                <span className="relative z-10">{section.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Back to app */}
        <div className="p-6 border-t border-[rgba(245,245,247,0.06)] pb-8">
          <Link
            href="/"
            className="text-xs text-[#71717A] hover:text-[#F5F5F7] transition-colors pl-2"
          >
            ← Back to Sentinel
          </Link>
        </div>
      </aside>

      {/* Right content — centered relative to remaining space */}
      <div className="pl-[260px] w-full flex justify-center">
        <main className="flex-1 max-w-3xl px-12 py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
