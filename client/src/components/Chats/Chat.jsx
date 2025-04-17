import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage, Input, Button } from "../ui/index";
import { MessageCircleCode } from "lucide-react";
import { Link } from "react-router-dom";
import { setSelectedUser } from "@/store/authSlice";
import axios from "axios";
import { setMessages } from "@/store/chatSlice";
import { Messages } from "../index";
import { toast } from "sonner";

function Chat() {
  const { user, suggestedUsers, selectedUser, colorToggled } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const [textMessage, setTextMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);

  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/v2/messages/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in chats");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => {
      dispatch(setSelectedUser(null));
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row pl-20 h-screen overflow-hidden p-4 transition-colors duration-500">
      <section
        className={`w-full md:w-1/4 my-4 md:my-6 rounded-xl transition-colors duration-500
        ${colorToggled ? "bg-gray-900 text-white" : "bg-white"}
        ${isMobile && selectedUser ? "hidden" : "block"}
        `}
      >
        <h1
          className={`font-semibold mb-4 text-xl md:text-2xl px-4 transition-colors duration-500 ${
            colorToggled ? "text-white" : "text-gray-800"
          }`}
        >
          {user?.username}
        </h1>
        <hr
          className={`mb-4 transition-colors duration-500 ${
            colorToggled ? "border-gray-700" : "border-gray-300"
          }`}
        />
        <div className="overflow-y-auto max-h-[calc(80vh)] px-4">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex gap-3 items-center p-4 mb-3 rounded-lg cursor-pointer transition-colors duration-500 hover:scale-105 ${
                  colorToggled ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <Avatar className="w-12 h-12 md:w-16 md:h-16">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span
                    className={`font-medium text-base md:text-lg transition-colors duration-500 ${
                      colorToggled ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {suggestedUser?.username}
                  </span>
                  <span
                    className={`text-xs md:text-sm font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section
          className={`flex-1 border-l border-gray-300 flex flex-col h-full p-4 rounded-xl transition-colors duration-500
          ${
            colorToggled
              ? "bg-gradient-to-r from-gray-500 to-gray-900"
              : "bg-gradient-to-r from-indigo-100 to-blue-200"
          }
          ${isMobile && !selectedUser ? "hidden" : "block"}
        `}
        >
          <div
            className={`flex gap-3 items-center px-4 py-3 border-b sticky top-0 z-10 rounded-xl shadow-md transition-colors duration-500 
            ${
              colorToggled
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <Link to={`/profile/${selectedUser?._id}`} className="inline-block">
              <Avatar
                className={`transition-all duration-500 p-1 rounded-full 
                  ${
                    colorToggled
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                <AvatarImage
                  src={selectedUser?.profilePicture}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <span
                className={`text-lg font-medium transition-colors duration-500 ${
                  colorToggled ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedUser?.username}
              </span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center p-4 border-t border-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-4 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className={`px-6 py-2 rounded-lg transition-colors duration-500 
                ${
                  colorToggled
                    ? "bg-grey-900 text-white hover:bg-grey-500"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div
          className={`flex flex-col items-center justify-center mx-auto p-6 ${
            isMobile ? "hidden" : "block"
          }`}
        >
          <MessageCircleCode className="w-32 h-32 my-4 text-blue-500" />
          <h1 className="font-medium text-2xl text-gray-700">Your messages</h1>
          <span className="text-sm text-gray-600">
            Send a message to start a chat.
          </span>
        </div>
      )}
    </div>
  );
}

export default Chat;
