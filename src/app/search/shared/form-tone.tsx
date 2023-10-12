"use client";
import FieldSet from "@/components/Form/FieldSet";
import { Control, useController } from "react-hook-form";
import { FormInput, JSONModelType } from "@/redux/search/type";
import Selection from "@/components/Form/Selection";
import { getDisplayValue } from "./utils";

export default function FieldSetComponent(props: {
  control: Control<FormInput>;
  models: JSONModelType;
  initialIndex: number;
  relativeField: keyof FormInput;
}) {
  const entity = useController({
    name: props.relativeField,
    control: props.control,
  });

  const tone = useController({
    name: "tone",
    control: props.control,
  });

  return (
    <FieldSet legend={`"${entity.field.value}" có tông màu như thế nào?`}>
      {props.models["tone"]?.length && (
        <Selection
          name="tone"
          control={props.control}
          list={props.models["tone"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={props.initialIndex}
          onChange={(selectedItem) => {
            tone.field.onChange([selectedItem.value]);
          }}
        />
      )}
    </FieldSet>
  );
}
