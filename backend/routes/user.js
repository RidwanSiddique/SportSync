// user.js
const express = require('express');
const { loginUser, registerUser, userProfile, userHome, forgotPassword, resetPassword, verify, updateUserProfileImage, updateProfile, logout } = require('../controllers/userController');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/verify', verify);
router.get("/user/logout", logout)
// Protected routes (require authentication)
router.get('/user/:userId', requireAuth, userProfile);
router.post('/user/updateProfile/:userId', requireAuth, updateProfile);
router.get('/home/:userId', requireAuth, userHome);

// New route for updating the profile image
router.post('/user/:userId/profile-image', requireAuth, updateUserProfileImage);

module.exports = router;
