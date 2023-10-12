import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
// Define a type for the slice state
import { RowDataType, SliceState } from "./type";

// Define the initial state using that type
const initialState = {
  formVisualStyle: [],
  visualStyleComposition: [],
} as SliceState;

export const Slice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updateSearchResult: (
      state: SliceState,
      { payload }: PayloadAction<RowDataType[]>
    ) => {
      state.formVisualStyle = payload;
    },
    updateData: (state, { payload }: PayloadAction<RowDataType[]>) => {
      state.visualStyleComposition = payload;
    },
  },
});
// Action
export const { updateData, updateSearchResult } = Slice.actions;
// selectors
export const selectOriginalData = (state: RootState) =>
  state.application.visualStyleComposition;
export const selectSearchResult = (state: RootState) =>
  state.application.formVisualStyle;
//
export default Slice.reducer;
