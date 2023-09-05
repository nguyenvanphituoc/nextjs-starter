import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
// Define a type for the slice state
import { RowDataType, FormDataType } from "./type";

interface SliceState {
  searchResult: RowDataType[];
  originalData: RowDataType[];
}

// Define the initial state using that type
const initialState = {
  searchResult: [],
  originalData: [],
} as SliceState;

export const Slice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updateSearchResult: (
      state: SliceState,
      { payload }: PayloadAction<RowDataType[]>
    ) => {
      state.searchResult = payload;
    },
    updateData: (state, { payload }: PayloadAction<RowDataType[]>) => {
      state.originalData = payload;
    },
  },
});
// Action
export const { updateData, updateSearchResult } = Slice.actions;
export const submitFormAction = createAction<FormDataType>(
  "application/submitFormAction"
);
// selectors
export const selectOriginalData = (state: RootState) =>
  state.application.originalData;
export const selectSearchResult = (state: RootState) =>
  state.application.searchResult;
//
export default Slice.reducer;
