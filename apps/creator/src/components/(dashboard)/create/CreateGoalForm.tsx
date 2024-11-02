"use client";

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
import { toast } from "sonner";
import { Icons } from "../../ui/icons";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["financial", "patron", "project"]),
  target: z.number().min(1, "Target must be at least 1"),
  deadline: z.date().optional(),
  isPublic: z.boolean(),
  milestones: z
    .array(
      z.object({
        description: z.string(),
        value: z.number(),
      })
    )
    .optional(),
});

export function CreateGoalForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "financial",
      target: 1000,
      isPublic: true,
      milestones: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Goal created successfully!");
      console.log(values);
      form.reset();
    } catch (error) {
      toast.error("Failed to create goal. Please try again.");
    }
  };

  const addMilestone = () => {
    const currentMilestones = form.getValues("milestones") || [];
    form.setValue("milestones", [
      ...currentMilestones,
      { description: "", value: 0 },
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter goal title"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your goal..."
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-700 text-zinc-100">
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="patron">Patron Count</SelectItem>
                  <SelectItem value="project">Project Milestone</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  className="bg-zinc-700 text-zinc-100"
                />
              </FormControl>
              <FormDescription>
                {form.watch("type") === "financial" && "Target amount in USD"}
                {form.watch("type") === "patron" && "Target number of patrons"}
                {form.watch("type") === "project" &&
                  "Target percentage completion"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline (Optional)</FormLabel>
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
              <FormDescription>Leave empty for an ongoing goal</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-700">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Goal</FormLabel>
                <FormDescription>
                  Make this goal visible to everyone, not just your patrons
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
          name="milestones"
          render={() => (
            <FormItem>
              <FormLabel>Milestones (Optional)</FormLabel>
              {form.watch("milestones")?.map((_, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Milestone description"
                            {...field}
                            className="bg-zinc-700 text-zinc-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Value"
                            {...field}
                            className="bg-zinc-700 text-zinc-100 w-24"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                className="mt-2"
              >
                Add Milestone
              </Button>
              <FormDescription>
                Add milestones to track progress towards your goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Goal</Button>
      </form>
    </Form>
  );
}
