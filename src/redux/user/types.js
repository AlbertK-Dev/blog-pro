


//Login User (firebase auth)
export const LOGIN_REQUEST = 'user -> LOGIN ';
export const LOGIN_REQUEST_SUCCESS = 'user -> LOGIN.success';
export const LOGIN_REQUEST_FAILED = 'user -> LOGIN.failed';

//Logout user
export const LOGOUT_REQUEST = 'user -> LOGOUT';

//get user Info (firebase firestore)
// export const GET_USER_INFO_REQUEST = 'user  ->  GET_INFO';
// export const GET_USER_INFO_REQUEST_SUCCESS = 'user -> GET_INFO.success';
// export const GET_USER_INFO_REQUEST_FAILED = 'user -> GET_INFO.failed';

/** CREATE */

//create one post
export const CREATE_USER_POST_REQUEST = 'user -> posts -> CREATE_ONE';
export const CREATE_USER_POST_REQUEST_SUCCESS = 'user -> posts -> CREATE_ONE.success';
export const CREATE_USER_POST_REQUEST_FAILED = 'user -> posts -> CREATE_ONE.failed';

//create user
export const CREATE_USER_REQUEST = 'user -> CREATE';
export const CREATE_USER_REQUEST_SUCCESS = 'user -> CREATE.success';
export const CREATE_USER_REQUEST_FAILED = 'user -> CREATE.failed';



/**READ */
//get all user posts
export const GET_USER_POSTS_REQUEST = 'user -> posts -> GET_ALL';
export const GET_USER_POSTS_REQUEST_SUCCESS = 'user -> posts -> GET_ALL.success';
export const GET_USER_POSTS_REQUEST_FAILED = 'user -> posts -> GET_ALL.failed';


/**UPDATE */

//update posts
export const UPDATE_USER_POST_REQUEST = 'user -> posts -> UPDATE';
export const UPDATE_USER_POST_REQUEST_SUCCESS = 'user -> posts -> UPDATE.success';
export const UPDATE_USER_POST_REQUEST_FAILED = 'user -> posts -> UPDATE.failed';

//update user
export const UPDATE_USER_INFO_REQUEST = 'user -> infos -> UPDATE';
export const UPDATE_USER_INFO_REQUEST_SUCCESS = 'user -> infos -> UPDATE.success';
export const UPDATE_USER_INFO_REQUEST_FAILED = 'user -> infos -> UPDATE.failed';







/***DELETE */

//delete one post
export const DELETE_USER_POST_REQUEST = 'user -> posts -> DELETE_ONE';
export const DELETE_USER_POST_REQUEST_SUCCESS = 'user -> posts -> DELETE_ONE.success';
export const DELETE_USER_POST_REQUEST_FAILED = 'user -> posts -> DELETE_ONE.failed'

//delete all user posts
export const DELETE_USER_POSTS_REQUEST = 'user -> posts -> DELETE_ALL';
export const DELETE_USER_POSTS_REQUEST_SUCCESS = 'user -> posts -> DELETE_ALL.success';
export const DELETE_USER_POSTS_REQUEST_FAILED = 'user -> posts -> DELETE_ALL.failed'

//delete user
export const DELETE_USER_REQUEST = 'user -> DELETE';
export const DELETE_USER_REQUEST_SUCCESS = 'user -> DELETE.success';
export const DELETE_USER_REQUEST_FAILED = 'user -> DELETE.failed';

//reset all

export const PRELOAD = 'user -> getExistingPseudo'

export const RESET_ALL = 'user -> reset'