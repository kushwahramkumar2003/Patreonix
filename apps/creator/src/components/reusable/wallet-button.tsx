"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@repo/ui/lib/utils";

interface WalletButtonProps {
  className?: string;
  variant?: "default" | "large";
}

const WalletButton = ({
  className,
  variant = "default",
}: WalletButtonProps) => {
  const variants = {
    default:
      "!bg-zinc-800 hover:!bg-zinc-700 !h-10 !px-4 !rounded-md !transition-colors !duration-200",
    large:
      "!bg-zinc-800 hover:!bg-zinc-700 !h-12 !px-6 !rounded-lg !text-lg !transition-colors !duration-200",
  };

  return (
    <WalletMultiButton
      className={cn(
        variants[variant],
        "!font-medium !text-zinc-100",
        "!border !border-zinc-700",
        "!shadow-lg hover:!shadow-zinc-900/20",
        className
      )}
    />
  );
};

export { WalletButton };
