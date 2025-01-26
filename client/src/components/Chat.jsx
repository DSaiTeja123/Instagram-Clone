import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage, Input, Button } from './ui';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router-dom'
import { setSelectedUser } from '@/store/authSlice';
import axios from 'axios';
import { setMessages } from '@/store/chatSlice';
import Messages from './Messages';

function Chat() {

  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  
  const [ textMessage, setTextMessage ] = useState('');
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v2/message/send/${receiverId}`, { textMessage }, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      });
      if (res.data?.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in chats");
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <section className="w-full md:w-1/4 my-8 bg-white shadow-lg rounded-xl">
        <h1 className="font-semibold mb-4 text-2xl text-gray-800">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto max-h-[calc(80vh)]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-4 mb-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all ease-in-out transform hover:scale-105"
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-lg text-gray-800">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {isOnline ? 'online' : 'offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full p-4 bg-gradient-to-r from-indigo-100 to-blue-200 rounded-xl">
          <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-300 sticky top-0 bg-white z-10 rounded-xl shadow-md">
            <Avatar>
              <Link to={`/profile/${selectedUser?._id}`} className="inline-block">
                <Button className="flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300">
                  <AvatarImage
                    src={selectedUser?.profilePicture}
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />
                </Button>
              </Link>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-gray-900">{selectedUser?.username}</span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-4 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto p-6">
          <MessageCircleCode className="w-32 h-32 my-4 text-blue-500" />
          <h1 className="font-medium text-2xl text-gray-700">Your messages</h1>
          <span className="text-sm text-gray-600">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  )
}

export default Chat