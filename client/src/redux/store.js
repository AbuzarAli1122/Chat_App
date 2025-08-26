import {configureStore} from '@reduxjs/toolkit'
import authSlice from './reducers/auth';
import api from './api/api';
import miscSlice from './reducers/misc';
import chatReducer from './reducers/chat';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        chat: chatReducer,
        [api.reducerPath]: api.reducer,

    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(),
        api.middleware
    ],
})

export default store;