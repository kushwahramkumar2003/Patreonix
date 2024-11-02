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
import { Input } from "@repo/ui/components/ui/Input";
import { Label } from "@repo/ui/components/ui/Label";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "crypto_creator",
      email: "creator@decentra.com",
      bio: "Decentralized content creator",
      website: "https://decentra.com/creator",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
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
          <CardTitle>Decentralized Profile</CardTitle>
          <CardDescription>Update your decentralized identity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="Profile picture"
                />
                <AvatarFallback>CC</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Icons.upload className="mr-2 h-4 w-4" />
                Change Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
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
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register("website")}
                className="bg-zinc-700 text-zinc-100"
              />
              {errors.website && (
                <p className="text-red-400 text-sm">{errors.website.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
