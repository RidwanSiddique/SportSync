
const { Team, userTeam, TeamStats } = require("../models/teamModels");


const createTeam = async (req, res) => {
  // const {TeamName, coachId } = req.body;
  const TeamName = req.body.TeamName;
  const coachId = req.body.coachId;
  //if TeamName field not entered, then send back error
  console.log(coachId);
  console.log(TeamName);
  if (!TeamName) {
    return res.status(404).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // checking if Team exists in the database already
  const exists = await Team.findOne({TeamName});

  if (exists) {
    //if it does exist, return an error.
    return res.status(404).json({
      success: false,
      message: "This team already exists!",
    });
  }
  try {
    const userId=coachId;
    // else add a entry to the Team, and add the player to the team with userTeam database
    const team = await Team.create({ TeamName,  coachId  });
    const userteam = await userTeam.create({ TeamName,  userId  });
    await TeamStats.create({ TeamName, Wins: 0, Losses: 0, Ties: 0 });

    res.status(200).json({
      message: "Team Created, assigned as coach",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


const deleteTeam = async (req, res) => {
  const { TeamName, coachId } = req.body;
  console.log({coachId, TeamName});
  if (!TeamName || !coachId) {
    return res.status(400).json({
      success: false,
      message: "Both TeamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await Team.findOne({ TeamName, coachId });

    if (!existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team not found or unauthorized to delete.",
      });
    }
    //if the coach does delete the team, removes from the Team database, and deletes all mentions of it in userTeam
    await Team.deleteOne({ TeamName, coachId });
    await userTeam.deleteMany({ TeamName });
    await TeamStats.deleteOne({TeamName});

    res.status(200).json({
      message: "Team Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addToTeam = async (req, res) => {
  const { TeamName, userId } = req.body;
  console.log(TeamName)
  if (!TeamName || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both TeamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await userTeam.findOne({ TeamName, userId });

    if (existingTeam) {
      return res.status(404).json({
        success: false,
        message: "Already a part of the team!",
      });
    } 
    const teamExists = await Team.findOne({TeamName});
    if (!teamExists){
      return res.status(404).json({
        success: false,
        message: "Team does not exist",
      });
    }
    await userTeam.create({ TeamName, userId });

    res.status(200).json({
      message: "added to the team",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeFromTeam = async (req, res) => {
  const { TeamName, userId } = req.body;

  if (!TeamName || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both TeamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await Team.findOne({ TeamName, userId });

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: "You are not on this team",
      });
    }
    //if the coach does delete the team, removes from the Team database, and deletes all mentions of it in userTeam
    await userTeam.deleteOne({ TeamName, userId });

    res.status(200).json({
      message: "Removed From Team",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const updateStats = async (req, res) => {
  const { TeamName, wins, loss, ties, coachId } = req.body;
  if (!TeamName || !wins || !loss || !ties || !coachId) {
    res.status(400).json({success: false, message: "Need all fields to be filled" });
  } else {
    try {
      const isCoach = await Team.findOne({TeamName, coachId});
      if (!isCoach){
        res.status(400).json({success:false, message:"YOu are nto the Coach or team does not exist!"});
      }else{
      const exist = await TeamStats.findOne({ TeamName });
      if (!exist) {
        res.status(404).json({ success: false,message: "Team not found" });
      } else {
        await TeamStats.updateOne(
          { TeamName: TeamName },
          { $set: { Wins: wins, Losses: loss, Ties: ties } }
        );
        res.status(200).json({success: true, message: "Stats updated successfully" });
      }}
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Unexpected error has occurred" });
    }
  }
};

const showAllTeams = async (req,res) => {
	try {
		const teams = await Team.find();
    console.log(teams);
		res.json(teams);
	} catch (error) {
		console.log('Error retrieving teams: ', error);
		res.status(500).json({success: false, error: "Internal Server Error "});
	}
};

const getStats = async (req,res) =>{
  const{TeamName} = req.body;
  try{
    const stats= await TeamStats.findOne({TeamName});
    if (!stats){
      res.status(400).json({success: false, message: "Error: Team does not exist"});
    }
    else{
      res.status(200).json({success: true, stats});
    }
  }catch{
    console.log("Error with fetching stats");
    res.status(500).json({success: false, message:"ERROR SOMETHING UNEXPECTED"});

  }
}


const getUserTeams = async (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  try {
    const teams = await userTeam.find({ userId });
    if (!teams || teams.length === 0) {
      res.status(200).json({ success: true, message: "Not on any teams" });
    } else {
      res.status(200).json({ success: true, teams });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error with getting user Teams", error: error.message });
  }
};

const getTeamMembers= async (req,res) => {
  const {TeamName} = req.body;
  try{
    const members = await userTeam.find({ TeamName }).populate('userId', 'firstName lastName email');
    const simplifiedMembers = members.map(member => ({
      userId: member.userId._id,
      firstName: member.userId.firstName,
      lastName: member.userId.lastName,
      email: member.userId.email,
    }));
    res.status(200).json({success: true, simplifiedMembers});
    
  }catch{
    res.status(500).json({success:false, message: "Failure to get memebers"});
  }
}

module.exports = {
    createTeam,
    deleteTeam,
    addToTeam,
    removeFromTeam,
    updateStats,
    showAllTeams, 
    getStats,
    getUserTeams,
    getTeamMembers,
  };
