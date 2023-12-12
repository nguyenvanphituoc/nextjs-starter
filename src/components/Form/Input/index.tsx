import Input, { InputProps } from "@/components/Input";
import {
  Control,
  UseControllerProps,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import { FormItem, FormItemProps } from "../Item";

interface FormInputProps<T extends FieldValues>
  extends InputProps,
    Omit<FormItemProps, "error" | "children"> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: UseControllerProps<T>["rules"];
  onExtraChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  fullWidth?: boolean;
}

const FormInput = <T extends FieldValues>(props: FormInputProps<T>) => {
  const {
    name,
    control,
    label,
    rules,
    onExtraChange,

    // container
    containerClass,
    fullWidth = true,
    required,
    ...inputProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormItem
          label={label}
          containerClass={containerClass}
          required={required}
          error={error?.message}
          fullWidth={fullWidth}
        >
          <Input
            {...field}
            {...inputProps}
            onChange={(e) => {
              field.onChange(e);
              onExtraChange?.(e);
            }}
            {...(error?.message && { variant: "error" })}
          />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
