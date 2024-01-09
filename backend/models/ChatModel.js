const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chatSchema = new schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("chat", chatSchema);