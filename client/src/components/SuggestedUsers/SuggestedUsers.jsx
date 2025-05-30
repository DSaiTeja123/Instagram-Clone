import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/index';
import { useSelector } from 'react-redux';
import { FollowButton } from '../index';

function SuggestedUsers() {
  const { user, suggestedUsers, colorToggled } = useSelector((store) => store.auth);

  return (
    <div className={`my-10 transition-colors duration-500 ${colorToggled ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between text-sm gap-2">
        <h1 className={`font-semibold ${colorToggled ? 'text-gray-300' : 'text-gray-600'}`}>
          suggested for you
        </h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between my-5 border-b border-gray-300 dark:border-gray-700 pb-2"
        >
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="post_image" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
              </h1>
              <span
                className={`text-sm ${colorToggled ? 'text-gray-400' : 'text-gray-600'}`}
              >
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-bold cursor-pointer ${
              colorToggled
                ? 'bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700 text-transparent bg-clip-text'
                : 'bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C] text-transparent bg-clip-text'
            }`}
          >
            <FollowButton targetUserId={user?._id} initialIsFollowed={user?.isFollowed} />
          </span>
        </div>
      ))}
    </div>
  );
}

export default SuggestedUsers;
