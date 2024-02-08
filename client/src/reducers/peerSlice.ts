import { createSlice } from '@reduxjs/toolkit'

export type Peer = Record<
    string,
    { stream?: MediaStream; userName?: string; peerId: string }
>

interface PeerState {
    value: Peer[]
}

const initialState: PeerState = {
    value: []
}

const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        addPeer: (state, action) => {
            const { peerId, stream } = action.payload;
            state.value.push({ peerId, stream });
        },
        removePeer: (state, action) => {
            const { peerId } = action.payload;
            state.value = state.value.filter((peer) => peer.peerId !== peerId);
        },
    }
})

export const { addPeer, removePeer } = peerSlice.actions

export default peerSlice.reducer;