-- Globals

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- Users Table
    
CREATE TABLE IF NOT EXISTS users
(
  id SERIAL PIMARY KEY,
  name VARCHAR (20) UNIQUE NOT NULL,
  email VARCHAR (30) NOT NULL,
  password VARCHAR (30) NOT NULL,
  avatar INTEGER
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

CREATE TABLE IF NOT EXISTS Players(in-game)
(
  id SERIAL PIMARY KEY,
  income INTEGER,
  wallet INTEGER,
  character INTEGER,
  specialMeter INTEGER
);

-- Units Table
-- List of every unit in all games.

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

-- UnitTypes Table

CREATE TABLE IF NOT EXISTS unitTypes
(
  id SERIAL PIMARY KEY,
  type VARCHAR(30),
  sprite VARCHAR(100), --Will be a URL.
  cost INTEGER,
  damage INTEGER,
  health INTEGER,
  range INTEGER,
  speed INTEGER,
  movementType INTEGER
);

-- Buildings Table
-- List of every building in all games.

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

-- BuildingTypes Table

CREATE TABLE IF NOT EXISTS buildingTypes
(
  id SERIAL PIMARY KEY,
  sprite VARCHAR(100), --Will be a URL
  type VARCHAR(30),
  income INTEGER
);

-- Maps Table

CREATE TABLE IF NOT EXISTS maps
(
  id SERIAL PIMARY KEY,
  name VARCHAR(30),
  numPlayers INTEGER,
  mapImage INTEGER
);

-- MapTerrain Table
-- Specific terrain layout for each map in maps table.

CREATE TABLE IF NOT EXISTS mapTerrain
(
  id SERIAL PIMARY KEY,
  mapID INTEGER,
  type INTEGER,
  xCoord INTEGER,
  yCoord INTEGER
);

-- TerrainTypes Table

CREATE TABLE IF NOT EXISTS terrainTypes
(
  id SERIAL PIMARY KEY,
  name INTEGER,
  defenseBonus INTEGER,
  pathingType INTEGER,
  moveChange INTEGER
);

-- Characters Table

CREATE TABLE IF NOT EXISTS characters
(
  id SERIAL PIMARY KEY,
  name INTEGER,
  passive INTEGER,
  sprite VARCHAR(100), --Will be a URL
  special VARCHAR(50),
);

-- Stats Table

CREATE TABLE IF NOT EXISTS stats
(
  id SERIAL PIMARY KEY,
  wins INTEGER,
  losses INTEGER,
  totalMatches INTEGER
);

-- Foreign Keys

ALTER TABLE Players(in-game) ADD FOREIGN KEY (id) REFERENCES games (id);
ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES Players(in-game) (id);
ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES stats (id);
ALTER TABLE units(in-game) ADD FOREIGN KEY (unitID) REFERENCES games (id);
ALTER TABLE units(in-game) ADD FOREIGN KEY (unitID) REFERENCES unitTypes (id);
ALTER TABLE chat ADD FOREIGN KEY (id) REFERENCES games (id);
ALTER TABLE mapTerrain ADD FOREIGN KEY (mapID) REFERENCES maps (id);
ALTER TABLE buildings(in-game) ADD FOREIGN KEY (buildingID) REFERENCES buildingTypes (id);
ALTER TABLE buildings(in-game) ADD FOREIGN KEY (buildingID) REFERENCES games (id);

-- Table Properties

-- ALTER TABLE games ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Players(in-game) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE units(in-game) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE buildingTypes ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE chat ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE maps ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE characters ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE unitTypes ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE terrainTypes ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE stats ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE mapTerrain ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE buildings(in-game) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Test Data

-- INSERT INTO games (id,map,totalTurns,players,currentPlayerTurn) VALUES
-- ('','','','','');
-- INSERT INTO Players(in-game) (id,income,wallet,character,specialMeter) VALUES
-- ('','','','','');
-- INSERT INTO users (id,name,email,password,avatar) VALUES
-- ('','','','','');
-- INSERT INTO units(in-game) (id,unitID,posX,posY,health,playerID,terrain,type) VALUES
-- ('','','','','','','','');
-- INSERT INTO buildingTypes (id,sprite,type(factory,base,city),income) VALUES
-- ('','','','');
-- INSERT INTO chat (id,userID,message) VALUES
-- ('','','');
-- INSERT INTO maps (id,name,numPlayers,mapImage) VALUES
-- ('','','','');
-- INSERT INTO characters (id,name,passive,sprite,special) VALUES
-- ('','','','','');
-- INSERT INTO unitTypes (id,type(infantry,tank,plane,etc),sprite,cost,damage,health,range,speed(movement),movementType) VALUES
-- ('','','','','','','','','');
-- INSERT INTO terrainTypes (id,name,defenseBonus,pathingType(0-X),moveChange) VALUES
-- ('','','','','');
-- INSERT INTO stats (id,wins,losses,totalMatches) VALUES
-- ('','','','');
-- INSERT INTO mapTerrain (id,mapID,type,xCoord,yCoord) VALUES
-- ('','','','','');
-- INSERT INTO buildings(in-game) (id,buildingID,posX,posY,health,owner,type) VALUES
-- ('','','','','','','');