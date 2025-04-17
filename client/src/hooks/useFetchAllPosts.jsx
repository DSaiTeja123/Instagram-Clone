import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "@/store/postSlice";

const useFetchAllPosts = () => {

  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v2/post/fetchAllPosts`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchPosts();
  }, []);
};

export default useFetchAllPosts;
