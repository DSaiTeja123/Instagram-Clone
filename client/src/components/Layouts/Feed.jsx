import React, { useEffect } from "react";
import { Posts } from "../index";
import { useSelector } from "react-redux";

function Feed() {
  const { colorToggled } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <div
      className={`flex-1 my-8 flex flex-col items-center pl-[20%] transition-colors duration-500 ${
        colorToggled ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Posts />
    </div>
  );
}

export default Feed;
