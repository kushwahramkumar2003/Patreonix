"use client";

import * as React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@repo/ui/lib/utils";

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "ghost";
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default:
        "text-zinc-200 hover:text-zinc-100 underline-offset-4 hover:underline",
      subtle: "text-zinc-400 hover:text-zinc-300 no-underline",
      ghost:
        "text-zinc-400 hover:text-zinc-300 no-underline hover:bg-zinc-800 px-2 py-1 rounded-md",
    };

    return (
      <NextLink
        className={cn(
          variants[variant],
          "transition-colors duration-200",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export { Link };
