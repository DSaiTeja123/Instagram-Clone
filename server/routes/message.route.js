import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { receiveMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/https://instagram-clone-eptf.onrender.com/send/:id", isAuthenticated, sendMessage);
router.get("/https://instagram-clone-eptf.onrender.com/receive/:id", isAuthenticated, receiveMessage);

export default router;