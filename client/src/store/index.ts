import { configureStore } from '@reduxjs/toolkit'
import peerSlice from '@/reducers/peerSlice'

export default configureStore({
    reducer: {
        peer: peerSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})