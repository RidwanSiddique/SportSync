// creates Model class for games
const Game = require('../models/gameModels');

// function that creates a game
const createGame = async (req, res) => {
	console.log('called createGame');
	// need place but that's for later
	const {name, team1, team2, date, time} = req.body

	// no empty fields, place to be added later
	if(!name || !team1 || !team2 || !time || !date) {
		return res.status(400).json({
			success: false,
			message: "one of the fields is blank"
		});

	}

	try{
		// creating the document and placing into database 
		console.log('Request body: ', req.body);
		const game = await Game.create({name, team1, team2, date, time});
		console.log('Game created: ', game);

		res.status(200).json({message: "Game created successfully", game});
	} catch (error) {
		console.error("Error creating game: ", error);
		res.status(500).json({error: "Internal Server Error" });		
	}

};


// function that gets all games post
// this is really only used for testing
const showAllGames = async (req, res) => {
	try {
		const games = await Game.find();
		res.json(games);
	} catch (error) {
		console.log('Error retrieving games: ', error);
		res.status(500).json({error: "Internal Server Error "});			
	}
};

module.exports = {createGame, showAllGames};
