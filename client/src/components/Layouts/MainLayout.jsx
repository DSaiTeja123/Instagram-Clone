import React from 'react'
import { Outlet } from 'react-router-dom'
import { LeftSidebar } from '../index'
import { useSelector } from 'react-redux'

function MainLayout() {
  const { colorToggled } = useSelector((store) => store.auth);

  return (
    <div className={`flex transition-colors duration-500 ${colorToggled ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <LeftSidebar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
