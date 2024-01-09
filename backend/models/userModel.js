const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isAccess: {
    type: Boolean,
    default: true,
  },
  profileImage: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  role: {
    type: Number,
    default: 2000,
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema);
