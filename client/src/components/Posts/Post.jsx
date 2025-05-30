import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogTrigger,
  Button,
  Input,
  Badge,
} from "../ui/index";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  BookMarked,
} from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CommentDialog } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { FollowButton } from "../index";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/store/postSlice";
import axios from "axios";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const { user, colorToggled } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [Liked, setLiked] = useState(
    (post?.likes || []).includes(user?._id) || false
  );
  const [Bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes(post._id) || false
  );
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const [isFollowingAuthor, setIsFollowingAuthor] = useState(
    (user?.following || []).includes(post?.author?._id)
  );

  const dispatch = useDispatch();
  const updatedPost = posts.find((p) => p._id === post._id);

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const handleFollowToggle = (newIsFollowed) => {
    setIsFollowingAuthor(newIsFollowed);
    const updatedUser = {
      ...user,
      following: newIsFollowed
        ? [...user.following, post.author._id]
        : user.following.filter((id) => id !== post.author._id),
    };
    dispatch({ type: "auth/setUser", payload: updatedUser });
  };

  const changeEventHandler = (e) => {
    const text = e.target.value;
    setText(text.trim() ? text : "");
  };

  const likeHandler = async () => {
    try {
      const action = Liked ? "dislike" : "like";
      const res = await axios.get(
        `${baseURL}/api/v2/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.message) {
        const updatedLikes = Liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!Liked);

        const updatedPostLikes = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: Liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostLikes));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${baseURL}/api/v2/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/api/v2/post/${post?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComment = [res.data.comment, ...comment];
        setComment(updatedComment);
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComment } : p
        );
        dispatch(setPosts(updatedPosts));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/v2/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data?.success) {
        setBookmarked(!Bookmarked);
        toast.success(res.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div
      className={`my-8 w-full max-w-2xl mx-auto duration-500 ${
        colorToggled ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`rounded-lg transition-colors duration-500 p-4 ${
          colorToggled ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={post.author?.profilePicture}
                alt="post_image"
                className="w-12 h-12"
              />
              <AvatarFallback className="text-lg">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg">
                {post?.author?.username}
              </h1>
              {user?._id === post.author._id && (
                <Badge
                  variant="secondary"
                  className={`text-xs rounded-xl bg-gray-300`}
                >
                  Author
                </Badge>
              )}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal
                className={`cursor-pointer rounded-xl ${
                  colorToggled
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              />
            </DialogTrigger>
            <DialogContent
              className={`flex flex-col items-center text-sm text-center rounded-xl p-4 ${
                colorToggled
                  ? "bg-gray-800 text-white border border-gray-600"
                  : "bg-white text-black"
              }`}
            >
              {post.author._id !== user?._id && (
                <FollowButton
                  targetUserId={post.author._id}
                  initialIsFollowed={isFollowingAuthor}
                  onToggle={handleFollowToggle}
                  className="w-full py-2 rounded-xl font-semibold transition-colors mb-2"
                />
              )}
              <Button
                variant="ghost"
                className="w-full py-2 hover:bg-gray-300 rounded-xl"
              >
                Add to Fav
              </Button>
              {user && user?._id === post?.author._id && (
                <Button
                  onClick={deletePostHandler}
                  variant="ghost"
                  className="w-full hover:bg-gray-300 rounded-xl py-2"
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <img
          className="rounded-xl my-4 w-full aspect-video object-cover cursor-pointer"
          src={post.image}
          alt="post_img"
          onClick={() => setImageOpen(true)}
        />

        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="flex justify-center items-center bg-opacity-75 p-1">
            <img
              src={post.image}
              alt="Enlarged post image"
              className="w-[80vw] h-auto object-contain"
            />
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-5">
            {Liked ? (
              <FaHeart
                onClick={likeHandler}
                size={24}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeHandler}
                size={24}
                className={`cursor-pointer ${
                  colorToggled
                    ? "text-gray-400 hover:text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className={`cursor-pointer ${
                colorToggled
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            />
            <Send
              className={`cursor-pointer ${
                colorToggled
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            />
          </div>
          {Bookmarked ? (
            <BookMarked
              onClick={bookmarkHandler}
              size={24}
              className={`cursor-pointer ${
                colorToggled ? "text-gray-400" : "text-gray-600"
              }`}
            />
          ) : (
            <Bookmark
              onClick={bookmarkHandler}
              size={24}
              className={`cursor-pointer ${
                colorToggled
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            />
          )}
        </div>

        <span
          className={`font-medium ${
            colorToggled ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {postLike} likes
        </span>
        <p
          className={`mt-2 ${colorToggled ? "text-gray-300" : "text-gray-700"}`}
        >
          <span className="font-semibold">{post?.author?.username}</span>{" "}
          {post.caption}
        </p>

        {updatedPost && updatedPost.comments?.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className={`text-sm cursor-pointer hover:text-gray-500 ${
              colorToggled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            View all {updatedPost.comments.length} comments
          </span>
        )}

        <CommentDialog open={open} setOpen={setOpen} />

        <div className="flex items-center justify-between mt-4">
          <Input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment"
            className={`outline-none text-sm w-full py-2 px-3 border rounded-lg focus:ring-2 ${
              colorToggled
                ? "bg-gray-700 text-white focus:ring-blue-500"
                : "focus:ring-indigo-500"
            }`}
          />
          {text.trim() && (
            <span
              onClick={commentHandler}
              className={`ml-2 cursor-pointer ${
                colorToggled ? "text-blue-400" : "text-indigo-600"
              }`}
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
