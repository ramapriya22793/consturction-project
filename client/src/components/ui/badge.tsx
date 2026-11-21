import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-blue-200/80 bg-blue-50/90 text-blue-700 shadow-xs",
        secondary: "border-slate-200 bg-slate-100 text-slate-700",
        destructive: "border-rose-200 bg-rose-50 text-rose-700 shadow-xs",
        outline: "text-slate-700 border-slate-200 bg-white shadow-xs",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs",
        warning: "border-amber-200 bg-amber-50 text-amber-700 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
