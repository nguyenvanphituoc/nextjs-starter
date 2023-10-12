"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/Form/Input";
import Selection from "@/components/Form/Selection";
import Button from "@/components/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectOriginalData, updateData } from "@/redux/search/slice";
import { RedirectType } from "next/dist/client/components/redirect";
import { useCallback, useEffect, useRef, useState } from "react";
import FormObject from "./form-object";
import FormElement from "./form-element";
import FormTone from "./form-tone";
import FormVisualStyle from "./form-visual-style";
import {
  DataKey,
  FormInput,
  JSONModelType,
  RowDataType,
} from "@/redux/search/type";
import { getDisplayValue } from "./utils";
import { toSnakeCase } from "@/lib/common";
import Result from "./result";

function getScoreByKey(key: string) {
  //
  // tone
  // time_context
  // Shaping
  // composition
  // medium
  const snakeKey = toSnakeCase(key);
  const normalizeKey = snakeKey.toLowerCase().trim();
  switch (normalizeKey) {
    case "tone":
      return 1;
    case "time_context":
      return 0.5;
    case "shaping":
      return 0.5;
    case "composition":
      return 0.5;
    case "medium":
      return 0.5;
    default:
      return 0;
  }
}
// visual style step
function predictionMatch(data: Partial<FormInput>, rowData: RowDataType) {
  const prediction = Object.entries(data).reduce(
    (acc, [key, combination]) => {
      if (key === "visual_style" || !Array.isArray(combination)) {
        return acc;
      }

      let score = acc.score;
      if (combination.find((value) => value?.toLowerCase() === "all")) {
        score = score + 0.1;
      }

      if (!rowData[key as DataKey]) {
        return acc;
      }

      const values = rowData[key as DataKey]?.values;
      const selectedValues = combination.map((item) => item);

      const matchedCount = selectedValues.filter(
        (value) => values?.includes(value) && value?.toLowerCase() !== "all"
      )?.length;
      score = score + getScoreByKey(key) * matchedCount;

      return {
        ...acc,
        score: score,
      };
    },
    {
      score: 0,
    } as {
      score: number;
      graphic_style?: string;
    }
  );

  return prediction;
}

function compareFn(options: Partial<FormInput>) {
  return (currentRow: RowDataType, previousRow: RowDataType) => {
    const currentRowPrediction = predictionMatch(options, currentRow);
    const previousRowPrediction = predictionMatch(options, previousRow);

    // descending order
    return previousRowPrediction.score - currentRowPrediction.score;
  };
}
//
async function getData() {
  const res = await fetch("/api/element");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getVisualData() {
  const res = await fetch("/api/visual-style");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export enum DISPLAY_SEARCH_STEP {
  OBJECT = "object",
  ELEMENT = "element",
  TONE = "tone",
  VISUAL_STYLE = "visual-style",
  RESULT = "result",
}

export default function Form() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  //
  const visualOriginData = useAppSelector(selectOriginalData);

  const [models, setModels] = useState<JSONModelType | undefined>(undefined);
  const [displayStep, setDisplayStep] = useState<DISPLAY_SEARCH_STEP>(
    DISPLAY_SEARCH_STEP.OBJECT
  );

  const initialIndex = useRef(0).current;

  const getQueryObject = useCallback(
    (query: URLSearchParams): Partial<FormInput> => {
      // dispatch form action
      const data: Partial<FormInput> = {};

      const iterator = query.entries();
      let next = iterator.next();

      while (!next.done) {
        const [key, value] = next.value;
        const decodeKey = decodeURIComponent(key);
        const decodeValue = decodeURIComponent(value);
        //
        if (decodeKey.endsWith("[]")) {
          const newKey = decodeKey.replace("[]", "") as DataKey;
          if (!data[newKey]) {
            data[newKey] = [];
          }

          (data[newKey] as string[]).push(decodeValue);
        } else if (decodeKey === "entity") {
          // entity
          data["entity"] = decodeValue;
        }
        //
        next = iterator.next();
      }
      return data;
    },
    []
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormInput>({
    defaultValues: searchParams.toString()
      ? (getQueryObject(searchParams) as any)
      : {
          entity: "",
        },
  });

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (formData) => {
      const query = new URLSearchParams();
      Object.entries(formData).forEach(([key, item]) => {
        if (Array.isArray(item)) {
          item.forEach((i) => query.append(`${key}[]`, i?.trim() || ""));
        } else {
          // entity
          query.append(key, item?.trim() || "");
        }
      });
      // cast to string
      const search = query.toString();
      const newQuery = search ? `?${search}` : "";
      // replace since we don't want to build a history
      router.replace(`${pathname}${newQuery}`, {
        scroll: true,
      });
      //
      // setValue for visual style
      const suggestionTopFive = visualOriginData
        .toSorted(compareFn(formData))
        .slice(0, 5);

      const values = suggestionTopFive.map(
        (item) => item["visual_style"]?.values[0] ?? ""
      );
      setValue(
        "visual_style",
        values.filter(
          (value, index, arr) => arr.findIndex((v) => v === value) === index
        )
      );
      // search result
      setDisplayStep(DISPLAY_SEARCH_STEP.RESULT);
    },
    [pathname, router, setValue, visualOriginData]
  );

  useEffect(() => {
    getData().then((data: JSONModelType) => {
      setModels(data);
      // set form default values
      Object.entries(data).forEach(([key, item]) => {
        // default values update if need
        if (key === "visual_style") {
          return;
        }
        if (!getValues(key as DataKey)) {
          setValue(key as DataKey, [getDisplayValue(item[0])]);
        }
      });
    });

    getVisualData().then((data) => {
      dispatch(updateData(data));
    });
  }, [dispatch, getValues, setValue]);

  if (displayStep === DISPLAY_SEARCH_STEP.RESULT) {
    return (
      <Result
        formData={getValues()}
        onRequestEdit={() => {
          setDisplayStep(DISPLAY_SEARCH_STEP.OBJECT);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-3xl mx-auto">
        <FormObject control={control} />
        {models ? (
          <>
            <FormElement
              control={control}
              models={models}
              relativeField="entity"
            />
            <FormTone
              control={control}
              models={models}
              relativeField="entity"
              initialIndex={0}
            />
            <FormVisualStyle
              control={control}
              models={models}
              relativeField="tone"
              initialIndex={0}
            />
          </>
        ) : undefined}
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
