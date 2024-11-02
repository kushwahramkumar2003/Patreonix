"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Switch } from "@repo/ui/components/ui/switch";
import { toast } from "sonner";
import Button from "@repo/ui/components/ui/Button";
import { Icons } from "../../ui/icons";
import { Input } from "@repo/ui/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
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
  isPublic: z.boolean(),
  scheduledDate: z.date().optional(),
  tiers: z.array(z.string()).min(1, "Select at least one tier"),
});

const contentTypeOptions = [
  { value: "text", label: "Text", icon: Icons.fileText },
  { value: "image", label: "Image", icon: Icons.image },
  { value: "video", label: "Video", icon: Icons.video },
  { value: "audio", label: "Audio", icon: Icons.audio },
];

export function CreatePostForm() {
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      contentType: "text",
      isPublic: true,
      tiers: [],
    },
  });

  const contentType = form.watch("contentType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Post created successfully!");
      console.log(values);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
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
                          placeholder="Enter post title"
                          {...field}
                          className="bg-zinc-700 text-zinc-100"
                        />
                      </FormControl>
                      <FormDescription>
                        Give your post a catchy title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-700 text-zinc-100">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-700 text-zinc-100">
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="announcement">
                            Announcement
                          </SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="behind-the-scenes">
                            Behind the Scenes
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a category for your post
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
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {contentTypeOptions.map((option) => (
                            <FormItem
                              key={option.value}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <option.icon className="w-4 h-4 mr-2 inline-block" />
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                {contentType === "text" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your post content here..."
                            className="min-h-[200px] bg-zinc-700 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can use markdown for formatting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {(contentType === "image" ||
                  contentType === "video" ||
                  contentType === "audio") && (
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
                <FormField
                  control={form.control}
                  name="tiers"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Tiers</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {["Free", "Basic", "Premium", "VIP"].map((tier) => (
                            <FormField
                              key={tier}
                              control={form.control}
                              name="tiers"
                              render={({ field }) => (
                                <FormItem
                                  key={tier}
                                  className="flex items-center space-x-1 space-y-0"
                                >
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value?.includes(tier)}
                                      onChange={(e) => {
                                        const updatedTiers = e.target.checked
                                          ? [...field.value, tier]
                                          : field.value?.filter(
                                              (t) => t !== tier
                                            );
                                        field.onChange(updatedTiers);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {tier}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select which tiers can access this post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-700">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Post</FormLabel>
                        <FormDescription>
                          Make this post visible to everyone, not just your
                          patrons
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Schedule Post (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Leave empty to publish immediately
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Create Post <Icons.check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
