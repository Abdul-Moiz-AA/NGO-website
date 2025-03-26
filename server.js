const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ngo_website'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Handle form submission
let serial = 0; // Initialize serial variable

app.post('/submit', (req, res) => {
    const { inputName, inputMessage, Amount } = req.body;

    serial++; // Increment serial variable

    const sql = 'INSERT INTO users (serial, name, message, amount) VALUES (?, ?, ?, ?)';
    db.query(sql, [serial, inputName, inputMessage, Amount], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.send('Error occurred while saving data.');
            return;
        }
        res.send('New record created successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/donations', (req, res) => {
    const sql = 'SELECT name, message, amount FROM users ORDER BY serial DESC LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error occurred while fetching data.');
            return;
        }
        res.json(results);
    });
});