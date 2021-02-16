const express = require('express');
const Joi = require('joi');
const { ObjectId, MongoClient } = require('mongodb');
const mysql = require('mysql');
const route = express.Router();

// Sema za validaciju
const scheme = Joi.object().keys({
    subject_id: Joi.number().integer(),
    title: Joi.string().trim().min(3).max(128).required(),
    content: Joi.string().trim().min(3).max(2048).required(),
});

// Prikaz svih poruka
route.get('/subjects/:id/news', (req, res) => {
    MongoClient.connect(mongoUrl, function (err, client) {
        client
            .db('student_portal')
            .collection('portal_news')
            .find({ subject_id: ObjectId(req.params.id) })
            .toArray(function (err, result) {
                if (err) res.status(500).send(err.errmsg);

                res.send(result);
            });
    });
});

// Cuvanje nove poruke (vraca korisniku ceo red iz baze)
route.post('/subjects/:id/news', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = scheme.validate(req.body); // Object decomposition - dohvatamo samo gresku
    // Ako su podaci neispravni prijavimo gresku
    if (error) {
        res.status(400).send(error.details[0].message); // Greska zahteva
    } else {
        MongoClient.connect(mongoUrl, function (err, client) {
            client
                .db('student_portal')
                .collection('portal_news')
                .insertOne(
                    {
                        title: req.body.title,
                        content: req.body.content,
                        subject_id: ObjectId(req.params.id),
                    },
                    function (err, response) {
                        if (err) res.status(500).send(err.errmsg);

                        res.send(response.ops[0]);
                    }
                );
        });
    }
});

route.put('/subjects/:subject_id/news/:news_id', (req, res) => {
    console.log(req.path);
    let { error } = scheme.validate(req.body);

    if (error) res.status(400).send(error.details[0].message);
    else {
        MongoClient.connect(mongoUrl, function (err, client) {
            client
                .db('student_portal')
                .collection('portal_news')
                .updateOne(
                    { _id: ObjectId(req.params.news_id) },
                    {
                        $set: {
                            title: req.body.title,
                            content: req.body.content,
                        },
                    },
                    function (err, result) {
                        if (err) res.status(500).send(err.errmsg);

                        client
                            .db('student_portal')
                            .collection('portal_news')
                            .findOne(
                                { _id: ObjectId(req.params.news_id) },
                                function (err, response) {
                                    if (err) res.status(500).send(err.errmsg);

                                    console.log(response);
                                    res.send(response);
                                }
                            );
                    }
                );
        });
        // let query =
        //     'update subject_news set title=?, content=? where subject_news_id=?';
        // let formated = mysql.format(query, [
        //     req.body.title,
        //     req.body.content,
        //     req.params.news_id,
        // ]);

        // pool.query(formated, (err, response) => {
        //     if (err) res.status(500).send(err.sqlMessage);
        //     else {
        //         query = 'select * from subject_news where subject_news_id=?';
        //         formated = mysql.format(query, [req.params.news_id]);

        //         pool.query(formated, (err, rows) => {
        //             if (err) res.status(500).send(err.sqlMessage);
        //             else res.send(rows[0]);
        //         });
        //     }
        // });
    }
});

// Brisanje poruke (vraca korisniku ceo red iz baze)
route.delete('/subjects/:subject_id/news/:news_id', (req, res) => {
    let query = 'select * from subject_news where subject_news_id=?';
    let formated = mysql.format(query, [req.params.news_id]);

    pool.query(formated, (err, rows) => {
        if (err) res.status(500).send(err.sqlMessage);
        else {
            let poruka = rows[0];

            let query = 'delete from subject_news where subject_news_id=?';
            let formated = mysql.format(query, [req.params.news_id]);

            pool.query(formated, (err, rows) => {
                if (err) res.status(500).send(err.sqlMessage);
                else res.send(poruka);
            });
        }
    });
});

module.exports = route;
