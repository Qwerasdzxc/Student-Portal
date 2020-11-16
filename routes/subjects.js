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
const sema = Joi.object().keys({
    name: Joi.string().trim().min(3).max(48).required()
});

// Prikaz svih poruka
route.get('/subjects', (req, res) => {
    // Saljemo upit bazi
    pool.query('select * from subject', (err, rows) => {
        if (err) {
            console.log(err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        }
        else
            res.send(rows);
    });
});

// Cuvanje nove poruke (vraca korisniku ceo red iz baze)
route.post('/subjects', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = sema.validate(req.body);  // Object decomposition - dohvatamo samo gresku
    // Ako su podaci neispravni prijavimo gresku
    if (error) {
        console.log(error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    }
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string
        let query = "insert into subject (name) values (?)";
        let formated = mysql.format(query, [req.body.name]);
        console.log(formated)

        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err) {
                console.log(err)
                res.status(500).send(err.sqlMessage);
            }
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from subject where subject_id=?';
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

route.put('/subject/:id', (req, res) => {
    let { error } = sema.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update subject set name=? where subject_id=?";
        let formated = mysql.format(query, [req.body.name, req.params.id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from subject where subject_id=?';
                formated = mysql.format(query, [req.params.id]);

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
route.delete('/subjects/:id', (req, res) => {
    let query = 'select * from subject where subject_id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let poruka = rows[0];

            let query = 'delete from subject where subject_id=?';
            let formated = mysql.format(query, [req.params.id]);

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