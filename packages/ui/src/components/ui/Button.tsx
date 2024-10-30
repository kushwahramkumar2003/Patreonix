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
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:transform active:translate-y-0.5",
      "overflow-hidden"
    );

    const variants = {
      default: "bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-500",
      cta: cn(
        "relative bg-zinc-900 text-white",
        "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-zinc-400/20 before:via-zinc-100/20 before:to-zinc-400/20",
        "before:animate-shimmer before:bg-[length:200%_100%]",
        "after:absolute after:inset-[-2px] after:-z-10 after:rounded-lg",
        "after:bg-gradient-to-r after:from-zinc-500 after:via-zinc-400 after:to-zinc-500",
        "after:animate-gradient-xy",
        "hover:bg-zinc-800 focus:ring-zinc-400",
        "shadow-lg hover:shadow-zinc-500/25"
      ),
      gradient: cn(
        "bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900",
        "text-white",
        "hover:from-zinc-700 hover:via-zinc-600 hover:to-zinc-800",
        "focus:ring-zinc-500",
        "shadow-lg hover:shadow-zinc-900/25",
        "border border-zinc-600/50"
      ),
      outline: cn(
        "border-2 border-zinc-700",
        "text-zinc-100",
        "hover:bg-zinc-700 hover:text-white",
        "focus:ring-zinc-500",
        "transition-colors"
      ),
      ghost: cn(
        "text-zinc-300",
        "hover:bg-zinc-800/50 hover:text-zinc-100",
        "focus:ring-zinc-500",
        "backdrop-blur-sm"
      ),
      zinc: cn(
        "relative bg-zinc-900",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-gradient-to-r before:from-zinc-700 before:via-zinc-600 before:to-zinc-700",
        "before:animate-pulse",
        "text-white",
        "hover:before:from-zinc-600 hover:before:via-zinc-500 hover:before:to-zinc-600",
        "focus:ring-zinc-400",
        "shadow-lg hover:shadow-zinc-500/25",
        "border border-zinc-700/50"
      ),
      simple: cn(
        "bg-zinc-200 text-zinc-800",
        "hover:bg-zinc-300",
        "focus:ring-zinc-400"
      ),
      neon: cn(
        "relative bg-zinc-900",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-gradient-to-r before:from-zinc-300 before:via-zinc-100 before:to-zinc-300",
        "before:opacity-10 before:animate-pulse",
        "text-zinc-100",
        "hover:text-white hover:before:opacity-20",
        "focus:ring-zinc-300",
        "shadow-lg shadow-zinc-300/5 hover:shadow-zinc-300/10",
        "border border-zinc-700"
      ),
      cosmic: cn(
        "relative bg-zinc-900",
        "before:absolute before:inset-0 before:rounded-md",
        "before:bg-[radial-gradient(circle_at_50%_50%,_zinc-400,_transparent_50%)]",
        "before:animate-cosmic",
        "text-white",
        "hover:bg-zinc-800",
        "focus:ring-zinc-500",
        "shadow-lg hover:shadow-zinc-400/10",
        "border border-zinc-700"
      ),
      animated: cn(
        "relative bg-zinc-900 text-white z-0",
        "before:absolute before:inset-[-2px] before:-z-10 before:rounded-lg",
        "before:bg-gradient-to-r before:from-zinc-500 before:via-zinc-400 before:to-zinc-500",
        "before:animate-gradient-xy before:bg-[length:200%_200%]",
        "after:absolute after:inset-[-2px] after:-z-20 after:rounded-lg",
        "after:bg-gradient-to-r after:from-zinc-400 after:via-zinc-300 after:to-zinc-400",
        "after:animate-gradient-xy after:animate-delay-100 after:bg-[length:200%_200%]",
        "hover:bg-zinc-800",
        "focus:ring-zinc-400",
        "shadow-lg hover:shadow-zinc-500/25"
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
            Loading...
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
