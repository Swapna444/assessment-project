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