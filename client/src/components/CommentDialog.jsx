import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, Avatar, AvatarFallback, AvatarImage, Input, Button, Toaster } from './ui'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { Comment } from '.'
import axios from 'axios'
import { setPosts } from '@/store/postSlice'

const CommentDialog = ({open, setOpen}) => {

  const [text,setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      setText(text);
    } else {
      setText("");
    }
  }

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/api/v2/post/${selectedPost?._id}/comment`, {text}, 
      {headers: { 'Content-Type': 'application/json' }, withCredentials: true});
      if (res.data.success) {
        const updatedComment = [res.data.comment, ...comment];
        setComment(updatedComment);

        const updatedPosts = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedComment } : p
        );
        dispatch(setPosts(updatedPosts));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col bg-white shadow-lg rounded-lg">
          <div className="flex w-full">
            <div className="w-1/2">
              <img
                className="w- h-full object-cover rounded-l-lg"
                src={selectedPost?.image}
                alt="post_img"
              />
            </div>
            <div className="w-1/2 flex flex-col p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Link className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{selectedPost?.author?.username}</p>
                    <span className="text-gray-500 text-xs">{selectedPost?.author?.bio || "Bio"}</span>
                  </div>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center bg-gray-50 p-2 rounded-lg shadow">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold hover:bg-red-100 py-1 rounded">Unfollow</div>
                    <div className="cursor-pointer w-full hover:bg-gray-100 py-1 rounded">Add to Fav</div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr className="border-gray-200" />
              <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-4">
                {comment.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a Comment"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Button
                    disabled={!text.trim()}
                    onClick={sendMessageHandler}
                    variant="outline"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      !text.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentDialog