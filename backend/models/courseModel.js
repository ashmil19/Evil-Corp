const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "category"
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  coverImage: {
    public_id: {
      type: String,
      required: function () {
        return this.url != null;
      },
    },
    url: {
      type: String,
      required: function () {
        return this.public_id != null;
      },
    },
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapter",
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("course", courseSchema);
