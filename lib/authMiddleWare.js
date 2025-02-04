module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorised to view this resource'});
    }
}

module.exports.isNotMember = (req, res, next) => {
    if (!req.user.membershipstatus){
        next();
    } else {
        res.status(401).json({ msg: 'YOU ARE ALREADY A MEMBER IDIOT!'});
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.admin){
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorised to view this resource NO ADMIN'});
    }
}