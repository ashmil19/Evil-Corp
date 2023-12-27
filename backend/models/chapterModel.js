const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chapterSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  video: {
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
});

module.exports = mongoose.model("chapter", chapterSchema);
