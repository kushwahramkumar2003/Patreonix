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
import { Input } from "@repo/ui/components/ui/Input";
import { Label } from "@repo/ui/components/ui/Label";
import { Switch } from "@repo/ui/components/ui/switch";
import { Icons } from "@/components/ui/icons";

export function ApiSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
  const [settings, setSettings] = useState({
    enableApi: true,
    allowThirdPartyAccess: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleRegenerateKey = async () => {
    setIsLoading(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setApiKey("yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"); // New API key
    setIsLoading(false);
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
          <CardTitle>API Settings</CardTitle>
          <CardDescription>
            Manage your API access and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                value={apiKey}
                readOnly
                className="bg-zinc-700 text-zinc-100 flex-grow"
              />
              <Button onClick={handleRegenerateKey} disabled={isLoading}>
                {isLoading ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.refresh className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enableApi">Enable API Access</Label>
            <Switch
              id="enableApi"
              checked={settings.enableApi}
              onCheckedChange={() => handleToggle("enableApi")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allowThirdPartyAccess">
              Allow Third-Party Access
            </Label>
            <Switch
              id="allowThirdPartyAccess"
              checked={settings.allowThirdPartyAccess}
              onCheckedChange={() => handleToggle("allowThirdPartyAccess")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save API Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
