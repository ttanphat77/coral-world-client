import {configureStore} from "@reduxjs/toolkit";
import uploaderReducer from "./uploaderSlice";

export default configureStore({
    reducer: {
        uploader: uploaderReducer
    },
});
