const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const SECRET = "supersecret";


/*
========================
LOGIN
========================
*/

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, result) => {

        if(result.length === 0){

            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const user = result[0];

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role
        }, SECRET);

        res.json({
            token
        });
    });
});


/*
========================
❌ BROKEN AUTHENTICATION
========================
NO TOKEN REQUIRED
*/

app.get('/admin/users', (req, res) => {

    db.query('SELECT * FROM users', (err, result) => {

        res.json(result);
    });
});


/*
========================
❌ BOLA
========================
USER CAN ACCESS OTHER USERS
*/

app.get('/users/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, result) => {

            res.json(result[0]);
        }
    );
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});