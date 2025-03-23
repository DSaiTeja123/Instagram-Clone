import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { Chat, Home, Login, Signup, Profile, EditProfile, MainLayout, ProtectedRoutes } from './components';
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux';
import { setSocket } from './store/socketSlice';
import { setOnlineUsers } from './store/chatSlice';
import { setLikeNotification } from './store/notificationSlice';
import { useEffect } from 'react';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes> <MainLayout /> </ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes> <Home /> </ProtectedRoutes>
      }, {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /> </ProtectedRoutes>
      }, {
        path: '/profile/update',
        element: <ProtectedRoutes> <EditProfile /> </ProtectedRoutes>
      }, {
        path: '/chat',
        element: <ProtectedRoutes> <Chat /> </ProtectedRoutes>
      }
    ]
  }, {
    path: '/signup',
    element: <Signup />
  }, {
    path: '/signin',
    element: <Login />
  }
])

function App() {

  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000',{
        query: {
          userId: user?._id
        }, transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App