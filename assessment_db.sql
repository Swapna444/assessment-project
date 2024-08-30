CREATE DATABASE assessment_db;

USE assessment_db;

CREATE TABLE assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    popularity INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00
);

CREATE TABLE recent_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE assessment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    grading_options VARCHAR(50),
    instructions TEXT,
    time_limit INT,
    attempts INT,
    feedback_options VARCHAR(50),
    course_link VARCHAR(255),
    status VARCHAR(50)
);
CREATE TABLE question (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50),
    question_options TEXT,
    assessment_id BIGINT,
    FOREIGN KEY (assessment_id) REFERENCES assessment(id) ON DELETE CASCADE
);


CREATE TABLE student_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    assessment_id INT,
    question_id INT,
    answer TEXT,
    submission_time DATETIME,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    assessment_id INT,
    question_id INT,
    feedback_text TEXT,
    teacher_comments TEXT,
    score DECIMAL(5,2)
);