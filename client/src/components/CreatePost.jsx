import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, Avatar, AvatarFallback, AvatarImage, Textarea, Input, Button } from './ui'
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/store/postSlice';

const CreatePost = ({ open, setOpen }) => {

  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, colorToggled } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const data = new FormData();
    data.append("caption", caption);
    if (imagePreview) data.append("image", file);
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v2/post/createPost', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res?.data?.message || "No data received");
        setOpen(false);
        setFile("");
        setCaption("");
        setImagePreview("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleImagePreview = () => {
    setImagePreview((prev) => (prev ? "" : imagePreview));
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className={`text-center font-semibold ${colorToggled ? 'text-white' : 'text-black'}`}>Create New Post</DialogHeader>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className={`font-semibold text-xs ${colorToggled ? 'text-white' : 'text-black'}`}>{user?.username}</h1>
              <span className={`text-gray-600 text-xs ${colorToggled ? 'text-white' : 'text-gray-600'}`}>Bio </span>
            </div>
          </div>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption" />
          {imagePreview && (
            <div className="flex flex-col justify-center items-center w-full">
              <img src={imagePreview} alt="preview image" className="object-cover rounded-lg w-1/2" />
              <Button onClick={toggleImagePreview} className="mt-2 w-fit bg-red-500 hover:bg-red-600 text-white">
                {imagePreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          )}
          <Input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-clip-text">
            <span className="text-transparent bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C] bg-clip-text">
              Select from computer
            </span>
          </Button>
          {imagePreview && (
            loading ? (
              <Button className="flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">
                Post
              </Button>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePost;