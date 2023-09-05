import { combineReducers, Action, AnyAction, current } from "@reduxjs/toolkit";
import { Slice } from "./search/slice";
const appReducer = {
  [Slice.name]: Slice.reducer,
};

const appCombineReducer = combineReducers(appReducer);

// export type RootState = ReturnType<typeof rootReducer>;
const rootReducer = (state: typeof appReducer | undefined, action: Action) => {
  // if (resetStateAction.match(action)) {
  //   // for all keys defined in your persistConfig(s)
  //   AsyncStorage.removeItem('persist:root');
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

export default appCombineReducer;
