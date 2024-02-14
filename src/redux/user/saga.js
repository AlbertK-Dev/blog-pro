import { put, takeLatest } from "redux-saga/effects";
import * as types from "./types";
import { uActions } from "./userSlice";


import { pSagaActions } from "../setup/allSagaActions";



function* login(userFormData) {
    console.log("Login user");
    
}

function* register(userFormData) {
    console.log("create user",userFormData);
    
}

function* createPost(formData) {
    
        console.log("create post");
    
    
}

function* disconnectUserProcess() {
   console.log('disconnecting ...')
}

function* getPosts(userId) {
    console.log("getting post");
    yield put(uActions.getUserPostsLoading());
}

function* updateInfos(newUsersInfos) {
    console.log("update user informations");
    yield put(uActions.updateUserInfoLoading());
}

function* updatePost(newPostData) {
    console.log("updating post");
    yield put(uActions.updateUserPostLoading());
}

function* deleteUser(userId) {
    console.log("deleting user");
    yield put(uActions.deleteUserLoading());
}

function* deleteUserPost(userId) {
    console.log("deleting user post");
    yield put(uActions.deleteUserPostLoading());
}

function* deleteAllUserPost(userId) {
    console.log("deleting all user post");
    yield put(uActions.deleteAllUserPostLoading());
}

export default function* userSaga() {
   // yield takeLatest(types.PRELOAD, getPreloadingData);
    yield takeLatest(types.LOGIN_REQUEST, login);
    yield takeLatest(types.CREATE_USER_REQUEST, register);
    yield takeLatest(types.CREATE_USER_POST_REQUEST, createPost);
    yield takeLatest(types.GET_USER_POSTS_REQUEST, getPosts);
    yield takeLatest(types.UPDATE_USER_INFO_REQUEST, updateInfos);
    yield takeLatest(types.UPDATE_USER_POST_REQUEST, updatePost);
    yield takeLatest(types.DELETE_USER_POST_REQUEST, deleteUserPost);
    yield takeLatest(types.DELETE_USER_REQUEST, deleteUser);
    yield takeLatest(types.DELETE_USER_POSTS_REQUEST, deleteAllUserPost);
    yield takeLatest(types.LOGOUT_REQUEST , disconnectUserProcess )
}
