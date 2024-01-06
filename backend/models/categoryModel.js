const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
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

module.exports = mongoose.model("category", categorySchema);
