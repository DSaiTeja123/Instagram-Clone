import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import router from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  "https://instagram-clone-blond-two.vercel.app",
  "http://instagram-clone-blond-two.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v2/user", router);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening to port ${PORT}`);
});
