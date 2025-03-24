import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPosts } from '@/store/postSlice';

const useFetchAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://instagram-clone-eptf.onrender.com/api/v2/post/fetchAllPosts', {withCredentials:true});
        if (res.data.success) {
          console.log(res.data);
          console.log(res.data.posts);
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
    fetchPosts();
  }, []);
}

export default useFetchAllPosts