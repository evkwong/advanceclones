CREATE TABLE IF NOT EXISTS users
(
  id SERIAL PIMARY KEY,
  name VARCHAR (20) UNIQUE NOT NULL,
  email VARCHAR (30) NOT NULL,
  password VARCHAR (30) NOT NULL,
  avatar INTEGER
);


CREATE TABLE IF NOT EXISTS games
(
  id SERIAL PRIMARY KEY,
  map INTEGER NOT NULL,
  totalTurns INTEGER,
  players INTEGER,
  currentPlayerTurn INTEGER
);


CREATE TABLE IF NOT EXISTS Players(in-game)
(
  id SERIAL PIMARY KEY,
  income INTEGER,
  wallet INTEGER,
  character INTEGER,
  specialMeter INTEGER
);


CREATE TABLE IF NOT EXISTS units(in-game)
(
  id SERIAL PIMARY KEY,
  unitID INTEGER,
  posX INTEGER,
  posY INTEGER,
  health INTEGER,
  ownerID INTEGER,
  type INTEGER
);


CREATE TABLE IF NOT EXISTS unitTypes
(
  id SERIAL PIMARY KEY,
  type VARCHAR(30),
  cost INTEGER,
  damage INTEGER,
  health INTEGER,
  range INTEGER,
  speed INTEGER,
  movementType INTEGER
);


CREATE TABLE IF NOT EXISTS buildings(in-game)
(
  id SERIAL PIMARY KEY,
  buildingID INTEGER,
  posX INTEGER,
  posY INTEGER,
  health INTEGER,
  owner INTEGER,
  type INTEGER
);


CREATE TABLE IF NOT EXISTS buildingTypes
(
  id SERIAL PIMARY KEY,
  type VARCHAR(30),
  income INTEGER
);


CREATE TABLE IF NOT EXISTS maps
(
  id SERIAL PIMARY KEY,
  name VARCHAR(30),
  numPlayers INTEGER,
  mapImage INTEGER
);


CREATE TABLE IF NOT EXISTS mapTerrain
(
  id SERIAL PIMARY KEY,
  mapID INTEGER,
  type INTEGER,
  xCoord INTEGER,
  yCoord INTEGER
);


CREATE TABLE IF NOT EXISTS terrainTypes
(
  id SERIAL PIMARY KEY,
  name INTEGER,
  defenseBonus INTEGER,
  pathingType INTEGER,
  moveChange INTEGER
);


CREATE TABLE IF NOT EXISTS characters
(
  id SERIAL PIMARY KEY,
  name INTEGER,
  passive INTEGER,
  special VARCHAR(50),
);


CREATE TABLE IF NOT EXISTS stats
(
  id SERIAL PIMARY KEY,
  wins INTEGER,
  losses INTEGER,
  totalMatches INTEGER
);


ALTER TABLE Players(in-game) ADD FOREIGN KEY (id) REFERENCES games (id);
ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES Players(in-game) (id);
ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES stats (id);
ALTER TABLE units(in-game) ADD FOREIGN KEY (unitID) REFERENCES games (id);
ALTER TABLE units(in-game) ADD FOREIGN KEY (unitID) REFERENCES unitTypes (id);
ALTER TABLE chat ADD FOREIGN KEY (id) REFERENCES games (id);
ALTER TABLE mapTerrain ADD FOREIGN KEY (mapID) REFERENCES maps (id);
ALTER TABLE buildings(in-game) ADD FOREIGN KEY (buildingID) REFERENCES buildingTypes (id);
ALTER TABLE buildings(in-game) ADD FOREIGN KEY (buildingID) REFERENCES games (id);
