const mongoose = require('mongoose');

// name is the name of the match
const GameDatabase = new mongoose.Schema({
	name: {type: String, required: true},
	// team1 is the team the user is playing in
	team1: {type: String, required: true},
	// team2 is the team they're playing against
	team2: {type: String, required: true},
	date: {type: String, required: true},
	time:  {type: String, required: true},
	place: {type: String}
});


module.exports = mongoose.model('Game', GameDatabase);
