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
import { Switch } from "@repo/ui/components/ui/switch";
import { Label } from "@repo/ui/components/ui/Label";
import { Icons } from "@/components/ui/icons";
import Button from "@repo/ui/components/ui/Button";

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newSubscriber: true,
    newComment: true,
    newDonation: true,
    contentMilestone: true,
    blockchainEvents: true,
    smartContractUpdates: false,
  });
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
          <CardTitle>Decentralized Notifications</CardTitle>
          <CardDescription>
            Manage your on-chain and off-chain notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
