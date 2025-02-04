const usersModel = require('../model/usersmodel');
const postsModel = require('../model/postsmodel');
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const { body, validationResult } = require("express-validator");

const validateRegister = [
    body('username').custom(async value => {
        const user = await usersModel.getUserByUsername(value);
        if (user) {
          throw new Error('Username already in use');
        }
    }).withMessage(`Username already in use`),
    body("password").trim()
        .isLength({ min: 8}).withMessage(`Password must be atleast 8 characters`),
    body('cpassword').custom((value, { req }) => {
        return value === req.body.password;
        }).withMessage(`Password does not match`)
];

const validateLogin = [
    body("password").trim()
        .isLength({ min: 8}).withMessage(`Password must be atleast 8 characters`)
];

const validateJoin = [
    body("password").trim()
        .custom((value) => {
            return value === "supersecret";
        }).withMessage("Wrong password")
];

module.exports.getIndex = async (req, res) => {
    const posts = await postsModel.getAllPosts();
    res.render("index", { user: req.user, posts: posts});
}

module.exports.getLogin = async (req, res) => {
    res.render("login");
}

module.exports.postLogin =[validateLogin, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        errors: errors.array(),
      });
    }
    next();
},  passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' })];

module.exports.getRegister = async (req, res) => {
    res.render("register");
}

module.exports.postRegister =[validateRegister, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
      });
    }
    const saltHash = genPassword(req.body.password);
        
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    await usersModel.addUser(req.body.username, req.body.firstname, req.body.lastname, hash, salt);

    res.redirect('/login');
}];

module.exports.getCreatePost = async (req, res) => {
    res.render('createpost');
}

module.exports.postCreatePost = async (req, res) => {
    await postsModel.createPost(req.user.userid, req.body.title, req.body.text);
    res.redirect('/');
}

module.exports.getJoin = (req, res) => {
    res.render('join');
}

module.exports.postJoin = [validateJoin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join", {
        errors: errors.array(),
      });
    }

    await usersModel.grantAccess(req.user.userid);
    res.redirect('/');
}]

module.exports.getDelete = async (req, res) => {
    await postsModel.deletePostByID(req.query.postid);
    res.redirect('/');
}

module.exports.getLogout = async (req, res) => {
    req.logout(function(err) {
    if (err) { return next(err); }
        });
    res.redirect('/login');
}