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

const corsOptions = {
  origin: [
    "https://instagram-clone-blond-two.vercel.app",
    "http://instagram-clone-blond-two.vercel.app",
    "https://instagram-clone-eptf.onrender.com"
  ],
  credentials: true
};
app.use(cors(corsOptions));

app.use("/api/v2/user", router);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port ${PORT}`);
});