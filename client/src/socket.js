import { io } from "socket.io-client";

// setting URL to undefined causes socket.io to autodetect the WebSocket server
// endpoint based on the URL it's being served from
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

export const socket = io(URL);