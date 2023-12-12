"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/Form/Input";
import Selection from "@/components/Form/Selection";
import Button from "@/components/Button";
import { useForm, SubmitHandler, Control } from "react-hook-form";
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

  const alreadySubmitted = useRef(false);
  const isFirstLoad = useRef(true);

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

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    //
    // setValue for visual style
    const suggestionTopFive = visualOriginData
      .toSorted(compareFn(formData))
      .slice(0, 5);

    const values = suggestionTopFive.map(
      (item) => item["visual_style"]?.values[0] ?? ""
    );
    console.log("visual style values", values);
    //
    setValue(
      "visual_style",
      values.filter(
        (value, index, arr) => arr.findIndex((v) => v === value) === index
      )
    );
    //

    // update display step
    if (alreadySubmitted.current) {
      // search result
      setDisplayStep(DISPLAY_SEARCH_STEP.RESULT);
      //
      alreadySubmitted.current = true;
    } else {
      switch (displayStep) {
        case DISPLAY_SEARCH_STEP.OBJECT:
          setDisplayStep(DISPLAY_SEARCH_STEP.ELEMENT);
          return;
        case DISPLAY_SEARCH_STEP.ELEMENT:
          setDisplayStep(DISPLAY_SEARCH_STEP.TONE);
          return;
        case DISPLAY_SEARCH_STEP.TONE:
          setDisplayStep(DISPLAY_SEARCH_STEP.VISUAL_STYLE);
          return;
        case DISPLAY_SEARCH_STEP.VISUAL_STYLE:
          // search result
          setDisplayStep(DISPLAY_SEARCH_STEP.RESULT);
          //
          alreadySubmitted.current = true;
          break;
        default:
          return;
      }
    }
    //
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
  };

  const getInitialData = useCallback(async () => {
    const models: JSONModelType = await getData();
    const visualData = await getVisualData();
    // set form default values
    isFirstLoad.current &&
      Object.entries(models).forEach(([key, item]) => {
        // default values update if need
        if (key === "visual_style") {
          return;
        }
        if (!getValues(key as DataKey)) {
          setValue(key as DataKey, [getDisplayValue(item[0])]);
        }

        isFirstLoad.current = false;
      });

    dispatch(updateData(visualData));
    setModels(models);
  }, [dispatch, setValue, getValues]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  useEffect(() => {
    if (isFirstLoad.current && searchParams.toString()) {
      const formData = getQueryObject(searchParams);
      // set form default values
      Object.entries(formData).forEach(([key, item]) => {
        setValue(key as DataKey, item);
      });
      // search result
      setDisplayStep(DISPLAY_SEARCH_STEP.RESULT);
      //
      alreadySubmitted.current = true;
      isFirstLoad.current = false;
    }
  }, [searchParams, getQueryObject, setValue]);

  const renderStep = useCallback(
    (control: Control<FormInput, any>, models?: JSONModelType) => {
      // guard
      if (!models && DISPLAY_SEARCH_STEP.OBJECT !== displayStep) return null;
      //
      switch (displayStep) {
        case DISPLAY_SEARCH_STEP.OBJECT:
          return <FormObject control={control} />;
        case DISPLAY_SEARCH_STEP.ELEMENT:
          return (
            <FormElement
              control={control}
              models={models!}
              relativeField="entity"
            />
          );
        case DISPLAY_SEARCH_STEP.TONE:
          return (
            <FormTone
              control={control}
              models={models!}
              relativeField="entity"
            />
          );
        case DISPLAY_SEARCH_STEP.VISUAL_STYLE:
          return (
            <FormVisualStyle
              control={control}
              models={models!}
              relativeField="tone"
            />
          );
        default:
          return null;
      }
    },
    [displayStep]
  );

  const displayFormTitle = useCallback(() => {
    switch (displayStep) {
      case DISPLAY_SEARCH_STEP.OBJECT:
      case DISPLAY_SEARCH_STEP.ELEMENT:
      case DISPLAY_SEARCH_STEP.TONE:
      case DISPLAY_SEARCH_STEP.VISUAL_STYLE:
        return "NEXT STEP";
    }
  }, [displayStep]);

  return displayStep === DISPLAY_SEARCH_STEP.RESULT ? (
    <Result
      formData={getValues()}
      onRequestEdit={(focus) => {
        switch (focus) {
          case "entity":
            setDisplayStep(DISPLAY_SEARCH_STEP.OBJECT);
            break;
          case "visual_style":
          case "composition":
          case "time_context":
          case "shaping":
          case "medium":
            setDisplayStep(DISPLAY_SEARCH_STEP.VISUAL_STYLE);
            break;
          case "element":
            setDisplayStep(DISPLAY_SEARCH_STEP.ELEMENT);
            break;
          case "tone":
            setDisplayStep(DISPLAY_SEARCH_STEP.TONE);
            break;
          default:
            break;
        }
      }}
    />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-3xl mx-auto">
        {renderStep(control, models)}
        <Button
          className="mb-10 dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]] inline-block w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          data-te-ripple-init
          data-te-ripple-color="light"
          type="submit"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">{displayFormTitle()}</span>
          </span>
        </Button>
      </div>
    </form>
  );
}
