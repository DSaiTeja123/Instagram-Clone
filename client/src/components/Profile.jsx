import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from './ui';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetchProfile from '@/hooks/useFetchProfile';
import { useSelector, useDispatch } from 'react-redux';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { setUserProfile } from '@/store/authSlice';
import { CommentDialog } from '.';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useFetchProfile(userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [active, setActive] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const { userProfile, user } = useSelector((store) => store.auth);

  const loggedInUser = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);
  const displayPost = active === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const tabChange = (tab) => {
    setActive(tab);
  };

  const handleNavigateToMessages = () => {
    navigate(`/chat/${userProfile?._id}`);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDialogOpen(true); // Open the dialog when a post is clicked
  };

  const handleFollow = () => {
    const updatedFollowers = isFollowing
      ? userProfile.followers.filter((id) => id !== user._id)
      : [...userProfile.followers, user._id];

    dispatch(
      setUserProfile({
        ...userProfile,
        followers: updatedFollowers,
      })
    );
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilePhoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {loggedInUser ? (
                  <>
                    <Link to="/profile/update">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View archive
                    </Button>
                  </>
                ) : (
                  <>
                    {isFollowing ? (
                      <>
                        <Button onClick={handleFollow} variant="secondary" className="h-8">Unfollow</Button>
                        <Link to="/chat">
                          <Button variant="secondary" className="h-8" onClick={handleNavigateToMessages} >Message</Button>
                        </Link>
                      </>
                    ) : (
                      <Button onClick={handleFollow}className="bg-[#0095F6] hover:bg-[#3192d2] h-8">Follow</Button>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">{userProfile?.posts.length} </span>posts
                </p>
                <p>
                  <span className="font-semibold">{userProfile?.followers.length} </span>followers
                </p>
                <p>
                  <span className="font-semibold">{userProfile?.following.length} </span>following
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-auto">
                <span className="font-semibold self-start">{userProfile?.bio || 'Bio'}</span>
                <Badge className="w-fit border-r-8 rounded-lg" variant="secondary">
                  <AtSign /> <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${active === 'posts' ? 'font-bold' : ''}`}
              onClick={() => tabChange('posts')}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer ${active === 'saved' ? 'font-bold' : ''}`}
              onClick={() => tabChange('saved')}
            >
              Saved
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayPost?.map((post) => (
              <div key={post?._id} onClick={() => handlePostClick(post)} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt="postImage"
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Dialog */}
      {selectedPost && (
        <CommentDialog 
          open={isDialogOpen} 
          setOpen={setIsDialogOpen} 
          post={selectedPost} 
        />
      )}
    </div>
  );
};

export default Profile;