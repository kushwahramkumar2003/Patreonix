"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Briefcase, Camera, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Button from "@repo/ui/components/ui/Button";

import { Label } from "@repo/ui/components/ui/Label";
import { Input } from "@repo/ui/components/ui/Input";
import { cn } from "@repo/ui/lib/utils";
import { FormControl } from "@repo/ui/components/ui/form";

type FormStage = "wallet" | "personal" | "profile" | "verification";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  creatorName: string;
  category: string;
  bio: string;
  avatar: File | null;
  walletAddress: string;
}

const RegisterForm = () => {
  const { connected, publicKey } = useWallet();
  const [stage, setStage] = useState<FormStage>("wallet");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    creatorName: "",
    category: "",
    bio: "",
    avatar: null,
    walletAddress: "",
  });

  const stages = {
    wallet: {
      title: "Connect Your Wallet",
      fields: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-700">
            <div className="flex flex-col items-center space-y-4">
              <Wallet className="w-12 h-12 text-zinc-400" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-zinc-200">
                  Wallet Connection Required
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Connect your Solana wallet to continue registration
                </p>
              </div>
              <WalletMultiButton className="!bg-zinc-800 hover:!bg-zinc-700 !h-10 !px-4 !rounded-md" />
            </div>
          </div>
          {connected && (
            <div className="text-sm text-zinc-400 text-center">
              Connected: {publicKey?.toBase58().slice(0, 8)}...
            </div>
          )}
        </div>
      ),
    },
    personal: {
      title: "Personal Information",
      fields: (
        <>
          <FormControl>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              icon={<User size={18} />}
              placeholder="John"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="lastName">Last Name (Optional)</Label>
            <Input
              id="lastName"
              type="text"
              icon={<User size={18} />}
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              icon={<Mail size={18} />}
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </FormControl>
        </>
      ),
    },
    profile: {
      title: "Creator Profile",
      fields: (
        <>
          <FormControl>
            <Label htmlFor="creatorName">Creator Name</Label>
            <Input
              id="creatorName"
              type="text"
              icon={<Briefcase size={18} />}
              placeholder="Your creator name"
              value={formData.creatorName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  creatorName: e.target.value,
                }))
              }
              required
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              type="text"
              icon={<Briefcase size={18} />}
              placeholder="e.g., Art, Music, Writing"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <textarea
              id="bio"
              className="flex w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              placeholder="Tell us about yourself"
              rows={3}
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </FormControl>
        </>
      ),
    },
    verification: {
      title: "Profile Picture",
      fields: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
              {formData.avatar ? (
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-zinc-400">
                  <Camera size={32} />
                </div>
              )}
            </div>
          </div>
          <FormControl>
            <Label htmlFor="avatar">Upload Picture (Optional)</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, avatar: file }));
                }
              }}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("avatar")?.click()}
              type="button"
            >
              Choose File
            </Button>
          </FormControl>
        </div>
      ),
    },
  };

  const handleNext = () => {
    const stageOrder: FormStage[] = [
      "wallet",
      "personal",
      "profile",
      "verification",
    ];
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex < stageOrder.length - 1) {
      //@ts-ignore
      setStage(stageOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stageOrder: FormStage[] = [
      "wallet",
      "personal",
      "profile",
      "verification",
    ];
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex > 0) {
      //@ts-ignore
      setStage(stageOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    if (stage === "verification") {
      // Here you would interact with your Solana program
      const finalFormData = {
        ...formData,
        walletAddress: publicKey.toBase58(),
      };
      console.log("Submitting to Solana program:", finalFormData);
      // Add your Solana program interaction here
    } else {
      handleNext();
    }
  };

  return (
    <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg border border-zinc-700 p-6 shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            {stages[stage].title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {stages[stage].fields}
            <div className="flex justify-between mt-6 pt-4 border-t border-zinc-700">
              {stage !== "wallet" && (
                <Button type="button" variant="ghost" onClick={handleBack}>
                  Back
                </Button>
              )}
              {stage === "wallet" && !connected ? (
                <div className="ml-auto">
                  <WalletMultiButton className="!bg-zinc-800 hover:!bg-zinc-700 !h-10 !px-4 !rounded-md" />
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="animated"
                  className="ml-auto"
                  disabled={stage === "wallet" && !connected}
                >
                  {stage === "verification" ? "Complete" : "Next"}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6">
        <div className="flex items-center gap-2">
          {["wallet", "personal", "profile", "verification"].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  s === stage ? "w-8 bg-zinc-400" : "w-2 bg-zinc-600"
                )}
              />
              {i < 3 && <div className="flex-1 h-[1px] bg-zinc-700" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
