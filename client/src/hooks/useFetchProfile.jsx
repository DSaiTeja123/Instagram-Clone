import { setUserProfile } from "@/store/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchProfile = (userId) => {
  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v2/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useFetchProfile;
