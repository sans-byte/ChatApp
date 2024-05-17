function OnlineUsers({ userIds, currentUser, setReciever }: any) {
  return (
    <>
      {userIds.map(
        (userId, index) =>
          userId != currentUser.id && (
            <div
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5px",
                cursor: "pointer",
              }}
              onClick={() => setReciever(userId)}
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
