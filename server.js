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
    password: 'Swap@123',
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

// Get Assessment Details
app.get('/assessment/:id', (req, res) => {
    let sql = 'SELECT * FROM assessments WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Get Assessment Questions
app.get('/assessment/:id/questions', (req, res) => {
    let sql = 'SELECT * FROM questions WHERE assessment_id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Submit Student Response
app.post('/submit_response', (req, res) => {
    const { student_id, assessment_id, question_id, answer } = req.body;
    let sql = 'INSERT INTO student_responses (student_id, assessment_id, question_id, answer, submission_time) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [student_id, assessment_id, question_id, answer], (err, result) => {
        if (err) throw err;
        res.send('Response submitted.');
    });
});

// Get Student Feedback
app.get('/feedback/:student_id/:assessment_id', (req, res) => {
    let sql = 'SELECT * FROM feedback WHERE student_id = ? AND assessment_id = ?';
    db.query(sql, [req.params.student_id, req.params.assessment_id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

// Save assessment (draft or publish)
app.post('/save-assessment', (req, res) => {
    const { title, type, questions, gradingOptions, instructions, timeLimit, attempts, feedbackOptions, courseLink, status } = req.body;

    const query = `
        INSERT INTO assessments (title, type, grading_options, instructions, time_limit, attempts, feedback_options, course_link, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [title, type, gradingOptions, instructions, timeLimit, attempts, feedbackOptions, courseLink, status], (err, result) => {
        if (err) {
            return res.json({ success: false, error: err });
        }

        // Save questions
        const assessmentId = result.insertId;
        const questionQuery = `
            INSERT INTO questions (assessment_id, question_text, question_type, question_options)
            VALUES ?
        `;
        const questionValues = questions.map(q => [assessmentId, q.text, q.type, q.options.join(', ')]);
        db.query(questionQuery, [questionValues], (err, result) => {
            if (err) {
                return res.json({ success: false, error: err });
            }

        });
    });
})
// Get All Questions
app.get('/questions', (req, res) => {
    let sql = 'SELECT * FROM questions';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add New Question
app.post('/questions', (req, res) => {
    const { question_text, question_type, difficulty, subject, category, tags } = req.body;
    let sql = 'INSERT INTO questions (question_text, question_type, difficulty, subject, category, tags) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [question_text, question_type, difficulty, subject, category, tags], (err, result) => {
        if (err) throw err;
        res.send('Question added.');
    });
});

// Update a Question
app.put('/questions/:id', (req, res) => {
    const { question_text, question_type, difficulty, subject, category, tags } = req.body;
    let sql = 'UPDATE questions SET question_text = ?, question_type = ?, difficulty = ?, subject = ?, category = ?, tags = ? WHERE id = ?';
    db.query(sql, [question_text, question_type, difficulty, subject, category, tags, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Question updated.');
    });
});

// Delete a Question
app.delete('/questions/:id', (req, res) => {
    let sql = 'DELETE FROM questions WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Question deleted.');
    });
});


// Get Assessment Details
app.get('/assessment/:id', (req, res) => {
    let sql = 'SELECT * FROM assessments WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Get Assessment Questions
app.get('/assessment/:id/questions', (req, res) => {
    let sql = 'SELECT * FROM questions WHERE assessment_id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Submit Student Response
app.post('/submit_response', (req, res) => {
    const { student_id, assessment_id, question_id, answer } = req.body;
    let sql = 'INSERT INTO student_responses (student_id, assessment_id, question_id, answer, submission_time) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [student_id, assessment_id, question_id, answer], (err, result) => {
        if (err) throw err;
        res.send('Response submitted.');
    });
});

// Get Student Feedback
app.get('/feedback/:student_id/:assessment_id', (req, res) => {
    let sql = 'SELECT * FROM feedback WHERE student_id = ? AND assessment_id = ?';
    db.query(sql, [req.params.student_id, req.params.assessment_id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
})