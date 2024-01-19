const {
  sendMessage,
  sendCommunityMessage,
} = require("../controller/common/chatController");

const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("joinRoom", (conversationId) => {
      console.log("chat",conversationId);
      socket.join(conversationId);
    });

    socket.on("joinCommunity", (communityId) => {
      console.log("community",communityId);
      socket.join(communityId);
    });

    socket.on("sendMessage", async (data) => {
      console.log("sendm",data);
      socket.broadcast.to(data.conversationId).emit("receiveMessage", data);
      await sendMessage(data);
    });

    socket.on("communitySendMessage", async (data) => {
      console.log("comm",data);
      socket.broadcast
        .to(data.communityId)
        .emit("communityReceiveMessage", data);
      // write send message function for community
      await sendCommunityMessage(data);
    });

    socket.on("videoUploadSuccess", (data) => {
      console.log("video success", data.isVideoUploaded);
      socket.broadcast.emit("videoUpload", data);
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
