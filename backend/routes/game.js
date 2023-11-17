const express = require('express');
const router = express.Router();
const {createGame, showAllGames} = require('../controllers/GameControler');

// handle the new submission into our db
router.post('/CreateGame', createGame);

// handle request for showing all games
// so far only used for testing
router.get('/ShowGames', showAllGames);

module.exports = router; 
