import { combineReducers, Action, AnyAction, current } from "@reduxjs/toolkit";
import { Slice } from "./search/slice";
const appReducer = {
  [Slice.name]: Slice.reducer,
};

const appCombineReducer = combineReducers(appReducer);

export default appCombineReducer;
