  import React, { useState } from 'react'
  import { Avatar, AvatarFallback, AvatarImage, Dialog, DialogContent, DialogTrigger, Button, Label, Input, Badge } from './ui'
  import { Bookmark, MessageCircle, MoreHorizontal, Send, BookMarked } from 'lucide-react'
  import { FaHeart, FaRegHeart } from 'react-icons/fa'
  import { CommentDialog } from '.'
  import { useDispatch, useSelector } from 'react-redux'
  import { toast } from 'sonner'
  import { setPosts, setSelectedPost } from '@/store/postSlice'
  import axios from 'axios'


  const Post = ({ post }) => {

    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [ Liked, setLiked ] = useState(post.likes.includes(user?._id) || false);
    const [ Bookmarked, setBookmarked ] = useState(false);
    const [ postLike, setPostLike ] = useState(post.likes.length);
    const [ comment, setComment ] = useState(post.comments);
    const dispatch = useDispatch();
    const updatedPost = posts.find(p => p._id === post._id);

    const changeEventHandler = (e) => {
      const text = e.target.value;
      if (text.trim) {
        setText(text);
      } else {
        setText("");
      }
    }

    const followUnfollowHandler = async () => {
      try {
        const isFollowing = user.following.includes(post.author._id);
    
        const res = await axios.post(
          `http://localhost:8000/api/v2/user/follow/${post.author._id}`, {}, { withCredentials: true }
        );
    
        if (res.data.success) {
          toast.success(res.data.message);

          const updatedPosts = posts.map((p) => {
            if (p._id === post._id) {
              const updatedFollowers = isFollowing
                ? (p.author.followers || []).filter((id) => id !== user._id) // Fallback to an empty array if undefined
                : [...(p.author.followers || []), user._id]; // Append the current user's ID
    
              return {
                ...p,
                author: {
                  ...p.author,
                  followers: updatedFollowers,
                },
              };
            }
            return p;
          });
    
          dispatch(setPosts(updatedPosts));
          const updatedUser = {
            ...user,
            following: isFollowing
              ? user.following.filter((id) => id !== post.author._id)
              : [...user.following, post.author._id],
          };
    
          dispatch({ type: 'auth/setUser', payload: updatedUser });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    };  

    const likeHandler = async () => {
      try {
        const action = Liked ? 'dislike' : 'like';
        const res = await axios.get(`http://localhost:8000/api/v2/post/${post?._id}/${action}`, {withCredentials: true});
        if (res.data.message) {
          const updatedLikes = Liked ? postLike - 1 : postLike + 1;
          setPostLike(updatedLikes);
          setLiked(!Liked);

          const updatedPostLikes = posts.map(p => p._id === post._id ? {
            ...p, likes: Liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p);

          dispatch(setPosts(updatedPostLikes));
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    const deletePostHandler = async () => {
      try {
        const res = await axios.delete(`http://localhost:8000/api/v2/post/delete/${post?._id}`, {withCredentials:true});
        if (res.data.success) {
          const updatedPosts = posts.filter((postItem) => postItem?._id !== post?._id);
          dispatch(setPosts(updatedPosts));
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    const commentHandler = async () => {
      try {
        const res = await axios.post(`http://localhost:8000/api/v2/post/${post?._id}/comment`, {text}, 
        {headers: { 'Content-Type': 'application/json' }, withCredentials: true});
        if (res.data.success) {
          const updatedComment = [res.data.comment, ...comment];
          setComment(updatedComment);
          const updatedPosts = posts.map(p =>
            p._id === post._id ? { ...p, comments: updatedComment } : p
          );
          dispatch(setPosts(updatedPosts));
          setText("");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    const bookmarkHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v2/post/${post?._id}/bookmark`, { withCredentials:true });
        if (res.data?.success)
          setBookmarked(!Bookmarked);
          toast.success(res.data?.message);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }

    return (
      <div className='my-8 w-full max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg p-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <Avatar>
                <AvatarImage src={post.author?.profilePicture} alt="post_image" className='w-12 h-12' />
                <AvatarFallback className='text-lg'>A</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <h1 className='font-semibold text-lg'>{post?.author?.username}</h1>
                {user?._id === post.author._id && <Badge variant="secondary" className="text-xs">Author</Badge>}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className='cursor-pointer text-gray-600 hover:text-gray-900' />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center text-sm text-center bg-white rounded-lg p-4">
                {post.author._id !== user._id && (
                  user.following.includes(post.author._id) ? (
                    <Button onClick={followUnfollowHandler} variant='ghost' className="w-full py-2">Follow/Unfollow</Button>
                  ) : (
                    <Button onClick={followUnfollowHandler} variant='ghost' className="w-full py-2">Follow/Unfollow</Button>
                  )
                )}
                <Button variant='ghost' className="w-full py-2">Add to Fav</Button>
                {user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="w-full py-2">Delete</Button>}
              </DialogContent>
            </Dialog>
          </div>

          <img
            className='rounded-xl my-4 w-full aspect-video object-cover cursor-pointer'
            src={post.image}
            alt="post_img"
            onClick={() => setImageOpen(true)}
          />

          <Dialog open={imageOpen} onOpenChange={setImageOpen}>
            <DialogContent className="flex justify-center items-center bg-opacity-75 p-1">
              <img 
                src={post.image} 
                alt="Enlarged post image"
                className="w-[80vw] h-auto object-contain" 
              />
            </DialogContent>
          </Dialog>
    
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center gap-5'>
              {Liked ? <FaHeart onClick={likeHandler} size={24} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeHandler} size={24} className='cursor-pointer text-gray-600 hover:text-red-500' />}
              <MessageCircle onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }} className='cursor-pointer text-gray-600 hover:text-gray-800' />
              <Send className='cursor-pointer text-gray-600 hover:text-gray-800' />
            </div>
            {Bookmarked ? (
              <BookMarked onClick={bookmarkHandler} size={24} className='cursor-pointer text-gray-600' />
            ) : (
              <Bookmark onClick={bookmarkHandler} size={24} className='cursor-pointer text-gray-600 hover:text-gray-800' />
            )}
          </div>
    
          <span className='text-gray-600 font-medium'>{postLike} likes</span>
          <p className='text-gray-700 mt-2'>
            <span className='font-semibold'>{post?.author?.username}</span> {post.caption}
          </p>
    
          {updatedPost && updatedPost.comments?.length > 0 && (
            <span
              onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}
              className='text-sm text-gray-400 cursor-pointer hover:text-gray-500'>
              View all {updatedPost.comments.length} comments
            </span>
          )}
    
          <CommentDialog open={open} setOpen={setOpen} />
    
          <div className='flex items-center justify-between mt-4'>
            <Input
              type="text"
              value={text}
              onChange={changeEventHandler}
              placeholder='Add a comment'
              className="outline-none text-sm w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {text && <span onClick={commentHandler} className='text-indigo-600 cursor-pointer'>Post</span>}
          </div>
        </div>
      </div>
    )  
  }

  export default Post