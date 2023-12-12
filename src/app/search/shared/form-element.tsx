"use client";
import FieldSet from "@/components/Form/FieldSet";
import { Control, useController } from "react-hook-form";
import { FormInput, JSONModelType } from "@/redux/search/type";
import Selection from "@/components/Form/Selection";
import { useRef } from "react";
import { getDisplayValue } from "./utils";

export default function FieldSetComponent(props: {
  control: Control<FormInput>;
  models: JSONModelType;
  relativeField: keyof FormInput;
}) {
  const entity = useController({
    name: props.relativeField,
    control: props.control,
  });

  const element = useController({
    name: "element",
    control: props.control,
  });

  const foundIndex = props.models["element"]?.length
    ? props.models["element"].findIndex(
        (i) => getDisplayValue(i) === element.field.value?.[0]
      )
    : -1;

  return (
    <FieldSet
      legend={`"${entity.field.value}" là yếu tố gì trong thiết kế của bạn?`}
    >
      {props.models["element"]?.length && (
        <Selection
          name="element"
          control={props.control}
          list={props.models["element"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={foundIndex > -1 ? foundIndex : undefined}
          onChange={(selectedItem) => {
            element.field.onChange([selectedItem.value]);
          }}
        />
      )}
    </FieldSet>
  );
}
