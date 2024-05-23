import { useRef } from "react";

function ChatWindow({ socket }) {
  const messageRef = useRef<HTMLInputElement>(null);
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
            borderRadius: "10px",
            border: "1px solid white",
            width: "100%",
          }}
        />
        <button onClick={sendMessage}> Send </button>
      </div>
    </>
  );
}

export default ChatWindow;
