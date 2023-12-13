require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const mongodb = require("./config/mongo");
const connectCloudinary = require("./config/cloudinary");
const verifyJWT = require("./middleware/verifyJWT");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  origin: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));

mongodb();
connectCloudinary();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 },
  })
);

app.use("/", authRoutes);

app.use(verifyJWT);

app.use("/user", userRoutes);
app.use("/teacher", teacherRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
