const express = require('express');

const {addToTeam,deleteTeam,createTeam} = require("../controllers/teamController");
const router = express.Router();


router.get('/teamCreate', createTeam);
router.get('/teamDelete', deleteTeam);
router.get('/addToTeam', addToTeam);

module.exports = router;