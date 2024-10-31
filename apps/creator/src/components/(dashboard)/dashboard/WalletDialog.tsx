"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";

import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import Button from "@repo/ui/components/ui/Button";

export function WalletDialog() {
  const { publicKey, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}`,
        "_blank"
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50"
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-zinc-300">
            {publicKey?.toBase58().slice(0, 4)}...
            {publicKey?.toBase58().slice(-4)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Wallet Management</DialogTitle>
          <DialogDescription>
            Manage your connected wallet and view your details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-zinc-300">
                Wallet Address
              </p>
              <p className="text-sm text-zinc-400">{publicKey?.toBase58()}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex items-center"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openExplorer}
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => disconnect()}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
