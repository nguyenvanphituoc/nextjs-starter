"use client";
import FieldSet from "@/components/Form/FieldSet";
import { Control, useController } from "react-hook-form";
import { FormInput, JSONModelType } from "@/redux/search/type";
import Selection from "@/components/Form/Selection";
import MultipleChoice from "@/components/Form/MultipleChoice";
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

  const timeContext = useController({
    name: "time_context",
    control: props.control,
  });

  const shaping = useController({
    name: "shaping",
    control: props.control,
  });

  const composition = useController({
    name: "composition",
    control: props.control,
  });

  const medium = useController({
    name: "medium",
    control: props.control,
  });

  const compositionList = props.models["composition"]?.length
    ? props.models["composition"].map((item) => ({
        id: item.label,
        value: getDisplayValue(item),
      }))
    : [];

  return (
    <FieldSet
      legend={`"${entity.field.value}" sẽ có phong cách theo mô tả như sau: `}
    >
      {props.models["time_context"]?.length && (
        <Selection
          name="time_context"
          label="Bối cảnh thời gian"
          control={props.control}
          list={props.models["time_context"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={props.initialIndex}
          onChange={(selectedItem) => {
            timeContext.field.onChange([selectedItem.value]);
          }}
        />
      )}
      {props.models["shaping"]?.length && (
        <Selection
          name="shaping"
          label="Cách dựng hình"
          control={props.control}
          list={props.models["shaping"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={props.initialIndex}
          onChange={(selectedItem) => {
            shaping.field.onChange([selectedItem.value]);
          }}
        />
      )}
      {props.models["medium"]?.length && (
        <Selection
          name="medium"
          label="Chất liệu dựng hình"
          control={props.control}
          list={props.models["medium"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={props.initialIndex}
          onChange={(selectedItem) => {
            medium.field.onChange([selectedItem.value]);
          }}
        />
      )}

      {props.models["composition"]?.length && (
        <MultipleChoice
          label="Bố cục"
          list={props.models["composition"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          defaultValues={compositionList.filter(
            (i) =>
              Array.isArray(composition.field.value) &&
              composition.field.value.includes(i.value)
          )}
          control={props.control}
          name="composition"
          onChange={(selectedItems) => {
            composition.field.onChange(selectedItems.map((i) => i.value));
          }}
        />
      )}
    </FieldSet>
  );
}
