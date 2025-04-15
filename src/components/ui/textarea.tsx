import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-secondary-1 placeholder:text-muted-foreground  aria-invalid:ring-destructive/20  aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 max-h-20 w-full rounded-lg border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
