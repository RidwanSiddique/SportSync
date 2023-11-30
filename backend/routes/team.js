const express = require('express');

const {addToTeam,deleteTeam,createTeam, showAllTeams, updateStats, removeFromTeam, getStats, getUserTeams, getTeamMembers} = require("../controllers/teamController");
const router = express.Router();


router.post('/teamCreate', createTeam);
router.post('/teamDelete', deleteTeam);
router.post('/addToTeam', addToTeam);
router.get('/showTeams', showAllTeams);
router.post('/removeFromTeam', removeFromTeam);
router.post('/updateStats',updateStats)
router.get('/getStats',getStats);
router.get('/getUserTeams', getUserTeams);
router.get('/getTeamMembers',getTeamMembers);
module.exports = router;

