"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { addAndPinFile } from "@/lib/ipfs";
import { Icons } from "@/components/ui/icons";
import { useProgram } from "@/hooks/usePatreonix";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/Input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import Button from "@repo/ui/components/ui/Button";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = {
  text: [".txt"],
  image: [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  video: [".mp4", ".webm"],
  audio: [".mp3", ".wav", ".ogg"],
} as const;

// Type definitions
type ContentType = keyof typeof ALLOWED_FILE_TYPES;

interface FileWithPreview extends File {
  preview?: string;
}

// Form schema with improved validation
const formSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters")
      .trim(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters")
      .trim(),
    content: z.string().optional(),
    contentType: z.enum(["text", "image", "video", "audio"] as const),
    file: z.custom<FileWithPreview>().optional(),
  })
  .superRefine((values, ctx) => {
    const { file, content, contentType } = values;
    if (!file && !content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either file or content is required",
      });
    }
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }
      const fileType = file.type.split("/")[1];
      const allowedTypes = ALLOWED_FILE_TYPES[contentType as ContentType];
      if (
        !allowedTypes.some((type) => file.name.toLowerCase().endsWith(type))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `File type must be one of: ${allowedTypes.join(", ")}`,
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

const contentTypeOptions = [
  { value: "text", label: "Text", icon: Icons.fileText },
  { value: "image", label: "Image", icon: Icons.image },
  { value: "video", label: "Video", icon: Icons.video },
  { value: "audio", label: "Audio", icon: Icons.audio },
] as const;

export function CreatePostForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { program } = useProgram();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      contentType: "text",
    },
    mode: "onChange",
  });

  const contentType = form.watch("contentType");

  // File preview handler
  const handleFileChange = useCallback(
    (file: File | undefined) => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      if (file) {
        const preview = URL.createObjectURL(file);
        setFilePreview(preview);
        form.setValue("file", Object.assign(file, { preview }));
      } else {
        setFilePreview(null);
        form.setValue("file", undefined);
      }
    },
    [filePreview, form]
  );

  // Cleanup file preview on unmount
  React.useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const onSubmit = async (values: FormValues) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!program) {
      toast.error("Program not connected");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating content...");

    try {
      let contentUrl = values.content || "";

      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);

        try {
          contentUrl = await addAndPinFile(formData);
        } catch (error) {
          throw new Error("Failed to upload file to IPFS");
        }
      }

      const tx = await program.createPost({
        creatorPublicKey: publicKey,
        title: values.title.trim(),
        description: values.description.trim(),
        contentUrl,
        contentType: values.contentType,
      });

      toast.success("Content created successfully!", { id: toastId });
      form.reset();
      setStep(1);
      setFilePreview(null);
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create content",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isFirstStepValid = await form.trigger([
      "title",
      "description",
      "contentType",
    ]);
    if (isFirstStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

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
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6">
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
                          className="bg-zinc-700 text-zinc-100 min-h-[100px]"
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
                        onValueChange={(value: ContentType) => {
                          field.onChange(value);
                          // Reset file when content type changes
                          handleFileChange(undefined);
                          form.setValue("content", "");
                        }}
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
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
                          <div className="space-y-4">
                            <Input
                              type="file"
                              accept={ALLOWED_FILE_TYPES[contentType].join(",")}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                handleFileChange(file);
                              }}
                              {...field}
                              className="bg-zinc-700 text-zinc-100"
                            />
                            {filePreview && contentType === "image" && (
                              <div className="mt-4">
                                <img
                                  src={filePreview}
                                  alt="Preview"
                                  className="max-w-full h-auto max-h-[200px] rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Accepted formats:{" "}
                          {ALLOWED_FILE_TYPES[contentType].join(", ")}
                          <br />
                          Max file size: 5MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="bg-zinc-700 text-zinc-100"
            >
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
