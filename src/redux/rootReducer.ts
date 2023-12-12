import { combineReducers, Action, AnyAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { Slice } from "./search/slice";
const appReducer = {
  [Slice.name]: Slice.reducer,
};

const appCombineReducer = combineReducers(appReducer);
type AppStateType = typeof appCombineReducer;
// export type RootState = ReturnType<typeof rootReducer>;
const rootReducer = (state: Parameters<AppStateType>["0"], action: Action) => {
  // if (resetStateAction.match(action)) {
  //   // for all keys defined in your persistConfig(s)
  //   storage.removeItem('persist:root');
  //   // storage.removeItem('persist:otherKey')

  //   return appCombineReducer(
  //     {
  //       [MetaSlice.name]:
  //         state?.[MetaSlice.name] ?? MetaSlice.getInitialState(),
  //     },
  //     action,
  //   );
  // }
  return appCombineReducer(state, action);
};

export default rootReducer;
