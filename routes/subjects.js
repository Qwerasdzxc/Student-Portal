const express = require('express');
const Joi = require('joi');
const { MongoClient, ObjectId } = require('mongodb');
const mysql = require('mysql');
const route = express.Router();
const crypto = require('crypto');
const { apiAuthChecker } = require('../student-portal/middleware');

const scheme = Joi.object().keys({
    name: Joi.string().trim().min(3).max(256).required(),
    description: Joi.string().trim().min(3).max(1024).required(),
});

// Prikaz svih poruka
route.get('/subjects', apiAuthChecker, (req, res) => {
    MongoClient.connect(mongoUrl, function (err, client) {
        client
            .db('student_portal')
            .collection('portal_subject')
            .find({})
            .toArray(function (err, result) {
                if (err) res.status(500).send(err.errmsg);

                res.send(result);
            });
    });
});

// Cuvanje nove poruke (vraca korisniku ceo red iz baze)
route.post('/subjects', apiAuthChecker, (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = scheme.validate(req.body); // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error) {
        res.status(400).send(error.details[0].message); // Greska zahteva
    } else {
        // Ako nisu upisemo ih u bazu
        MongoClient.connect(mongoUrl, function (err, client) {
            client
                .db('student_portal')
                .collection('portal_subject')
                .insertOne(
                    {
                        name: req.body.name,
                        description: req.body.description,
                    },
                    function (err, response) {
                        if (err) {
                            res.status(500).send(err.errmsg);
                        } else {
                            res.send(response.ops[0]);
                        }
                    }
                );
        });
    }
});

// route.put('/subjects/:id', (req, res) => {
//     let { error } = scheme.validate(req.body);

//     if (error) res.status(400).send(error.details[0].message);
//     else {
//         MongoClient.connect(mongoUrl, function (err, client) {
//             client
//                 .db('student_portal')
//                 .collection('portal_subject')
//                 .updateOne(
//                     { _id: ObjectId(req.params.id) },
//                     {
//                         $set: {
//                             name: req.body.name,
//                             description: req.body.description,
//                         },
//                     }
//                 );
//         });
//         // let query = "update subject set name=?, description=? where subject_id=?";
//         // let formated = mysql.format(query, [req.body.name, req.body.description, req.params.id]);

//         // pool.query(formated, (err, response) => {
//         //     if (err)
//         //         res.status(500).send(err.sqlMessage);
//         //     else {
//         //         query = 'select * from subject where subject_id=?';
//         //         formated = mysql.format(query, [req.params.id]);

//         //         pool.query(formated, (err, rows) => {
//         //             if (err)
//         //                 res.status(500).send(err.sqlMessage);
//         //             else
//         //                 res.send(rows[0]);
//         //         });
//         //     }
//         // });
//     }
// });

// Brisanje poruke (vraca korisniku ceo red iz baze)
route.delete('/subjects/:id', apiAuthChecker, (req, res) => {
    MongoClient.connect(mongoUrl, function (err, client) {
        client
            .db('student_portal')
            .collection('portal_subject')
            .findOneAndDelete(
                { _id: ObjectId(req.params.id) },
                async function (err, result) {
                    if (err) {
                        res.status(500).send(err.errmsg);
                    } else {
                        // brisanje svih objava koje su imale veze sa predmetom
                        await client
                            .db('student_portal')
                            .collection('portal_news')
                            .deleteMany({
                                subject_id: ObjectId(req.params.id),
                            });

                        res.send(result.value);
                    }
                }
            );
    });
});

module.exports = route;
