const express = require('express');
const {loginUser, registerUser, userProfile, userHome, forgotPassword, resetPassword} = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);

router.post('/register', registerUser);
router.get('/user/:userId', userProfile);
router.get('/home/:userId', userHome);
router.get('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;