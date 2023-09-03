import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/common";
// import { Loading } from 'assets/icons';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        active: "bg-primary text-white hover:bg-primary/90",
        "no-border": "bg-transparent text-neutral-dark",
        outline:
          "bg-neutral text-neutral-dark-500 hover:bg-blue-white border border-neutral-dark-500",
        "outline-place":
          "bg-neutral text-gray-place hover:bg-blue-white border border-gray-place",
        "outline-primary":
          "bg-neutral text-primary border border-primary hover:bg-primary hover:text-neutral",
        icon: "rounded-full bg-neutral text-neutral-dark-300 hover:bg-neutral-300",
      },
      size: {
        default: "h-10 py-2 px-4",
        pagin: "h-8 w-8",
        icon: "p-2",
        md: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-11 px-8",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(loading
          ? {
              disabled: true,
              children: (
                <div className="relative flex justify-center">
                  <div className="opacity-0">{children}</div>
                  <div className="absolute">
                    {/* {<Loading width='20' height='20' />} */}
                  </div>
                </div>
              ),
            }
          : { children })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
