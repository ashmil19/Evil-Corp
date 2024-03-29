const mongoose = require("mongoose");
const schema = mongoose.Schema;

const communitySchema = schema(
  {
    communityName: {
      type: String,
      required: true,
    },
    communityId: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("community", communitySchema);
