import React, {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
} from "react";

import { cn } from "@/lib/common";
import { VariantProps, cva } from "class-variance-authority";
import Search from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import Eye from "@heroicons/react/24/outline/EyeIcon";
import EyeOff from "@heroicons/react/24/outline/EyeSlashIcon";
import Button from "../Button";

const inputVariants = cva("text-gray-900 text-sm rounded-lg", {
  variants: {
    variant: {
      default: "bg-gray-50 border border-gray-300",
      dark: "bg-neutral-dark-500 text-neutral",
      error:
        "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500",
    },
    size: {
      default: "h-10 px-3 py-2 text-sm w-full",
      search: "h-10 px-3 py-2 text-sm w-full",
    },
    iconPlace: {
      default: "",
      start: "pl-10",
      end: "pr-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    iconPlace: "default",
  },
});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size,
      variant,
      icon = size === "search" ? (
        <Search className="text-neutral-400" />
      ) : undefined,
      iconPlace = "start",
      step = "any",
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);

    const handleVisible = () => {
      setVisible(!visible);
    };

    const onWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      e.currentTarget.blur();
    };

    const preventCharacterWhenNumber = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (["e", "E"].includes(e.key)) e.preventDefault();
    };

    return (
      <div className="flex w-inherit relative">
        <input
          type={visible ? (type === "password" ? "text" : type) : type}
          className={cn(
            inputVariants({
              className,
              size,
              variant,
              ...(!!icon && { iconPlace }),
            }),
            {
              "pr-10": type === "password",
            }
          )}
          onWheel={onWheel}
          {...(type === "number" && {
            onKeyDown: preventCharacterWhenNumber,
          })}
          step={step}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <Button
            type="button"
            className="absolute right-[3px] top-[calc(50%-17px)]"
            variant="icon"
            size="icon"
            onClick={handleVisible}
          >
            {visible ? <EyeOff /> : <Eye />}
          </Button>
        )}
        {!!icon && (
          <div
            className={cn("absolute top-[calc(50%-17px)] p-2", {
              "right-[3px]": iconPlace === "end",
              "left-[3px]": iconPlace === "start",
            })}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
