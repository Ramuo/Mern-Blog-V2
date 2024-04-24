import {configureStore} from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import AutSliceReducer from './slices/authSlice';
import ThemeSliceReducer from "./slices/themeSlice"


const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: AutSliceReducer,
        theme: ThemeSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store; 