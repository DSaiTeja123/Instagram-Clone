import React from 'react';
import { Feed, Sidebar } from '.';
import { Outlet } from 'react-router-dom';
import useFetchAllPosts from '@/hooks/useFetchAllPosts';
import useFetchSuggestedUsers from '@/hooks/useFetchSuggestedUsers';
import { useSelector } from 'react-redux';

function Home() {
  useFetchAllPosts();
  useFetchSuggestedUsers();

  const { colorToggled } = useSelector((store) => store.auth);

  return (
    <div
      className={`flex transition-colors duration-500 min-h-screen ${colorToggled ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>

      <div className="hidden md:block w-64 md:translate-x-2">
        <Sidebar />
      </div>
    </div>
  );
}

export default Home;