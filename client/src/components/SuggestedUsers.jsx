import React from 'react'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui';
import { useSelector } from 'react-redux';

function SuggestedUsers() {

  const { suggestedUsers } = useSelector(store => store.auth);

  return (
    <div className='my-10'>
      <div className="flex items-center justify-between text-sm gap-2">
        <h1 className='font-semibold text-gray-600'>suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {
        suggestedUsers.map((user) => {
          return (
            <div key={user._id} className="flex items-center justify-between my-5">
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                  <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                </div>
              </div>
              <span className='text-xs font-bold cursor-pointer hover:text-transparent bg-clip-text bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C]'>Follow</span>
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers