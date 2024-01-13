const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseReviewSchema = new schema({
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("courseReview", courseReviewSchema);
