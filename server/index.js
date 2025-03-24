import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import router from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "https://instagram-clone-blond-two.vercel.app",
    "http://instagram-clone-blond-two.vercel.app"
  ],
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Serve API routes
app.use("/api/v2/user", router);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);

// ✅ Serve frontend (client) build files
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port ${PORT}`);
});