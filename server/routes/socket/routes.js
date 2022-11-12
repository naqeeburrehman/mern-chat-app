module.exports = (socket) => {
    console.log('gahasf')
    socket.on("send-message", (data) => {
        socket.broadcast.emit("message-from-server", data);
        console.log("message recived ", data);
    });
    socket.on("typing-start", () => {
        socket.broadcast.emit("typing-start-from-server");
        console.log("Someone is typing");
    });
    socket.on("typing-stop", () => {
        socket.broadcast.emit("typing-stop-from-server");
        console.log("Someone is typing");
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
};
