import { useEffect, useRef, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { CHAT, INIT_CHAT } from "../Constants";
import OnlineUsers from "./OnlineUsers";

function App() {
  interface User {
    id: string;
    socket: WebSocket | null;
  }
  const messageRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const [user, setUser] = useState<User | null>(null);
  const [recieverId, setRecieverId] = useState<User | null>(null);
  const [allUserIds, setAllUserIds] = useState<String[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      handleMessage(event);
    };
  }, [socket]);

  const handleMessage = (event: MessageEvent<any>) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case INIT_CHAT:
        handleInitializeChat(message);
        break;
      case CHAT:
        handleChat(message);
        break;
      default:
        break;
    }
    console.log(message);
  };

  const handleChat = (message: any) => {
    console.log(message);
  };

  const handleInitializeChat = (message: any) => {
    if (!sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", message.id);
      setUser({ id: message.id, socket });
    } else {
      const id = sessionStorage.getItem("user") as string;
      setUser({ id, socket });
    }
    setAllUserIds(message.users);
    console.log("User Initialized", message.id);
  };

  const sendMessage = () => {
    if (socket && messageRef.current) {
      const message = messageRef.current.value;
      socket?.send(
        JSON.stringify({ id: recieverId, text: message, type: CHAT })
      );
    } else {
      console.log("error", socket);
      console.log("error", messageRef.current?.value);
    }
  };

  return (
    <>
      {!socket ? (
        <h1> Connecting...</h1>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              width: "30%",
              height: "100vh",
              borderRight: "1px solid black",
            }}
          >
            <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
              <h2 style={{ marginTop: "40px" }}> Online </h2>
              <OnlineUsers
                userIds={allUserIds}
                currentUser={user}
                setRecieverId={setRecieverId}
                recieverId={recieverId}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "50px",
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              ref={messageRef}
              style={{
                padding: "10px",
                marginRight: "10px",
                borderRadius: "10px",
                border: "1px solid white",
              }}
            />
            <button onClick={sendMessage}> Send </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
