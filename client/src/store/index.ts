import { configureStore } from '@reduxjs/toolkit'
import chatSlice from '@/reducers/chatSlice'

export default configureStore({
    reducer: {
        chat: chatSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})