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
document.getElementById('sortOption').addEventListener('change', fetchAssessments)