import express from 'express';
import { 
  registerController,
  // googleSignupController,
  loginController,
  logoutController,
  fetchProfile,
  updateProfile,
  getSuggestedUsers,
  followUnfollow,
  deleteUserController
}
from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post('/https://instagram-clone-eptf.onrender.com/signup', registerController);
// router.post('/signup', googleSignupController);
router.post('/https://instagram-clone-eptf.onrender.com/signin', loginController);
router.get('/https://instagram-clone-eptf.onrender.com/logout', isAuthenticated, logoutController);
router
  .route('/https://instagram-clone-eptf.onrender.com/:id/profile')
  .get(isAuthenticated, fetchProfile)
  .delete(isAuthenticated, deleteUserController);
router.post('/https://instagram-clone-eptf.onrender.com/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.get('/https://instagram-clone-eptf.onrender.com/suggested', isAuthenticated, getSuggestedUsers);
router.post('/https://instagram-clone-eptf.onrender.com/follow/:id', isAuthenticated, followUnfollow);
export default router;