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

app.get('/admin/users', auth, (req, res) => {

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

app.get('/users/:id', auth, (req, res) => {

    const requestedId = parseInt(req.params.id);

    if(req.user.id !== requestedId){

        return res.status(403).json({
            error: 'Forbidden'
        });
    }

    db.query(
        'SELECT * FROM users WHERE id = ?',
        [requestedId],
        (err, result) => {

            const user = result[0];

            res.json({
                id: user.id,
                username: user.username,
                email: user.email
            });
        }
    );
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});