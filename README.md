# Chattify

A feature-rich Instagram-like social media application built with the **MERN Stack** and styled using **Tailwind CSS**.  
**Authenticated users** can create posts, like, comment, bookmark, follow/unfollow users, chat in real-time, and receive notifications for interactions — all within a dark/light themed, responsive UI.

---

## ✨ Features

- **User Authentication** (Register, Login with Email or Google)
- **Create, Edit, and Delete Posts** with image support
- **Like, Comment, and Bookmark** posts
- **Follow/Unfollow** other users
- **Edit Profile** with image upload (Cloudinary)
- **Real-time Chat** with other users using `socket.io`
- **Notifications** when someone likes your post
- **Responsive UI** for all devices
- **Dark/Light Theme Support** with Tailwind + `next-themes`
- **Toast Notifications** for actions using `sonner`

---

## 🚀 Demo

**Live:** [https://instagram-clone-five-eosin.vercel.app](https://instagram-clone-five-eosin.vercel.app)

---

## 📦 Installation

1. **Clone the repository**
- git clone https://github.com/DSaiTeja123/Instagram-Clone
- cd expense-tracker

2. **Install dependencies**
***Install client dependencies***
- cd client
- npm install

# Install server dependencies
- cd server
- npm install

3. **Start the development server**
# Terminal 1 - start backend
- cd server
- npm run dev

# Terminal 2 - start frontend
- cd client
- npm run dev

4. **Open in your browser:**  
[http://localhost:5173](http://localhost:5173)

---

## 🛠️ Usage

- **Register/Login** to access Chattify.
- **Create posts** with optional captions and images.
- **Like, comment, and bookmark** other users' posts.
- **Follow/unfollow** users and view their profiles.
- **Edit your own profile** with avatar and bio.
- **Chat** with other users in real-time using `socket.io`.
- **Get notifications** when someone likes your post.
- All interactions are synced and secured using **JWT** and **MongoDB**.

---

## 🌓 Dark/Light Theme

- Toggle light and dark themes using the UI switch.
- Theme preference is saved and respects system settings.
- Powered by **Tailwind CSS** and [`next-themes`](https://github.com/pacocoursey/next-themes).

---

## 🌐 Deployment

**Client (Frontend) on Vercel:**  
- Push the `client` folder to GitHub and import into Vercel.  
- Set the environment variable:
  - `VITE_SERVER_URL`

**Server (Backend) on Render:**  
- Push the `server` folder to GitHub and import into Render.
- Set the following environment variables:
  - `PORT`
  - `MONGO_URI`
  - `SECRET_KEY`
  - `API_KEY`
  - `API_SECRET`
  - `CLOUD_NAME`

---

## 🧩 Tech Stack

### Frontend

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next Themes](https://github.com/pacocoursey/next-themes)
- [React Router DOM (v7)](https://reactrouter.com/en/main)
- [Axios](https://axios-http.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Hook Form](https://react-hook-form.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [Socket.IO Client](https://socket.io/)
- [Lucide React](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.dev/)
- [Radix UI Primitives](https://www.radix-ui.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [JWT](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt / bcryptjs](https://github.com/dcodeIO/bcrypt.js/)
- [Cloudinary](https://cloudinary.com/)
- [Multer](https://github.com/expressjs/multer)
- [Sharp](https://github.com/lovell/sharp)
- [Socket.IO](https://socket.io/)
- [dotenv](https://github.com/motdotla/dotenv)
- [CORS](https://github.com/expressjs/cors)
- [Cookie Parser](https://github.com/expressjs/cookie-parser)
