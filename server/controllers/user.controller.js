import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUrl from "../utils/dataurl.js";
import cloudinary from "../utils/cloudinary.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All the fields must be filled !!!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try out with a different email !!!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error during registration", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All the fields must be filled !!!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password!",
        success: false,
      });
    }

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY is not set in environment variables.");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Defensive: ensure posts is an array
    const postsArray = Array.isArray(user.posts) ? user.posts : [];
    const populatedPosts = await Promise.all(
      postsArray.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(user._id)) return post;
        return null;
      })
    );

    const responseUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts.filter((post) => post !== null),
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${responseUser.username}`,
        success: true,
        user: responseUser,
      });
  } catch (error) {
    console.error("Error while logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = async (req, res) => {
  try {
    return res.clearCookie("token").json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .select("-password")
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log("Error getting profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUrl = getDataUrl(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUrl);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error updating profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } })
      .select("-password")
      .sort({ createdAt: -1 });
    if (!suggestedUsers) {
      return res.status(404).json({
        message: "No suggested users found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Suggested users",
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("Error during suggestions", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
    } else {
      user.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await user.save();
    await targetUser.save();

    const updatedUser = await User.findById(currentUserId);
    const updatedTargetUser = await User.findById(targetUserId);

    return res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      success: true,
      isFollowing: !isFollowing,
      followersCount: updatedTargetUser.followers.length,
      followingCount: updatedUser.following.length,
    });
  } catch (error) {
    console.error("Error in follow/unfollow:", error);
    return res.status(500).json({
      message: "An error occurred while processing your request",
      success: false,
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    await Promise.all([
      User.updateMany({ following: userId }, { $pull: { following: userId } }),
      User.updateMany({ followers: userId }, { $pull: { followers: userId } }),
    ]);

    await Post.deleteMany({ author: userId });
    await User.findByIdAndDelete(userId);
    res.clearCookie("token");

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error while deleting user:", error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};
