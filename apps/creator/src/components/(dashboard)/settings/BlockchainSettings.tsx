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
import { Icons } from "@/components/ui/icons";
import { Input } from "@repo/ui/components/ui/Input";
import { Label } from "@repo/ui/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import Button from "@repo/ui/components/ui/Button";

export function BlockchainSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    network: "mainnet",
    gasPrice: "auto",
    useProxy: false,
    enableENS: true,
    ipfsGateway: "https://ipfs.io",
  });
  //@ts-ignore
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  //@ts-ignore
  const handleToggle = (setting) => {
    //@ts-ignore
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(settings);
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
          <CardTitle>Blockchain Settings</CardTitle>
          <CardDescription>
            Configure your blockchain interaction preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select
              value={settings.network}
              onValueChange={(value) => handleChange("network", value)}
            >
              <SelectTrigger id="network" className="bg-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-zinc-100">
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
                <SelectItem value="local">Local Network</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gasPrice">Gas Price Strategy</Label>
            <Select
              value={settings.gasPrice}
              onValueChange={(value) => handleChange("gasPrice", value)}
            >
              <SelectTrigger
                id="gasPrice"
                className="bg-zinc-700 text-zinc-100"
              >
                <SelectValue placeholder="Select gas price strategy" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-zinc-100">
                <SelectItem value="auto">Auto (Recommended)</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="useProxy" className="text-zinc-300">
              Use Proxy Contract
            </Label>
            <Switch
              id="useProxy"
              checked={settings.useProxy}
              onCheckedChange={() => handleToggle("useProxy")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enableENS" className="text-zinc-300">
              Enable ENS
            </Label>
            <Switch
              id="enableENS"
              checked={settings.enableENS}
              onCheckedChange={() => handleToggle("enableENS")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipfsGateway">IPFS Gateway</Label>
            <Input
              id="ipfsGateway"
              value={settings.ipfsGateway}
              onChange={(e) => handleChange("ipfsGateway", e.target.value)}
              className="bg-zinc-700 text-zinc-100"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Blockchain Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
