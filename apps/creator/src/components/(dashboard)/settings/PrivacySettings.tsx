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
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Icons } from "@/components/ui/icons";

export function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: "public",
    activityFeed: true,
    showEarnings: false,
    allowDataCollection: true,
    encryptData: true,
    useZKProofs: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSelectChange = (value) => {
    setSettings((prev) => ({ ...prev, profileVisibility: value }));
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
          <CardTitle>Decentralized Privacy</CardTitle>
          <CardDescription>
            Manage your on-chain privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger
                id="profileVisibility"
                className="bg-zinc-700 text-zinc-100"
              >
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-zinc-100">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="supporters-only">Supporters Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {Object.entries(settings).map(([key, value]) => {
            if (key !== "profileVisibility") {
              return (
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
              );
            }
          })}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Privacy Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
