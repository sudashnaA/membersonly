const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validPassword = require('./passwordUtils').validPassword;
const { getUserByID, getUserByUsername} = require('../model/usersmodel.js');

const verifyCallback = async (username, password, done) => {
    try {
        const user = await getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = validPassword(password, user.hash, user.salt);

        if (!match) {
        // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
        }
        
        return done(null, user);
      } catch(err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.userid);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserByID(id);
  
      done(null, user);
    } catch(err) {
      done(err);
    }
});