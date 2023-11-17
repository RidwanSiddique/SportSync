const mongoose = require('mongoose');

// may need a team 2, don't have it for now
// name is the name of the match
const GameDatabase = new mongoose.Schema({
	name: {type: String, required: true},
	team: {type: String, required: true},
	time:  {type: String, required: true},
	place: {type: String}
});


module.exports = mongoose.model('Game', GameDatabase);
