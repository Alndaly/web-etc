import { createSlice } from "@reduxjs/toolkit";

export type IMessage = {
    content: string;
    timestamp: number;
    userId: string;
}

interface ChatState {
    value: IMessage[];
}

const initialState: ChatState = {
    value: []
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addHistory: (state, action) => {
            state.value = action.payload;
        },
        addMessage: (state, action) => {
            const { content, userId, timestamp } = action.payload;
            if (!state.value) {
                state.value = [];
            }
            state.value.push({ content, userId, timestamp });
        },
    }
})

export const { addMessage, addHistory } = chatSlice.actions

export default chatSlice.reducer;