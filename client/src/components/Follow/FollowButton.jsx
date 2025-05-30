// src/components/FollowButton.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const FollowButton = ({
  targetUserId,
  initialIsFollowed,
  onToggle,
  className = "",
}) => {
  const { user } = useSelector((state) => state.auth);
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [loading, setLoading] = useState(false);

  if (!user || user._id === targetUserId) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v2/user/follow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      setIsFollowed(res.data.isFollowing);
      toast.success(res.data.message);
      if (onToggle) onToggle(res.data.isFollowing, res.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update follow status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`px-4 py-1 rounded font-semibold transition ${
        isFollowed
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Please wait..." : isFollowed ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
