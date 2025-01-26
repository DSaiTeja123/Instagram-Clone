import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  createPost,
  fetchAllPosts,
  fetchPostsByUser,
  likePost,
  dislikePost,
  createComment,
  fetchCommentsByPost,
  deleteComment,
  deletePost,
  addPostToBookmarks,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost", isAuthenticated, upload.single("image"), createPost);
router.get("/fetchAllPosts", isAuthenticated, fetchAllPosts);
router.get("/user/all", isAuthenticated, fetchPostsByUser);

router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.get("/:id/bookmark", isAuthenticated, addPostToBookmarks);

router.post("/:id/comment", isAuthenticated, createComment);
router.post("/:id/comment/all", isAuthenticated, fetchCommentsByPost);
router.delete("/:id/comment/:commentId", isAuthenticated, deleteComment);

router.delete("/delete/:id", isAuthenticated, deletePost);

export default router;