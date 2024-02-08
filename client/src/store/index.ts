import { configureStore } from '@reduxjs/toolkit'
import peerSlice from '@/reducers/peerSlice'
import chatSlice from '@/reducers/chatSlice'

export default configureStore({
    reducer: {
        peer: peerSlice,
        chat: chatSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})