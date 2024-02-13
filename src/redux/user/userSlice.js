import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfos: {},
  userPosts: [],
  loginLoading:false,
  loginSuccess: false,
  registrationSuccess:false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfos: (state, action) => {
      return {
        ...state,
        userInfos: {
          ...state.userInfos,
          ...action.payload

        },
        
      };
    },
    
  },
});

export const uActions = userSlice.actions;

export default userSlice;
