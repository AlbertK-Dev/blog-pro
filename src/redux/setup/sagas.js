import { all } from "redux-saga/effects";
import postsSaga from "../posts/saga";
import userSaga from "../user/saga";



export function* sagas() {
    yield all([
        postsSaga(),
        userSaga()
    ])
}