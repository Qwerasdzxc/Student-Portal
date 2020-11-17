const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const route = express.Router();

// Koristimo pool da bi automatski aquire-ovao i release-ovao konekcije
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: '8000',
    user: 'root',
    password: '',
    database: 'student_portal'
});

// Sema za validaciju
const scheme = Joi.object().keys({
    subject_id: Joi.number().integer(),
    title: Joi.string().trim().min(3).max(128).required(),
    content: Joi.string().trim().min(3).max(2048).required(),
});

// Prikaz svih poruka
route.get('/subjects/:id/news', (req, res) => {
    let query = 'select * from subject_news where subject_id=?';
    let formatted = mysql.format(query, [req.params.id]);
    pool.query(formatted, (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);  // Greska servera
        }
        else {
            res.send(rows);
        }
    });
});

// Cuvanje nove poruke (vraca korisniku ceo red iz baze)
route.post('/subjects/:id/news', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = scheme.validate(req.body);  // Object decomposition - dohvatamo samo gresku
    // Ako su podaci neispravni prijavimo gresku
    if (error) {
        res.status(400).send(error.details[0].message);  // Greska zahteva
    }
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string
        let query = "insert into subject_news (title, content, subject_id) values (?, ?, ?)";
        let formated = mysql.format(query, [req.body.title, req.body.content, req.params.id]);

        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err) {
                console.log(err)
                res.status(500).send(err.sqlMessage);
            }
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from subject_news where subject_news_id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err.sqlMessage);
                    }
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.put('/subjects/:subject_id/news/:news_id', (req, res) => {
    let { error } = scheme.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update subject_news set title=?, content=? where subject_news_id=?";
        let formated = mysql.format(query, [req.body.title, req.body.content, req.params.news_id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from subject_news where subject_news_id=?';
                formated = mysql.format(query, [req.params.news_id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }

});

// Brisanje poruke (vraca korisniku ceo red iz baze)
route.delete('/subjects/:subject_id/news/:news_id', (req, res) => {
    let query = 'select * from subject_news where subject_news_id=?';
    let formated = mysql.format(query, [req.params.news_id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let poruka = rows[0];

            let query = 'delete from subject_news where subject_news_id=?';
            let formated = mysql.format(query, [req.params.news_id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(poruka);
            });
        }
    });
});

module.exports = route;