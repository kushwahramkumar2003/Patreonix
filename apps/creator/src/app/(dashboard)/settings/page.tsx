"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { ProfileSettings } from "@/components/(dashboard)/settings/ProfileSettings";
import { NotificationSettings } from "@/components/(dashboard)/settings/NotificationSettings";
import { PrivacySettings } from "@/components/(dashboard)/settings/PrivacySettings";
import { WalletSettings } from "@/components/(dashboard)/settings/WalletSettings";
import { BlockchainSettings } from "@/components/(dashboard)/settings/BlockchainSettings";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">
            Decentralized Settings
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage your account and blockchain preferences
          </p>
        </div> */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-100">
            {" "}
            Decentralized Settings
          </h1>
        </div>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletSettings />
        </TabsContent>

        <TabsContent value="blockchain">
          <BlockchainSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
