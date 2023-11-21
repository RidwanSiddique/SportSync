const express = require('express');
const {loginUser, registerUser, userProfile, userHome, forgotPassword, resetPassword, verify} = require('../controllers/userController');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

// public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/verify', verify);

// protected routes (requre authentication)
router.get('/user/:userId', requireAuth, userProfile);
router.get('/home/:userId', requireAuth, userHome);
module.exports = router;