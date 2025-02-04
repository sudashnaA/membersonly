const express = require('express');
const path = require("node:path");;
const session = require('express-session');
var passport = require('passport');
var routes = require('./routes/indexRouter');
const pool = require('./model/pool');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const pgSession = require('connect-pg-simple')(session);

// Need to require the entire Passport config module so app.js knows about it
require('./lib/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new pgSession({
    pool : pool,                // Connection pool
    tableName : 'user_sessions', // Use another table-name than the default "session" one
    createTableIfMissing: true
});

app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore
    })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
console.log('App listening on port 3000');
app.listen(3000);