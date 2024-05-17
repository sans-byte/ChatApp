"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const constants_1 = require("./constants");
const generateId = () => Math.floor(Math.random() * 10000000).toString();
const wss = new ws_1.WebSocketServer({ port: 8080 });
const users = new Map();
wss.on('connection', function connection(ws) {
    ws.on('error', (err) => console.error(`WebSocket error: ${err}`));
    ws.on('message', function message(data) {
        try {
            const message = JSON.parse(data);
            handleMessage(ws, message);
        }
        catch (err) {
            console.error(`Failed to parse message: ${data}`, err);
        }
    });
});
function handleMessage(ws, message) {
    switch (message.type) {
        case constants_1.INIT_CHAT:
            handleInitChat(ws);
            break;
        case constants_1.CLOSE:
            handleClose(ws);
            break;
        case constants_1.CHAT:
            handleChat(ws, message);
            break;
        default:
            console.warn(`Unknown message type: ${message.type}`);
    }
}
function handleInitChat(ws) {
    const id = generateId();
    users.set(id, ws);
    console.log(`User connected. Total users: ${users.size}`);
    wss.clients.forEach((client) => {
        if (client.readyState == ws_1.WebSocket.OPEN)
            client.send(JSON.stringify({ id, type: constants_1.INIT_CHAT, users: Array.from(users.keys()) }));
    });
}
function handleClose(ws) {
    for (const [id, socket] of users.entries()) {
        if (socket === ws) {
            users.delete(id);
            console.log(`User disconnected. Total users: ${users.size}`);
            break;
        }
    }
}
function handleChat(ws, message) {
    const socket = users.get(message.id);
    socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify({ type: constants_1.CHAT, message: message.text }));
    console.log(message);
}
console.log('WebSocket server is running on ws://localhost:8080');
