"use client";
import { useRouter } from "next/navigation";
import Input from "@/components/Form/Input";
import Selection from "@/components/Form/Selection";
import Button from "@/components/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "@/redux";
import { submitFormAction } from "@/redux/search/slice";
import { RedirectType } from "next/dist/client/components/redirect";

type JSONModelType = {
  [key in string]: Array<{
    value: string;
    label: string;
    note?: string;
  }>;
};

type FormKeys = keyof JSONModelType;
type Values = JSONModelType[FormKeys];
type FormInput = {
  [key in FormKeys]: {
    id: Values["0"]["label"];
    value: Values["0"]["value"];
  };
};

export default function Form({ models }: { models: JSONModelType }) {
  let initialIndex = 0;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: Object.entries(models).reduce((acc, [key, item]) => {
      acc[key] = {
        id: item[initialIndex].label,
        value: item[initialIndex].value,
      };
      return acc;
    }, {} as FormInput),
  });

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    dispatch(
      submitFormAction(
        Object.entries(formData).reduce((acc, [key, item]) => {
          acc[key] = [item];
          return acc;
        }, {} as Parameters<typeof submitFormAction>["0"])
      )
    );

    router.push("/search/suggestion");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="block mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
        {Object.entries(models).map(([label, data]) => {
          // ignore the visual-style model
          if (label === "visual_style") return null;
          return (
            <Selection
              key={label}
              label={label.toUpperCase()}
              name={label}
              control={control}
              list={data.map((item) => ({
                id: item.label,
                value: item.value,
              }))}
              initialIndex={initialIndex}
            />
          );
        })}
        <Button
          className="dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]] inline-block w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          data-te-ripple-init
          data-te-ripple-color="light"
          type="submit"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">Submit</span>
          </span>
        </Button>
      </div>
    </form>
  );
}
