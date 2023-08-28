"use client";
import Head from "next/head";
import Input from "@/components/Input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  TextField: string;
}

export default function Page() {
  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      TextField: "default value",
    },
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => console.log(data);

  console.log(watch("TextField")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="TextField" control={control} rules={{ required: true }} />

        <input type="submit" />
      </form>
    </>
  );
}
