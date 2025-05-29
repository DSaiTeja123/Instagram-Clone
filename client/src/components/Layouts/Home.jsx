import React, { useEffect } from "react";
import { Feed, Sidebar } from "../index";
import { Outlet } from "react-router-dom";
import { useFetchAllPosts, useFetchSuggestedUsers } from "../../hooks/index";
import { useSelector } from "react-redux";

function Home() {
  useFetchAllPosts();
  useFetchSuggestedUsers();

  const { user, colorToggled } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <div
      className={`flex transition-colors duration-500 min-h-screen ${
        colorToggled ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
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
