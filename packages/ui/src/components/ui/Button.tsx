"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type ButtonVariant =
  | "default"
  | "cta"
  | "gradient"
  | "outline"
  | "ghost"
  | "zinc"
  | "simple"
  | "neon"
  | "cosmic"
  | "animated";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "relative inline-flex items-center justify-center rounded-md font-medium",
      "transition-all duration-300 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:transform active:translate-y-0.5",
      "overflow-hidden"
    );

    const variants = {
      default: cn(
        "bg-zinc-800 text-white",
        "hover:bg-zinc-700",
        "focus:ring-zinc-500",
        "shadow-lg shadow-zinc-900/20",
        "hover:shadow-zinc-900/30",
        "border border-zinc-700/30"
      ),
      cta: cn(
        "relative bg-zinc-900 text-white",
        "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-zinc-400/30 before:via-zinc-100/30 before:to-zinc-400/30",
        "before:animate-shimmer before:bg-[length:200%_100%]",
        "after:absolute after:inset-[-2px] after:-z-10 after:rounded-lg",
        "after:bg-gradient-to-r after:from-zinc-400 after:via-zinc-300 after:to-zinc-400",
        "after:animate-gradient-xy",
        "hover:bg-zinc-800 focus:ring-zinc-400",
        "shadow-lg hover:shadow-zinc-400/25"
      ),
      gradient: cn(
        "bg-[linear-gradient(110deg,#1f1f1f,45%,#383838,55%,#1f1f1f)]",
        "bg-[length:200%_100%]",
        "animate-shimmer",
        "text-white",
        "border border-zinc-700/50",
        "shadow-lg shadow-zinc-900/20",
        "hover:shadow-zinc-900/40",
        "focus:ring-zinc-500"
      ),
      outline: cn(
        "border-2",
        "border-[linear-gradient(110deg,#3f3f3f,45%,#525252,55%,#3f3f3f)]",
        "text-zinc-100",
        "hover:bg-zinc-800/80",
        "hover:text-white",
        "focus:ring-zinc-500",
        "shadow-lg shadow-zinc-900/10",
        "hover:shadow-zinc-900/20"
      ),
      ghost: cn(
        "text-zinc-300",
        "hover:bg-zinc-800/30",
        "hover:text-zinc-100",
        "focus:ring-zinc-500",
        "backdrop-blur-sm",
        "border border-zinc-700/20",
        "hover:border-zinc-700/40"
      ),
      zinc: cn(
        "relative bg-zinc-900",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-[linear-gradient(110deg,#3f3f3f,45%,#525252,55%,#3f3f3f)]",
        "before:bg-[length:200%_100%]",
        "before:animate-shimmer",
        "text-white",
        "border border-zinc-700/50",
        "shadow-lg",
        "hover:shadow-zinc-700/20",
        "focus:ring-zinc-400"
      ),
      simple: cn(
        "bg-zinc-200 text-zinc-900",
        "hover:bg-zinc-300",
        "focus:ring-zinc-400",
        "shadow-sm",
        "hover:shadow-md",
        "transition-shadow"
      ),
      neon: cn(
        "relative bg-zinc-900",
        "text-zinc-100",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-gradient-to-r before:from-zinc-400/20 before:to-zinc-300/20",
        "before:animate-pulse",
        "after:absolute after:inset-[-1px] after:-z-10 after:rounded-lg",
        "after:bg-gradient-to-r after:from-zinc-400/50 after:to-zinc-300/50",
        "border border-zinc-700/50",
        "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]",
        "hover:text-white",
        "focus:ring-zinc-300"
      ),
      cosmic: cn(
        "relative bg-zinc-900",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-[radial-gradient(circle_at_50%_50%,#4a4a4a,transparent_60%)]",
        "before:animate-cosmic",
        "text-white",
        "hover:bg-zinc-800",
        "focus:ring-zinc-500",
        "shadow-lg",
        "hover:shadow-zinc-400/20",
        "border border-zinc-700/50"
      ),
      animated: cn(
        "relative bg-zinc-900 text-white",
        "before:absolute before:inset-0",
        "before:rounded-md before:bg-zinc-800",
        "after:absolute after:inset-[-2px] after:-z-10",
        "after:rounded-lg after:bg-transparent",
        "after:border-[3px] after:border-transparent",
        "after:bg-gradient-to-r after:from-zinc-400 after:via-zinc-300 after:to-zinc-400",
        "after:bg-clip-border after:animate-spin-slow",
        "hover:bg-zinc-800",
        "focus:ring-zinc-400",
        "shadow-lg hover:shadow-zinc-500/25",
        "[&:hover]:after:border-[3px]",
        "[&:hover]:after:border-zinc-400/50"
      ),
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 text-base rounded-lg",
      lg: "h-12 px-6 text-lg rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="relative z-10">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center relative z-10">
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
