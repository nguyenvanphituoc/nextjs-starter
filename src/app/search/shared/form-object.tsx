"use client";
import FieldSet from "@/components/Form/FieldSet";
import { Control } from "react-hook-form";
import { FormInput, JSONModelType } from "@/redux/search/type";
import Input from "@/components/Form/Input";

export default function FieldSetComponent(props: {
  control: Control<FormInput>;
}) {
  return (
    <FieldSet legend="Đối tượng bạn muốn thể hiện">
      <Input
        control={props.control}
        name="entity"
        placeholder="VD: con mèo, văn phòng, xe ô tô, ..."
        rules={{
          required: "This is required",
          maxLength: {
            value: 20,
            message: "Max length is 20",
          },
        }}
      />
    </FieldSet>
  );
}
