import { setMessages } from '@/store/chatSlice';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useFetchNotification = () => {

  const dispatch = useDispatch();
  const { socket } = useSelector(store => store.socketio);
  const { messages } = useSelector(store => store.chat);

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    })

    return () => {
      socket?.off('newMessage');
    }
  }, [ socket, messages, setMessages, dispatch ]);
};

export default useFetchNotification;