import { setMessages } from '@/store/chatSlice';
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useFetchMessages = () => {

  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.auth);

  const baseURL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v2/message/receive/${selectedUser?._id}`, { withCredentials: true });
        if (res?.data?.success) {
          dispatch(setMessages(res?.data?.messages));
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMessages();
  }, [selectedUser]);
};

export default useFetchMessages