require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectMongo = (req, res) => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch(() => {
      console.log("Error connecting to mongoDB");
    });
};

module.exports = connectMongo;
