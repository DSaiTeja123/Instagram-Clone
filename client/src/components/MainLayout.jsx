import React from 'react'
import { Outlet } from 'react-router-dom'
import { LeftSidebar } from '.'

function MainLayout() {
  return (
    <div>
      <LeftSidebar />
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default MainLayout