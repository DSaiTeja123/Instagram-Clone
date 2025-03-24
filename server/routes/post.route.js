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

router.post("/https://instagram-clone-eptf.onrender.com/createPost", isAuthenticated, upload.single("image"), createPost);
router.get("/https://instagram-clone-eptf.onrender.com/fetchAllPosts", isAuthenticated, fetchAllPosts);
router.get("/https://instagram-clone-eptf.onrender.com/user/all", isAuthenticated, fetchPostsByUser);

router.get("/https://instagram-clone-eptf.onrender.com/:id/like", isAuthenticated, likePost);
router.get("/https://instagram-clone-eptf.onrender.com/:id/dislike", isAuthenticated, dislikePost);
router.get("/https://instagram-clone-eptf.onrender.com/:id/bookmark", isAuthenticated, addPostToBookmarks);

router.post("/https://instagram-clone-eptf.onrender.com/:id/comment", isAuthenticated, createComment);
router.post("/https://instagram-clone-eptf.onrender.com/:id/comment/all", isAuthenticated, fetchCommentsByPost);
router.delete("/https://instagram-clone-eptf.onrender.com/:id/comment/:commentId", isAuthenticated, deleteComment);

router.delete("/https://instagram-clone-eptf.onrender.com/delete/:id", isAuthenticated, deletePost);

export default router;