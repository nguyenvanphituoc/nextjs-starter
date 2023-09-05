import { takeLatest, select, put } from "redux-saga/effects";

import {
  submitFormAction,
  selectOriginalData,
  updateSearchResult,
} from "./slice";
import { RowDataType, FormDataType } from "./type";

function predictionMatch(data: FormDataType, rowData: RowDataType) {
  const prediction = Object.entries(data).reduce(
    (acc, [key, combination]) => {
      if (combination.find((item) => item.value === "All")) {
        return {
          ...acc,
          score: acc.score + 1,
        };
      }

      if (!rowData[key]) {
        return acc;
      }

      const { values } = rowData[key];
      const selectedValues = combination.map((item) => item.value);

      const matched = selectedValues.some((value) => values.includes(value));

      return {
        ...acc,
        score: matched ? acc.score + 1 : acc.score,
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

function compareFn(options: FormDataType) {
  return (currentRow: RowDataType, previousRow: RowDataType) => {
    const currentRowPrediction = predictionMatch(options, currentRow);
    const previousRowPrediction = predictionMatch(options, previousRow);

    // descending order
    return previousRowPrediction.score - currentRowPrediction.score;
  };
}

function* submitFormHandler(action: any) {
  if (submitFormAction.match(action)) {
    const originalData: RowDataType[] = yield select(selectOriginalData);
    const suggestion = originalData.toSorted(compareFn(action.payload));

    yield put(updateSearchResult(suggestion.slice(0, 5)));
  }
}

function* sagaHandler() {
  yield takeLatest(submitFormAction.type, submitFormHandler);
}

export default sagaHandler;
