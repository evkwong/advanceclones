-- Globals

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- Users Table
CREATE TABLE IF NOT EXISTS users
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  email VARCHAR(25) NOT NULL,
  password VARCHAR(200) NOT NULL,
  avatar INTEGER
);

-- Stats Table
CREATE TABLE IF NOT EXISTS stats
(
  id SERIAL PRIMARY KEY,
  wins INTEGER,
  losses INTEGER,
  totalMatches INTEGER
);

-- Games Table
CREATE TABLE IF NOT EXISTS games
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  map INTEGER NOT NULL,
  totalTurns INTEGER,
  totalPlayers INTEGER,
  maxPlayers INTEGER,
  currentPlayerTurn INTEGER,
  started BOOLEAN
);

-- Players Table
CREATE TABLE IF NOT EXISTS players
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  gameID INTEGER,
  userID INTEGER,
  playerNumber INTEGER,
  income INTEGER,
  wallet INTEGER,
  co INTEGER,
  specialMeter INTEGER
);

-- Units Table
-- List of every unit in all games.
CREATE TABLE IF NOT EXISTS units
(
  id SERIAL PRIMARY KEY,
  gameID INTEGER,
  owner INTEGER,
  xpos INTEGER,
  ypos INTEGER,
  health INTEGER,
  type VARCHAR(25)
);

-- UnitTypes Table
CREATE TABLE IF NOT EXISTS unitTypes
(
  id SERIAL PRIMARY KEY,
  type VARCHAR(25),
  sprite VARCHAR(100),
  cost INTEGER,
  damage INTEGER,
  health INTEGER,
  range INTEGER,
  speed INTEGER,
  movementType VARCHAR(25)
);

-- Buildings Table
-- List of every building in all games.
CREATE TABLE IF NOT EXISTS buildings
(
  id SERIAL PRIMARY KEY,
  gameID INTEGER,
  owner INTEGER,
  xPos INTEGER,
  yPos INTEGER,
  type VARCHAR(25)
);

-- BuildingTypes Table
CREATE TABLE IF NOT EXISTS buildingTypes
(
  id SERIAL PRIMARY KEY,
  type VARCHAR(25),
  sprite VARCHAR(100),
  income VARCHAR(25)
);

-- Maps Table
CREATE TABLE IF NOT EXISTS maps
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25),
  numPlayers INTEGER,
  mapImage INTEGER
);

-- MapTerrain Table
-- Specific terrain layout for each map in maps table.
CREATE TABLE IF NOT EXISTS mapTerrain
(
  id SERIAL PRIMARY KEY,
  mapID INTEGER,
  type INTEGER,
  xCoord INTEGER,
  yCoord INTEGER
);

-- TerrainTypes Table
CREATE TABLE IF NOT EXISTS terrainTypes
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25),
  sprite VARCHAR(100),
  defenseBonus INTEGER,
  moveChange INTEGER
);

-- Characters Table
CREATE TABLE IF NOT EXISTS characters
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25),
  sprite VARCHAR(100),
  passiveDescription VARCHAR(100),
  special VARCHAR(25),
  specialDescription VARCHAR(100)
);