import { GET_ALL_AUTHORS, GET_POSTS_REQUEST, RESET_POSTS } from "./types";


export const getAllPostsProcess = () => ({
    type: GET_POSTS_REQUEST,
});
  
export const getAllAuthors = () => ({
  type: GET_ALL_AUTHORS,
});
  
  export const clearAllPostsProcess = () => ({
    type: RESET_POSTS,
  });
  