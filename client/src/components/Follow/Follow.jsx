import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { followUser, unfollowUser } from "../../store/authSlice";
import { toast } from "sonner";

const Follow = ({ userData }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const followings = useSelector((state) => state.auth.followings);
  const isFollowing = followings.includes(userData._id);

  const handleFollowToggle = async () => {
    try {
      const url = `/api/${isFollowing ? "unfollow" : "follow"}/${userData._id}`;
      await axios.post(url);

      if (isFollowing) {
        dispatch(unfollowUser(userData._id));
        toast.success("Unfollowed");
      } else {
        dispatch(followUser(userData._id));
        toast.success("Followed");
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
      toast.error("Something went wrong");
    }
  };

  if (!currentUser || currentUser._id === userData._id) return null;

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        isFollowing
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default Follow;
