import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    allPosts: [],
    gettingPosts: false,
    currentAddPostData: {
        othersImagesFiles: [],
        tags:[],
    },
    allAuthors:[]
}



export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        clearAll: (state) => {
            return {
                ...initialState,
                
            }
        },
        updateCurrentAddPostData: (state, action) => {
            return {
                ...state,
                currentAddPostData: { ...state.currentAddPostData, ...action.payload}
            }
        },
        resetCurrentAddPostData: (state) => {
            return {
                ...state,
                currentAddPostData: {
                    othersImagesFiles: [],
                    content: '',
                    title: '',
                    postImgfile: null,
                    otherImageTemp: null,
                    otherImageTempLegend: '',
                    tags: [],
                    currentTag:'',

                }
            }
        },
        updateAllPost: (state, action) => {
            return {
                ...state,
                allPosts: action.payload
            }
        },
        updateAllAuthors: (state, action) => {
            return {
                ...state,
                allAuthors: action.payload
            }
        }
    }

});

export const pActions = postsSlice.actions
export default postsSlice;

