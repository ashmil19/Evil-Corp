require("dotenv").config();
const express = require("express");
const { createServer } = require('node:http');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { Server } = require('socket.io');

const mongodb = require("./config/mongo");
const connectCloudinary = require("./config/cloudinary");
const verifyJWT = require("./middleware/verifyJWT");
const userMiddleware = require("./middleware/userMiddleware")
const adminMiddleware = require("./middleware/adminMiddleware")
const teacherMiddleware = require("./middleware/teacherMiddleware")
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const configureSocket = require("./config/socket")

const app = express();
const server = createServer(app)
const io = new Server(server,{
  transports: ["websocket", "polling"],
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  origin: true,
};

configureSocket(io);

app.use(cookieParser());
app.use(cors(corsOptions));

mongodb();
// connectS3Bucket();
connectCloudinary();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '100mb'}));
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
app.use("/chat", chatRoutes);

server.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
