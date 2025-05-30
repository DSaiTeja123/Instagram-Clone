import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/index'
import { useSelector } from 'react-redux'

function Comment({ comment }) {
  const { user, colorToggled } = useSelector((store) => store.auth);

  return (
    <div className={`my-2 transition-colors duration-500 ${colorToggled ? 'text-white' : 'text-black'}`}>
      <div className='flex gap-3 items-center'>
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className={`font-bold text-sm ${colorToggled ? 'text-gray-300' : 'text-black'}`}>
          {comment?.author?.username} 
          <span className={`font-normal pl-1 ${colorToggled ? 'text-gray-400' : 'text-gray-600'}`}>
            {comment?.text}
          </span>
        </h1>
      </div>
    </div>
  )
}

export default Comment