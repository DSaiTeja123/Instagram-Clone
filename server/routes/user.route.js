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

router.post('/signup', registerController);
// router.post('/signup', googleSignupController);
router.post('/signin', loginController);
router.get('/logout', isAuthenticated, logoutController);
router
  .route('/:id/profile')
  .get(isAuthenticated, fetchProfile)
  .delete(isAuthenticated, deleteUserController);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.get('/suggested', isAuthenticated, getSuggestedUsers);
router.post('/follow/:id', isAuthenticated, followUnfollow);
export default router;