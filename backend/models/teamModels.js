
const mongoose = require('mongoose');

const Teams = new mongoose.Schema({
    TeamName: {
        type: String,
        required: true
    },
    coachId:{
        type: String,
        required: true
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game' // Assuming your Game model is named 'Game'
    }],
}, {timestamps: true});

const userTeams = new mongoose.Schema({
    TeamName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
}, {timestamps: true})

const teamStats = new mongoose.Schema({
    TeamName:{
        type: String, 
        required: true
    },
    Wins:{
        type: Number,
        required: true
    },
    Losses: {
        type: Number, 
        required:true
    },
    Ties: {
        type: Number, 
        required: true
    }

})



const Team = mongoose.model('Team', Teams);
const userTeam = mongoose.model('userTeam', userTeams);
const TeamStats = mongoose.model('teamStats', teamStats);

module.exports = { Team, userTeam, TeamStats };