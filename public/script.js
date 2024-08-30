// Fetch and display assessments
document.addEventListener('DOMContentLoaded', function () {
    fetchAssessments();
    fetchRecentActivities();
    fetchAnalyticsSummary();
});

function fetchAssessments() {
    fetch('/assessments')
        .then(response => response.json())
        .then(data => {
            const assessmentsList = document.getElementById('myAssessments');
            assessmentsList.innerHTML = ''; // Clear previous data
            data.forEach(assessment => {
                const item = document.createElement('div');
                item.className = 'assessment-item';
                item.innerHTML = `
                    <h3>${assessment.title}</h3>
                    <p>Type: ${assessment.type}</p>
                    <p>Created on: ${new Date(assessment.created_at).toLocaleDateString()}</p>
                `;
                assessmentsList.appendChild(item);
            });
        });
}

function fetchRecentActivities() {
    fetch('/recent-activities')
        .then(response => response.json())
        .then(data => {
            const recentActivities = document.getElementById('recentActivities');
            recentActivities.innerHTML = ''; // Clear previous data
            data.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'recent-activity-item';
                item.innerHTML = `
                    <p>${activity.description}</p>
                    <p>${new Date(activity.timestamp).toLocaleString()}</p>
                `;
                recentActivities.appendChild(item);
            });
        });
}

function fetchAnalyticsSummary() {
    fetch('/analytics-summary')
        .then(response => response.json())
        .then(data => {
            const analyticsSummary = document.getElementById('analyticsSummary');
            analyticsSummary.innerHTML = ''; // Clear previous data
            data.forEach(metric => {
                const item = document.createElement('div');
                item.className = 'analytics-item';
                item.innerHTML = `
                    <h3>${metric.title}</h3>
                    <p>Average Score: ${metric.avg_score}</p>
                    <p>Completion Rate: ${metric.completion_rate}%</p>
                `;
                analyticsSummary.appendChild(item);
            });
        });
}

// Search and filter functionality
document.getElementById('searchBar').addEventListener('input', fetchAssessments);
document.getElementById('filterType').addEventListener('change', fetchAssessments);
document.getElementById('sortOption').addEventListener('change', fetchAssessments);

let questions = [];

function addQuestion() {
    const questionText = prompt('Enter the question text:');
    const questionType = prompt('Enter the question type (multiple-choice, short answer, etc.):');
    const questionOptions = prompt('Enter the options for the question (comma-separated):');

    const question = {
        text: questionText,
        type: questionType,
        options: questionOptions.split(',')
    };

    questions.push(question);
    displayQuestions();
}

function displayQuestions() {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <h4>Question ${index + 1}</h4>
            <p>${question.text}</p>
            <p>Type: ${question.type}</p>
            <p>Options: ${question.options.join(', ')}</p>
        `;
        questionList.appendChild(item);
    });
}

function previewAssessment() {
    alert('Preview Assessment');
    // Preview functionality can be implemented here
}

function saveAssessment(status) {
    const assessment = {
        title: document.getElementById('assessmentTitle').value,
        type: document.getElementById('assessmentType').value,
        questions: questions,
        gradingOptions: document.getElementById('gradingOptions').value,
        instructions: document.getElementById('instructions').value,
        timeLimit: document.getElementById('timeLimit').value,
        attempts: document.getElementById('attempts').value,
        feedbackOptions: document.getElementById('feedbackOptions').value,
        courseLink: document.getElementById('courseLink').value,
        status: status
    };

    fetch('/save-assessment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessment)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Assessment ${status ==='publish' ? 'Published' : 'Saved as Draft'} Successfully`);
        } else {
            alert('Error Saving Assessment');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionModal = document.getElementById('questionModal');
    const closeModal = document.querySelector('.close');
    const questionForm = document.getElementById('questionForm');

    // Show modal on Add New Question button click
    addQuestionBtn.addEventListener('click', () => {
        questionModal.style.display = 'flex';
    });

    // Close modal on clicking the 'x'
    closeModal.addEventListener('click', () => {
        questionModal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target === questionModal) {
            questionModal.style.display = 'none';
        }
    });

    // Handle form submission
    questionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const questionData = {
            question_text: document.getElementById('questionText').value,
            question_type: document.getElementById('questionType').value,
            difficulty: document.getElementById('difficulty').value,
            subject: document.getElementById('subject').value,
            category: document.getElementById('category').value,
            tags: document.getElementById('tags').value
        };

        fetch('/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            questionModal.style.display = 'none';
            loadQuestions();
        });
    });

    // Load questions from the database and display
    function loadQuestions() {
        fetch('/questions')
            .then(response => response.json())
            .then(data => {
                const questionList = document.getElementById('questionList');
                questionList.innerHTML = ''; // Clear current list
                data.forEach(question => {
                    const questionItem = document.createElement('div');
                    questionItem.innerHTML = `
                        <p>${question.question_text}</p>
                        <p><strong>Type:</strong> ${question.question_type}</p>
                        <p><strong>Difficulty:</strong> ${question.difficulty}</p>
                        <p><strong>Subject:</strong> ${question.subject}</p>
                        <p><strong>Category:</strong> ${question.category}</p>
                        <p><strong>Tags:</strong> ${question.tags}</p>
                        <button onclick="editQuestion(${question.id})">Edit</button>
                <button onclick="deleteQuestion(${question.id})">Delete</button>
                    `;
                    questionList.appendChild(questionItem);
                });
            });
    }

    // Edit Question Function
    function editQuestion(questionId) {
        fetch(/questions/${questionId})
            .then(response => response.json())
            .then(question => {
                document.getElementById('questionText').value = question.question_text;
                document.getElementById('questionType').value = question.question_type;
                document.getElementById('difficulty').value = question.difficulty;
                document.getElementById('subject').value = question.subject;
                document.getElementById('category').value = question.category;
                document.getElementById('tags').value = question.tags;
                
                questionModal.style.display = 'flex';

                // Update form submission to handle updates
                questionForm.onsubmit = (event) => {
                    event.preventDefault();
                    const updatedQuestionData = {
                        question_text: document.getElementById('questionText').value,
                        question_type: document.getElementById('questionType').value,
                        difficulty: document.getElementById('difficulty').value,
                        subject: document.getElementById('subject').value,
                        category: document.getElementById('category').value,
                        tags: document.getElementById('tags').value
                    };

                    fetch(/questions/${questionId}, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedQuestionData)
                    })
                    .then(response => response.text())
                    .then(data => {
                        alert(data);
                        questionModal.style.display = 'none';
                        loadQuestions();
                    });
                };
            });
    }

    // Delete Question Function
    function deleteQuestion(questionId) {
        if (confirm('Are you sure you want to delete this question?')) {
            fetch(/questions/${questionId}, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadQuestions();
            });
        }
    }

    // Load questions when the page is loaded
    loadQuestions();
});
document.addEventListener('DOMContentLoaded', () => {
    const assessmentId = 1;  // Example ID, replace with dynamic ID
    const studentId = 1;     // Example ID, replace with dynamic ID

    // Fetch assessment details and questions
    fetch(/assessment/${assessmentId})
        .then(response => response.json())
        .then(data => {
            document.getElementById('assessmentTitle').textContent = data.title;
            document.getElementById('instructions').textContent = data.instructions;
            // Initialize timer if time limit is set
            if (data.time_limit) {
                initializeTimer(data.time_limit);
            }
        });

    fetch(/assessment/${assessmentId}/questions)
        .then(response => response.json())
        .then(data => {
            generateQuestionNavigation(data);
            displayQuestion(data[0]);
        });

    // Timer function
    function initializeTimer(timeLimit) {
        let timeRemaining = timeLimit * 60;  // Convert minutes to seconds
        const timerDisplay = document.getElementById('timerDisplay');

        const timer = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds};
            if (timeRemaining <= 0) {
                clearInterval(timer);
                alert('Time is up! Submitting assessment.');
                submitAssessment();
            }
            timeRemaining--;
        }, 1000);
    }

    // Generate question navigation
    function generateQuestionNavigation(questions) {
        const navContainer = document.getElementById('questionNavigation');
        questions.forEach((question, index) => {
            const button = document.createElement('button');
            button.textContent = Question ${index + 1};
            button.addEventListener('click', () => {
                displayQuestion(question);
            });
            navContainer.appendChild(button);
        });
    }

    // Display question
    function displayQuestion(question) {
        const questionDisplay = document.getElementById('questionDisplay');
        questionDisplay.innerHTML = `
            <p>${question.question_text}</p>
            <input type="text" id="answerInput" placeholder="Enter your answer here">
        `;
    }

    // Save progress
    document.getElementById('saveProgressBtn').addEventListener('click', () => {
        const answer = document.getElementById('answerInput').value;
        const questionId = 1; // Replace with actual question ID
        saveProgress(questionId, answer);
    });
});