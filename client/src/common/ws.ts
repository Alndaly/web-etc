import socketIOClient from "socket.io-client";

const wsUrl = "http://localhost:3000";

export const ws = socketIOClient(wsUrl);
