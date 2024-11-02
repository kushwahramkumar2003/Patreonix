"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@repo/ui/components/ui/Input";
import Button from "@repo/ui/components/ui/Button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { Icons } from "../../ui/icons";

const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string()).min(2, "You must provide at least 2 options"),
  multipleChoice: z.boolean(),
  allowCustomOptions: z.boolean(),
  endDate: z.date(),
  visibleTo: z.array(z.string()).min(1, "Select at least one tier"),
});

export function CreatePollForm() {
  const [optionCount, setOptionCount] = useState(2);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      options: ["", ""],
      multipleChoice: false,
      allowCustomOptions: false,
      visibleTo: ["Free"],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Poll created successfully!");
      console.log(values);
      form.reset();
    } catch (error) {
      toast.error("Failed to create poll. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your poll question"
                  {...field}
                  className="bg-zinc-700 text-zinc-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="options"
          render={() => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              {Array.from({ length: optionCount }).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          {...field}
                          className="bg-zinc-700 text-zinc-100 mb-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOptionCount((prev) => prev + 1)}
                className="mt-2"
              >
                Add Option
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="multipleChoice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-700">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Multiple Choice</FormLabel>
                <FormDescription>
                  Allow users to select multiple options
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
          name="allowCustomOptions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-700">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Allow Custom Options
                </FormLabel>
                <FormDescription>
                  Let users add their own options to the poll
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
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Poll End Date</FormLabel>
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
              <FormDescription>Select when the poll should end</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibleTo"
          render={() => (
            <FormItem>
              <FormLabel>Visible To</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {["Free", "Basic", "Premium", "VIP"].map((tier) => (
                    <FormField
                      key={tier}
                      control={form.control}
                      name="visibleTo"
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
                                  : field.value?.filter((t) => t !== tier);
                                field.onChange(updatedTiers);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{tier}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Select which tiers can see and participate in this poll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Poll</Button>
      </form>
    </Form>
  );
}
