const router = require('express').Router();
const { isAuth, isAdmin, isNotMember } = require('../lib/authMiddleWare');
const indexController = require('../controller/indexController');


router.post('/login', indexController.postLogin);
router.post('/register', indexController.postRegister);
router.post('/create-post', indexController.postCreatePost);
router.post('/join', indexController.postJoin);

router.get('/', indexController.getIndex);
router.get('/login', indexController.getLogin);
router.get('/register', indexController.getRegister);
router.get('/logout', indexController.getLogout);
router.get('/create-post', isAuth, indexController.getCreatePost);
router.get('/join', isAuth, isNotMember, indexController.getJoin);
router.get('/delete', isAuth, isAdmin, indexController.getDelete);

module.exports = router;