import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, autoResize, ...props }, ref: any) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] h-fit resize-y overflow-y-visible w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          autoResize ? "resize-none" : "", // disabling manual resizing by the user
          className
        )}
        onChange={() => {
          const { clientHeight, scrollHeight } = ref.current;
          if (autoResize && ref && ref.current && scrollHeight > clientHeight) {
            ref.current.style.height = "auto";
            ref.current.style.height = `${ref.current.scrollHeight}px`;
          }
        }}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
