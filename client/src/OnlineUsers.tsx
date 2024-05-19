import { Key, useState } from "react";

function OnlineUsers({ userIds, currentUser, recieverId, setRecieverId }: any) {
  return (
    <>
      {userIds.map(
        (userId: string, index: Key) =>
          userId != currentUser.id && (
            <div
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: recieverId == userId ? "grey" : "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                setRecieverId(userId);
              }}
              key={index}
            >
              <h3>User</h3>
            </div>
          )
      )}
    </>
  );
}

export default OnlineUsers;
