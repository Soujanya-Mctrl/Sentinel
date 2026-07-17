"use client";

export function CircuitGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `
            linear-gradient(rgba(139, 143, 232, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 143, 232, 0.5) 1px, transparent 1px),
            linear-gradient(rgba(139, 143, 232, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 143, 232, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 60px 60px, 15px 15px, 15px 15px",
          animation: "circuit-drift 20s linear infinite",
        }}
      />
      {/* Radial fade to black edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #0A0A0B 70%)",
        }}
      />
    </div>
  );
}
