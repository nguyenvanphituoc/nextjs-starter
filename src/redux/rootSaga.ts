import { all } from "redux-saga/effects";

import applicationSaga from "./search/saga";

export default function* rootSaga() {
  // yield all([applicationSaga(), sessionSaga()]);
  yield all([applicationSaga()]);
}
