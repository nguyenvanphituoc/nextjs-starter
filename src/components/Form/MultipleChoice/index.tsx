import {
  Control,
  UseControllerProps,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import { FormItem, FormItemProps } from "../Item";
import MultipleChoice, {
  ComponentProps as MultipleChoiceProps,
} from "@/components/MultipleChoice";

interface ComponentProps<T extends FieldValues>
  extends MultipleChoiceProps,
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
          <MultipleChoice
            list={list}
            {...field}
            {...componentProps}
            ref={undefined}
          />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
