import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 100 })
      .toBuffer();

    const fileUrl = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUrl);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log("Error while creating post:", error);
  }
};

export const fetchAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error occurred while retrieving all posts:", error);
    return res.status(500).json({
      message:
        "An error occurred while retrieving posts. Please try again later.",
      success: false,
    });
  }
};

export const fetchPostsByUser = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error occurred while retrieving user posts:", error);
    return res.status(500).json({
      message: "Failed to retrieve posts. Please try again later.",
      success: false,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    const user = await User.findById(userId).select("username profilePicture");

    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log("Error while liking the post:", error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $pull: { likes: userId } });
    await post.save();

    const user = await User.findById(userId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was disliked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log("Error while liking the post:", error);
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commenterId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "Text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commenterId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log("Error while adding comment:", error);
  }
};

export const fetchCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "Comments not found", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log("Error while getting comments of post:", error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    // Find the associated post
    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Check if the user is either the author of the comment or the author of the post
    if (comment.author.toString() !== userId && post.author.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // If the post author deletes the comment, notify the comment author
    if (post.author.toString() === userId) {
      const notification = {
        type: "delete-comment",
        userId: userId,
        userDetails: await User.findById(userId).select("username profilePicture"),
        postId: post._id,
        message: "Your comment was deleted by the post author",
      };
      const commentAuthorSocketId = getReceiverSocketId(comment.author.toString());
      io.to(commentAuthorSocketId).emit("notification", notification);
    }

    // Remove the comment ID from the post's comments array
    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted",
      success: true,
    });
  } catch (error) {
    console.log("Error while deleting comment:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the comment. Please try again later.",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log("Error while deleting post:", error);
  }
};

export const addPostToBookmarks = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(userId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "Post removed from bookmark",
          success: true,
        });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log("Error while bookmarking the post:", error);
  }
};