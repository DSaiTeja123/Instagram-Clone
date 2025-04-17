import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { receiveMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/receive/:id", isAuthenticated, receiveMessage);

export default router;