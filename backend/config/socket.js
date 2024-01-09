const { sendMessage } = require("../controller/common/chatController");

const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", (data) => {
      console.log(data);
      socket.broadcast.to(data.conversationId).emit("receiveMessage", data);
      sendMessage(data);
    });

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
    });

    socket.on("error", (error) => {
      console.log("socket error", error);
    });
  });
};

module.exports = configureSocket;
