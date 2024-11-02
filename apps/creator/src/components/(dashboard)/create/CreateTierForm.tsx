"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@repo/ui/components/ui/Input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Switch } from "@repo/ui/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { toast } from "sonner";
import { Icons } from "../../ui/icons";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  benefits: z.array(z.string()).min(1, "You must provide at least 1 benefit"),
  maxMembers: z.number().optional(),
  isLimited: z.boolean(),
  currency: z.string(),
  billingCycle: z.enum(["monthly", "yearly"]),
});

export function CreateTierForm() {
  const [benefitCount, setBenefitCount] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 5,
      description: "",
      benefits: [""],
      isLimited: false,
      currency: "USD",
      billingCycle: "monthly",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Tier created successfully!");
      console.log(values);
      form.reset();
    } catch (error) {
      toast.error("Failed to create tier. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tier name"
                  {...field}
                  className="bg-zinc-700 text-zinc-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
            name="currency"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-700 text-zinc-100">
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Billing Cycle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-700 text-zinc-100">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your tier..."
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
          name="benefits"
          render={() => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              {Array.from({ length: benefitCount }).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`benefits.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`Benefit ${index + 1}`}
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
                onClick={() => setBenefitCount((prev) => prev + 1)}
                className="mt-2"
              >
                Add Benefit
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isLimited"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-700">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Limited Membership</FormLabel>
                <FormDescription>
                  Set a maximum number of members for this tier
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
        {form.watch("isLimited") && (
          <FormField
            control={form.control}
            name="maxMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Members</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className="bg-zinc-700 text-zinc-100"
                  />
                </FormControl>
                <FormDescription>
                  Set the maximum number of members for this tier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Create Tier</Button>
      </form>
    </Form>
  );
}
