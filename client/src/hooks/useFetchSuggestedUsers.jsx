import { setSuggestedUsers } from "@/store/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchSuggestedUsers = () => {
  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v2/user/suggested`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};

export default useFetchSuggestedUsers;
