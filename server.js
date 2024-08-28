const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'assessment_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Fetch all assessments
app.get('/assessments', (req, res) => {
    let query = 'SELECT * FROM assessments';
    
    // Search query
    if (req.query.search) {
        query += ` WHERE title LIKE '%${req.query.search}%'`;
    }
    
    // Filter by type
    if (req.query.filterType && req.query.filterType !== 'all') {
        query += ` AND type = '${req.query.filterType}'`;
    }
    
    // Sort by option
    if (req.query.sortOption) {
        if (req.query.sortOption === 'date') {
            query += ' ORDER BY created_at DESC';
        } else if (req.query.sortOption === 'popularity') {
            query += ' ORDER BY popularity DESC';
        } else if (req.query.sortOption === 'completion') {
            query += ' ORDER BY completion_rate DESC';
        }
    }
    
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch recent activities
app.get('/recent-activities', (req, res) => {
    const query = 'SELECT * FROM recent_activities ORDER BY timestamp DESC LIMIT 10';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch assessment analytics summary
app.get('/analytics-summary', (req, res) => {
    const query = 'SELECT title, AVG(score) AS avg_score, AVG(completion_rate) AS completion_rate FROM assessments GROUP BY title';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
})