import {createSlice} from "@reduxjs/toolkit";

export const UploaderSlice = createSlice({
    name: 'uploader',
    initialState: {
        list: [],
    },
    reducers: {
        addFile: (state, action) => {
            var album = state.list.find(item => item.id === action.payload.albumId);
            if (album) {
                album.files.push(action.payload);
            } else {
                state.list.push({
                    id: action.payload.albumId,
                    name: action.payload.albumName,
                    files: [action.payload]
                });
            }
        },
        updateFileStatus: (state, action) => {
            var album = state.list.find(item => item.id === action.payload.albumId);
            if (album) {
                var file = album.files.find(item => item.userMediaId === action.payload.userMediaId);
                if (file) {
                    file.status = action.payload.status;
                    file.progress = action.payload.progress;
                }
            }
        },
        updateFileID: (state, action) => {
            var album = state.list.find(item => item.id === action.payload.albumId);
            if (album) {
                var file = album.files.find(item => item.userMediaId === action.payload.name);
                if (file) {
                    file.userMediaId = action.payload.userMediaId;
                }
            }
        },
        clear: (state) => {
            state.list = [];
        }
    }
})

export const {addFile, updateFileStatus, updateFileID, clear} = UploaderSlice.actions;

export default UploaderSlice.reducer;
