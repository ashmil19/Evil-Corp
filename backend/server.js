require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const mongodb = require("./config/mongo");
const connectCloudinary = require("./config/cloudinary");
// const connectS3Bucket = require("./config/s3Bucket");
const verifyJWT = require("./middleware/verifyJWT");
const userMiddleware = require("./middleware/userMiddleware")
const adminMiddleware = require("./middleware/adminMiddleware")
const teacherMiddleware = require("./middleware/teacherMiddleware")
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
// connectS3Bucket();
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

app.use("/user", userMiddleware, userRoutes);
app.use("/teacher", teacherMiddleware, teacherRoutes);
app.use("/admin", adminMiddleware, adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
