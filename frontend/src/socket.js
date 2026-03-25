import { io } from "socket.io-client"

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://10.98.235.39:3000/';
export const socket = io(URL, {
  autoConnect: false
});


