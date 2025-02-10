"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import { Camera } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import Button from "@repo/ui/components/ui/Button";
import { Label } from "@repo/ui/components/ui/Label";
import { Input } from "@repo/ui/components/ui/Input";
import { addAndPinFile } from "@/lib/ipfs";
import { useSession } from "next-auth/react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getClientAnchorProgramm } from "@/lib/Anchor";
import { getCreatorPda } from "@/lib/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import config from "@/config";
import idl from "@repo/patreonix_program/idl";
import { PatreonixProgram } from "@repo/patreonix_program/types";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string(),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
});

const connection = new Connection(config.rpcEndpoint, {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
});

export function ProfileSettings({ data }) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    data?.avatar ? `https://gateway.pinata.cloud/ipfs/${data?.avatar}` : ""
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wallet = useAnchorWallet();
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
    skipPreflight: false,
  });

  const programm = new anchor.Program(idl as PatreonixProgram, provider);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data?.authority,
      email: data?.email || "",
      bio: data?.bio || "",
      name: data?.name || "",
    },
  });

  const onSubmit = async (formData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (!session.data?.user.publicKey) {
        toast.error("Please connect your wallet first");
        return;
      }

      const creatorPda = await getCreatorPda(
        new PublicKey(session.data?.user.publicKey)
      );

      const tx = await programm.methods
        .updateCreator(
          formData.name,
          formData.email,
          formData.bio,
          data?.avatar || ""
        )
        .accounts({
          creator: creatorPda,
          authority: new PublicKey(session.data?.user.publicKey),
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("tx", tx);

      await connection.confirmTransaction(tx, "confirmed");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!session.data?.user.publicKey) {
        toast.error("Please connect your wallet first");
        return;
      }

      const form = new FormData();
      form.append("file", selectedImage);

      const cid = await addAndPinFile(form);
      if (!cid) throw new Error("Failed to upload to IPFS");

      console.log("cid", cid);

      const creatorPda = await getCreatorPda(
        new PublicKey(session.data?.user.publicKey)
      );

      const tx = await programm.methods
        .updateCreator(data?.name, data?.email, data?.bio, cid)
        .accounts({
          creator: creatorPda,
          authority: new PublicKey(session.data?.user.publicKey),
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({
          skipPreflight: false,
          maxRetries: 3,
        });

      console.log("tx", tx);

      const confirmation = await connection.confirmTransaction(tx, "confirmed");

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        error.message || "Failed to upload avatar. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Decentralized Profile</CardTitle>
          <CardDescription>Update your decentralized identity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Avatar className="w-20 h-20 relative">
                  <AvatarImage
                    src={previewUrl}
                    alt="Profile picture"
                    className={`transition-all duration-200 ${isHovered ? "blur-sm" : ""}`}
                  />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                {isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Camera className="h-8 w-8 text-white" />
                    </label>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onAvatarSubmit}
                disabled={!selectedImage || isLoading}
                className={
                  !selectedImage ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.upload className="mr-2 h-4 w-4" />
                )}
                Change Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                disabled
                id="username"
                {...register("username")}
                className="bg-zinc-700 text-zinc-100"
              />
              {errors.username && (
                <p className="text-red-400 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-zinc-700 text-zinc-100"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-zinc-700 text-zinc-100"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="bg-zinc-700 text-zinc-100"
              />
              {errors.bio && (
                <p className="text-red-400 text-sm">{errors.bio.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ProfileSettings;
