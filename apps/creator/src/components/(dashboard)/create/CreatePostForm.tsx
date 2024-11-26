"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { toast } from "sonner";
import Button from "@repo/ui/components/ui/Button";
import { Input } from "@repo/ui/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getCreatorPda } from "@/lib/anchor";
import { addAndPinFile } from "@/lib/ipfs";
import { Icons } from "@/components/ui/icons";
import * as anchor from "@coral-xyz/anchor";
import idl from "@repo/patreonix_programms/idl";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";
import { PlugIcon } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  contentType: z.enum(["text", "image", "video", "audio"]),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (file) {
        return file.size <= MAX_FILE_SIZE;
      }
      return true;
    }, `Max file size is 5MB.`),
});

const contentTypeOptions = [
  { value: "text", label: "Text", icon: Icons.fileText },
  { value: "image", label: "Image", icon: Icons.image },
  { value: "video", label: "Video", icon: Icons.video },
  { value: "audio", label: "Audio", icon: Icons.audio },
];

export function CreatePostForm() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { publicKey } = useWallet();
  const [program, setProgram] =
    useState<anchor.Program<PatreonixProgramms> | null>(null);

  const initializeProgram = useCallback(() => {
    if (!wallet) {
      console.log("Wallet not connected!");
      return;
    }
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "processed",
    });
    const program = new anchor.Program(idl as PatreonixProgramms, provider);
    setProgram(program);
  }, [wallet, connection]);

  useEffect(() => {
    initializeProgram();
  }, [initializeProgram]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      contentType: "text",
    },
  });

  const contentType = form.watch("contentType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!program) {
      toast.error("Program not initialized. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      let contentUrl = values.content;
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);
        contentUrl = await addAndPinFile(formData);
      }

      const contentTypeMap = {
        text: { text: {} },
        image: { image: {} },
        video: { video: {} },
        audio: { audio: {} },
      };

      const [contentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("content"), publicKey.toBuffer()],
        program.programId
      );

      const creatorPda = await getCreatorPda(publicKey);

      if (!creatorPda) {
        toast.error("Failed to get creator PDA. Please try again.");
        return;
      }

      const tx = await program.methods
        .createContent(
          values.title,
          values.description,
          contentUrl,
          contentTypeMap[values.contentType]
        )
        .accounts({
          // content: contentPda,
          creator: creatorPda,
          authority: publicKey,
          // systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);
      toast.success("Content created successfully!");
      form.reset();
      setStep(1);
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter content title"
                          {...field}
                          className="bg-zinc-700 text-zinc-100"
                        />
                      </FormControl>
                      <FormDescription>
                        Give your content a catchy title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter content description"
                          {...field}
                          className="bg-zinc-700 text-zinc-100"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a brief description of your content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-700 text-zinc-100">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-700 text-zinc-100">
                          {contentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <option.icon className="mr-2 h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of content you're creating
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                {contentType === "text" ? (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your content here..."
                            className="min-h-[200px] bg-zinc-700 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Upload {contentType}</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept={`.${contentType}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                            {...field}
                            className="bg-zinc-700 text-zinc-100"
                          />
                        </FormControl>
                        <FormDescription>Max file size: 5MB</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {step < 2 ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Content <Icons.check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
