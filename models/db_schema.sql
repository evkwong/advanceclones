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
  map INTEGER NOT NULL,
  totalTurns INTEGER,
  players INTEGER,
  currentPlayerTurn INTEGER
);

-- Players Table
CREATE TABLE IF NOT EXISTS players
(
  id SERIAL PRIMARY KEY,
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
  unitID INTEGER,
  posX INTEGER,
  posY INTEGER,
  health INTEGER,
  ownerID INTEGER,
  type INTEGER
);

-- UnitTypes Table
CREATE TABLE IF NOT EXISTS unitTypes
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25),
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
  buildingID INTEGER,
  posX INTEGER,
  posY INTEGER,
  health INTEGER,
  owner INTEGER,
  type INTEGER
);

-- BuildingTypes Table
CREATE TABLE IF NOT EXISTS buildingTypes
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25),
  sprite VARCHAR(100),
  income INTEGER
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

-- Foreign Keys
-- ALTER TABLE Players ADD FOREIGN KEY (id) REFERENCES games (id);
-- ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES Players(in-game) (id);
-- ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES stats (id);
-- ALTER TABLE units ADD FOREIGN KEY (unitID) REFERENCES games (id);
-- ALTER TABLE units ADD FOREIGN KEY (unitID) REFERENCES unitTypes (id);
-- ALTER TABLE chat ADD FOREIGN KEY (id) REFERENCES games (id);
-- ALTER TABLE mapTerrain ADD FOREIGN KEY (mapID) REFERENCES maps (id);
-- ALTER TABLE buildings ADD FOREIGN KEY (buildingID) REFERENCES buildingTypes (id);
-- ALTER TABLE buildings ADD FOREIGN KEY (buildingID) REFERENCES games (id);