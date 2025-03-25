import { setAuthUser, setColorToggled } from '@/store/authSlice';
import { FaInstagram } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage, Popover, PopoverContent, PopoverTrigger, Button } from './ui';
import axios from 'axios';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CreatePost, Toggle } from '.';
import { setPosts, setSelectedPost } from '@/store/postSlice';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, colorToggled } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.notification);
  const [open, setOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://instagram-clone-eptf.onrender.com/api/v2/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate('/signin');
        toast.success('Logged out successfully');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleToggle = () => {
    dispatch(setColorToggled(!colorToggled));
  };

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      setIsMessagesOpen((prevState) => !prevState);
      navigate('/chat');
    }
  };

  const sidebar = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notification' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-7 h-7 rounded-full">
          <AvatarImage src={user?.profilePicture} className="w-7 h-7 rounded-full" />
          <AvatarFallback className="rounded-full">A</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 z-10 w-16 md:w-1/5 h-screen transition-colors duration-500 ${
        colorToggled ? 'text-white' : 'text-black'
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div
            className="text-3xl bg-gradient-to-r bg-clip-text text-[#833AB4] hover:text-[#E1306C] transition-all duration-500 pl-6 py-6 cursor-pointer"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <FaInstagram className="block" />
          </div>

          {!isSidebarCollapsed && !isMessagesOpen && (
            <h1 className="hidden md:block my-8 pb-2 text-4xl bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C] bg-clip-text text-transparent font-extrabold drop-shadow-lg">
              Instagram
            </h1>
          )}
        </div>

        <div className="space-y-4 pl-4 md:pl-6">
          {sidebar.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className={`flex items-center gap-3 relative group cursor-pointer rounded-lg p-2 my-3 transition-all duration-300`}
            >
              <div
                className={`text-2xl ${
                  colorToggled ? 'text-gray-300' : 'text-[#333]'
                } group-hover:text-[#833AB4] transition-colors duration-300`}
              >
                {item.icon}
              </div>

              {!isSidebarCollapsed && !isMessagesOpen && (
                <span
                  className={`hidden md:inline-block text-xl bg-clip-text font-oleo-script transition-all duration-500 ${
                    colorToggled ? 'text-white' : 'text-black'
                  } group-hover:text-lg`}
                >
                  {item.text}
                </span>
              )}

              {item.text === 'Notification' && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute bottom-1 left-1 md:bottom-6 md:left-6 rounded-full h-5 w-5 bg-red-600 hover:bg-red-600"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {likeNotification.length === 0 ? (
                        <p>No new notifications</p>
                      ) : (
                        likeNotification.map((n) => (
                          <div key={n.userId} className="flex items-center gap-2 my-2">
                            <Avatar>
                              <AvatarImage src={n.userDetails?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">{n.userDetails?.username}</span> liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
          ))}
        </div>
        
        <div className="rounded-2xl hover:shadow-2xl transition-shadow duration-300">
          <Link to={`/signin`}>
            <Button className="bg-gradient-to-r from-blue-400 to-purple-600 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105">
              Sign In
            </Button>
          </Link>
        </div>

        <div onClick={handleToggle}>
          <Toggle />
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
