#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    userid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL, 
    salt VARCHAR(255) NOT NULL,
    membershipstatus BOOLEAN NOT NULL,
    admin BOOLEAN
);
    
CREATE TABLE IF NOT EXISTS posts (
    postsid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    userid INTEGER REFERENCES users(userid),
    title VARCHAR(255),
    timestamp timestamp default current_timestamp,
    text TEXT
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.user}:${process.env.password}@localhost:5432/${process.env.database}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
