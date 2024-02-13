import {
  CREATE_USER_POST_REQUEST,
  CREATE_USER_REQUEST,
  DELETE_USER_POSTS_REQUEST,
  DELETE_USER_POST_REQUEST,
  DELETE_USER_REQUEST,
  GET_USER_POSTS_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_POST_REQUEST,
} from "./types";

export const loginProcess = (payload) => ({
  type: LOGIN_REQUEST,
  payload,
});

export const registrationProcess = (payload) => ({
  type: CREATE_USER_REQUEST,
  payload,
});
export const postCreationProcess = (payload) => ({
  type: CREATE_USER_POST_REQUEST,
  payload,
});

export const userPostsGettingProcess = (payload) => ({
  type: GET_USER_POSTS_REQUEST,
  payload,
});

export const userUpdateProcess = (payload) => ({
  type: UPDATE_USER_INFO_REQUEST,
  payload,
});

export const postUpdateProcess = (payload) => ({
  type: UPDATE_USER_POST_REQUEST,
  payload,
});

export const postDeleteProcess = (payload) => ({
  type: DELETE_USER_POST_REQUEST,
  payload,
});

export const userDeleteProcess = (payload) => ({
  type: DELETE_USER_REQUEST,
  payload,
});

export const allPostsDeleteProcess = (payload) => ({
  type: DELETE_USER_POSTS_REQUEST,
  payload,
});

export const disconnect = () => ({
  type: LOGOUT_REQUEST
})

// export const preloadingData = () => ({
//   type: PRELOAD,

// })
