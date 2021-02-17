const apiAuthChecker = (req, res, next) => {
    if (!req.session.loggedIn) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
};

function indexAuthChecker(req, res, next) {
    if (req.path == '/' && !req.session.loggedIn) {
        res.redirect('/login');
    } else if (req.path == '/login' && req.session.loggedIn) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = {
    apiAuthChecker: apiAuthChecker,
    indexAuthChecker, indexAuthChecker
}
