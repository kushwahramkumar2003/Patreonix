"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@repo/ui/components/ui/Input";
import { Label } from "@repo/ui/components/ui/Label";
import { Switch } from "@repo/ui/components/ui/switch";

export function WalletSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x1234...5678");
  const [settings, setSettings] = useState({
    autoConnect: true,
    showBalance: true,
    useHardwareWallet: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    // Simulated wallet disconnection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setWalletAddress("");
    setIsLoading(false);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulated wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setWalletAddress("0x9876...5432");
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Wallet Settings</CardTitle>
          <CardDescription>
            Manage your decentralized wallet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Connected Wallet</Label>
            <Input
              id="walletAddress"
              value={walletAddress}
              readOnly
              className="bg-zinc-700 text-zinc-100"
            />
          </div>
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="text-zinc-300">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleDisconnect}
            disabled={isLoading || !walletAddress}
            variant="destructive"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Disconnect Wallet
          </Button>
          <Button onClick={handleConnect} disabled={isLoading || walletAddress}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect Wallet
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
