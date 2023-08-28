import * as React from "react";
import {
  useForm,
  useController,
  UseControllerProps,
  Controller,
} from "react-hook-form";

function Input(props: UseControllerProps<any>) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field, fieldState }) => (
          <input {...field} placeholder={props.name} />
        )}
      />
      {/* <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p> */}
    </div>
  );
}

export default Input;
