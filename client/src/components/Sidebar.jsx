import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SuggestedUsers } from '.';
import { setColorToggled } from '@/store/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user, colorToggled } = useSelector((store) => store.auth);

  return (
    <div className={`w-fit my-10 transition-colors duration-500 ${colorToggled ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profile_image" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className={`text-sm ${colorToggled ? 'text-gray-300' : 'text-gray-600'}`}>
              {user?.bio || 'Bio here...'}
            </span>
          </div>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default Sidebar;