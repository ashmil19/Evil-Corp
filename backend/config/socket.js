const { sendMessage } = require("../controller/common/chatController");

const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", async (data) => {
      console.log(data);
      socket.broadcast.to(data.conversationId).emit("receiveMessage", data);
      await sendMessage(data);
    });


    socket.on("videoUploadSuccess",(data)=>{
      console.log("video success",data.isVideoUploaded)
      socket.broadcast.emit("videoUpload", data)
    })

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id)
    });

    socket.on("error", (error) => {
      console.log("socket error", error);
    });
  });
};

module.exports = configureSocket;
