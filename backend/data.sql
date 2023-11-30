DROP DATABASE sportSync;

-- Create the database
CREATE DATABASE IF NOT EXISTS sportSync;

-- Use the database
USE sportSync;

-- Create the "Chat" table
CREATE TABLE IF NOT EXISTS Chat (
    chatID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    timeStamp DATETIME,
    teamID INT,
    message TEXT
);

-- Create the "DMs" table
CREATE TABLE IF NOT EXISTS DMs (
    chatID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    timeStamp DATETIME,
    targetUserID INT,
    message TEXT
);

-- Create the "Teams" table
CREATE TABLE IF NOT EXISTS Teams (
    teamID INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL
);

-- Create the "Calendar" table
CREATE TABLE IF NOT EXISTS Calendar (
    gameID INT AUTO_INCREMENT PRIMARY KEY,
    timeStamp DATETIME,
    homeTeamID INT,
    awayTeamID INT,
    gameScore VARCHAR(255)
);

-- Create the "Stats" table
CREATE TABLE IF NOT EXISTS Stats (
    userID INT PRIMARY KEY,
    POS VARCHAR(5),
    GP INT,
    G INT,
    A INT,
    PTS INT,
    HAT INT,
    W INT,
    L INT,
    T INT
);

-- Create the "User Login" table
CREATE TABLE IF NOT EXISTS UserLogin (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    userID INT
);

-- Create the "Roster Info" table
CREATE TABLE IF NOT EXISTS RosterInfo (
    userID INT PRIMARY KEY,
    playerName VARCHAR(255),
    playerNumber INT
);

-- Create the "User Info" table
CREATE TABLE IF NOT EXISTS UserInfo (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    contactInfo TEXT
);

-- Create the "UserTeams" table
CREATE TABLE IF NOT EXISTS UserTeams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    teamID INT
);

CREATE TABLE IF NOT EXISTS TeamPolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    timestamp DATETIME,
    teamID INT
);

CREATE TABLE IF NOT EXISTS PollResults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pollID INT,
    optionName VARCHAR(255),
    result INT
);