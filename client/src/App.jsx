import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {
  Chat,
  Home,
  Login,
  Signup,
  Profile,
  EditProfile,
  MainLayout,
  ProtectedRoutes,
} from "./components";

import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "./store/socketSlice";
import { setOnlineUsers } from "./store/chatSlice";
import { setLikeNotification } from "./store/notificationSlice";
import { initiateSocket, closeSocket } from "./socket/socket";
import { useEffect } from "react";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        {" "}
        <MainLayout />{" "}
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            {" "}
            <Home />{" "}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            {" "}
            <Profile />{" "}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/update",
        element: (
          <ProtectedRoutes>
            {" "}
            <EditProfile />{" "}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            {" "}
            <Chat />{" "}
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = initiateSocket(user?._id);
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        closeSocket();
        dispatch(setSocket(null));
      };
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
