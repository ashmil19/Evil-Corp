const mongoose = require("mongoose");
const schema = mongoose.Schema;

const communityMessageSchema = schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    community: {
      type: mongoose.Types.ObjectId,
      ref: "community",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("communityMessage", communityMessageSchema);