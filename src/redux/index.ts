import { AnyAction, configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import logger, { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

//
import rootReducer from "./rootReducer";
//
import rootSaga from "./rootSaga";

type ReducerType = ReturnType<typeof rootReducer>;
type ReducerNameEnum = keyof ReducerType;
const persistConfig: PersistConfig<ReducerType> = {
  key: "root",
  version: 1,
  // storage: AsyncStorage,
  storage,
  timeout: undefined,
  blacklist: [
    // these reducer have filtering dont need to save persist
    "application",
  ] as ReducerNameEnum[] as string[],
  // https://github.com/rt2zz/redux-persist#state-reconciler
  // https://blog.bam.tech/developer-news/redux-persist-how-it-works-and-how-to-change-the-structure-of-your-persisted-store
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer<ReducerType, AnyAction>(
  persistConfig,
  rootReducer
);

const sagaMiddleware = createSagaMiddleware();

const middlewareArray = new MiddlewareArray<any>().concat(
  // asyncDispatchMiddleware,
  // asyncFunctionMiddleware,
  sagaMiddleware
);

if (process.env.NODE_ENV === "development") {
  middlewareArray.push(logger);
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: middlewareArray,
});

sagaMiddleware.run(rootSaga);
export const persister = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
