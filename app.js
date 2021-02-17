const express = require('express');
const subjects = require('./routes/subjects');
const news = require('./routes/news');
const history = require('connect-history-api-fallback');
const path = require('path');
const { MongoClient } = require('mongodb');
var session = require('express-session');
const Joi = require('joi');
const crypto = require('crypto');
const { indexAuthChecker, apiAuthChecker } = require('./student-portal/middleware');

const app = express();

app.use(
    session({
        secret: 'oq12hxThO3MadIOhfSKi1FLgHwKHL9tl',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1210000000, resave: false, httpOnly: false }, // dve nedelje
    })
);

const mongoUrl = 'mongodb://localhost:27017/student_portal';

global.mongoUrl = mongoUrl;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET',
        'PUT',
        'POST',
        'DELETE',
        'OPTIONS'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(express.json());

app.use(indexAuthChecker);

const loginScheme = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(3).max(128).required(),
});

app.post('/api/login', (req, res) => {
    let { error } = loginScheme.validate(req.body);
    if (error) res.status(500).send(error.message);
    else {
        MongoClient.connect(mongoUrl, function (err, client) {
            client
                .db('student_portal')
                .collection('auth_user')
                .findOne(
                    {
                        email: req.body.email,
                    },
                    function (err, response) {
                        if (err) res.status(500).send(err.errmsg);

                        let user = response;

                        let params = user.password.split('$');

                        crypto.pbkdf2(
                            req.body.password,
                            params[2],
                            parseInt(params[1]),
                            new Buffer.from(params[3], 'base64').toString(
                                'ascii'
                            ).length,
                            params[0].split('_')[1],
                            function (err, key) {
                                var password = new Buffer.from(
                                    key,
                                    'binary'
                                ).toString('base64');

                                if (password == params[3]) {
                                    req.session.loggedIn = true;
                                    req.session.user = user;

                                    res.send(user);
                                } else {
                                    res.status(401).send('Failed login');
                                }
                            }
                        );
                    }
                );
        });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {});

    res.clearCookie('connect.sid');

    res.redirect('/login');
});

app.get('/api/logged-in', (req, res) => {
    res.send({ logged_in: req.session.user != null });
});

app.get('/api/user', apiAuthChecker, (req, res) => {
    res.send(req.session.user);
});


// Kazemo aplikaciji da za rute koje pocinju sa '/api' koristi nas ruter
app.use('/api', subjects);
app.use('/api', news);

const staticMiddleware = express.static(path.join(__dirname, 'public'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

app.listen(3000);
