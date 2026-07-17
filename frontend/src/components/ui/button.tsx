"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B8FE8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#8B8FE8] text-[#0A0A0B] hover:bg-[#6C6FE0] hover:shadow-[0_0_30px_rgba(139,143,232,0.25)]",
        ghost:
          "border border-[rgba(245,245,247,0.12)] text-[#F5F5F7] hover:border-[#8B8FE8] hover:text-[#8B8FE8] hover:shadow-[0_0_20px_rgba(139,143,232,0.1)]",
        outline:
          "border border-[#8B8FE8]/30 text-[#8B8FE8] hover:bg-[#8B8FE8]/10 hover:border-[#8B8FE8]/60",
        danger:
          "bg-[#FF3B30]/10 border border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/20",
        link: "text-[#8B8FE8] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 rounded-md",
        sm: "h-9 px-4 text-xs rounded-md",
        lg: "h-13 px-8 text-base rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
