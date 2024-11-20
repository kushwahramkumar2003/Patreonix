"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Briefcase, Camera, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";
import IDL from "@repo/patreonix_programms/idl";
import Button from "@repo/ui/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/Input";
import { cn } from "@repo/ui/lib/utils";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormStage = "wallet" | "personal" | "profile" | "verification";

const PROGRAMM_ID = new PublicKey(
  "4iL34RsAAc1i4wYBCotcUoHdohPVZf5BBberACyxZ37Z"
);

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  creatorName: z.string().min(1, "Creator name is required"),
  category: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [stage, setStage] = React.useState<FormStage>("wallet");
  const [program, setProgram] =
    React.useState<Program<PatreonixProgramms> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [creatorPDA, setCreatorPDA] = React.useState<PublicKey | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      creatorName: "",
      category: "",
      bio: "",
      avatar: null,
    },
  });

  // Initialize program and PDA when wallet connects
  React.useEffect(() => {
    const initializeProgram = async () => {
      console.log("Initializing program1...");
      if (connected && wallet && publicKey) {
        try {
          const provider = new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
          });

          console.log("Initializing program2...");

          const programInstance = new Program<PatreonixProgramms>(
            IDL as PatreonixProgramms,
            provider
          );

          console.log("Program initialized:", programInstance);

          setProgram(programInstance);

          // Generate Creator PDA
          const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("creator"), publicKey.toBuffer()],
            programInstance.programId
          );
          console.log("Creator PDA:", pda.toBase58());
          setCreatorPDA(pda);
        } catch (err) {
          console.error("Error initializing program:", err);
          setError("Failed to initialize program");
        }
      }
    };

    initializeProgram();
  }, [connected, wallet, publicKey, connection]);

  const handleNext = () => {
    const stageOrder: FormStage[] = [
      "wallet",
      "personal",
      "profile",
      "verification",
    ];
    const currentIndex = stageOrder.indexOf(stage);
    console.log("currentIndex", currentIndex);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      if (nextStage) {
        setStage(nextStage);
      }
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
      const prevStage = stageOrder[currentIndex - 1];
      if (prevStage) {
        setStage(prevStage);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("onSubmit called..");
    if (!connected || !publicKey || !program || !creatorPDA) {
      setError("Please connect your wallet first");
      return;
    }

    console.log("stage", stage);

    if (stage === "verification") {
      setIsLoading(true);
      setError(null);

      try {
        // Create creator account
        const tx = await program.methods
          .registerCreator(
            data.creatorName,
            data.email || null,
            data.bio || null
          )
          .accounts({
            creator: creatorPDA,
            authority: publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        console.log("Creator registration signature:", tx);

        // Verify the creation was successful
        const creatorAccount = await program.account.creator.fetch(creatorPDA);

        if (
          creatorAccount.name === data.creatorName &&
          creatorAccount.email === (data.email || null) &&
          creatorAccount.bio === (data.bio || null) &&
          creatorAccount.isActive === true
        ) {
          console.log("Creator account verified:", creatorAccount);
          alert(
            "Registration successful! Your creator account has been created."
          );
        } else {
          throw new Error("Creator account verification failed");
        }
      } catch (err: any) {
        console.error("Error registering creator:", err);
        setError(err.message || "Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };

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
          {connected && publicKey && (
            <div className="text-sm text-zinc-400 text-center">
              Connected: {publicKey.toBase58().slice(0, 8)}...
            </div>
          )}
        </div>
      ),
    },
    personal: {
      title: "Personal Information",
      fields: (
        <>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    icon={<User size={18} />}
                    placeholder="John"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    icon={<User size={18} />}
                    placeholder="Doe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    icon={<Mail size={18} />}
                    placeholder="john@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    profile: {
      title: "Creator Profile",
      fields: (
        <>
          <FormField
            control={form.control}
            name="creatorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creator Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    icon={<Briefcase size={18} />}
                    placeholder="Your creator name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    icon={<Briefcase size={18} />}
                    placeholder="e.g., Art, Music, Writing"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Optional)</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="flex w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    verification: {
      title: "Profile Picture",
      fields: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
              {form.watch("avatar") ? (
                <img
                  src={URL.createObjectURL(form.watch("avatar") as File)}
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
          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Picture (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("avatar")?.click()}
                  type="button"
                >
                  Choose File
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    },
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {stages[stage].fields}
              {error && (
                <p className="text-red-500 text-sm mt-2 px-2 py-1 bg-red-500/10 rounded">
                  {error}
                </p>
              )}
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
                    onClick={handleNext}
                    type="submit"
                    variant="animated"
                    className="ml-auto"
                    disabled={isLoading || (stage === "wallet" && !connected)}
                  >
                    {isLoading
                      ? "Loading..."
                      : stage === "verification"
                        ? "Complete"
                        : "Next"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
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
