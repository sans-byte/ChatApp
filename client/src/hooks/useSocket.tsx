import { useEffect, useState } from "react";
import { CLOSE, INIT_CHAT } from "../../Constants";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const createConnection = () => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected");
      setSocket(ws);
      ws.send(JSON.stringify({ type: INIT_CHAT }));
    };

    ws.onclose = () => {
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  };

  useEffect(() => {
    const ws = createConnection();

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: CLOSE }));
      }
      ws.close();
    };
  }, []);

  return socket;
};
