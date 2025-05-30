import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LeftSidebar } from "../index";
import { useSelector } from "react-redux";

function MainLayout() {
  const { user, colorToggled } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <div
      className={`flex transition-colors duration-500 ${
        colorToggled ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <LeftSidebar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
