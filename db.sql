CREATE TABLE team(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(20),
    player1 VARCHAR(128),
    player2 VARCHAR(128),
    player3 VARCHAR(128),
    points VARCHAR(255) DEFAULT 0
);

CREATE TABLE games(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    team1 VARCHAR(20),
    team2 VARCHAR(20),
    ended BOOLEAN DEFAULT false,
    point1 VARCHAR(20),
    point2 VARCHAR(20),
    point3 VARCHAR(20)
);