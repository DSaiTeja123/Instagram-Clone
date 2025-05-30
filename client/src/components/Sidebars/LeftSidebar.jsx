import { setAuthUser, setColorToggled } from "@/store/authSlice";
import { FaInstagram } from "react-icons/fa";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "../ui/index";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { CreatePost, Toggle } from "../index";
import { setPosts, setSelectedPost } from "@/store/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, colorToggled } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.notification);
  const [open, setOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const baseURL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (location.pathname === "/chat") {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
    if (!user) {
      navigate("/signin");
    }
  }, [location.pathname, user, navigate]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v2/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/signin");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleToggle = () => {
    dispatch(setColorToggled(!colorToggled));
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      default:
        break;
    }
  };

  const sidebar = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-7 h-7 rounded-full">
          <AvatarImage
            src={user?.profilePicture}
            className="w-7 h-7 rounded-full"
          />
          <AvatarFallback className="rounded-full">A</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 z-10 w-16 ${
        isSidebarCollapsed ? "w-16" : "w-64 md:w-1/5"
      } h-screen transition-colors duration-500 ${
        colorToggled ? "text-white" : "text-black"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-gradient-to-r bg-clip-text text-[#833AB4] hover:text-[#E1306C] transition-all duration-500 pl-6 py-6 cursor-pointer">
            <FaInstagram className="block" />
          </div>

          {!isSidebarCollapsed && location.pathname !== "/chat" && (
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
                  colorToggled ? "text-gray-300" : "text-[#333]"
                } group-hover:text-[#833AB4] transition-colors duration-300`}
              >
                {item.icon}
              </div>

              {!isSidebarCollapsed && location.pathname !== "/chat" && (
                <span
                  className={`hidden md:inline-block text-xl bg-clip-text font-bold pb-1 transition-all duration-500 ${
                    colorToggled ? "text-white" : "text-black"
                  } group-hover:text-lg`}
                >
                  {item.text}
                </span>
              )}

              {item.text === "Notification" && likeNotification.length > 0 && (
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
                          <div
                            key={n.userId}
                            className="flex items-center gap-2 my-2"
                          >
                            <Avatar>
                              <AvatarImage
                                src={n.userDetails?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {n.userDetails?.username}
                              </span>{" "}
                              liked your post
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

        <div className="fixed left-10" onClick={handleToggle}>
          <Toggle />
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      {!user && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => navigate("/signin")}
            className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md hover:scale-105 transition-transform"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
