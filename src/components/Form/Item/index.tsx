import { ReactNode } from "react";
import { cn } from "@/lib/common";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
  {
    variants: {
      variant: {
        default: "",
        error: "block mb-2 text-sm font-medium text-red-700 dark:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface FormItemProps {
  containerClass?: string;
  fullWidth?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
}

type FormItemOmit = Omit<FormItemProps, "error" | "children">;

const FormItem = (props: FormItemProps) => {
  const {
    containerClass,
    fullWidth = true,
    label,
    required,
    error,
    children,
  } = props;

  return (
    <div className={cn(containerClass, "mb-6 relative", fullWidth && "w-full")}>
      <div className="w-full flex flex-col">
        {label && (
          <p
            className={inputVariants({ variant: error ? "error" : "default" })}
          >
            {label}
            {required && <span className="text-red">*</span>}
          </p>
        )}
        {children}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};

export { FormItem, type FormItemOmit, type FormItemProps };
