import { createSlice } from "@reduxjs/toolkit";

export type IMessage = {
    content: string;
    author?: string;
    timestamp: number;
}

interface ChatState {
    value: IMessage[];
}

const initialState: ChatState = {
    value: []
}

const chatSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const { content, author, timestamp } = action.payload;
            state.value.push({ content, author, timestamp });
        },
    }
})

export const { addMessage } = chatSlice.actions

export default chatSlice.reducer;