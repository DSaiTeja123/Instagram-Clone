import React from 'react'
import { Feed, RightSidebar } from '.'
import { Outlet } from 'react-router-dom'
import useFetchAllPosts from '@/hooks/useFetchAllPosts'
import useFetchSuggestedUsers from '@/hooks/useFetchSuggestedUsers';

function Home() {
  useFetchAllPosts();
  useFetchSuggestedUsers();
  return (
    <div className='flex'>
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home