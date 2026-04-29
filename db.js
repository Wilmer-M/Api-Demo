const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_demo'
});

db.connect((err) => {

    if(err){
        console.log('Error DB');
        return;
    }

    console.log('MySQL Connected');
});

module.exports = db;