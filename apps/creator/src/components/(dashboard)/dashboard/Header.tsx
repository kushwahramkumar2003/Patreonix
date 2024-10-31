"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "@repo/ui/components/ui/Button";
import { WalletButton } from "../../reusable/wallet-button";
import { WalletDialog } from "./WalletDialog";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { connected } = useWallet();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-700 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/75">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          className="mr-4 px-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <div className="hidden md:flex">
            <div className="text-xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text">
              Patreonix
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            {connected ? <WalletDialog /> : <WalletButton variant="default" />}
          </nav>
        </div>
      </div>
      {showNotifications && (
        <div className="absolute right-4 mt-2 w-80 rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
          <div className="p-4">
            <div className="flex justify-between flex-row">
              <h3 className="text-sm font-medium text-zinc-200">
                Notifications
              </h3>
              <X
                className="hover:text-zinc-300 cursor-pointer"
                onClick={() => {
                  setShowNotifications(false);
                }}
              />
            </div>

            <div className="mt-2 space-y-2">
              <div className="text-sm text-zinc-400">No new notifications</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
