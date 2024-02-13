import postsSlice from "../posts/postsSlice";
import userSlice from "../user/userSlice";




const rootReducer = {
    posts: postsSlice.reducer,
    user: userSlice.reducer,
};

export default rootReducer