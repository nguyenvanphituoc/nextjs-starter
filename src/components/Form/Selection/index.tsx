import Listbox, { ComponentProps as ListBoxProps } from "@/components/Listbox";
import {
  Control,
  UseControllerProps,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import { FormItem, FormItemProps } from "../Item";

interface ComponentProps<T extends FieldValues>
  extends ListBoxProps,
    Omit<FormItemProps, "error" | "children"> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: UseControllerProps<T>["rules"];
  label?: string;
  fullWidth?: boolean;
}

const FormInput = <T extends FieldValues>(props: ComponentProps<T>) => {
  const {
    name,
    control,
    label,
    rules,
    list,
    initialIndex,
    // container
    containerClass,
    fullWidth = true,
    required,
    ...componentProps
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
          <Listbox
            list={list}
            initialIndex={initialIndex}
            {...field}
            {...componentProps}
          />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
