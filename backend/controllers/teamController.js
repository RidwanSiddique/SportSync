
const { Team, userTeam, TeamStats } = require("../models/teamModels");


const createTeam = async (req, res) => {
  const {teamName, userId } = req.body;
  //if teamName field not entered, then send back error
  if (!teamName) {
    return res.status(404).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // checking if Team exists in the database already
  const exists = await Team.findOne({teamName});

  if (exists) {
    //if it does exist, return an error.
    return res.status(404).json({
      success: false,
      message: "This team already exists!",
    });
  }

  try {
    // else add a entry to the Team, and add the player to the team with userTeam database
    const team = await Team.create({ teamName, userId });
    const userteam = await userTeam.create({ teamName, userId });
    await TeamStats.create({teamName,number,number,number });

    res.status(200).json({
      message: "Team Created, assigned as coach",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


const deleteTeam = async (req, res) => {
  const { teamName, userId } = req.body;

  if (!teamName || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both teamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await Team.findOne({ teamName, userId });

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found or unauthorized to delete.",
      });
    }
    //if the coach does delete the team, removes from the Team database, and deletes all mentions of it in userTeam
    await Team.deleteOne({ teamName, userId });
    await userTeam.deleteMany({ teamName });
    await TeamStats.deleteOne({teamName});

    res.status(200).json({
      message: "Team Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addToTeam = async (req, res) => {
  const { teamName, userId } = req.body;

  if (!teamName || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both teamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await userTeam.findOne({ teamName, userId });

    if (existingTeam) {
      return res.status(404).json({
        success: false,
        message: "Already a part of the team!",
      });
    }

    await userTeam.create({ teamName, userId });

    res.status(200).json({
      message: "added to the team",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeFromTeam = async (req, res) => {
  const { teamName, userId } = req.body;

  if (!teamName || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both teamName and userId must be provided.",
    });
  }

  try {
    const existingTeam = await Team.findOne({ teamName, userId });

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: "You are not on this team",
      });
    }
    //if the coach does delete the team, removes from the Team database, and deletes all mentions of it in userTeam
    await userTeam.deleteOne({ teamName, userId });

    res.status(200).json({
      message: "Removed From Team",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const updateStats = async(req,res)=>{
  const {teamname,wins,loss,ties} = req.body;
  if (!teamname || !wins || !loss || !ties){
    res.status(400).json({message: "Need all fields to be full"});
  }
  else{
    try {
      const exist = await TeamStats.findOne({teamname});
      if (!exist){
        res.status(400).json({message: "Team not found"});
      }
      else{
        await TeamStats.updateOne(
          { TeamName: teamName },
          { $set: { Wins: wins, Losses: losses, Ties: ties } }
        );      
        res.status(200).json({message: "Stats updated successfully"});
      }
    }
    catch{
      res.status(400).json({message:"Unexpected error has occured"});
    }
  }

}




module.exports = {
    createTeam,
    deleteTeam,
    addToTeam,
    removeFromTeam,
    updateStats,
  };