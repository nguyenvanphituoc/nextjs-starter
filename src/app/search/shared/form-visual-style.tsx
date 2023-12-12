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

  const foundTCIndex = props.models["time_context"]?.length
    ? props.models["time_context"]?.findIndex(
        (i) => getDisplayValue(i) === timeContext.field.value?.[0]
      )
    : -1;

  const foundSIndex = props.models["shaping"]?.length
    ? props.models["shaping"]?.findIndex(
        (i) => getDisplayValue(i) === shaping.field.value?.[0]
      )
    : -1;

  const foundMIndex = props.models["medium"]?.length
    ? props.models["medium"]?.findIndex(
        (i) => getDisplayValue(i) === medium.field.value?.[0]
      )
    : -1;

  const toneTitle =
    entity.field.value?.[0] === "All"
      ? "Tông màu"
      : `Tông màu "${entity.field.value}"`;

  return (
    <FieldSet legend={`${toneTitle} sẽ có phong cách theo mô tả như sau: `}>
      {props.models["time_context"]?.length && (
        <Selection
          name="time_context"
          label="Bối cảnh thời gian"
          control={props.control}
          list={props.models["time_context"].map((item) => ({
            id: item.label,
            value: getDisplayValue(item),
          }))}
          initialIndex={foundTCIndex > -1 ? foundTCIndex : undefined}
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
          initialIndex={foundSIndex > -1 ? foundSIndex : undefined}
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
          initialIndex={foundMIndex > -1 ? foundMIndex : undefined}
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
