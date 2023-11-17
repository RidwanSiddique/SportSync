const express = require('express');
const {loginUser, registerUser, userProfile} = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);

router.post('/register', registerUser);
router.get('/user/:userId', userProfile);


module.exports = router;