"use client";

import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", error && "animate-shake", className)}
        {...props}
      />
    );
  }
);
FormControl.displayName = "FormControl";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-zinc-200",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export { FormControl, FormLabel, FormMessage };