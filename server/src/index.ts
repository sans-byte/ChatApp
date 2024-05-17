import { WebSocketServer, WebSocket } from 'ws';
import { CHAT, CLOSE, INIT_CHAT } from './constants';

const generateId = () => Math.floor(Math.random() * 10000000).toString();

const wss = new WebSocketServer({ port: 8080 });

interface User {
  id: string;
  socket: WebSocket;
}

const users = new Map<string, WebSocket>();

wss.on('connection', function connection(ws: WebSocket) {
  ws.on('error', (err) => console.error(`WebSocket error: ${err}`));

  ws.on('message', function message(data: string) {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (err) {
      console.error(`Failed to parse message: ${data}`, err);
    }
  });
});

function handleMessage(ws: WebSocket, message: any) {
  switch (message.type) {
    case INIT_CHAT:
      handleInitChat(ws);
      break;
    case CLOSE:
      handleClose(ws);
      break;
    case CHAT:
      handleChat(ws, message);
      break;
    default:
      console.warn(`Unknown message type: ${message.type}`);
  }
}

function handleInitChat(ws: WebSocket) {
  const id = generateId();
  users.set(id, ws);
  console.log(`User connected. Total users: ${users.size}`);
  wss.clients.forEach((client)=>{
    if(client.readyState == WebSocket.OPEN)
    client.send(JSON.stringify({ id, type: INIT_CHAT, users: Array.from(users.keys()) }));
  })
}

function handleClose(ws: WebSocket) {
  for (const [id, socket] of users.entries()) {
    if (socket === ws) {
      users.delete(id);
      console.log(`User disconnected. Total users: ${users.size}`);
      break;
    }
  }
}

function handleChat(ws: WebSocket, message: any) {
  const socket = users.get(message.id);
  socket?.send(JSON.stringify({ type: CHAT, message:message.text }));
  console.log(message);
}

console.log('WebSocket server is running on ws://localhost:8080');
